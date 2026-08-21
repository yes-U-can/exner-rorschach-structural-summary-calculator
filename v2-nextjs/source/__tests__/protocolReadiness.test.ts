import { describe, expect, it } from 'vitest';

import { evaluateProtocolReadiness } from '@/lib/scoringInputValidation';
import type { RorschachResponse } from '@/types';

function response(card: string): RorschachResponse {
  return {
    card,
    response: '',
    location: 'W',
    dq: 'o',
    determinants: ['F'],
    fq: 'o',
    pair: 'none',
    contents: ['A'],
    popular: false,
    z: '',
    specialScores: [],
  };
}

const ALL_CARDS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

describe('protocol calculation readiness', () => {
  it('allows a complete ten-response protocol and preserves the R < 14 warning', () => {
    expect(evaluateProtocolReadiness(ALL_CARDS.map(response))).toEqual({
      responseCount: 10,
      missingCards: [],
      canCalculate: true,
      shouldWarnAboutValidity: true,
    });
  });

  it('preserves the validity warning at the upper brief-record boundary of R = 13', () => {
    const responses = [
      ...ALL_CARDS.map(response),
      ...Array.from({ length: 3 }, () => response('I')),
    ];

    expect(evaluateProtocolReadiness(responses)).toEqual({
      responseCount: 13,
      missingCards: [],
      canCalculate: true,
      shouldWarnAboutValidity: true,
    });
  });

  it('blocks a 14-response protocol when one of cards I-X is missing', () => {
    const responses = [
      ...ALL_CARDS.slice(0, -1).map(response),
      ...Array.from({ length: 5 }, () => response('I')),
    ];

    expect(evaluateProtocolReadiness(responses)).toEqual({
      responseCount: 14,
      missingCards: ['X'],
      canCalculate: false,
      shouldWarnAboutValidity: false,
    });
  });

  it('allows a complete protocol with 14 or more responses without the brief-record warning', () => {
    const responses = [
      ...ALL_CARDS.map(response),
      ...Array.from({ length: 4 }, () => response('I')),
    ];

    expect(evaluateProtocolReadiness(responses)).toEqual({
      responseCount: 14,
      missingCards: [],
      canCalculate: true,
      shouldWarnAboutValidity: false,
    });
  });

  it('blocks an incomplete low-response protocol before its validity warning can be used', () => {
    expect(evaluateProtocolReadiness(ALL_CARDS.slice(0, -1).map(response))).toEqual({
      responseCount: 9,
      missingCards: ['X'],
      canCalculate: false,
      shouldWarnAboutValidity: true,
    });
  });

  it('ignores untouched rows when checking response count and card completion', () => {
    const blank = { ...response(''), location: '', fq: '' };
    const status = evaluateProtocolReadiness([...ALL_CARDS.map(response), blank]);

    expect(status.responseCount).toBe(10);
    expect(status.missingCards).toEqual([]);
    expect(status.canCalculate).toBe(true);
  });
});
