import { type Language } from '@/types';
import { type Provider } from '@/lib/aiModels';
import {
  type KnowledgeItem,
  getBuiltInKnowledge,
  selectRelevantKnowledge,
} from '@/lib/chatKnowledge';
import {
  buildCodingAssistQuery,
  getCodingRuleChunks,
  selectCodingRuleChunks,
  type CodingRuleChunk,
} from '@/lib/codingAssistKnowledge';
import type { CodingAssistContext } from '@/types';
import { embedReferenceQuery } from '@/lib/referenceEmbeddings';
import { isReferenceVectorRuntimeReady } from '@/lib/referenceVectorRuntime';
import { searchReferenceChunkEmbeddings } from '@/lib/referenceVectorStore';

type HybridProvider = Extract<Provider, 'openai'>;
export type HybridRetrievalMode = 'lexical' | 'hybrid';

export type RetrievalTraceEntry = {
  id: string;
  title: string;
  canonicalRoute: string | null;
  finalScore: number;
  lexicalRank: number | null;
  lexicalScore: number;
  vectorSimilarity: number | null;
  vectorScore: number;
  overlapScore: number;
  rerankBonus: number;
  bothBonus: number;
  sourceKinds: Array<'lexical' | 'vector'>;
};

type HybridKnowledgeResult = {
  items: KnowledgeItem[];
  mode: HybridRetrievalMode;
  vectorHitCount: number;
  trace: RetrievalTraceEntry[];
};

type HybridCodingResult = {
  items: CodingRuleChunk[];
  mode: HybridRetrievalMode;
  vectorHitCount: number;
  trace: RetrievalTraceEntry[];
};

type WeightedMergeConfig = {
  lexicalWeight: number;
  vectorWeight: number;
  overlapWeight: number;
  bothBonus: number;
};

const INTERPRETATION_MERGE_CONFIG: WeightedMergeConfig = {
  lexicalWeight: 64,
  vectorWeight: 36,
  overlapWeight: 2.6,
  bothBonus: 14,
};

const CODING_MERGE_CONFIG: WeightedMergeConfig = {
  lexicalWeight: 74,
  vectorWeight: 26,
  overlapWeight: 2.2,
  bothBonus: 10,
};

type MergeAccumulator<TItem> = {
  item: TItem;
  finalScore: number;
  lexicalRank: number | null;
  lexicalScore: number;
  vectorSimilarity: number | null;
  vectorScore: number;
  overlapScore: number;
  rerankBonus: number;
  bothBonus: number;
  sourceKinds: Array<'lexical' | 'vector'>;
};

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}%+/'-]+/gu);
  return matches ?? [];
}

function scoreQueryOverlap(query: string, item: { title: string; content: string; canonicalRoute?: string | null; aliases?: string[] }): number {
  const queryTokens = new Set(tokenize(query));
  const haystack = [
    item.title,
    item.content,
    item.canonicalRoute ?? '',
    ...(item.aliases ?? []),
  ]
    .join('\n')
    .toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += token.length >= 4 ? 8 : 3;
    }
  }
  return score;
}

function getRankSignal(index: number, total: number): number {
  if (total <= 1) {
    return 1;
  }

  return Math.max(0, 1 - index / (total - 1));
}

function scoreExactOrPrefixMatch(
  query: string,
  value?: string | null,
  exactBonus = 0,
  prefixBonus = 0,
): number {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedValue = value?.trim().toLowerCase() ?? '';

  if (!normalizedQuery || !normalizedValue) {
    return 0;
  }

  if (normalizedQuery === normalizedValue) {
    return exactBonus;
  }

  if (
    normalizedValue.startsWith(normalizedQuery) ||
    normalizedQuery.startsWith(normalizedValue) ||
    normalizedValue.includes(normalizedQuery)
  ) {
    return prefixBonus;
  }

  return 0;
}

function scoreKnowledgeRerankBonus(query: string, item: KnowledgeItem): number {
  const titleBonus = scoreExactOrPrefixMatch(query, item.title, 18, 8);
  const routeBonus = scoreExactOrPrefixMatch(query, item.canonicalRoute, 24, 10);
  const aliasBonus = Math.max(
    0,
    ...(item.aliases ?? []).map((alias) => scoreExactOrPrefixMatch(query, alias, 16, 7)),
  );
  const retrievalKindBonus = item.retrievalKind === 'runtime-route-summary' ? 8 : 0;

  return titleBonus + routeBonus + aliasBonus + retrievalKindBonus;
}

