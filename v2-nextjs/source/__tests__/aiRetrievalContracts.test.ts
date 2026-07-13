import { describe, expect, it } from 'vitest';
import { selectRelevantKnowledge, type KnowledgeItem } from '@/lib/chatKnowledge';
import { selectCodingRuleChunks } from '@/lib/codingAssistKnowledge';
import type { CodingAssistContext } from '@/types';
import type { Language } from '@/types';

const emptyCodes = {
  location: '',
  dq: '',
  determinants: [],
  fq: '',
  pair: '',
  contents: [],
  popular: false,
  z: '',
  specialScores: [],
};

function buildCodingContext(overrides: Partial<CodingAssistContext>): CodingAssistContext {
  const card = overrides.card ?? 'I';
  const responseMemo = overrides.responseMemo ?? 'A person lifting something.';
  const existingCodes = overrides.existingCodes ?? emptyCodes;

  return {
    rowIndex: 0,
    focusRowIndex: 0,
    selectedRowIndices: [0],
    card,
    responseMemo,
    existingCodes,
    sheetRows: [
      {
        rowIndex: 0,
        card,
        responseMemo,
        existingCodes,
      },
    ],
    ...overrides,
  };
}

function routeList(items: Array<{ canonicalRoute?: string }>) {
  return items.map((item) => item.canonicalRoute?.toLowerCase() ?? '');
}

function expectTopRoutesToContain(
  routes: string[],
  expectedRoute: string,
  topN = 5,
) {
  const normalizedExpectedRoute = expectedRoute.toLowerCase();
  expect(
    routes
      .slice(0, topN)
      .some((route) => route === normalizedExpectedRoute || route.startsWith(`${normalizedExpectedRoute}/`)),
  ).toBe(true);
}

