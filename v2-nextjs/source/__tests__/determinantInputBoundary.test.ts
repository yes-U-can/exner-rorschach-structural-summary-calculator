import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import { findInvalidDeterminantInputs } from '@/lib/determinantInput';
import { SCORING_CONFIG } from '@/lib/constants';
import {
  DETERMINANT_INPUT_CODES,
  LEGACY_BARE_MOVEMENT_INPUT_CODES,
  OPTIONS,
} from '@/lib/options';
import type { RorschachResponse } from '@/types';

function response(
  determinants: string[],
  contents: string[] = ['A'],
): RorschachResponse {
  return {
    card: 'I',
    response: '',
    location: 'W',
    dq: 'o',
    determinants,
    fq: 'o',
    pair: 'none',
    contents,
    popular: false,
    z: '',
    specialScores: [],
  };
}

describe('movement determinant input boundary', () => {
  it('keeps bare family labels out of the response input palette', () => {
    expect(OPTIONS.DETERMINANTS).toBe(DETERMINANT_INPUT_CODES);
    for (const code of LEGACY_BARE_MOVEMENT_INPUT_CODES) {
      expect(OPTIONS.DETERMINANTS).not.toContain(code);
    }
  });

  it('keeps M, FM, and m as Structural Summary family labels', () => {
    expect(SCORING_CONFIG.CODES.HUMAN_MOVEMENT).toContain('M');
    expect(SCORING_CONFIG.CODES.ANIMAL_MOVEMENT).toContain('FM');
    expect(SCORING_CONFIG.CODES.INANIMATE_MOVEMENT).toContain('m');
    expect(SCORING_CONFIG.CODES.DETERMINANTS_SINGLE).toEqual(
      expect.arrayContaining(['M', 'FM', 'm']),
    );
  });

  it('finds legacy and unknown codes without mutating saved responses', () => {
    const saved = [response(['M', "m'a", 'Ma'])];
    const before = JSON.stringify(saved);

    expect(findInvalidDeterminantInputs(saved)).toEqual([
      { responseIndex: 0, code: 'M' },
      { responseIndex: 0, code: "m'a" },
    ]);
    expect(JSON.stringify(saved)).toBe(before);
  });

  it.each(['M', 'FM', 'm', "m'a", 'UNKNOWN'])(
    'blocks calculation for invalid response code %s',
    (code) => {
      const result = calculateStructuralSummary([response([code])]);

      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toMatchObject({
        field: 'responses.0.determinants',
      });
      expect(result.errors?.[0].message).toContain(code);
    },
  );

  it('keeps family totals separate from Single and Blends presentation', () => {
    const result = calculateStructuralSummary([
      response(['Ma']),
      response(['Ma', 'FC']),
      response(['Mp']),
    ]);

    expect(result.success).toBe(true);
    expect(result.data?.upper_section.detCounts.M).toBe(3);
    expect(result.data?.upper_section.singleDetCounts.M).toBe(2);
    expect(result.data?.upper_section.blends).toContainEqual(['Ma', 'FC']);
  });

  it('locks the CDI passive-movement boundary to valid suffixed inputs', () => {
    const positive = calculateStructuralSummary([
      response(['Mp'], ['H']),
      response(['Mp'], ['H']),
    ]);
    const belowBoundary = calculateStructuralSummary([
      response(['Mp'], ['H']),
      response(['F'], ['H']),
    ]);

    expect(positive.data?.special_indices.CDI).toBe('4, Positive');
    expect(positive.data?.special_indices.cdi_criteria.c4).toBe(true);
    expect(belowBoundary.data?.special_indices.CDI).toBe('3, NO');
    expect(belowBoundary.data?.special_indices.cdi_criteria.c4).toBe(false);
  });

  it('keeps the invalid-input warning complete in all five locales', () => {
    for (const locale of ['ko', 'en', 'ja', 'es', 'pt']) {
      const messages = JSON.parse(
        readFileSync(`i18n/locales/${locale}.json`, 'utf8'),
      ) as {
        toast: {
          invalidDeterminants?: {
            title?: string;
            message?: string;
          };
        };
      };
      const warning = messages.toast.invalidDeterminants;

      expect(warning?.title?.trim()).toBeTruthy();
      expect(warning?.message?.trim()).toBeTruthy();
      expect(warning?.message?.match(/\{[^}]+\}/g)?.sort()).toEqual([
        '{codes}',
        '{rows}',
      ]);
    }
  });
});
