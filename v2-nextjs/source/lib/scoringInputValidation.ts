import { findInvalidDeterminantInputs } from '@/lib/determinantInput';
import { SCORING_CONFIG } from '@/lib/constants';
import { OPTIONS } from '@/lib/options';
import { getFormQualityRequirement, SPECIAL_SCORE_LEVEL_PAIRS } from '@/lib/scoringResponseRules';
import type { RorschachResponse } from '@/types';

export const MOVEMENT_CODE_FAMILIES = {
  M: ['Ma', 'Mp', 'Ma-p'],
  FM: ['FMa', 'FMp', 'FMa-p'],
  m: ['ma', 'mp', 'ma-p'],
} as const;

export type MovementFamily = keyof typeof MOVEMENT_CODE_FAMILIES;

export const DETERMINANT_CODE_CONFLICT_GROUPS = {
  chromaticColor: ['FC', 'CF', 'C'],
  achromaticColor: ["FC'", "C'F", "C'"],
  texture: ['FT', 'TF', 'T'],
  vista: ['FV', 'VF', 'V'],
  diffuseShading: ['FY', 'YF', 'Y'],
  reflection: ['Fr', 'rF'],
} as const;

export type DeterminantConflictRule = keyof typeof DETERMINANT_CODE_CONFLICT_GROUPS;

export const CRITICAL_SPECIAL_SCORES_EXCLUDED_BY_CONTAM = [
  'DV1',
  'DV2',
  'DR1',
  'DR2',
  'INCOM1',
  'INCOM2',
  'FABCOM1',
  'FABCOM2',
  'ALOG',
] as const;

export const CHROMATIC_COLOR_DETERMINANTS = ['FC', 'CF', 'C'] as const;

export const CONTENT_CODE_CONFLICT_GROUPS = {
  nature: ['Na', 'Bt', 'Ls'],
  xrayAnatomy: ['An', 'Xy'],
} as const;

export type ContentConflictRule = keyof typeof CONTENT_CODE_CONFLICT_GROUPS;

export type ScoringInputIssue =
  | {
      type: 'missing_required_field';
      responseIndex: number;
      field: 'location' | 'dq' | 'determinants' | 'contents';
    }
  | {
      type: 'incompatible_form_quality';
      responseIndex: number;
    }
  | {
      type: 'invalid_determinant';
      responseIndex: number;
      code: string;
    }
  | {
      type: 'standalone_space';
      responseIndex: number;
    }
  | {
      type: 'movement_family_conflict';
      responseIndex: number;
      family: MovementFamily;
      codes: string[];
    }
  | {
      type: 'determinant_conflict';
      responseIndex: number;
      rule: DeterminantConflictRule;
      codes: string[];
    }
  | {
      type: 'duplicate_determinant';
      responseIndex: number;
      code: string;
    }
  | {
      type: 'duplicate_content';
      responseIndex: number;
      code: string;
    }
  | {
      type: 'content_conflict';
      responseIndex: number;
      rule: ContentConflictRule;
      codes: string[];
    }
  | {
      type: 'critical_special_score_conflict';
      responseIndex: number;
      codes: string[];
    }
  | {
      type: 'special_score_level_conflict';
      responseIndex: number;
      codes: string[];
    }
  | {
      type: 'color_projection_conflict';
      responseIndex: number;
      codes: string[];
    }
  | {
      type: 'invalid_z';
      responseIndex: number;
      code: string;
    }
  | {
      type: 'missing_form_quality';
      responseIndex: number;
    };

const movementFamilyByCode = new Map<string, MovementFamily>(
  Object.entries(MOVEMENT_CODE_FAMILIES).flatMap(([family, codes]) =>
    codes.map((code) => [code, family as MovementFamily] as const),
  ),
);

export function getMovementFamily(code: string): MovementFamily | null {
  return movementFamilyByCode.get(code) ?? null;
}

export function getDisabledMovementCodes(
  values: readonly string[],
  currentIndex: number,
): string[] {
  const familiesUsedElsewhere = new Set(
    values
      .filter((_, index) => index !== currentIndex)
      .map(getMovementFamily)
      .filter((family): family is MovementFamily => family !== null),
  );

  return [...familiesUsedElsewhere].flatMap((family) => [
    ...MOVEMENT_CODE_FAMILIES[family],
  ]);
}

