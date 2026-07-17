import { type Language } from '@/types';
import { type Provider } from '@/lib/aiModels';
import {
  type KnowledgeItem,
  getBuiltInKnowledge,
  isBroadInterpretationQuery,
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
import { getReferenceRuntimeChunks } from '@/lib/referenceCorpus';
import { isReferenceVectorRuntimeReady } from '@/lib/referenceVectorRuntime';
import { filterCurrentReferenceVectorHits } from '@/lib/referenceVectorIntegrity';
import { searchReferenceChunkEmbeddings } from '@/lib/referenceVectorStore';

type HybridProvider = Extract<Provider, 'openai'>;
export type HybridRetrievalMode = 'lexical' | 'hybrid';

export type RetrievalTraceEntry = {
  id: string;
  title: string;
  canonicalRoute: string | null;
  finalScore: number;
  lexicalRank: number | null;
  vectorRank: number | null;
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

type RrfMergeConfig = {
  rrfK: number;
  lexicalWeight: number;
  vectorWeight: number;
  overlapWeight: number;
  bothBonus: number;
  minimumVectorSimilarity: number;
};

const INTERPRETATION_MERGE_CONFIG: RrfMergeConfig = {
  rrfK: 60,
  lexicalWeight: 1.1,
  vectorWeight: 1,
  overlapWeight: 0.00005,
  bothBonus: 0.002,
  minimumVectorSimilarity: 0.32,
};

const CODING_MERGE_CONFIG: RrfMergeConfig = {
  rrfK: 60,
  lexicalWeight: 1.2,
  vectorWeight: 0.8,
  overlapWeight: 0.00005,
  bothBonus: 0.002,
  minimumVectorSimilarity: 0.32,
};

const BROAD_INTERPRETATION_ANCHOR_BONUS = 0.02;
const EXPLICIT_CODING_INTENT_BONUS = 0.04;
const EXPLICIT_CN_BOUNDARY_INTENT_BONUS = 0.05;
const EXPLICIT_NATURE_CONTENT_BOUNDARY_BONUS = 0.05;

const POPULAR_QUERY_PATTERNS = [
  /\bpopular(?:\s+response)?\b/iu,
  /인기\s*반응/u,
  /人気反応/u,
  /respuesta\s+popular/iu,
  /resposta\s+popular/iu,
  /(^|[^\p{L}\p{N}])p(?:로|를|가|는|으로)?(?=$|[^\p{L}\p{N}])/iu,
];

function isExplicitPopularQuery(query: string): boolean {
  return POPULAR_QUERY_PATTERNS.some((pattern) => pattern.test(query));
}

function hasAsciiCodeToken(query: string, code: string): boolean {
  return new RegExp(`(^|[^a-z0-9_])${code}(?=$|[^a-z0-9_])`, 'iu').test(query);
}

function isExplicitCnCalculationBoundaryQuery(query: string): boolean {
  // Use an ASCII code boundary so Korean/Japanese particles may immediately
  // follow `Cn` without turning it into an unrelated English identifier.
  if (!hasAsciiCodeToken(query, 'cn')) return false;

  const boundarySignals = [
    /wsumc/iu,
    /s-?con/iu,
    /color[\s-]*shading/iu,
    /fc\s*:\s*cf\s*\+\s*c/iu,
  ];

  return boundarySignals.some((pattern) => pattern.test(query));
}

function isExplicitNatureContentBoundaryQuery(query: string): boolean {
  return ['na', 'bt', 'ls'].every((code) => hasAsciiCodeToken(query, code));
}

type MergeAccumulator<TItem> = {
  item: TItem;
  finalScore: number;
  lexicalRank: number | null;
  vectorRank: number | null;
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
    if (token.length < 2) continue;
    if (haystack.includes(token)) {
      score += token.length >= 4 ? 8 : 3;
    }
  }
  return Math.min(score, 12);
}

function scoreRrfRank(rankIndex: number, weight: number, k: number): number {
  return weight / (k + rankIndex + 1);
}

function hasMinimumVectorSignal(similarity: number, config: RrfMergeConfig): boolean {
  return Number.isFinite(similarity) && similarity >= config.minimumVectorSimilarity;
}

function deduplicateByKey<TItem>(
  items: TItem[],
  getKey: (item: TItem, index: number) => string,
): TItem[] {
  const seen = new Set<string>();

  return items.filter((item, index) => {
    const key = getKey(item, index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function prepareVectorCandidates<TItem>(
  items: Array<{ item: TItem; similarity: number }>,
  config: RrfMergeConfig,
  getKey: (item: TItem, index: number) => string,
): Array<{ item: TItem; similarity: number }> {
  const sorted = items
    .filter(({ similarity }) => hasMinimumVectorSignal(similarity, config))
    .sort((a, b) => b.similarity - a.similarity);
  const seen = new Set<string>();

  return sorted.filter(({ item }, index) => {
    const key = getKey(item, index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isInterpretationKnowledgeItem(item: KnowledgeItem): boolean {
  return (
    item.canonicalRoute === 'result-interpretation' ||
    item.canonicalRoute?.startsWith('result-interpretation/') === true
  );
}

function getKnowledgeMergeKey(item: KnowledgeItem): string {
  return item.canonicalRoute ?? item.id ?? `${item.title}\u0000${item.content}`;
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
  const titleBonus = scoreExactOrPrefixMatch(query, item.title, 0.006, 0.002);
  const routeBonus = scoreExactOrPrefixMatch(query, item.canonicalRoute, 0.012, 0.004);
  const aliasBonus = Math.max(
    0,
    ...(item.aliases ?? []).map((alias) => scoreExactOrPrefixMatch(query, alias, 0.008, 0.003)),
  );
  const retrievalKindBonus = item.retrievalKind === 'runtime-route-summary' ? 0.0004 : 0;

  return titleBonus + routeBonus + aliasBonus + retrievalKindBonus;
}

function scoreCodingRerankBonus(query: string, item: CodingRuleChunk): number {
  const titleBonus = scoreExactOrPrefixMatch(query, item.title, 0.006, 0.002);
  const tagBonus = Math.max(
    0,
    ...item.categoryTags.map((tag) => scoreExactOrPrefixMatch(query, tag, 0.008, 0.003)),
  );
  const routeTagBonus = item.categoryTags.some((tag) => tag.startsWith('scoring-input'))
    ? 0.0004
    : 0;
  const intentBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/popular' &&
    isExplicitPopularQuery(query)
      ? EXPLICIT_CODING_INTENT_BONUS
      : 0;
  const cnBoundaryBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/determinants/cn' &&
    isExplicitCnCalculationBoundaryQuery(query)
      ? EXPLICIT_CN_BOUNDARY_INTENT_BONUS
      : 0;
  const natureContentBoundaryBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/contents/na' &&
    isExplicitNatureContentBoundaryQuery(query)
      ? EXPLICIT_NATURE_CONTENT_BOUNDARY_BONUS
      : 0;

  return (
    titleBonus +
    tagBonus +
    routeTagBonus +
    intentBonus +
    cnBoundaryBonus +
    natureContentBoundaryBonus
  );
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
  const getKey = (item: KnowledgeItem) => getKnowledgeMergeKey(item);
  const deduplicatedLexicalCandidates = deduplicateByKey(lexicalItems, getKey);
  const broadInterpretationAnchor =
    deduplicatedLexicalCandidates[0]?.canonicalRoute === 'result-interpretation';
  const lexicalCandidates = broadInterpretationAnchor
    ? deduplicatedLexicalCandidates.filter(isInterpretationKnowledgeItem)
    : deduplicatedLexicalCandidates;
  const preparedVectorCandidates = prepareVectorCandidates(
    vectorItems,
    INTERPRETATION_MERGE_CONFIG,
    getKey,
  );
  const vectorCandidates = broadInterpretationAnchor
    ? preparedVectorCandidates.filter(({ item }) => isInterpretationKnowledgeItem(item))
    : preparedVectorCandidates;

  lexicalCandidates.forEach((item, index) => {
    const key = getKey(item);
    const overlapScore = scoreQueryOverlap(query, item);
    const rerankBonus =
      scoreKnowledgeRerankBonus(query, item) +
      (broadInterpretationAnchor && index === 0
        ? BROAD_INTERPRETATION_ANCHOR_BONUS
        : 0);
    const lexicalScore = scoreRrfRank(
      index,
      INTERPRETATION_MERGE_CONFIG.lexicalWeight,
      INTERPRETATION_MERGE_CONFIG.rrfK,
    );
    merged.set(key, {
      item,
      finalScore:
        lexicalScore +
        overlapScore * INTERPRETATION_MERGE_CONFIG.overlapWeight +
        rerankBonus,
      lexicalRank: index + 1,
      vectorRank: null,
      lexicalScore,
      vectorSimilarity: null,
      vectorScore: 0,
      overlapScore,
      rerankBonus,
      bothBonus: 0,
      sourceKinds: ['lexical'],
    });
  });

  vectorCandidates.forEach(({ item, similarity }, index) => {
    const key = getKey(item);
    const existing = merged.get(key);
    const vectorScore = scoreRrfRank(
      index,
      INTERPRETATION_MERGE_CONFIG.vectorWeight,
      INTERPRETATION_MERGE_CONFIG.rrfK,
    );
    if (existing) {
      existing.finalScore += vectorScore + INTERPRETATION_MERGE_CONFIG.bothBonus;
      existing.vectorRank = index + 1;
      existing.vectorSimilarity = similarity;
      existing.vectorScore = vectorScore;
      existing.bothBonus = INTERPRETATION_MERGE_CONFIG.bothBonus;
      if (!existing.sourceKinds.includes('vector')) {
        existing.sourceKinds.push('vector');
      }
    } else {
      const overlapScore = scoreQueryOverlap(query, item);
      const rerankBonus = scoreKnowledgeRerankBonus(query, item);
      merged.set(key, {
        item,
        finalScore:
          vectorScore +
          overlapScore * INTERPRETATION_MERGE_CONFIG.overlapWeight +
          rerankBonus,
        lexicalRank: null,
        vectorRank: index + 1,
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
      finalScore: Number(entry.finalScore.toFixed(6)),
      lexicalRank: entry.lexicalRank,
      vectorRank: entry.vectorRank,
      lexicalScore: Number(entry.lexicalScore.toFixed(6)),
      vectorSimilarity:
        entry.vectorSimilarity === null ? null : Number(entry.vectorSimilarity.toFixed(4)),
      vectorScore: Number(entry.vectorScore.toFixed(6)),
      overlapScore: entry.overlapScore,
      rerankBonus: Number(entry.rerankBonus.toFixed(6)),
      bothBonus: Number(entry.bothBonus.toFixed(6)),
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
  const getKey = (item: CodingRuleChunk) => item.canonicalRoute ?? item.id;
  const lexicalCandidates = deduplicateByKey(lexicalItems, getKey);
  const vectorCandidates = prepareVectorCandidates(vectorItems, CODING_MERGE_CONFIG, getKey);

  lexicalCandidates.forEach((item, index) => {
    const overlapScore = scoreQueryOverlap(query, {
      title: item.title,
      content: item.text,
      aliases: item.categoryTags,
    });
    const rerankBonus = scoreCodingRerankBonus(query, item);
    const lexicalScore = scoreRrfRank(
      index,
      CODING_MERGE_CONFIG.lexicalWeight,
      CODING_MERGE_CONFIG.rrfK,
    );
    merged.set(getKey(item), {
      item,
      finalScore:
        lexicalScore + overlapScore * CODING_MERGE_CONFIG.overlapWeight + rerankBonus,
      lexicalRank: index + 1,
      vectorRank: null,
      lexicalScore,
      vectorSimilarity: null,
      vectorScore: 0,
      overlapScore,
      rerankBonus,
      bothBonus: 0,
      sourceKinds: ['lexical'],
    });
  });

  vectorCandidates.forEach(({ item, similarity }, index) => {
    const existing = merged.get(getKey(item));
    const vectorScore = scoreRrfRank(
      index,
      CODING_MERGE_CONFIG.vectorWeight,
      CODING_MERGE_CONFIG.rrfK,
    );
    if (existing) {
      existing.finalScore += vectorScore + CODING_MERGE_CONFIG.bothBonus;
      existing.vectorRank = index + 1;
      existing.vectorSimilarity = similarity;
      existing.vectorScore = vectorScore;
      existing.bothBonus = CODING_MERGE_CONFIG.bothBonus;
      if (!existing.sourceKinds.includes('vector')) {
        existing.sourceKinds.push('vector');
      }
    } else {
      const overlapScore = scoreQueryOverlap(query, {
        title: item.title,
        content: item.text,
        aliases: item.categoryTags,
      });
      const rerankBonus = scoreCodingRerankBonus(query, item);
      merged.set(getKey(item), {
        item,
        finalScore:
          vectorScore + overlapScore * CODING_MERGE_CONFIG.overlapWeight + rerankBonus,
        lexicalRank: null,
        vectorRank: index + 1,
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
      canonicalRoute: entry.item.canonicalRoute ?? entry.item.id,
      finalScore: Number(entry.finalScore.toFixed(6)),
      lexicalRank: entry.lexicalRank,
      vectorRank: entry.vectorRank,
      lexicalScore: Number(entry.lexicalScore.toFixed(6)),
      vectorSimilarity:
        entry.vectorSimilarity === null ? null : Number(entry.vectorSimilarity.toFixed(4)),
      vectorScore: Number(entry.vectorScore.toFixed(6)),
      overlapScore: entry.overlapScore,
      rerankBonus: Number(entry.rerankBonus.toFixed(6)),
      bothBonus: Number(entry.bothBonus.toFixed(6)),
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
  const broadInterpretation = isBroadInterpretationQuery(params.query, params.lang);
  const selectedLexicalItems = selectRelevantKnowledge(params.query, undefined, params.lang);
  const lexicalItems = broadInterpretation
    ? selectedLexicalItems.filter(isInterpretationKnowledgeItem)
    : selectedLexicalItems;
  const lexicalOnly = rankMergedKnowledgeDetailed(params.query, lexicalItems, [], limit);

  if (!isReferenceVectorRuntimeReady(params.provider, params.lang)) {
    return {
      items: lexicalOnly.items,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: lexicalOnly.trace,
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
    const searchedVectorHits = await searchReferenceChunkEmbeddings({
      locale: params.lang,
      provider: params.provider,
      queryVector: embedding.vector,
      limit: Math.max(limit * 2, 10),
      routePrefix: broadInterpretation ? 'result-interpretation' : undefined,
    });
    vectorHits = filterCurrentReferenceVectorHits(
      searchedVectorHits,
      getReferenceRuntimeChunks(params.lang),
    );
  } catch (error) {
    if (params.signal?.aborted) throw error;
    console.warn('[reference-hybrid-retrieval] Falling back to lexical interpretation retrieval.', error);
    return {
      items: lexicalOnly.items,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: lexicalOnly.trace,
    };
  }
  const runtimeKnowledge = getBuiltInKnowledge(params.lang);
  const preparedVectorItems = prepareVectorCandidates(
    vectorHits
      .map((hit) => {
        const item = runtimeKnowledge.find((candidate) => candidate.id === `chunk:${hit.chunkId}`);
        return item ? { item, similarity: hit.similarity } : null;
      })
      .filter((value): value is { item: KnowledgeItem; similarity: number } => Boolean(value)),
    INTERPRETATION_MERGE_CONFIG,
    (item) => getKnowledgeMergeKey(item),
  );
  const vectorItems = broadInterpretation
    ? preparedVectorItems.filter(({ item }) => isInterpretationKnowledgeItem(item))
    : preparedVectorItems;

  const ranked = rankMergedKnowledgeDetailed(params.query, lexicalItems, vectorItems, limit);

  return {
    items: ranked.items,
    mode: vectorItems.length > 0 ? 'hybrid' : 'lexical',
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
  const codingChunks = getCodingRuleChunks(params.lang);
  const explicitPopularItems = isExplicitPopularQuery(query)
    ? codingChunks.filter(
        (item) => item.canonicalRoute?.toLowerCase() === 'scoring-input/popular',
      )
    : [];
  const explicitCnBoundaryItems = isExplicitCnCalculationBoundaryQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === 'scoring-input/determinants/cn' &&
          /wsumc/iu.test(item.text) &&
          /s-?con/iu.test(item.text) &&
          /color[\s-]*shading/iu.test(item.text),
      )
    : [];
  const explicitNatureContentBoundaryItems = isExplicitNatureContentBoundaryQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === 'scoring-input/contents/na' &&
          /(^|[^a-z0-9_])na(?=$|[^a-z0-9_])/iu.test(item.text) &&
          /(^|[^a-z0-9_])bt(?=$|[^a-z0-9_])/iu.test(item.text) &&
          /(^|[^a-z0-9_])ls(?=$|[^a-z0-9_])/iu.test(item.text),
      )
    : [];
  const lexicalItems = deduplicateByKey(
    [
      ...explicitCnBoundaryItems,
      ...explicitNatureContentBoundaryItems,
      ...explicitPopularItems,
      ...selectCodingRuleChunks(params.context, params.lang, limit),
    ],
    (item) => item.canonicalRoute ?? item.id,
  );
  const lexicalOnly = rankMergedCodingChunksDetailed(query, lexicalItems, [], limit);

  if (!isReferenceVectorRuntimeReady(params.provider, params.lang)) {
    return {
      items: lexicalOnly.items,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: lexicalOnly.trace,
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
    const searchedVectorHits = await searchReferenceChunkEmbeddings({
      locale: params.lang,
      provider: params.provider,
      queryVector: embedding.vector,
      limit: Math.max(limit * 2, 10),
      routePrefix: 'scoring-input/',
    });
    vectorHits = filterCurrentReferenceVectorHits(
      searchedVectorHits,
      getReferenceRuntimeChunks(params.lang),
    );
  } catch (error) {
    if (params.signal?.aborted) throw error;
    console.warn('[reference-hybrid-retrieval] Falling back to lexical coding retrieval.', error);
    return {
      items: lexicalOnly.items,
      mode: 'lexical',
      vectorHitCount: 0,
      trace: lexicalOnly.trace,
    };
  }
  const vectorItems = prepareVectorCandidates(
    vectorHits
      .filter((hit) => hit.canonicalRoute.startsWith('scoring-input/'))
      .map((hit) => {
        const item = codingChunks.find((candidate) => candidate.id === `${params.lang}:${hit.chunkId}`);
        return item ? { item, similarity: hit.similarity } : null;
      })
      .filter((value): value is { item: CodingRuleChunk; similarity: number } => Boolean(value)),
    CODING_MERGE_CONFIG,
    (item) => item.canonicalRoute ?? item.id,
  );

  const ranked = rankMergedCodingChunksDetailed(query, lexicalItems, vectorItems, limit);

  return {
    items: ranked.items,
    mode: vectorItems.length > 0 ? 'hybrid' : 'lexical',
    vectorHitCount: vectorItems.length,
    trace: ranked.trace,
  };
}
