import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import type { RorschachResponse } from '@/types';

const CARDS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function makeResponse(
  index: number,
  overrides: Partial<RorschachResponse> = {},
): RorschachResponse {
  return {
    card: CARDS[index % CARDS.length],
    response: `witness-${index + 1}`,
    location: 'D',
    dq: 'o',
    determinants: ['F'],
    fq: '-',
    pair: '',
    contents: ['A'],
    popular: false,
    z: '',
    specialScores: [],
    ...overrides,
  };
}

function makeSconBoundaryProtocol(vistaCount: 2 | 3): RorschachResponse[] {
  return Array.from({ length: 18 }, (_, index) => {
    if (index === 0) {
      return makeResponse(index, { determinants: ['C', 'FV'] });
    }
    if (index < vistaCount) {
      return makeResponse(index, { determinants: ['FV'] });
    }
    return makeResponse(index);
  });
}

describe('constellation boundary witnesses', () => {
  it('marks S-CON positive at exactly eight true conditions and negative at seven', () => {
    const atThreshold = calculateStructuralSummary(makeSconBoundaryProtocol(3));
    const belowThreshold = calculateStructuralSummary(makeSconBoundaryProtocol(2));

    expect(atThreshold.success).toBe(true);
    expect(atThreshold.data?.special_indices.scon_criteria).toEqual({
      c1: true,
      c2: true,
      c3: true,
      c4: false,
      c5: false,
      c6: true,
      c7: true,
      c8: true,
      c9: false,
      c10: true,
      c11: true,
      c12: false,
    });
    expect(atThreshold.data?.special_indices.SCON).toBe('8, Positive');
    expect(belowThreshold.data?.special_indices.SCON).toBe('7, NO');
  });

  it('keeps the OBS second decision rule independently observable', () => {
    const protocol = Array.from({ length: 20 }, (_, index) => makeResponse(index, {
      location: index < 4 ? 'Dd' : 'D',
      fq: index < 4 ? '+' : '-',
      popular: index < 8,
    }));
    const result = calculateStructuralSummary(protocol);

    expect(result.success).toBe(true);
    expect(result.data?.special_indices.obs_criteria).toEqual({
      c1: true,
      c2: false,
      c3: false,
      c4: true,
      c5: true,
    });
    expect(result.data?.special_indices.obs_rules).toEqual({
      r1: false,
      r2: true,
      r3: false,
      r4: false,
    });
    expect(result.data?.special_indices.OBS).toBe('3, Positive');
  });
});
