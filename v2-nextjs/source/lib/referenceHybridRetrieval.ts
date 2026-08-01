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
const EXPLICIT_XY_AN_CONTENT_BOUNDARY_BONUS = 0.05;
const EXPLICIT_SAME_DETERMINANT_BOUNDARY_BONUS = 0.06;
const EXPLICIT_CONTAM_EXCLUSION_BOUNDARY_BONUS = 0.06;
const EXPLICIT_C_PRIME_FQ_BOUNDARY_BONUS = 0.06;
const EXPLICIT_SPECIAL_SCORE_LEVEL_PAIR_BONUS = 0.06;
const EXPLICIT_CRITICAL_SCORE_OVERLAP_BONUS = 0.06;

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

function isExplicitXyAnContentBoundaryQuery(query: string): boolean {
  return ['xy', 'an'].every((code) => hasAsciiCodeToken(query, code));
}

const SAME_DETERMINANT_FORM_EMPHASIS_GROUPS = [
  ['fc', 'cf', 'c'],
  ["fc'", "c'f", "c'"],
  ['ft', 'tf', 't'],
  ['fv', 'vf', 'v'],
  ['fy', 'yf', 'y'],
  ['fr', 'rf'],
] as const;

function isExplicitSameDeterminantFormEmphasisQuery(query: string): boolean {
  if (isExplicitCnCalculationBoundaryQuery(query)) return false;
  return SAME_DETERMINANT_FORM_EMPHASIS_GROUPS.some(
    (group) => group.filter((code) => hasAsciiCodeToken(query, code)).length >= 2,
  );
}

const CONTAM_EXCLUDED_QUERY_CODES = [
  'dv',
  'dv1',
  'dv2',
  'dr',
  'dr1',
  'dr2',
  'incom',
  'incom1',
  'incom2',
  'fabcom',
  'fabcom1',
  'fabcom2',
  'alog',
] as const;

function isExplicitContamExclusionQuery(query: string): boolean {
  return (
    hasAsciiCodeToken(query, 'contam') &&
    CONTAM_EXCLUDED_QUERY_CODES.some((code) => hasAsciiCodeToken(query, code))
  );
}

const SPECIAL_SCORE_LEVEL_PAIRS = [
  ['dv1', 'dv2'],
  ['dr1', 'dr2'],
  ['incom1', 'incom2'],
  ['fabcom1', 'fabcom2'],
] as const;

function isExplicitSpecialScoreLevelPairQuery(query: string): boolean {
  return SPECIAL_SCORE_LEVEL_PAIRS.some((pair) =>
    pair.every((code) => hasAsciiCodeToken(query, code)),
  );
}

const CRITICAL_SPECIAL_SCORE_QUERY_CODES = [
  'dv1',
  'dv2',
  'dr1',
  'dr2',
  'incom1',
  'incom2',
  'fabcom1',
  'fabcom2',
  'alog',
] as const;

const CRITICAL_SCORE_OVERLAP_QUERY_PATTERNS = [
  /same\s+(?:wording|expression)/iu,
  /overlap(?:ped|ping|s)?/iu,
  /같은\s*(?:표현|문구)|겹치/u,
  /同じ(?:表現|文言)|重な/u,
  /misma\s+expresi[oó]n|superpuest/iu,
  /mesma\s+(?:formula[cç][aã]o|express[aã]o)|sobrepost/iu,
];

function isExplicitCriticalSpecialScoreOverlapQuery(query: string): boolean {
  const mentionedCodes = CRITICAL_SPECIAL_SCORE_QUERY_CODES.filter((code) =>
    hasAsciiCodeToken(query, code),
  );

  return (
    mentionedCodes.length >= 2 &&
    CRITICAL_SCORE_OVERLAP_QUERY_PATTERNS.some((pattern) => pattern.test(query))
  );
}

function isExplicitCPrimeFormQualityQuery(query: string): boolean {
  if (!hasAsciiCodeToken(query, "c'")) return false;
  return [
    /\bfq(?:none)?\b/iu,
    /형태질/u,
    /形態質/u,
    /calidad\s+formal/iu,
    /qualidade\s+formal/iu,
    /form\s+quality/iu,
  ].some((pattern) => pattern.test(query));
}

