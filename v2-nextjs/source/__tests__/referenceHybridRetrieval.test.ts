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

  it('anchors GHR:PHR interpretation questions at the interpersonal overview', () => {
    const scoringRule: KnowledgeItem = {
      id: 'route:scoring-input/gphr/GHR',
      title: 'GHR',
      content: 'Ordered scoring criteria for assigning GHR.',
      source: 'builtin',
      locale: 'en',
      aliases: ['GHR'],
      canonicalRoute: 'scoring-input/gphr/GHR',
      relatedRoutes: [],
      retrievalKind: 'runtime-route-summary',
    };
    const interpersonalOverview: KnowledgeItem = {
      id: 'route:result-interpretation/lower-section/interpersonal',
      title: 'Interpersonal',
      content:
        'GHR:PHR is a descriptive frequency ratio and does not establish interpersonal functioning by itself.',
      source: 'builtin',
      locale: 'en',
      aliases: ['GHR:PHR', 'interpersonal'],
      canonicalRoute: 'result-interpretation/lower-section/interpersonal',
      relatedRoutes: ['scoring-input/gphr'],
      retrievalKind: 'runtime-route-summary',
    };

    const ranked = rankMergedKnowledge(
      'If GHR=8 and PHR=2, can I conclude that interpersonal functioning is good?',
      [scoringRule, interpersonalOverview],
      [{ item: scoringRule, similarity: 0.91 }],
      4,
    );

    expect(ranked[0]?.canonicalRoute).toBe(
      'result-interpretation/lower-section/interpersonal',
    );
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

  it.each([
    ['ko' as const, 'GHR=8, PHR=2이면 대인관계 기능이 좋다고 결론 내려도 돼?'],
    ['en' as const, 'If GHR=8 and PHR=2, can I conclude that interpersonal functioning is good?'],
    ['ja' as const, 'GHR=8、PHR=2なら、対人機能は良好だと結論づけてよいですか？'],
    ['es' as const, 'Si GHR=8 y PHR=2, ¿puedo concluir que el funcionamiento interpersonal es bueno?'],
    ['pt' as const, 'Se GHR=8 e PHR=2, posso concluir que o funcionamento interpessoal é bom?'],
  ])(
    'anchors the explicit %s GHR:PHR interpretation query to the interpersonal overview',
    async (lang, query) => {
      const result = await getHybridInterpretationKnowledge({
        query,
        lang,
        provider: 'openai',
        apiKey: 'unused-in-lexical-fallback',
        limit: 5,
      });

      expect(result.mode).toBe('lexical');
      expect(result.items[0]?.canonicalRoute).toBe(
        'result-interpretation/lower-section/interpersonal',
      );
      expect(result.items[0]?.content).toMatch(/GHR\s*[:/]\s*PHR/u);
    },
  );

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

  it.each([
    ['ko' as const, 'Cn이 FC:CF+C 화면 비율, WSumC, S-CON, Color-Shading에 어떻게 반영돼?'],
    ['en' as const, 'How does Cn affect FC:CF+C, WSumC, S-CON, and Color-Shading?'],
    ['ja' as const, 'Cn は FC:CF+C、WSumC、S-CON、Color-Shading にどう反映されますか。'],
    ['es' as const, '¿Cómo afecta Cn a FC:CF+C, WSumC, S-CON y Color-Shading?'],
    ['pt' as const, 'Como Cn afeta FC:CF+C, WSumC, S-CON e Color-Shading?'],
  ])('anchors the explicit %s Cn calculation-boundary query to the complete Cn rule', async (lang, responseMemo) => {
    const result = await getHybridCodingRuleChunks({
      context: {
        rowIndex: 0,
        focusRowIndex: 0,
        selectedRowIndices: [0],
        card: 'VIII',
        responseMemo,
        existingCodes: {
          location: '',
          dq: '',
          determinants: ['Cn'],
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
    expect(result.items[0]?.canonicalRoute).toBe('scoring-input/determinants/Cn');
    expect(result.items[0]?.text).toMatch(/WSumC/u);
    expect(result.items[0]?.text).toMatch(/S-CON/u);
    expect(result.items[0]?.text).toMatch(/Color-Shading|色彩[・\s-]?陰影/iu);
  });

  it.each([
    ['ko' as const, 'WSumC에 Cn을 포함해서 계산해?'],
    ['en' as const, 'Does WSumC include Cn?'],
    ['ja' as const, 'WSumC に Cn を含めて計算しますか。'],
    ['es' as const, '¿WSumC incluye Cn?'],
    ['pt' as const, 'O WSumC inclui Cn?'],
  ])('anchors the focused %s WSumC-Cn boundary query to the Cn rule', async (lang, responseMemo) => {
    const result = await getHybridCodingRuleChunks({
      context: {
        rowIndex: 0,
        focusRowIndex: 0,
        selectedRowIndices: [0],
        card: 'VIII',
        responseMemo,
        existingCodes: {
          location: '',
          dq: '',
          determinants: ['Cn'],
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
    expect(result.items[0]?.canonicalRoute).toBe('scoring-input/determinants/Cn');
    expect(result.items[0]?.text).toMatch(/WSumC/u);
  });

  it.each([
    [
      'ko' as const,
      'Na, Bt, Ls가 함께 해당되면 어떻게 부호화해?',
      /Na[\s\S]*(?:Bt|Ls)[\s\S]*(?:Na만|우선)/u,
      /Na[\s\S]*없[\s\S]*Bt[\s\S]*Ls[\s\S]*(?:하나만|둘 중 하나)/u,
    ],
    [
      'en' as const,
      'How should Na, Bt, and Ls be coded when they overlap?',
      /Na[\s\S]*(?:Bt|Ls)[\s\S]*(?:Na only|takes priority)/iu,
      /Na is absent[\s\S]*Bt[\s\S]*Ls[\s\S]*(?:only one|one that)/iu,
    ],
    [
      'ja' as const,
      'Na、Bt、Ls が重なる場合はどう符号化しますか。',
      /Na[\s\S]*(?:Bt|Ls)[\s\S]*(?:Naだけ|優先)/u,
      /Naがなく[\s\S]*Bt[\s\S]*Ls[\s\S]*一方だけ/u,
    ],
    [
      'es' as const,
      '¿Cómo se codifican Na, Bt y Ls cuando coinciden?',
      /Na[\s\S]*(?:Bt|Ls)[\s\S]*(?:solo Na|prioridad)/iu,
      /(?:Na no está presente|no hay Na)[\s\S]*Bt[\s\S]*Ls[\s\S]*(?:solo|únicamente)/iu,
    ],
    [
      'pt' as const,
      'Como codificar Na, Bt e Ls quando coincidem?',
      /Na[\s\S]*(?:Bt|Ls)[\s\S]*(?:apenas Na|prioridade)/iu,
      /não houver Na[\s\S]*Bt[\s\S]*Ls[\s\S]*(?:somente|apenas)/iu,
    ],
  ])(
    'anchors the explicit %s Na-Bt-Ls boundary query to both content rules',
    async (lang, responseMemo, priorityPattern, noNaPattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'I',
          responseMemo,
          existingCodes: {
            location: '',
            dq: '',
            determinants: [],
            fq: '',
            pair: '',
            contents: ['Na', 'Bt', 'Ls'],
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
      expect(result.items[0]?.canonicalRoute).toBe('scoring-input/contents/Na');
      const naEvidence = result.items
        .filter((item) => item.canonicalRoute === 'scoring-input/contents/Na')
        .map((item) => item.text)
        .join('\n');
      expect(naEvidence).toMatch(priorityPattern);
      expect(naEvidence).toMatch(noNaPattern);
    },
  );

  it.each([
    [
      'ko' as const,
      'Xy를 부호화할 때 An도 함께 적어야 해?',
      /Xy[\s\S]*An[\s\S]*(?:더하지|추가하지|함께.*않)/u,
    ],
    [
      'en' as const,
      'Should An also be coded when Xy is coded?',
      /Xy[\s\S]*(?:do not add|excludes)[\s\S]*An/iu,
    ],
    [
      'ja' as const,
      'Xyを付けるとき、Anも一緒に記録しますか。',
      /Xy[\s\S]*An[\s\S]*(?:併記しません|加えません)/u,
    ],
    [
      'es' as const,
      '¿Se añade An cuando se codifica Xy?',
      /Xy[\s\S]*(?:no se añade|excluye)[\s\S]*An/iu,
    ],
    [
      'pt' as const,
      'An também é registrado quando se codifica Xy?',
      /Xy[\s\S]*An[\s\S]*(?:não é acrescentado|exclui)/iu,
    ],
  ])(
    'anchors the explicit %s Xy-An boundary query to the Xy exclusion rule',
    async (lang, responseMemo, rulePattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'I',
          responseMemo,
          existingCodes: {
            location: '',
            dq: '',
            determinants: [],
            fq: '',
            pair: '',
            contents: ['Xy', 'An'],
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
      expect(result.items[0]?.canonicalRoute).toBe('scoring-input/contents/Xy');
      const xyEvidence = result.items
        .filter((item) => item.canonicalRoute === 'scoring-input/contents/Xy')
        .map((item) => item.text)
        .join('\n');
      expect(xyEvidence).toMatch(rulePattern);
    },
  );

  it.each([
    [
      'ko' as const,
      '같은 반응에 FC와 CF를 함께 결정인으로 입력해도 돼?',
      /FC\/CF\/C[\s\S]*(?:하나만|둘 이상.*않)[\s\S]*(?:형태 관여가 가장 적은|형태 관여.*적은)/u,
    ],
    [
      'en' as const,
      'Can FC and CF both be recorded as determinants in the same response?',
      /FC\/CF\/C[\s\S]*(?:only one|do not record more than one)[\s\S]*(?:least form emphasis)/iu,
    ],
    [
      'ja' as const,
      '同じ反応に FC と CF を両方の決定因として記録できますか。',
      /FC\/CF\/C[\s\S]*(?:一つだけ|複数記録しません)[\s\S]*形態の関与が最も少ない/u,
    ],
    [
      'es' as const,
      '¿Se pueden registrar FC y CF juntos como determinantes en una misma respuesta?',
      /FC\/CF\/C[\s\S]*(?:un solo código|más de una)[\s\S]*menor predominio formal/iu,
    ],
    [
      'pt' as const,
      'FC e CF podem ser registrados juntos como determinantes na mesma resposta?',
      /FC\/CF\/C[\s\S]*(?:apenas um código|mais de uma)[\s\S]*menor predomínio formal/iu,
    ],
  ])(
    'anchors the explicit %s same-determinant form-emphasis query to the determinant overview',
    async (lang, responseMemo, rulePattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'II',
          responseMemo,
          existingCodes: {
            location: '',
            dq: '',
            determinants: ['FC', 'CF'],
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
      expect(result.items[0]?.canonicalRoute).toBe('scoring-input/determinants');
      const evidence = result.items
        .filter((item) => item.canonicalRoute === 'scoring-input/determinants')
        .map((item) => item.text)
        .join('\n');
      expect(evidence).toMatch(rulePattern);
    },
  );

  it.each([
    ['ko' as const, 'CONTAM과 DV2를 같은 반응에 함께 기록해도 돼?', /CONTAM[\s\S]*DV[\s\S]*함께 기록하지/u],
    ['en' as const, 'Can CONTAM and DV2 both be scored in the same response?', /CONTAM[\s\S]*do not also record[\s\S]*DV/iu],
    ['ja' as const, '同じ反応に CONTAM と DV2 を併記できますか。', /CONTAM[\s\S]*DV[\s\S]*併記しません/u],
    ['es' as const, '¿Se pueden codificar CONTAM y DV2 en la misma respuesta?', /CONTAM[\s\S]*no se añaden[\s\S]*DV/iu],
    ['pt' as const, 'CONTAM e DV2 podem ser codificados na mesma resposta?', /CONTAM[\s\S]*não se registram[\s\S]*DV/iu],
  ])(
    'anchors the explicit %s CONTAM exclusion query to the CONTAM rule',
    async (lang, responseMemo, rulePattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'III',
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
            specialScores: ['CONTAM', 'DV2'],
          },
          sheetRows: [],
        },
        lang,
        provider: 'openai',
        apiKey: 'unused-in-lexical-fallback',
        limit: 6,
      });

      expect(result.mode).toBe('lexical');
      expect(result.items[0]?.canonicalRoute).toBe('scoring-input/special-score/CONTAM');
      const evidence = result.items
        .filter((item) => item.canonicalRoute === 'scoring-input/special-score/CONTAM')
        .map((item) => item.text)
        .join('\n');
      expect(evidence).toMatch(rulePattern);
    },
  );

  it.each([
    ['ko' as const, "순수 무채색 C'의 형태질은 무엇으로 기록해?", /C'[\s\S]*FQnone/u],
    ['en' as const, "What Form Quality should be recorded for pure achromatic C'?", /C'[\s\S]*FQnone/iu],
    ['ja' as const, "純粋な無彩色 C' の形態質は何を記録しますか。", /C'[\s\S]*FQnone/u],
    ['es' as const, "¿Qué calidad formal se registra para el C' acromático puro?", /C'[\s\S]*FQnone/iu],
    ['pt' as const, "Qual qualidade formal se registra para o C' acromático puro?", /C'[\s\S]*FQnone/iu],
  ])(
    "anchors the explicit %s C' Form Quality query to the pure achromatic rule",
    async (lang, responseMemo, rulePattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'I',
          responseMemo,
          existingCodes: {
            location: '',
            dq: '',
            determinants: ["C'"],
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
      expect(result.items[0]?.canonicalRoute).toBe("scoring-input/determinants/C'");
      const evidence = result.items
        .filter((item) => item.canonicalRoute === "scoring-input/determinants/C'")
        .map((item) => item.text)
        .join('\n');
      expect(evidence).toMatch(rulePattern);
    },
  );

  it.each([
    ['ko' as const, '같은 반응에 DV1과 DV2를 함께 기록해도 돼?', /DV1\/DV2[\s\S]*각 쌍 중 하나만[\s\S]*Level 1/u],
    ['en' as const, 'Can DV1 and DV2 both be recorded in the same response?', /DV1\/DV2[\s\S]*only one level[\s\S]*Level 1/iu],
    ['ja' as const, '同じ反応に DV1 と DV2 を両方記録できますか。', /DV1\/DV2[\s\S]*どちらか一方だけ[\s\S]*Level 1/u],
    ['es' as const, '¿Se pueden registrar DV1 y DV2 en una misma respuesta?', /DV1\/DV2[\s\S]*un solo nivel[\s\S]*Nivel 1/iu],
    ['pt' as const, 'DV1 e DV2 podem ser registrados na mesma resposta?', /DV1\/DV2[\s\S]*apenas um nível[\s\S]*Nível 1/iu],
  ])(
    'anchors the explicit %s Level 1-Level 2 query to the special-score overview',
    async (lang, responseMemo, rulePattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'I',
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
            specialScores: ['DV1', 'DV2'],
          },
          sheetRows: [],
        },
        lang,
        provider: 'openai',
        apiKey: 'unused-in-lexical-fallback',
        limit: 6,
      });

      expect(result.mode).toBe('lexical');
      expect(result.items[0]?.canonicalRoute).toBe('scoring-input/special-score');
      const evidence = result.items
        .filter((item) => item.canonicalRoute === 'scoring-input/special-score')
        .map((item) => item.text)
        .join('\n');
      expect(evidence).toMatch(rulePattern);
    },
  );

  it.each([
    ['ko' as const, '같은 표현이 INCOM1과 FABCOM1 기준에 겹치면 둘 다 기록해?', /독립된 표현[\s\S]*같은 표현[\s\S]*WSum6/u],
    ['en' as const, 'If the same wording meets both INCOM1 and FABCOM1, should both be recorded?', /discrete wording[\s\S]*same wording[\s\S]*WSum6/iu],
    ['ja' as const, '同じ表現が INCOM1 と FABCOM1 の両基準に重なる場合、両方を記録しますか。', /独立した表現[\s\S]*同じ表現[\s\S]*WSum6/u],
    ['es' as const, 'Si la misma expresión cumple INCOM1 y FABCOM1, ¿se registran ambos?', /expresión independiente[\s\S]*misma expresión[\s\S]*WSum6/iu],
    ['pt' as const, 'Se a mesma formulação satisfizer INCOM1 e FABCOM1, ambos são registrados?', /formulação independente[\s\S]*mesma formulação[\s\S]*WSum6/iu],
  ])(
    'anchors the explicit %s overlapping critical-score query to the discrete-wording rule',
    async (lang, responseMemo, rulePattern) => {
      const result = await getHybridCodingRuleChunks({
        context: {
          rowIndex: 0,
          focusRowIndex: 0,
          selectedRowIndices: [0],
          card: 'I',
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
            specialScores: ['INCOM1', 'FABCOM1'],
          },
          sheetRows: [],
        },
        lang,
        provider: 'openai',
        apiKey: 'unused-in-lexical-fallback',
        limit: 6,
      });

      expect(result.mode).toBe('lexical');
      expect(result.items[0]?.canonicalRoute).toBe('scoring-input/special-score');
      const evidence = result.items
        .filter((item) => item.canonicalRoute === 'scoring-input/special-score')
        .map((item) => item.text)
        .join('\n');
      expect(evidence).toMatch(rulePattern);
    },
  );

  it('reports lexical mode when coding vector retrieval has no usable hits', async () => {
    retrievalMocks.runtimeReady.mockReturnValue(true);
    retrievalMocks.embedQuery.mockResolvedValue({ vector: [0.1], model: 'test', dimensions: 1 });
    retrievalMocks.searchVectors.mockResolvedValue([]);

    const result = await getHybridCodingRuleChunks({
      context: {
        rowIndex: 0,
        focusRowIndex: 0,
        selectedRowIndices: [0],
        card: 'I',
        responseMemo: 'How should this response be coded?',
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
      lang: 'en',
      provider: 'openai',
      apiKey: 'test-key',
      limit: 4,
    });

    expect(result.mode).toBe('lexical');
    expect(result.vectorHitCount).toBe(0);
    expect(result.items.length).toBeLessThanOrEqual(4);
  });

  it('keeps ranked coding items and trace aligned when vector retrieval fails', async () => {
    retrievalMocks.runtimeReady.mockReturnValue(true);
    retrievalMocks.embedQuery.mockRejectedValue(new Error('test embedding failure'));

    const result = await getHybridCodingRuleChunks({
      context: {
        rowIndex: 0,
        focusRowIndex: 0,
        selectedRowIndices: [0],
        card: 'V',
        responseMemo: 'The response was a bat. Should it be marked P?',
        existingCodes: {
          location: 'W',
          dq: 'o',
          determinants: ['F'],
          fq: 'o',
          pair: '',
          contents: ['A'],
          popular: false,
          z: '',
          specialScores: [],
        },
        sheetRows: [],
      },
      lang: 'en',
      provider: 'openai',
      apiKey: 'test-key',
      limit: 3,
    });

    expect(result.mode).toBe('lexical');
    expect(result.vectorHitCount).toBe(0);
    expect(result.items).toHaveLength(3);
    expect(result.items.map((item) => item.canonicalRoute ?? item.id)).toEqual(
      result.trace.map((entry) => entry.canonicalRoute ?? entry.id),
    );
  });
});