function scoreCodingRerankBonus(query: string, item: CodingRuleChunk): number {
  const titleBonus = scoreExactOrPrefixMatch(query, item.title, 14, 6);
  const tagBonus = Math.max(
    0,
    ...item.categoryTags.map((tag) => scoreExactOrPrefixMatch(query, tag, 18, 7)),
  );
  const routeTagBonus = item.categoryTags.some((tag) => tag.startsWith('scoring-input')) ? 6 : 0;

  return titleBonus + tagBonus + routeTagBonus;
}

function scoreLexicalCandidate(
  rankIndex: number,
  total: number,
  overlapScore: number,
  config: WeightedMergeConfig,
): number {
  return getRankSignal(rankIndex, total) * config.lexicalWeight + overlapScore * config.overlapWeight;
}

function scoreVectorCandidate(
  similarity: number,
  overlapScore: number,
  config: WeightedMergeConfig,
): number {
  const boundedSimilarity = Number.isFinite(similarity) ? Math.min(1, Math.max(0, similarity)) : 0;
  return boundedSimilarity * config.vectorWeight + overlapScore * config.overlapWeight;
}

export function rankMergedKnowledge(
  query: string,
  lexicalItems: KnowledgeItem[],
  vectorItems: Array<{ item: KnowledgeItem; similarity: number }>,
  limit: number,
): KnowledgeItem[] {
  return rankMergedKnowledgeDetailed(query, lexicalItems, vectorItems, limit).items;
}

export function rankMergedKnowledgeDetailed(
  query: string,
  lexicalItems: KnowledgeItem[],
  vectorItems: Array<{ item: KnowledgeItem; similarity: number }>,
  limit: number,
): { items: KnowledgeItem[]; trace: RetrievalTraceEntry[] } {
  const merged = new Map<string, MergeAccumulator<KnowledgeItem>>();

  lexicalItems.forEach((item, index) => {
    const key = item.id ?? item.canonicalRoute ?? `${item.title}:${index}`;
    const overlapScore = scoreQueryOverlap(query, item);
    const rerankBonus = scoreKnowledgeRerankBonus(query, item);
    const lexicalScore =
      scoreLexicalCandidate(index, lexicalItems.length, overlapScore, INTERPRETATION_MERGE_CONFIG) +
      rerankBonus;
    merged.set(key, {
      item,
      finalScore: lexicalScore,
      lexicalRank: index,
      lexicalScore,
      vectorSimilarity: null,
      vectorScore: 0,
      overlapScore,
      rerankBonus,
      bothBonus: 0,
      sourceKinds: ['lexical'],
    });
  });

  vectorItems.forEach(({ item, similarity }) => {
    const key = item.id ?? item.canonicalRoute ?? item.title;
    const existing = merged.get(key);
    const overlapScore = scoreQueryOverlap(query, item);
    const rerankBonus = scoreKnowledgeRerankBonus(query, item);
    const vectorScore =
      scoreVectorCandidate(similarity, overlapScore, INTERPRETATION_MERGE_CONFIG) + rerankBonus;
    if (existing) {
      existing.finalScore += vectorScore + INTERPRETATION_MERGE_CONFIG.bothBonus;
      existing.vectorSimilarity = similarity;
      existing.vectorScore = vectorScore;
      existing.overlapScore = Math.max(existing.overlapScore, overlapScore);
      existing.rerankBonus = Math.max(existing.rerankBonus, rerankBonus);
      existing.bothBonus += INTERPRETATION_MERGE_CONFIG.bothBonus;
      if (!existing.sourceKinds.includes('vector')) {
        existing.sourceKinds.push('vector');
      }
      if (existing.item.retrievalKind !== 'runtime-chunk' && item.retrievalKind === 'runtime-chunk') {
        existing.item = item;
      }
    } else {
      merged.set(key, {
        item,
        finalScore: vectorScore,
        lexicalRank: null,
        lexicalScore: 0,
        vectorSimilarity: similarity,
        vectorScore,
        overlapScore,
        rerankBonus,
        bothBonus: 0,
        sourceKinds: ['vector'],
      });
    }
  });

  const ranked = [...merged.values()]
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);

  return {
    items: ranked.map((entry) => entry.item),
    trace: ranked.map((entry) => ({
      id: entry.item.id ?? entry.item.canonicalRoute ?? entry.item.title,
      title: entry.item.title,
      canonicalRoute: entry.item.canonicalRoute ?? null,
      finalScore: Number(entry.finalScore.toFixed(2)),
      lexicalRank: entry.lexicalRank,
      lexicalScore: Number(entry.lexicalScore.toFixed(2)),
      vectorSimilarity:
        entry.vectorSimilarity === null ? null : Number(entry.vectorSimilarity.toFixed(4)),
      vectorScore: Number(entry.vectorScore.toFixed(2)),
      overlapScore: entry.overlapScore,
      rerankBonus: Number(entry.rerankBonus.toFixed(2)),
      bothBonus: Number(entry.bothBonus.toFixed(2)),
      sourceKinds: entry.sourceKinds,
    })),
  };
}