const NATURE_CONTENT_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/Na만/u, /Na.*없/u, /(?:하나만|둘 중 하나)/u],
  en: [/Na only/iu, /Na is absent/iu, /(?:only one|one that)/iu],
  ja: [/Naだけ/u, /Naがなく/u, /一方だけ/u],
  es: [/solo Na/iu, /Na no está presente/iu, /(?:solo|únicamente).*(?:código|uno)/iu],
  pt: [/apenas Na/iu, /não houver Na/iu, /(?:somente|apenas).*(?:código|um)/iu],
};

const XY_AN_CONTENT_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/Xy/u, /An/u, /(?:더하지|추가하지|함께.*않)/u],
  en: [/Xy/iu, /An/iu, /(?:do not add|excludes)/iu],
  ja: [/Xy/u, /An/u, /(?:併記しません|加えません)/u],
  es: [/Xy/iu, /An/iu, /(?:no se añade|excluye)/iu],
  pt: [/Xy/iu, /An/iu, /(?:não é acrescentado|exclui)/iu],
};

const SAME_DETERMINANT_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/FC\/CF\/C/u, /(?:하나만|둘 이상.*않)/u, /형태 관여가 가장 적은/u],
  en: [/FC\/CF\/C/iu, /(?:only one|do not record more than one)/iu, /least form emphasis/iu],
  ja: [/FC\/CF\/C/u, /(?:一つだけ|複数記録しません)/u, /形態の関与が最も少ない/u],
  es: [/FC\/CF\/C/iu, /(?:un solo código|más de una)/iu, /menor predominio formal/iu],
  pt: [/FC\/CF\/C/iu, /(?:apenas um código|mais de uma)/iu, /menor predomínio formal/iu],
};

const CONTAM_EXCLUSION_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/CONTAM/u, /DV/u, /함께 기록하지/u],
  en: [/CONTAM/iu, /DV/iu, /do not also record/iu],
  ja: [/CONTAM/u, /DV/u, /併記しません/u],
  es: [/CONTAM/iu, /DV/iu, /no se añaden/iu],
  pt: [/CONTAM/iu, /DV/iu, /não se registram/iu],
};

