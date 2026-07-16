import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import { SCORING_CONFIG } from '@/lib/constants';
import { dTable, zestFromZf } from '@/lib/utils';
import type { RorschachResponse } from '@/types';

const CARDS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function makeResponse(
  index: number,
  overrides: Partial<RorschachResponse> = {},
): RorschachResponse {
  return {
    card: CARDS[index % CARDS.length],
    response: `response-${index + 1}`,
    location: 'D',
    dq: 'o',
    determinants: ['F'],
    fq: 'o',
    pair: '',
    contents: ['A'],
    popular: false,
    z: '',
    specialScores: [],
    ...overrides,
  };
}

function protocolFromDeterminants(determinants: string[]): RorschachResponse[] {
  return determinants.map((determinant, index) => makeResponse(index, {
    determinants: [determinant],
    fq: ['C', "C'", 'T', 'V', 'Y', 'Cn'].includes(determinant) ? 'none' : 'o',
  }));
}

function ebPerFor(determinants: string[]) {
  const result = calculateStructuralSummary(protocolFromDeterminants(determinants));
  expect(result.success).toBe(true);
  return result.data?.lower_section.EBPer;
}

describe('Comprehensive System calculation conformance', () => {
  it('continues the D interval rule beyond the legacy spreadsheet cap', () => {
    expect(dTable(Number.NaN)).toBe('-');
    expect(dTable(-2.5)).toBe(0);
    expect(dTable(2.5)).toBe(0);
    expect(dTable(-5)).toBe(-1);
    expect(dTable(5)).toBe(1);
    expect(dTable(-15)).toBe(-5);
    expect(dTable(15)).toBe(5);
    expect(dTable(-15.5)).toBe(-6);
    expect(dTable(15.5)).toBe(6);
    expect(dTable(-22.5)).toBe(-8);
    expect(dTable(22.5)).toBe(8);
  });

  it('produces D and AdjD -6 in a complete protocol beyond the legacy cap', () => {
    const protocol = Array.from({ length: 14 }, (_, index) => {
      if (index === 0) {
        return makeResponse(index, { determinants: ['Ma', 'FMa', "FC'"] });
      }
      if (index < 5) {
        return makeResponse(index, { determinants: ['FC', 'FMa', "FC'"] });
      }
      if (index === 5) {
        return makeResponse(index, { determinants: ['FC', 'FMa'] });
      }
      return makeResponse(index, { determinants: ['FMa'] });
    });

    const result = calculateStructuralSummary(protocol);

    expect(result.success).toBe(true);
    expect(result.data?.lower_section).toMatchObject({
      R: 14,
      EA: '3.5',
      es: '19.0',
      AdjEs: '19.0',
      D: -6,
      AdjD: -6,
    });
  });

  it('applies every EBPer eligibility gate', () => {
    expect(ebPerFor(['Ma', 'Ma', 'FC', 'FC'])).toBe('-');

    const markedAtLowEa = [
      ...Array(4).fill('Ma'),
      ...Array(4).fill('FC'),
    ];
    expect(ebPerFor(markedAtLowEa)).toBe('2.00');
    expect(ebPerFor([...markedAtLowEa, ...Array(7).fill('F')])).toBe('2.00');
    expect(ebPerFor([...markedAtLowEa, ...Array(8).fill('F')])).toBe('-');

    expect(ebPerFor([
      ...Array(3).fill('Ma'),
      ...Array(3).fill('FC'),
    ])).toBe('-');

    expect(ebPerFor([
      ...Array(7).fill('Ma'),
      ...Array(10).fill('FC'),
    ])).toBe('-');

    expect(ebPerFor([
      ...Array(8).fill('Ma'),
      ...Array(11).fill('FC'),
    ])).toBe('1.45');
  });

  it('includes Cn only in the displayed FC:CF+C right side', () => {
    const result = calculateStructuralSummary([
      makeResponse(0, { determinants: ['Cn', 'FY'], fq: 'o' }),
    ]);

    expect(result.success).toBe(true);
    expect(result.data?.lower_section).toMatchObject({
      EB: '0:0.0',
      FC_CF_C: '0 : 1',
      SumY: 1,
    });
    expect(result.data?.special_indices.depi_criteria.c2).toBe(false);
    expect(result.data?.special_indices.scon_criteria.c2).toBe(false);
    expect(result.data?.special_indices.scon_criteria.c7).toBe(false);
  });

  it('keeps the published triple weighting in the egocentricity index', () => {
    const protocol = Array.from({ length: 10 }, (_, index) => makeResponse(index, {
      determinants: index === 0 ? ['Fr'] : ['F'],
      pair: index === 1 ? '(2)' : '',
    }));

    const result = calculateStructuralSummary(protocol);
    expect(result.data?.lower_section._3r_2_R).toBe('0.40');
  });

  it('keeps undefined Afr and WDA% out of threshold decisions', () => {
    const protocol = Array.from({ length: 5 }, (_, index) => makeResponse(index, {
      card: ['VIII', 'IX', 'X'][index % 3],
      location: 'Dd',
      fq: '-',
      determinants: ['C', 'FY'],
    }));

    const result = calculateStructuralSummary(protocol);

    expect(result.success).toBe(true);
    expect(result.data?.lower_section.Afr).toBe('-');
    expect(result.data?.lower_section.WDA_percent).toBe('-');
    expect(result.data?.special_indices.pti_criteria.c1).toBe(false);
    expect(result.data?.special_indices.depi_criteria.c4).toBe(false);
    expect(result.data?.special_indices.cdi_criteria.c3).toBe(false);
  });

  it('uses the HVI Zd boundary strictly above 3.5', () => {
    const atBoundary = calculateStructuralSummary([
      makeResponse(0, { card: 'I', location: 'W', z: 'ZW' }),
      makeResponse(1, { card: 'V', location: 'D', dq: '+', z: 'ZD' }),
    ]);
    const aboveBoundary = calculateStructuralSummary([
      makeResponse(0, { card: 'I', location: 'W', z: 'ZW' }),
      makeResponse(1, { card: 'II', location: 'D', dq: '+', z: 'ZD' }),
    ]);

    expect(atBoundary.data?.lower_section.Zd).toBe('3.5');
    expect(atBoundary.data?.special_indices.hvi_criteria.c3).toBe(false);
    expect(aboveBoundary.data?.lower_section.Zd).toBe('4.0');
    expect(aboveBoundary.data?.special_indices.hvi_criteria.c3).toBe(true);
  });

  it('keeps the complete ZEst lookup and leaves Zf=1 undefined', () => {
    expect(zestFromZf(1, SCORING_CONFIG.TABLES.ZEST)).toBeNull();
    expect(zestFromZf(2, SCORING_CONFIG.TABLES.ZEST)).toBe(2.5);
    expect(zestFromZf(44, SCORING_CONFIG.TABLES.ZEST)).toBe(152);
    expect(zestFromZf(50, SCORING_CONFIG.TABLES.ZEST)).toBe(173);
    expect(zestFromZf(2.5, SCORING_CONFIG.TABLES.ZEST)).toBeNull();
    expect(zestFromZf(51, SCORING_CONFIG.TABLES.ZEST)).toBeNull();
  });
});