/**
 * A blend never repeats the same determinant, so a code selected in one slot
 * is disabled in every other slot, alongside the movement-family disables.
 */
export function getDisabledDeterminantCodes(
  values: readonly string[],
  currentIndex: number,
  specialScores: readonly string[] = [],
): string[] {
  const selectedElsewhere = values.filter(
    (value, index) => index !== currentIndex && value.length > 0,
  );
  const conflictingCodes = selectedElsewhere.flatMap((selectedCode) =>
    Object.values(DETERMINANT_CODE_CONFLICT_GROUPS)
      .filter((group) => (group as readonly string[]).includes(selectedCode))
      .flatMap((group) => [...group]),
  );

  return [...new Set([
    ...getDisabledMovementCodes(values, currentIndex),
    ...selectedElsewhere,
    ...conflictingCodes,
    ...(specialScores.includes('CP') ? CHROMATIC_COLOR_DETERMINANTS : []),
  ])];
}

export function getDisabledContentCodes(
  values: readonly string[],
  currentIndex: number,
): string[] {
  const selectedElsewhere = values.filter(
    (value, index) => index !== currentIndex && value.length > 0,
  );
  const conflictingCodes = selectedElsewhere.flatMap((selectedCode) =>
    Object.values(CONTENT_CODE_CONFLICT_GROUPS)
      .filter((group) => (group as readonly string[]).includes(selectedCode))
      .flatMap((group) => [...group]),
  );

  return [...new Set([...selectedElsewhere, ...conflictingCodes])];
}

export function getDisabledSpecialScoreCodes(
  values: readonly string[],
  currentIndex: number,
  determinants: readonly string[] = [],
): string[] {
  const selectedElsewhere = values.filter(
    (value, index) => index !== currentIndex && value.length > 0,
  );
  const hasContam = selectedElsewhere.includes('CONTAM');
  const hasExcludedCriticalScore = selectedElsewhere.some((score) =>
    (CRITICAL_SPECIAL_SCORES_EXCLUDED_BY_CONTAM as readonly string[]).includes(score),
  );

  return [...new Set([
    ...(hasContam ? CRITICAL_SPECIAL_SCORES_EXCLUDED_BY_CONTAM : []),
    ...(hasExcludedCriticalScore ? ['CONTAM'] : []),
    ...(determinants.some((code) =>
      (CHROMATIC_COLOR_DETERMINANTS as readonly string[]).includes(code))
      ? ['CP']
      : []),
  ])];
}

/**
 * A row participates in calculation only when its card is set.
 * Every caller (page warnings, form calculate, calculator validation)
 * must share this predicate so no row can pass one gate and skip another.
 */
export function isParticipatingResponse(response: RorschachResponse): boolean {
  return response.card.trim().length > 0;
}

export type ProtocolReadiness = {
  responseCount: number;
  missingCards: string[];
  canCalculate: boolean;
  shouldWarnAboutValidity: boolean;
};

/**
 * A complete Comprehensive System protocol includes at least one response for
 * every card I-X. Brief but complete protocols may still be calculated for
 * training, while retaining the existing R < 14 validity warning.
 */
export function evaluateProtocolReadiness(
  responses: readonly RorschachResponse[],
): ProtocolReadiness {
  const participatingResponses = responses.filter(isParticipatingResponse);
  const enteredCards = new Set(
    participatingResponses.map((response) => response.card.trim().toUpperCase()),
  );
  const missingCards = OPTIONS.CARDS.filter((card) => !enteredCards.has(card));

  return {
    responseCount: participatingResponses.length,
    missingCards,
    canCalculate: missingCards.length === 0,
    shouldWarnAboutValidity: participatingResponses.length < 14,
  };
}