const C_PRIME_FQ_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/C'/u, /FQnone/u],
  en: [/C'/iu, /FQnone/iu],
  ja: [/C'/u, /FQnone/u],
  es: [/C'/iu, /FQnone/iu],
  pt: [/C'/iu, /FQnone/iu],
};

const SPECIAL_SCORE_LEVEL_PAIR_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/DV1\/DV2/u, /각 쌍 중 하나만/u, /Level 1/u],
  en: [/DV1\/DV2/iu, /only one level/iu, /Level 1/iu],
  ja: [/DV1\/DV2/u, /どちらか一方だけ/u, /Level 1/u],
  es: [/DV1\/DV2/iu, /un solo nivel/iu, /Nivel 1/iu],
  pt: [/DV1\/DV2/iu, /apenas um nível/iu, /Nível 1/iu],
};

const CRITICAL_SCORE_OVERLAP_RULE_TEXT_PATTERNS: Record<Language, RegExp[]> = {
  ko: [/독립된 표현/u, /같은 표현/u, /WSum6/u],
  en: [/discrete wording/iu, /same wording/iu, /WSum6/iu],
  ja: [/独立した表現/u, /同じ表現/u, /WSum6/u],
  es: [/expresión independiente/iu, /misma expresión/iu, /WSum6/iu],
  pt: [/formulação independente/iu, /mesma formulação/iu, /WSum6/iu],
};

function matchesLocaleRuleText(
  text: string,
  lang: Language,
  patternsByLocale: Record<Language, RegExp[]>,
): boolean {
  return patternsByLocale[lang].every((pattern) => pattern.test(text));
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
  const xyAnContentBoundaryBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/contents/xy' &&
    isExplicitXyAnContentBoundaryQuery(query)
      ? EXPLICIT_XY_AN_CONTENT_BOUNDARY_BONUS
      : 0;
  const sameDeterminantBoundaryBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/determinants' &&
    isExplicitSameDeterminantFormEmphasisQuery(query)
      ? EXPLICIT_SAME_DETERMINANT_BOUNDARY_BONUS
      : 0;
  const contamExclusionBoundaryBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/special-score/contam' &&
    isExplicitContamExclusionQuery(query)
      ? EXPLICIT_CONTAM_EXCLUSION_BOUNDARY_BONUS
      : 0;
  const cPrimeFqBoundaryBonus =
    item.canonicalRoute?.toLowerCase() === "scoring-input/determinants/c'" &&
    isExplicitCPrimeFormQualityQuery(query)
      ? EXPLICIT_C_PRIME_FQ_BOUNDARY_BONUS
      : 0;
  const specialScoreLevelPairBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/special-score' &&
    isExplicitSpecialScoreLevelPairQuery(query)
      ? EXPLICIT_SPECIAL_SCORE_LEVEL_PAIR_BONUS
      : 0;
  const criticalScoreOverlapBonus =
    item.canonicalRoute?.toLowerCase() === 'scoring-input/special-score' &&
    isExplicitCriticalSpecialScoreOverlapQuery(query)
      ? EXPLICIT_CRITICAL_SCORE_OVERLAP_BONUS
      : 0;

  return (
    titleBonus +
    tagBonus +
    routeTagBonus +
    intentBonus +
    cnBoundaryBonus +
    natureContentBoundaryBonus +
    xyAnContentBoundaryBonus +
    sameDeterminantBoundaryBonus +
    contamExclusionBoundaryBonus +
    cPrimeFqBoundaryBonus +
    specialScoreLevelPairBonus +
    criticalScoreOverlapBonus
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
          matchesLocaleRuleText(
            item.text,
            params.lang,
            NATURE_CONTENT_RULE_TEXT_PATTERNS,
          ),
      )
    : [];
  const explicitXyAnContentBoundaryItems = isExplicitXyAnContentBoundaryQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === 'scoring-input/contents/xy' &&
          matchesLocaleRuleText(
            item.text,
            params.lang,
            XY_AN_CONTENT_RULE_TEXT_PATTERNS,
          ),
      )
    : [];
  const explicitSameDeterminantBoundaryItems =
    isExplicitSameDeterminantFormEmphasisQuery(query)
      ? codingChunks.filter(
          (item) =>
            item.canonicalRoute?.toLowerCase() === 'scoring-input/determinants' &&
            matchesLocaleRuleText(
              item.text,
              params.lang,
              SAME_DETERMINANT_RULE_TEXT_PATTERNS,
            ),
        )
      : [];
  const explicitContamExclusionBoundaryItems = isExplicitContamExclusionQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === 'scoring-input/special-score/contam' &&
          matchesLocaleRuleText(
            item.text,
            params.lang,
            CONTAM_EXCLUSION_RULE_TEXT_PATTERNS,
          ),
      )
    : [];
  const explicitCPrimeFqBoundaryItems = isExplicitCPrimeFormQualityQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === "scoring-input/determinants/c'" &&
          matchesLocaleRuleText(item.text, params.lang, C_PRIME_FQ_RULE_TEXT_PATTERNS),
      )
    : [];
  const explicitSpecialScoreLevelPairItems = isExplicitSpecialScoreLevelPairQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === 'scoring-input/special-score' &&
          matchesLocaleRuleText(
            item.text,
            params.lang,
            SPECIAL_SCORE_LEVEL_PAIR_RULE_TEXT_PATTERNS,
          ),
      )
    : [];
  const explicitCriticalScoreOverlapItems = isExplicitCriticalSpecialScoreOverlapQuery(query)
    ? codingChunks.filter(
        (item) =>
          item.canonicalRoute?.toLowerCase() === 'scoring-input/special-score' &&
          matchesLocaleRuleText(
            item.text,
            params.lang,
            CRITICAL_SCORE_OVERLAP_RULE_TEXT_PATTERNS,
          ),
      )
    : [];
  const lexicalItems = deduplicateByKey(
    [
      ...explicitSpecialScoreLevelPairItems,
      ...explicitCriticalScoreOverlapItems,
      ...explicitSameDeterminantBoundaryItems,
      ...explicitContamExclusionBoundaryItems,
      ...explicitCPrimeFqBoundaryItems,
      ...explicitCnBoundaryItems,
      ...explicitNatureContentBoundaryItems,
      ...explicitXyAnContentBoundaryItems,
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