export function rankMergedCodingChunks(
  query: string,
  lexicalItems: CodingRuleChunk[],
  vectorItems: Array<{ item: CodingRuleChunk; similarity: number }>,
  limit: number,
): CodingRuleChunk[] {
  return rankMergedCodingChunksDetailed(query, lexicalItems, vectorItems, limit).items;
}

export function rankMergedCodingChunksDetailed(
  query: string,
  lexicalItems: CodingRuleChunk[],
  vectorItems: Array<{ item: CodingRuleChunk; similarity: number }>,
  limit: number,
): { items: CodingRuleChunk[]; trace: RetrievalTraceEntry[] } {
  const merged = new Map<string, MergeAccumulator<CodingRuleChunk>>();

  lexicalItems.forEach((item, index) => {
    const overlapScore = scoreQueryOverlap(query, {
      title: item.title,
      content: item.text,
      aliases: item.categoryTags,
    });
    const rerankBonus = scoreCodingRerankBonus(query, item);
    const lexicalScore =
      scoreLexicalCandidate(index, lexicalItems.length, overlapScore, CODING_MERGE_CONFIG) +
      rerankBonus;
    merged.set(item.id, {
      item,
      finalScore: lexicalScore,
      lexicalRank: index,
      lexicalScore,
      vectorSimilarity: null,
      vectorScore: 0,
      overlapScore,
      rerankBonus,
      bothBonus: 0,
      sourceKinds: ['lexical'],
    });
  });

  vectorItems.forEach(({ item, similarity }) => {
    const existing = merged.get(item.id);
    const overlapScore = scoreQueryOverlap(query, {
      title: item.title,
      content: item.text,
      aliases: item.categoryTags,
    });
    const rerankBonus = scoreCodingRerankBonus(query, item);
    const vectorScore =
      scoreVectorCandidate(similarity, overlapScore, CODING_MERGE_CONFIG) + rerankBonus;
    if (existing) {
      existing.finalScore += vectorScore + CODING_MERGE_CONFIG.bothBonus;
      existing.vectorSimilarity = similarity;
      existing.vectorScore = vectorScore;
      existing.overlapScore = Math.max(existing.overlapScore, overlapScore);
      existing.rerankBonus = Math.max(existing.rerankBonus, rerankBonus);
      existing.bothBonus += CODING_MERGE_CONFIG.bothBonus;
      if (!existing.sourceKinds.includes('vector')) {
        existing.sourceKinds.push('vector');
      }
    } else {
      merged.set(item.id, {
        item,
        finalScore: vectorScore,
        lexicalRank: null,
        lexicalScore: 0,
        vectorSimilarity: similarity,
        vectorScore,
        overlapScore,
        rerankBonus,
        bothBonus: 0,
        sourceKinds: ['vector'],
      });
    }
  });

  const ranked = [...merged.values()]
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);

  return {
    items: ranked.map((entry) => entry.item),
    trace: ranked.map((entry) => ({
      id: entry.item.id,
      title: entry.item.title,
      canonicalRoute: entry.item.id,
      finalScore: Number(entry.finalScore.toFixed(2)),
      lexicalRank: entry.lexicalRank,
      lexicalScore: Number(entry.lexicalScore.toFixed(2)),
      vectorSimilarity:
        entry.vectorSimilarity === null ? null : Number(entry.vectorSimilarity.toFixed(4)),
      vectorScore: Number(entry.vectorScore.toFixed(2)),
      overlapScore: entry.overlapScore,
      rerankBonus: Number(entry.rerankBonus.toFixed(2)),
      bothBonus: Number(entry.bothBonus.toFixed(2)),
      sourceKinds: entry.sourceKinds,
    })),
  };
}

