import { findInvalidDeterminantInputs } from '@/lib/determinantInput';
import type { RorschachResponse } from '@/types';

export const MOVEMENT_CODE_FAMILIES = {
  M: ['Ma', 'Mp', 'Ma-p'],
  FM: ['FMa', 'FMp', 'FMa-p'],
  m: ['ma', 'mp', 'ma-p'],
} as const;

export type MovementFamily = keyof typeof MOVEMENT_CODE_FAMILIES;

export type ScoringInputIssue =
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
 * A row participates in calculation only when its card is set.
 * Every caller (page warnings, form calculate, calculator validation)
 * must share this predicate so no row can pass one gate and skip another.
 */
export function isParticipatingResponse(response: RorschachResponse): boolean {
  return response.card.trim().length > 0;
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

    if (response.location === 'S') {
      issues.push({ type: 'standalone_space', responseIndex });
    }

    for (const [family, familyCodes] of Object.entries(MOVEMENT_CODE_FAMILIES)) {
      const selectedCodes = response.determinants.filter((code) =>
        (familyCodes as readonly string[]).includes(code),
      );
      if (selectedCodes.length > 1) {
        issues.push({
          type: 'movement_family_conflict',
          responseIndex,
          family: family as MovementFamily,
          codes: selectedCodes,
        });
      }
    }

    if (response.fq.trim().length === 0) {
      issues.push({ type: 'missing_form_quality', responseIndex });
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

  return {
    invalidDeterminants: {
      rows: rowsFor('invalid_determinant'),
      codes: [...new Set(invalidDeterminants.map((issue) => issue.code))].join(', '),
    },
    standaloneSpaceRows: rowsFor('standalone_space'),
    movementConflictRows: rowsFor('movement_family_conflict'),
    missingFormQualityRows: rowsFor('missing_form_quality'),
  };
}
