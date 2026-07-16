import { describe, expect, it } from 'vitest';

import { ORIGINAL_EXCEL_CASE } from '@/__tests__/fixtures/originalExcelCase';
import { PUBLISHED_AMNESTIC_CASE } from '@/__tests__/fixtures/publishedAmnesticCase';
import { PUBLISHED_PIPPA_CASE } from '@/__tests__/fixtures/publishedPippaCase';
import { PUBLISHED_RIAP_CASE } from '@/__tests__/fixtures/publishedRiapCase';
import { OFFICIAL_WORKBOOK_PROTOCOL } from '@/__tests__/fixtures/officialWorkbookCase';
import { calculateStructuralSummary } from '@/lib/calculator';
import type { RorschachResponse } from '@/types';

const MEMOS = {
  ko: '한국어 반응 메모',
  en: 'English response memo',
  ja: '日本語の反応メモ',
  es: 'Nota de respuesta en español',
  pt: 'Nota de resposta em português',
} as const;

const CASES: Array<{ name: string; protocol: RorschachResponse[] }> = [
  { name: 'Exner Workbook Chapter 9', protocol: OFFICIAL_WORKBOOK_PROTOCOL },
  { name: 'published RIAP v5', protocol: PUBLISHED_RIAP_CASE },
  { name: 'published PIPPA', protocol: PUBLISHED_PIPPA_CASE },
  { name: 'published amnestic case', protocol: PUBLISHED_AMNESTIC_CASE },
  { name: '2019 workbook lineage case', protocol: ORIGINAL_EXCEL_CASE },
];

function calculationProjection(result: ReturnType<typeof calculateStructuralSummary>) {
  if (!result.success || !result.data) return result;

  return {
    upper_section: result.data.upper_section,
    lower_section: result.data.lower_section,
    special_indices: result.data.special_indices,
    row_calculations: result.data.row_calculations.map(({ card, gphr }) => ({ card, gphr })),
  };
}

describe('calculator locale invariance', () => {
  it.each(CASES)('keeps $name arithmetic identical across all five memo languages', ({ protocol }) => {
    const baseline = calculateStructuralSummary(protocol);
    expect(baseline.success).toBe(true);

    for (const memo of Object.values(MEMOS)) {
      const localized = protocol.map((response, index) => ({
        ...response,
        response: `${memo} ${index + 1}`,
      }));
      expect(calculationProjection(calculateStructuralSummary(localized))).toEqual(
        calculationProjection(baseline),
      );
    }
  });
});
