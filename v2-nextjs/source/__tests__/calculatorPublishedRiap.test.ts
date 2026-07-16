import { describe, expect, it } from 'vitest';

import { PUBLISHED_RIAP_CASE } from '@/__tests__/fixtures/publishedRiapCase';
import { PUBLISHED_PIPPA_CASE } from '@/__tests__/fixtures/publishedPippaCase';
import { ORIGINAL_EXCEL_CASE } from '@/__tests__/fixtures/originalExcelCase';
import { PUBLISHED_AMNESTIC_CASE } from '@/__tests__/fixtures/publishedAmnesticCase';
import { calculateStructuralSummary } from '@/lib/calculator';
import { SCORING_CONFIG } from '@/lib/constants';
import { dTable, zestFromZf } from '@/lib/utils';

describe('published RIAP v5 calculation oracle', () => {
  it('matches the published location, form-quality, determinant, and content totals', () => {
    const result = calculateStructuralSummary(PUBLISHED_RIAP_CASE);
    expect(result.success).toBe(true);

    const upper = result.data?.upper_section;
    expect(upper).toMatchObject({
      Zf: 12,
      ZSum: '40.0',
      ZEst: '38.0',
      Zd: '2.0',
      W: 9,
      D: 9,
      Dd: 2,
      S: 4,
      dq_plus: 4,
      dq_o: 15,
      dq_vplus: 1,
      dq_v: 0,
      pairs: 2,
      sum6: 1,
      wsum6: 1,
      GHR: 5,
      PHR: 2,
    });
    expect(upper?.formQuality).toEqual({
      '+': { fqx: 0, mqual: 0, wd: 0 },
      o: { fqx: 13, mqual: 4, wd: 13 },
      u: { fqx: 5, mqual: 1, wd: 4 },
      '-': { fqx: 2, mqual: 0, wd: 1 },
      none: { fqx: 0, mqual: 0, wd: 0 },
    });
    expect(upper?.contentCounts).toMatchObject({ H: 4, '(H)': 2, Hd: 1, A: 7, Ad: 1, An: 2, Bl: 1, Cg: 3, Hh: 3, Na: 2, Sc: 2, Sx: 3 });
  });

  it('matches the published ratios, derivations, and constellation totals', () => {
    const result = calculateStructuralSummary(PUBLISHED_RIAP_CASE);
    const lower = result.data?.lower_section;

    expect(lower).toMatchObject({
      R: 20,
      Lambda: '0.43',
      EB: '5:4.5',
      EA: '9.5',
      EBPer: '-',
      eb: '7:4',
      es: '11.0',
      AdjEs: '10.0',
      D: 0,
      AdjD: 0,
      FM: 5,
      m: 2,
      SumCprime: 3,
      SumT: 0,
      SumV: 0,
      SumY: 1,
      Afr: '0.33',
      XA_percent: '0.90',
      WDA_percent: '0.94',
      X_minus_percent: '0.10',
      S_minus: 1,
      P: 6,
      X_plus_percent: '0.65',
      Xu_percent: '0.25',
      a_p: '10 : 3',
      Ma_Mp: '4 : 1',
      _3r_2_R: '0.25',
      ISO_Index: '0.20',
    });
    expect(result.data?.special_indices).toMatchObject({
      PTI: '0, -',
      DEPI: '5, Positive',
      CDI: '2, NO',
      SCON: '6, NO',
      HVI: '3, NO',
      OBS: '0, NO',
      GHR: 5,
      PHR: 2,
    });
  });

  it('keeps documented boundary constants and the final ZEst lookup reachable', () => {
    expect(SCORING_CONFIG.CRITERIA.HVI.C3_ZD).toBe(3.5);
    expect(zestFromZf(50, SCORING_CONFIG.TABLES.ZEST)).toBe(173);
    expect(dTable(-0.1)).toBe(0);
    expect(Object.is(dTable(-0.1), -0)).toBe(false);
  });

  it('continues the half-step D conversion beyond the printed table and keeps all-F Lambda infinite', () => {
    const expectedD = (value: number) => {
      if (value >= -2.5 && value <= 2.5) return 0;
      return value > 2.5
        ? Math.ceil((value - 2.5) / 2.5)
        : -Math.ceil((Math.abs(value) - 2.5) / 2.5);
    };

    for (let value = -20; value <= 20; value += 0.5) {
      expect(dTable(value)).toBe(expectedD(value));
    }

    expect(dTable(-15.5)).toBe(-6);
    expect(dTable(15.5)).toBe(6);

    const allPureF = PUBLISHED_RIAP_CASE.map((response) => ({
      ...response,
      determinants: ['F'],
    }));
    expect(calculateStructuralSummary(allPureF).data?.lower_section.Lambda).toBe('∞');
  });
});