export function findScoringInputIssues(
  responses: readonly RorschachResponse[],
): ScoringInputIssue[] {
  const participatingRows = new Set(
    responses.flatMap((response, responseIndex) =>
      isParticipatingResponse(response) ? [responseIndex] : [],
    ),
  );

  const issues: ScoringInputIssue[] = findInvalidDeterminantInputs(responses)
    .filter(({ responseIndex }) => participatingRows.has(responseIndex))
    .map(({ responseIndex, code }) => ({
      type: 'invalid_determinant' as const,
      responseIndex,
      code,
    }));

  responses.forEach((response, responseIndex) => {
    if (!participatingRows.has(responseIndex)) return;

    for (const field of ['location', 'dq'] as const) {
      if (!response[field].trim()) {
        issues.push({ type: 'missing_required_field', responseIndex, field });
      }
    }
    for (const field of ['determinants', 'contents'] as const) {
      if (!response[field].some((code) => code.trim().length > 0)) {
        issues.push({ type: 'missing_required_field', responseIndex, field });
      }
    }

    if (response.location === 'S') {
      issues.push({ type: 'standalone_space', responseIndex });
    }

    for (const [family, familyCodes] of Object.entries(MOVEMENT_CODE_FAMILIES)) {
      const distinctFamilyCodes = [...new Set(
        response.determinants.filter((code) =>
          (familyCodes as readonly string[]).includes(code),
        ),
      )];
      if (distinctFamilyCodes.length > 1) {
        issues.push({
          type: 'movement_family_conflict',
          responseIndex,
          family: family as MovementFamily,
          codes: distinctFamilyCodes,
        });
      }
    }

    for (const [rule, conflictGroup] of Object.entries(DETERMINANT_CODE_CONFLICT_GROUPS)) {
      const selectedCodes = [...new Set(
        response.determinants.filter((code) =>
          (conflictGroup as readonly string[]).includes(code),
        ),
      )];
      if (selectedCodes.length > 1) {
        issues.push({
          type: 'determinant_conflict',
          responseIndex,
          rule: rule as DeterminantConflictRule,
          codes: selectedCodes,
        });
      }
    }

    const seenCodes = new Set<string>();
    for (const code of response.determinants) {
      if (code.length === 0) continue;
      if (seenCodes.has(code)) {
        issues.push({ type: 'duplicate_determinant', responseIndex, code });
      }
      seenCodes.add(code);
    }

    const seenContents = new Set<string>();
    for (const code of response.contents) {
      if (code.length === 0) continue;
      if (seenContents.has(code)) {
        issues.push({ type: 'duplicate_content', responseIndex, code });
      }
      seenContents.add(code);
    }

    for (const [rule, conflictGroup] of Object.entries(CONTENT_CODE_CONFLICT_GROUPS)) {
      const selectedCodes = [...new Set(
        response.contents.filter((code) =>
          (conflictGroup as readonly string[]).includes(code),
        ),
      )];
      if (selectedCodes.length > 1) {
        issues.push({
          type: 'content_conflict',
          responseIndex,
          rule: rule as ContentConflictRule,
          codes: selectedCodes,
        });
      }
    }

    if (response.specialScores.includes('CONTAM')) {
      const conflictingScores = response.specialScores.filter((score) =>
        (CRITICAL_SPECIAL_SCORES_EXCLUDED_BY_CONTAM as readonly string[]).includes(score),
      );
      if (conflictingScores.length > 0) {
        issues.push({
          type: 'critical_special_score_conflict',
          responseIndex,
          codes: ['CONTAM', ...new Set(conflictingScores)],
        });
      }
    }

    for (const pair of SPECIAL_SCORE_LEVEL_PAIRS) {
      if (pair.every((score) => response.specialScores.includes(score))) {
        issues.push({
          type: 'special_score_level_conflict',
          responseIndex,
          codes: [...pair],
        });
      }
    }

    if (
      response.specialScores.includes('CP')
      && response.determinants.some((code) =>
        (CHROMATIC_COLOR_DETERMINANTS as readonly string[]).includes(code))
    ) {
      issues.push({
        type: 'color_projection_conflict',
        responseIndex,
        codes: [
          'CP',
          ...new Set(response.determinants.filter((code) =>
            (CHROMATIC_COLOR_DETERMINANTS as readonly string[]).includes(code))),
        ],
      });
    }

    if (response.z.length > 0) {
      const cardScores = SCORING_CONFIG.TABLES.Z_SCORE[
        response.card as keyof typeof SCORING_CONFIG.TABLES.Z_SCORE
      ];
      const zValue = cardScores?.[
        response.z as keyof typeof SCORING_CONFIG.TABLES.Z_SCORE.I
      ];
      if (!(OPTIONS.Z_TYPES as readonly string[]).includes(response.z) || typeof zValue !== 'number') {
        issues.push({ type: 'invalid_z', responseIndex, code: response.z });
      }
    }

    if (response.fq.trim().length === 0) {
      issues.push({ type: 'missing_form_quality', responseIndex });
    } else {
      const requirement = getFormQualityRequirement(response.determinants);
      if (
        (requirement === 'form' && response.fq === 'none')
        || (requirement === 'none' && response.fq !== 'none')
      ) {
        issues.push({ type: 'incompatible_form_quality', responseIndex });
      }
    }
  });

  return issues;
}

