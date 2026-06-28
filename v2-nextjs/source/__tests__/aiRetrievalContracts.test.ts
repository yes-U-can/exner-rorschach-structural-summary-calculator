import { describe, expect, it } from 'vitest';
import { selectRelevantKnowledge } from '@/lib/chatKnowledge';
import { selectCodingRuleChunks } from '@/lib/codingAssistKnowledge';
import type { CodingAssistContext } from '@/types';
import type { Language } from '@/types';

const emptyCodes = {
  location: '',
  dq: '',
  determinants: [],
  fq: '',
  pair: false,
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
});