describe('AI retrieval contracts', () => {
  it.each([
    {
      title: 'human movement',
      context: buildCodingContext({
        card: 'I',
        responseMemo: 'A person lifting something with clear human action.',
        existingCodes: {
          ...emptyCodes,
          determinants: ['M'],
        },
      }),
      expectedRoute: 'scoring-input/determinants/M',
    },
    {
      title: 'form quality',
      context: buildCodingContext({
        card: 'V',
        responseMemo: 'The memo only says animal shape and does not describe contour fit.',
        existingCodes: {
          ...emptyCodes,
          fq: 'FQ?',
        },
      }),
      expectedRoute: 'scoring-input/fq',
    },
    {
      title: 'popular response',
      context: buildCodingContext({
        card: 'V',
        responseMemo: 'The respondent said bat, and I need to check whether this is Popular.',
        existingCodes: {
          ...emptyCodes,
          popular: true,
        },
      }),
      expectedRoute: 'scoring-input/popular',
    },
    {
      title: 'Z organization',
      context: buildCodingContext({
        card: 'III',
        responseMemo: 'The respondent connected two blot areas into one organized scene.',
        existingCodes: {
          ...emptyCodes,
          z: 'Z?',
        },
      }),
      expectedRoute: 'scoring-input/z',
    },
    {
      title: 'FABCOM2',
      context: buildCodingContext({
        card: 'III',
        responseMemo: 'Two figures are fused into one impossible body with bizarre logic.',
        existingCodes: {
          ...emptyCodes,
          specialScores: ['FABCOM2'],
        },
      }),
      expectedRoute: 'scoring-input/special-score/FABCOM2',
    },
  ])('selects the scoring reference layer for $title', ({ context, expectedRoute }) => {
    const chunks = selectCodingRuleChunks(context, 'en', 8);
    expectTopRoutesToContain(routeList(chunks), expectedRoute, 6);
  });

  it.each([
    {
      locale: 'en' as const,
      query: 'R is very low. Can I still interpret the profile?',
      expectedRoute: 'result-interpretation/lower-section/core/R',
    },
    {
      locale: 'en' as const,
      query: 'Lambda is high. Should I interpret this as avoidance by itself?',
      expectedRoute: 'result-interpretation/lower-section/core/Lambda',
    },
    {
      locale: 'ko' as const,
      query: 'R이 너무 낮은데 이 구조요약을 그대로 해석해도 되나요?',
      expectedRoute: 'result-interpretation/lower-section/core/R',
    },
    {
      locale: 'ko' as const,
      query: 'Lambda가 높으면 회피 성향이라고 단정해도 되나요?',
      expectedRoute: 'result-interpretation/lower-section/core/Lambda',
    },
  ])('selects the interpretation reference layer for $locale $expectedRoute', ({ locale, query, expectedRoute }) => {
    const knowledge = selectRelevantKnowledge(query, undefined, locale satisfies Language);
    expectTopRoutesToContain(routeList(knowledge), expectedRoute, 5);
  });

  it.each([
    ['ko', '이 프로토콜의 전체 해석을 어디서부터 시작하면 좋을까요?'],
    ['ko', '첫 단계에서 구조요약의 전반적인 패턴을 어떻게 읽나요?'],
    ['en', 'Where should I begin interpreting this protocol?'],
    ['en', 'I need a first-pass view of the whole record. What should I inspect first?'],
    ['ja', 'このプロトコルはどこから解釈を始めますか。'],
    ['ja', '構造要約の全体像を最初にどう読めばよいですか。'],
    ['es', '¿Por dónde debería empezar a interpretar este protocolo?'],
    ['es', 'A primera vista, ¿cómo leo el patrón general del protocolo?'],
    ['pt', 'Por onde devo começar a interpretar este protocolo?'],
    ['pt', 'A partir de uma visão geral, como leio o protocolo completo?'],
  ] as const)('anchors broad %s questions at the interpretation overview', (locale, query) => {
    const knowledge = selectRelevantKnowledge(query, undefined, locale);

    expect(knowledge[0]?.canonicalRoute).toBe('result-interpretation');
  });

  it.each([
    [
      'Lambdaが高い場合、それだけで回避と解釈してよいですか。',
      'result-interpretation/lower-section/core/Lambda',
    ],
    [
      'Rが非常に低い場合、解釈の前に何を確認しますか。',
      'result-interpretation/lower-section/core/R',
    ],
  ] as const)('segments Japanese and retrieves %s', (query, expectedRoute) => {
    const knowledge = selectRelevantKnowledge(query, undefined, 'ja');

    expectTopRoutesToContain(routeList(knowledge), expectedRoute, 4);
  });

  it('strips Korean verb endings before lexical matching', () => {
    const builtInKnowledge: KnowledgeItem[] = [
      {
        id: 'route:scoring-input',
        title: '채점 안내',
        content: '응답을 부호화하는 순서를 설명합니다.',
        source: 'builtin',
        locale: 'ko',
        aliases: ['채점'],
        canonicalRoute: 'scoring-input',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
        docLevel: 'category',
      },
      {
        id: 'route:result-interpretation',
        title: '해석 안내',
        content: '구조요약 결과를 읽는 순서를 설명합니다.',
        source: 'builtin',
        locale: 'ko',
        aliases: ['해석'],
        canonicalRoute: 'result-interpretation',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
        docLevel: 'category',
      },
    ];

    const knowledge = selectRelevantKnowledge('해석해야 하나요?', builtInKnowledge, 'ko');

    expect(knowledge[0]?.canonicalRoute).toBe('result-interpretation');
  });

  it.each([
    ['en', 'How should I code Card I?', 'scoring-input/card/I'],
    ['en', 'How should Content A be coded?', 'scoring-input/contents/A'],
    ['es', 'Cuando se codifica m?', 'scoring-input/determinants/m'],
    ['es', 'Que significa A como content?', 'scoring-input/contents/A'],
  ] as const)('keeps explicitly scoped one-character codes precise', (locale, query, expectedRoute) => {
    const knowledge = selectRelevantKnowledge(query, undefined, locale);

    expect(knowledge[0]?.canonicalRoute).toBe(expectedRoute);
  });

  it('keeps a parenthesized structural-summary expression intact', () => {
    const knowledge = selectRelevantKnowledge('Que indica 3r+(2)/R?', undefined, 'es');

    expect(knowledge[0]?.canonicalRoute).toBe(
      'result-interpretation/lower-section/selfPerception/_3r_2_R',
    );
  });

  it.each([
    [
      'Como a razao ideacional a:p e interpretada?',
      'result-interpretation/lower-section/ideation/a_p',
    ],
    [
      'Como a variavel de processamento Zf e interpretada?',
      'result-interpretation/lower-section/processing/Zf_proc',
    ],
  ] as const)('uses Portuguese section cues to disambiguate duplicate symbols', (query, expectedRoute) => {
    const knowledge = selectRelevantKnowledge(query, undefined, 'pt');

    expect(knowledge[0]?.canonicalRoute).toBe(expectedRoute);
  });
});