describe('published Engelman et al. calculation oracle', () => {
  it('matches the second published score sequence and Structural Summary', () => {
    const result = calculateStructuralSummary(PUBLISHED_PIPPA_CASE);
    expect(result.success).toBe(true);

    expect(result.data?.upper_section).toMatchObject({
      Zf: 18,
      ZSum: '53.5',
      ZEst: '59.5',
      Zd: '-6.0',
      W: 12,
      D: 7,
      Dd: 1,
      S: 3,
      dq_plus: 12,
      dq_o: 7,
      dq_vplus: 0,
      dq_v: 1,
      pairs: 9,
      sum6: 10,
      wsum6: 25,
      GHR: 7,
      PHR: 2,
    });
    expect(result.data?.upper_section.formQuality).toEqual({
      '+': { fqx: 0, mqual: 0, wd: 0 },
      o: { fqx: 9, mqual: 3, wd: 9 },
      u: { fqx: 6, mqual: 0, wd: 6 },
      '-': { fqx: 5, mqual: 0, wd: 4 },
      none: { fqx: 0, mqual: 0, wd: 0 },
    });

    expect(result.data?.lower_section).toMatchObject({
      R: 20,
      Lambda: '0.18',
      EB: '3:4.5',
      EA: '7.5',
      EBPer: '-',
      eb: '8:7',
      es: '15.0',
      AdjEs: '11.0',
      D: -2,
      AdjD: -1,
      FM: 5,
      m: 3,
      SumCprime: 3,
      SumT: 0,
      SumV: 1,
      SumY: 3,
      Blends_R: '6 : 20',
      Afr: '0.43',
      XA_percent: '0.75',
      WDA_percent: '0.79',
      X_minus_percent: '0.25',
      S_minus: 1,
      P: 9,
      X_plus_percent: '0.45',
      Xu_percent: '0.30',
      a_p: '6 : 5',
      Ma_Mp: '3 : 0',
      _2AB_Art_Ay: 2,
      MOR: 4,
      _3r_2_R: '0.45',
      ISO_Index: '0.20',
    });
    expect(result.data?.special_indices).toMatchObject({
      PTI: '1, -',
      DEPI: '6, Positive',
      CDI: '2, NO',
      // The published table prints HVI=Yes, but its own score sequence meets
      // only three secondary HVI criteria. Keep the standard RIAP rules as
      // the oracle instead of changing the calculator to fit that discrepancy.
      SCON: '7, NO',
      HVI: '4, NO',
      OBS: '2, NO',
      GHR: 7,
      PHR: 2,
    });
  });
});

describe('original 2019 Excel calculation oracle', () => {
  it('preserves the score-only workbook example after the GAS-to-TypeScript migration', () => {
    const result = calculateStructuralSummary(ORIGINAL_EXCEL_CASE);
    expect(result.success).toBe(true);

    expect(result.data?.upper_section).toMatchObject({
      Zf: 13,
      ZSum: '34.0',
      ZEst: '41.5',
      Zd: '-7.5',
      W: 10,
      D: 3,
      Dd: 3,
      S: 1,
      dq_plus: 9,
      dq_o: 7,
      dq_vplus: 0,
      dq_v: 0,
      pairs: 5,
      sum6: 4,
      wsum6: 11,
      GHR: 1,
      PHR: 3,
    });

    expect(result.data?.lower_section).toMatchObject({
      R: 16,
      Lambda: '0.33',
      EB: '4:1.0',
      EA: '5.0',
      EBPer: '4.00',
      eb: '7:2',
      es: '9.0',
      AdjEs: '9.0',
      D: -1,
      AdjD: -1,
      FM: 6,
      m: 1,
      SumCprime: 1,
      SumT: 0,
      SumV: 0,
      SumY: 1,
      Afr: '0.33',
      XA_percent: '0.50',
      WDA_percent: '0.62',
      X_minus_percent: '0.50',
      S_minus: 0,
      P: 3,
      X_plus_percent: '0.38',
      Xu_percent: '0.13',
      a_p: '9 : 2',
      Ma_Mp: '2 : 2',
      _2AB_Art_Ay: 1,
      MOR: 0,
      _3r_2_R: '0.31',
      ISO_Index: '0.00',
    });

    expect(result.data?.special_indices).toMatchObject({
      PTI: '3, -',
      DEPI: '3, NO',
      CDI: '4, Positive',
      SCON: '5, NO',
      HVI: '2, NO',
      OBS: '1, NO',
      GHR: 1,
      PHR: 3,
    });
  });
});

describe('published Tibon Czopp et al. calculation oracle', () => {
  it('matches the independently published and corrected high-confidence totals', () => {
    const result = calculateStructuralSummary(PUBLISHED_AMNESTIC_CASE);
    expect(result.success).toBe(true);

    expect(result.data?.lower_section).toMatchObject({
      R: 21,
      Lambda: '0.24',
      Blends_R: '9 : 21',
      FC_CF_C: '2 : 5',
      PureC: 0,
      a_p: '7 : 7',
      SumCprime: 2,
      SumT: 2,
      SumV: 2,
      SumY: 1,
      FD: 2,
    });
    expect(result.data?.upper_section).toMatchObject({
      sum6: 9,
      wsum6: 28,
    });
    expect(result.data?.upper_section.detCounts).toMatchObject({
      M: 3,
      FM: 8,
      m: 2,
    });
    expect(result.data?.upper_section.specialScoreCounts).toMatchObject({
      DR1: 5,
      DR2: 1,
      INCOM2: 1,
    });

    // The conventional label is FC:CF+C, but the published completed summary
    // confirms that Cn belongs on this display ratio's right side. WSumC and
    // S-CON criterion 7 retain their own formulas and do not reuse this total.
    expect(result.data?.lower_section.FC_CF_C).toBe('2 : 5');
  });

  it('keeps aggregate results invariant when response rows are reordered', () => {
    const forward = calculateStructuralSummary(PUBLISHED_AMNESTIC_CASE).data;
    const reversed = calculateStructuralSummary([...PUBLISHED_AMNESTIC_CASE].reverse()).data;
    if (!forward || !reversed) {
      throw new Error('Expected both structural-summary calculations to succeed.');
    }

    const orderInvariantUpper = (upper: typeof forward.upper_section) => Object.fromEntries(
      Object.entries(upper).filter(([key]) => key !== 'blends' && key !== 'approachData'),
    );
    const forwardUpper = orderInvariantUpper(forward.upper_section);
    const reverseUpper = orderInvariantUpper(reversed.upper_section);

    expect(reverseUpper).toEqual(forwardUpper);
    expect(reversed.lower_section).toEqual(forward.lower_section);
    expect(reversed.special_indices).toEqual(forward.special_indices);
  });
});