export async function getHybridInterpretationKnowledge(params: {
  query: string;
  lang: Language;
  provider: HybridProvider;
  apiKey: string;
  limit?: number;
  signal?: AbortSignal;
}): Promise<HybridKnowledgeResult> {
  const limit = params.limit ?? 8;
  const lexicalItems = selectRelevantKnowledge(params.query, undefined, params.lang).slice(0, limit);

  if (!isReferenceVectorRuntimeReady(params.provider, params.lang)) {
    return {
      items: lexicalItems,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: rankMergedKnowledgeDetailed(params.query, lexicalItems, [], limit).trace,
    };
  }

  let vectorHits: Awaited<ReturnType<typeof searchReferenceChunkEmbeddings>>;
  try {
    const embedding = await embedReferenceQuery({
      provider: params.provider,
      apiKey: params.apiKey,
      text: params.query,
      signal: params.signal,
    });
    vectorHits = await searchReferenceChunkEmbeddings({
      locale: params.lang,
      provider: params.provider,
      queryVector: embedding.vector,
      limit: Math.max(limit * 2, 10),
    });
  } catch (error) {
    if (params.signal?.aborted) throw error;
    console.warn('[reference-hybrid-retrieval] Falling back to lexical interpretation retrieval.', error);
    return {
      items: lexicalItems,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: rankMergedKnowledgeDetailed(params.query, lexicalItems, [], limit).trace,
    };
  }
  const runtimeKnowledge = getBuiltInKnowledge(params.lang);
  const vectorItems = vectorHits
    .map((hit) => {
      const item = runtimeKnowledge.find((candidate) => candidate.id === `chunk:${hit.chunkId}`);
      return item ? { item, similarity: hit.similarity } : null;
    })
    .filter((value): value is { item: KnowledgeItem; similarity: number } => Boolean(value));

  const ranked = rankMergedKnowledgeDetailed(params.query, lexicalItems, vectorItems, limit);

  return {
    items: ranked.items,
    mode: 'hybrid',
    vectorHitCount: vectorItems.length,
    trace: ranked.trace,
  };
}

export async function getHybridCodingRuleChunks(params: {
  context: CodingAssistContext;
  lang: Language;
  provider: HybridProvider;
  apiKey: string;
  limit?: number;
  signal?: AbortSignal;
}): Promise<HybridCodingResult> {
  const limit = params.limit ?? 6;
  const query = buildCodingAssistQuery(params.context);
  const lexicalItems = selectCodingRuleChunks(params.context, params.lang, limit);

  if (!isReferenceVectorRuntimeReady(params.provider, params.lang)) {
    return {
      items: lexicalItems,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: rankMergedCodingChunksDetailed(query, lexicalItems, [], limit).trace,
    };
  }

  let vectorHits: Awaited<ReturnType<typeof searchReferenceChunkEmbeddings>>;
  try {
    const embedding = await embedReferenceQuery({
      provider: params.provider,
      apiKey: params.apiKey,
      text: query,
      signal: params.signal,
    });
    vectorHits = await searchReferenceChunkEmbeddings({
      locale: params.lang,
      provider: params.provider,
      queryVector: embedding.vector,
      limit: Math.max(limit * 2, 10),
      routePrefix: 'scoring-input/',
    });
  } catch (error) {
    if (params.signal?.aborted) throw error;
    console.warn('[reference-hybrid-retrieval] Falling back to lexical coding retrieval.', error);
    return {
      items: lexicalItems,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: rankMergedCodingChunksDetailed(query, lexicalItems, [], limit).trace,
    };
  }
  const codingChunks = getCodingRuleChunks(params.lang);
  const vectorItems = vectorHits
    .filter((hit) => hit.canonicalRoute.startsWith('scoring-input/'))
    .map((hit) => {
      const item = codingChunks.find((candidate) => candidate.id === `${params.lang}:${hit.chunkId}`);
      return item ? { item, similarity: hit.similarity } : null;
    })
    .filter((value): value is { item: CodingRuleChunk; similarity: number } => Boolean(value));

  const ranked = rankMergedCodingChunksDetailed(query, lexicalItems, vectorItems, limit);

  return {
    items: ranked.items,
    mode: 'hybrid',
    vectorHitCount: vectorItems.length,
    trace: ranked.trace,
  };
}
