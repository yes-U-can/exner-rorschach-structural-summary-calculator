import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import { findInvalidDeterminantInputs } from '@/lib/determinantInput';
import {
  findScoringInputIssues,
  getDisabledDeterminantCodes,
  getDisabledMovementCodes,
} from '@/lib/scoringInputValidation';
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

  it('disables every other code in a movement family after one is selected', () => {
    expect(getDisabledMovementCodes(['Ma', 'FC'], 1)).toEqual([
      'Ma',
      'Mp',
      'Ma-p',
    ]);
    expect(getDisabledMovementCodes(['Ma', 'FC'], 0)).toEqual([]);
  });

  it('disables a code already selected in another slot for every determinant', () => {
    expect(getDisabledDeterminantCodes(['FC', '', ''], 1)).toEqual(['FC']);
    expect(getDisabledDeterminantCodes(['Ma', 'FC'], 0)).toEqual(['FC']);
    expect(getDisabledDeterminantCodes(['Ma', 'FC'], 1)).toEqual([
      'Ma',
      'Mp',
      'Ma-p',
    ]);
  });

  it.each([
    [['FC', 'FC']],
    [['F', 'F']],
    [['Ma', 'Ma']],
  ] as const)(
    'blocks the identical determinant entered twice: %j',
    (determinants) => {
      const issues = findScoringInputIssues([response([...determinants])]);
      expect(issues).toContainEqual({
        type: 'duplicate_determinant',
        responseIndex: 0,
        code: determinants[0],
      });

      const result = calculateStructuralSummary([response([...determinants])]);
      expect(result.success).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'responses.0.determinants',
        message: expect.stringContaining('Duplicate determinant code'),
      });
    },
  );

  it('keeps valid blends with distinct determinants unaffected', () => {
    const result = calculateStructuralSummary([response(['FC', "C'F"])]);
    expect(result.success).toBe(true);
    expect(result.data?.upper_section.blends).toContainEqual(['FC', "C'F"]);
  });

  it.each([
    ['M', ['Ma', 'Mp']],
    ['FM', ['FMa', 'FMa-p']],
    ['m', ['mp', 'ma-p']],
  ] as const)(
    'blocks multiple %s-family movement codes in one response',
    (family, determinants) => {
      const result = calculateStructuralSummary([response([...determinants])]);

      expect(result.success).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'responses.0.determinants',
        message: expect.stringContaining(`Multiple ${family} movement codes`),
      });
    },
  );

  it('allows different movement families in the same response', () => {
    const result = calculateStructuralSummary([
      response(['Ma', 'FMp', 'ma-p']),
    ]);

    expect(result.success).toBe(true);
    expect(result.data?.upper_section.detCounts).toMatchObject({
      M: 1,
      FM: 1,
      m: 1,
    });
  });

  it('counts one active-passive code once in its family and in both direction totals', () => {
    const result = calculateStructuralSummary([response(['Ma-p'])]);

    expect(result.success).toBe(true);
    expect(result.data?.upper_section.detCounts.M).toBe(1);
    expect(result.data?.lower_section.a_p).toBe('1 : 1');
    expect(result.data?.lower_section.Ma_Mp).toBe('1 : 1');
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

  it('keeps every input-boundary warning complete in all five locales', () => {
    for (const locale of ['ko', 'en', 'ja', 'es', 'pt']) {
      const messages = JSON.parse(
        readFileSync(`i18n/locales/${locale}.json`, 'utf8'),
      ) as {
        toast: {
          invalidDeterminants?: {
            title?: string;
            message?: string;
          };
          standaloneSpace?: {
            title?: string;
            message?: string;
          };
          movementConflict?: {
            title?: string;
            message?: string;
          };
          duplicateDeterminant?: {
            title?: string;
            message?: string;
          };
          missingFormQuality?: {
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

      for (const boundaryWarning of [
        messages.toast.standaloneSpace,
        messages.toast.movementConflict,
        messages.toast.missingFormQuality,
      ]) {
        expect(boundaryWarning?.title?.trim()).toBeTruthy();
        expect(boundaryWarning?.message?.trim()).toBeTruthy();
        expect(boundaryWarning?.message?.match(/\{[^}]+\}/g)).toEqual(['{rows}']);
      }

      const duplicateWarning = messages.toast.duplicateDeterminant;
      expect(duplicateWarning?.title?.trim()).toBeTruthy();
      expect(duplicateWarning?.message?.trim()).toBeTruthy();
      expect(duplicateWarning?.message?.match(/\{[^}]+\}/g)).toEqual([
        '{rows}',
        '{codes}',
      ]);
    }
  });
});

describe('location and Form Quality input boundaries', () => {
  it('keeps standalone S out of the response location palette', () => {
    expect(OPTIONS.LOCATIONS).toEqual(['W', 'WS', 'D', 'DS', 'Dd', 'DdS']);
    expect(OPTIONS.LOCATIONS).not.toContain('S');
  });

  it('blocks a legacy standalone S payload without changing it', () => {
    const saved = [{ ...response(['F']), location: 'S' }];
    const before = JSON.stringify(saved);

    expect(findScoringInputIssues(saved)).toContainEqual({
      type: 'standalone_space',
      responseIndex: 0,
    });
    expect(calculateStructuralSummary(saved).errors).toContainEqual({
      field: 'responses.0.location',
      message: expect.stringContaining('use WS, DS, or DdS'),
    });
    expect(JSON.stringify(saved)).toBe(before);
  });

  it('blocks blank FQ but accepts the explicit none category', () => {
    const blank = [{ ...response(['C']), fq: '' }];
    const explicitNone = [{ ...response(['C']), fq: 'none' }];

    expect(findScoringInputIssues(blank)).toContainEqual({
      type: 'missing_form_quality',
      responseIndex: 0,
    });
    expect(calculateStructuralSummary(blank).success).toBe(false);
    expect(calculateStructuralSummary(explicitNone).success).toBe(true);
  });

  it('ignores untouched rows that do not participate in calculation', () => {
    const untouched = [{ ...response([]), card: '', location: '', fq: '' }];

    expect(findScoringInputIssues(untouched)).toEqual([]);
  });
});
