import { describe, expect, it } from 'vitest';

import { OFFICIAL_WORKBOOK_PROTOCOL } from '@/__tests__/fixtures/officialWorkbookCase';
import { calculateStructuralSummary } from '@/lib/calculator';

describe('official Comprehensive System workbook fixture', () => {
  it('reproduces the published Chapter 9 structural summary end to end', () => {
    const result = calculateStructuralSummary(OFFICIAL_WORKBOOK_PROTOCOL);

    expect(result.success).toBe(true);
    expect(result.data?.upper_section).toMatchObject({
      Zf: 15,
      ZSum: '51.0',
      ZEst: '49.0',
      Zd: '2.0',
      W: 10,
      D: 5,
      Dd: 2,
      S: 5,
      dq_plus: 6,
      dq_o: 9,
      dq_vplus: 1,
      dq_v: 1,
      pairs: 3,
      sum6: 2,
      wsum6: 3,
      GHR: 5,
      PHR: 4,
    });
    expect(result.data?.lower_section).toMatchObject({
      R: 17,
      Lambda: '0.55',
      EB: '7:4.0',
      EA: '11.0',
      EBPer: '1.75',
      eb: '1:2',
      es: '3.0',
      AdjEs: '3.0',
      D: 3,
      AdjD: 3,
      FC_CF_C: '3 : 2',
      _3r_2_R: '0.35',
      Afr: '0.55',
      WDA_percent: '0.80',
    });
    expect(result.data?.special_indices).toMatchObject({
      PTI: '0, -',
      DEPI: '5, Positive',
      CDI: '1, NO',
      SCON: '3, NO',
      HVI: '6, Positive',
      OBS: '1, NO',
    });
  });
});
