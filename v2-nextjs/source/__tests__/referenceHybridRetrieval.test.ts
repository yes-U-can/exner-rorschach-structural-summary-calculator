import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { KnowledgeItem } from '@/lib/chatKnowledge';
import type { CodingRuleChunk } from '@/lib/codingAssistKnowledge';
import {
  getHybridCodingRuleChunks,
  getHybridInterpretationKnowledge,
  rankMergedCodingChunks,
  rankMergedKnowledge,
  rankMergedKnowledgeDetailed,
} from '@/lib/referenceHybridRetrieval';

const retrievalMocks = vi.hoisted(() => ({
  runtimeReady: vi.fn(() => false),
  embedQuery: vi.fn(),
  searchVectors: vi.fn(),
}));

vi.mock('@/lib/referenceVectorRuntime', () => ({
  isReferenceVectorRuntimeReady: retrievalMocks.runtimeReady,
}));

vi.mock('@/lib/referenceEmbeddings', () => ({
  embedReferenceQuery: retrievalMocks.embedQuery,
}));

vi.mock('@/lib/referenceVectorStore', () => ({
  searchReferenceChunkEmbeddings: retrievalMocks.searchVectors,
}));

describe('referenceHybridRetrieval', () => {
  beforeEach(() => {
    retrievalMocks.runtimeReady.mockReset();
    retrievalMocks.runtimeReady.mockReturnValue(false);
    retrievalMocks.embedQuery.mockReset();
    retrievalMocks.searchVectors.mockReset();
  });

  it('keeps exact route-oriented interpretation hits above broad vector matches', () => {
    const exactRoute: KnowledgeItem = {
      id: 'route:scoring-input/dq/+',
      title: 'DQ+',
      content: 'DQ plus route summary',
      source: 'builtin',
      locale: 'en',
      aliases: ['DQ+'],
      canonicalRoute: 'scoring-input/dq/+',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const broadChunk: KnowledgeItem = {
      id: 'chunk:result-interpretation/general',
      title: 'General processing note',
      content: 'Interpretive note that happens to mention developmental quality.',
      source: 'builtin',
      locale: 'en',
      aliases: ['developmental quality'],
      canonicalRoute: 'result-interpretation/lower-section/processing/general',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledge(
      'scoring-input/dq/+',
      [exactRoute],
      [{ item: broadChunk, similarity: 0.93 }],
      4,
    );

    expect(ranked[0]?.canonicalRoute).toBe('scoring-input/dq/+');
  });

  it('rewards items that are supported by both lexical and vector retrieval', () => {
    const shared: KnowledgeItem = {
      id: 'chunk:shared',
      title: 'Form quality anchor',
      content: 'Use this section when the question is about form quality.',
      source: 'builtin',
      locale: 'en',
      aliases: ['form quality'],
      canonicalRoute: 'scoring-input/fq/overview',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };
    const lexicalOnly: KnowledgeItem = {
      id: 'chunk:lexical-only',
      title: 'Nearby topic',
      content: 'Some nearby lexical topic.',
      source: 'builtin',
      locale: 'en',
      aliases: ['form'],
      canonicalRoute: 'scoring-input/fq/nearby',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledge(
      'form quality',
      [lexicalOnly, shared],
      [{ item: shared, similarity: 0.88 }],
      4,
    );

    expect(ranked[0]?.id).toBe('chunk:shared');
  });

  it('returns score breakdown trace for the selected interpretation results', () => {
    const shared: KnowledgeItem = {
      id: 'chunk:shared',
      title: 'DQ overview',
      content: 'Route summary for DQ.',
      source: 'builtin',
      locale: 'en',
      aliases: ['dq', 'developmental quality'],
      canonicalRoute: 'scoring-input/dq/overview',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const broadChunk: KnowledgeItem = {
      id: 'chunk:broad',
      title: 'Broad interpretation',
      content: 'A broad interpretive note about organization.',
      source: 'builtin',
      locale: 'en',
      aliases: ['organization'],
      canonicalRoute: 'result-interpretation/general/organization',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledgeDetailed(
      'scoring-input/dq/overview',
      [shared, broadChunk],
      [{ item: shared, similarity: 0.81 }],
      4,
    );

    expect(ranked.items[0]?.id).toBe('chunk:shared');
    expect(ranked.trace[0]?.id).toBe('chunk:shared');
    expect(ranked.trace[0]?.sourceKinds).toEqual(['lexical', 'vector']);
    expect(ranked.trace[0]?.lexicalScore).toBeGreaterThan(0);
    expect(ranked.trace[0]?.vectorScore).toBeGreaterThan(0);
    expect(ranked.trace[0]?.rerankBonus).toBeGreaterThan(0);
    expect(ranked.trace[0]?.bothBonus).toBeGreaterThan(0);
  });

  it('drops vector-only candidates below the minimum similarity signal', () => {
    const lexical: KnowledgeItem = {
      id: 'route:result-interpretation',
      title: 'Interpretation overview',
      content: 'Start with the whole record.',
      source: 'builtin',
      locale: 'en',
      aliases: ['overview'],
      canonicalRoute: 'result-interpretation',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const noise: KnowledgeItem = {
      id: 'chunk:noise',
      title: 'Unrelated scoring fragment',
      content: 'A weak semantic match.',
      source: 'builtin',
      locale: 'en',
      aliases: [],
      canonicalRoute: 'scoring-input/contents/A',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledgeDetailed(
      'Where should I begin interpreting the whole record?',
      [lexical],
      [{ item: noise, similarity: 0.12 }],
      4,
    );

    expect(ranked.items).toHaveLength(1);
    expect(ranked.items[0]?.canonicalRoute).toBe('result-interpretation');
  });

  it('deduplicates route summaries and chunks by canonical route', () => {
    const routeSummary: KnowledgeItem = {
      id: 'route:result-interpretation/lower-section/core/Lambda',
      title: 'Lambda',
      content: 'Route-level Lambda guidance.',
      source: 'builtin',
      locale: 'en',
      aliases: ['Lambda'],
      canonicalRoute: 'result-interpretation/lower-section/core/Lambda',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const firstChunk: KnowledgeItem = {
      ...routeSummary,
      id: 'chunk:lambda-1',
      content: 'First Lambda chunk.',
      retrievalKind: 'runtime-chunk',
    };
    const secondChunk: KnowledgeItem = {
      ...routeSummary,
      id: 'chunk:lambda-2',
      content: 'Second Lambda chunk.',
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledgeDetailed(
      'How should Lambda be interpreted?',
      [routeSummary],
      [
        { item: firstChunk, similarity: 0.82 },
        { item: secondChunk, similarity: 0.79 },
      ],
      4,
    );

    expect(ranked.items).toHaveLength(1);
    expect(ranked.items[0]?.id).toBe(routeSummary.id);
    expect(ranked.trace[0]?.sourceKinds).toEqual(['lexical', 'vector']);
  });

  it('merges keyless lexical and vector copies with a stable content key', () => {
    const nearby: KnowledgeItem = {
      title: 'Nearby item',
      content: 'Nearby content.',
      source: 'builtin',
    };
    const shared: KnowledgeItem = {
      title: 'Shared item',
      content: 'The same item arrived from both retrieval paths.',
      source: 'builtin',
    };

    const ranked = rankMergedKnowledgeDetailed(
      'shared item',
      [nearby, shared],
      [{ item: shared, similarity: 0.88 }],
      4,
    );
    const sharedTrace = ranked.trace.find((entry) => entry.title === shared.title);

    expect(ranked.items.filter((item) => item.title === shared.title)).toHaveLength(1);
    expect(sharedTrace?.sourceKinds).toEqual(['lexical', 'vector']);
  });

  it('preserves the broad interpretation anchor through fusion', () => {
    const overview: KnowledgeItem = {
      id: 'route:result-interpretation',
      title: 'Interpretation overview',
      content: 'Start with the whole record.',
      source: 'builtin',
      locale: 'en',
      aliases: ['first pass'],
      canonicalRoute: 'result-interpretation',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const upperSection: KnowledgeItem = {
      id: 'route:result-interpretation/upper-section',
      title: 'Upper section',
      content: 'A section-level overview.',
      source: 'builtin',
      locale: 'en',
      aliases: ['upper section'],
      canonicalRoute: 'result-interpretation/upper-section',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const scoringNoise: KnowledgeItem = {
      id: 'chunk:scoring-input/card/I',
      title: 'Card I',
      content: 'Scoring instructions for Card I.',
      source: 'builtin',
      locale: 'en',
      aliases: ['Card I'],
      canonicalRoute: 'scoring-input/card/I',
      relatedRoutes: [],
      retrievalKind: 'runtime-chunk',
    };

    const ranked = rankMergedKnowledgeDetailed(
      'I need a first-pass view of the whole record.',
      [overview, upperSection],
      [
        { item: upperSection, similarity: 0.48 },
        { item: scoringNoise, similarity: 0.45 },
      ],
      4,
    );

    expect(ranked.items[0]?.canonicalRoute).toBe('result-interpretation');
    expect(ranked.items.some((item) => item.canonicalRoute?.startsWith('scoring-input'))).toBe(
      false,
    );
  });

  it('keeps lexical fallback items and trace aligned for broad questions', async () => {
    const result = await getHybridInterpretationKnowledge({
      query: 'How should I approach the results as a whole?',
      lang: 'en',
      provider: 'openai',
      apiKey: 'unused-in-lexical-fallback',
      limit: 8,
    });

    expect(result.mode).toBe('lexical');
    expect(result.vectorHitCount).toBe(0);
    expect(result.items.map((item) => item.canonicalRoute ?? item.id)).toEqual(
      result.trace.map((entry) => entry.canonicalRoute ?? entry.id),
    );
    expect(
      result.items.every(
        (item) =>
          item.canonicalRoute === 'result-interpretation' ||
          item.canonicalRoute?.startsWith('result-interpretation/'),
      ),
    ).toBe(true);
  });

  it('reports lexical mode when the vector runtime returns no usable hits', async () => {
    retrievalMocks.runtimeReady.mockReturnValue(true);
    retrievalMocks.embedQuery.mockResolvedValue({ vector: [0.1], model: 'test', dimensions: 1 });
    retrievalMocks.searchVectors.mockResolvedValue([]);

    const result = await getHybridInterpretationKnowledge({
      query: 'How should Lambda be interpreted?',
      lang: 'en',
      provider: 'openai',
      apiKey: 'test-key',
      limit: 4,
    });

    expect(result.mode).toBe('lexical');
    expect(result.vectorHitCount).toBe(0);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('keeps coding retrieval biased toward explicit scoring chunks', () => {
    const scoringChunk: CodingRuleChunk = {
      id: 'en:scoring-input/determinants/m',
      title: 'Determinants / M',
      text: 'Movement coding rule for human movement.',
      categoryTags: ['scoring-input', 'determinants', 'm'],
      canonicalRoute: 'scoring-input/determinants/m',
      relatedRoutes: [],
      routeScope: 'primary',
    };
    const semanticChunk: CodingRuleChunk = {
      id: 'en:result-interpretation/movement-theme',
      title: 'Movement theme',
      text: 'Broad interpretive note about movement themes.',
      categoryTags: ['movement', 'theme'],
      canonicalRoute: 'result-interpretation/movement-theme',
      relatedRoutes: [],
      routeScope: 'secondary',
    };

    const ranked = rankMergedCodingChunks(
      'human movement determinant m scoring-input',
      [scoringChunk],
      [{ item: semanticChunk, similarity: 0.96 }],
      4,
    );

    expect(ranked[0]?.id).toBe('en:scoring-input/determinants/m');
  });

  it.each([
    ['ko', '이 반응을 P로 확정해도 돼?'],
    ['en', 'Should I mark this response as P?'],
  ])('routes an explicit %s P shorthand question to the Popular rule', (_locale, query) => {
    const popularChunk: CodingRuleChunk = {
      id: 'test:scoring-input/popular',
      title: 'Popular response / P',
      text: 'Use the Comprehensive System Popular response criterion.',
      categoryTags: ['scoring-input', 'popular', 'P'],
      canonicalRoute: 'scoring-input/popular',
      relatedRoutes: [],
      routeScope: 'primary',
    };
    const cardChunk: CodingRuleChunk = {
      id: 'test:scoring-input/card',
      title: 'Card coding',
      text: 'Identify the inkblot card before applying another code.',
      categoryTags: ['scoring-input', 'card'],
      canonicalRoute: 'scoring-input/card',
      relatedRoutes: [],
      routeScope: 'primary',
    };
    const locationChunk: CodingRuleChunk = {
      id: 'test:scoring-input/location',
      title: 'Location coding',
      text: 'Determine whether the response uses W, D, or Dd.',
      categoryTags: ['scoring-input', 'location'],
      canonicalRoute: 'scoring-input/location',
      relatedRoutes: [],
      routeScope: 'primary',
    };

    const ranked = rankMergedCodingChunks(
      query,
      [cardChunk, locationChunk, popularChunk],
      [
        { item: cardChunk, similarity: 0.91 },
        { item: locationChunk, similarity: 0.89 },
        { item: popularChunk, similarity: 0.64 },
      ],
      3,
    );

    expect(ranked[0]?.canonicalRoute).toBe('scoring-input/popular');
  });

  it.each([
    ['ko' as const, '카드 V에서 박쥐라고 했어. P로 확정해도 돼?'],
    ['en' as const, 'The response was a bat on Card V. Should I mark P?'],
  ])('injects the explicit %s Popular rule before lexical fallback ranking', async (lang, responseMemo) => {
    const result = await getHybridCodingRuleChunks({
      context: {
        rowIndex: 0,
        focusRowIndex: 0,
        selectedRowIndices: [0],
        card: 'V',
        responseMemo,
        existingCodes: {
          location: '',
          dq: '',
          determinants: [],
          fq: '',
          pair: '',
          contents: [],
          popular: false,
          z: '',
          specialScores: [],
        },
        sheetRows: [],
      },
      lang,
      provider: 'openai',
      apiKey: 'unused-in-lexical-fallback',
      limit: 6,
    });

    expect(result.mode).toBe('lexical');
    expect(result.items[0]?.canonicalRoute).toBe('scoring-input/popular');
    expect(result.trace[0]?.rerankBonus).toBeGreaterThan(0.03);
  });
});