export function summarizeScoringInputIssues(issues: readonly ScoringInputIssue[]) {
  const rowsFor = (type: ScoringInputIssue['type']) =>
    [...new Set(
      issues
        .filter((issue) => issue.type === type)
        .map((issue) => issue.responseIndex + 1),
    )].join(', ');

  const invalidDeterminants = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'invalid_determinant' }> =>
      issue.type === 'invalid_determinant',
  );
  const duplicateDeterminants = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'duplicate_determinant' }> =>
      issue.type === 'duplicate_determinant',
  );
  const determinantConflicts = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'determinant_conflict' }> =>
      issue.type === 'determinant_conflict',
  );
  const duplicateContents = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'duplicate_content' }> =>
      issue.type === 'duplicate_content',
  );
  const contentConflicts = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'content_conflict' }> =>
      issue.type === 'content_conflict',
  );
  const criticalSpecialScoreConflicts = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'critical_special_score_conflict' }> =>
      issue.type === 'critical_special_score_conflict',
  );
  const specialScoreLevelConflicts = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'special_score_level_conflict' }> =>
      issue.type === 'special_score_level_conflict',
  );
  const colorProjectionConflicts = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'color_projection_conflict' }> =>
      issue.type === 'color_projection_conflict',
  );
  const invalidZ = issues.filter(
    (issue): issue is Extract<ScoringInputIssue, { type: 'invalid_z' }> =>
      issue.type === 'invalid_z',
  );

  return {
    missingRequiredFieldsRows: rowsFor('missing_required_field'),
    incompatibleFormQualityRows: rowsFor('incompatible_form_quality'),
    invalidDeterminants: {
      rows: rowsFor('invalid_determinant'),
      codes: [...new Set(invalidDeterminants.map((issue) => issue.code))].join(', '),
    },
    standaloneSpaceRows: rowsFor('standalone_space'),
    movementConflictRows: rowsFor('movement_family_conflict'),
    determinantConflicts: {
      rows: rowsFor('determinant_conflict'),
      codes: [...new Set(determinantConflicts.map((issue) => issue.codes.join('/')))].join(', '),
    },
    duplicateDeterminants: {
      rows: rowsFor('duplicate_determinant'),
      codes: [...new Set(duplicateDeterminants.map((issue) => issue.code))].join(', '),
    },
    duplicateContents: {
      rows: rowsFor('duplicate_content'),
      codes: [...new Set(duplicateContents.map((issue) => issue.code))].join(', '),
    },
    contentConflicts: {
      rows: rowsFor('content_conflict'),
      codes: [...new Set(contentConflicts.map((issue) => issue.codes.join('/')))].join(', '),
    },
    criticalSpecialScoreConflicts: {
      rows: rowsFor('critical_special_score_conflict'),
      codes: [...new Set(
        criticalSpecialScoreConflicts.map((issue) => issue.codes.join('/')),
      )].join(', '),
    },
    specialScoreLevelConflicts: {
      rows: rowsFor('special_score_level_conflict'),
      codes: [...new Set(
        specialScoreLevelConflicts.map((issue) => issue.codes.join('/')),
      )].join(', '),
    },
    colorProjectionConflicts: {
      rows: rowsFor('color_projection_conflict'),
      codes: [...new Set(
        colorProjectionConflicts.map((issue) => issue.codes.join('/')),
      )].join(', '),
    },
    invalidZ: {
      rows: rowsFor('invalid_z'),
      codes: [...new Set(invalidZ.map((issue) => issue.code))].join(', '),
    },
    missingFormQualityRows: rowsFor('missing_form_quality'),
  };
}
