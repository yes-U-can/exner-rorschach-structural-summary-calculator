import type { RorschachResponse } from '@/types';

export const FORMLESS_DETERMINANTS = ['C', "C'", 'T', 'V', 'Y', 'Cn'] as const;

const FORM_REQUIRED_DETERMINANTS = new Set([
  'F', 'FC', 'CF', "FC'", "C'F", 'FT', 'TF', 'FV', 'VF', 'FY', 'YF',
  'Fr', 'rF', 'FD', 'FMa', 'FMp', 'FMa-p', 'ma', 'mp', 'ma-p',
]);

/** Exner Vol. 1 (4th ed.), p.120: human movement can also be formless. */
export function getFormQualityRequirement(
  determinants: readonly string[],
): 'form' | 'none' | 'either' {
  const selected = determinants.filter((code) => code.trim().length > 0);
  if (selected.some((code) => FORM_REQUIRED_DETERMINANTS.has(code))) return 'form';
  if (selected.length > 0 && selected.every((code) =>
    (FORMLESS_DETERMINANTS as readonly string[]).includes(code))) return 'none';
  return 'either';
}

export const SPECIAL_SCORE_LEVEL_PAIRS = [
  ['DV1', 'DV2'],
  ['DR1', 'DR2'],
  ['INCOM1', 'INCOM2'],
  ['FABCOM1', 'FABCOM2'],
] as const;

export type ScoringResponseRule =
  | 'reflection_pair'
  | 'dq_vague_fq'
  | 'dq_vague_z'
  | 'formless_fq'
  | 'form_required_fq'
  | 'special_score_level';

export interface ScoringResponseRuleResult {
  response: RorschachResponse;
  appliedRules: ScoringResponseRule[];
}

function active(values: readonly string[]): string[] {
  return values.filter((value) => value.length > 0);
}

export function applyScoringResponseRules(
  input: RorschachResponse,
  previous?: RorschachResponse,
): ScoringResponseRuleResult {
  const response: RorschachResponse = {
    ...input,
    determinants: [...input.determinants],
    contents: [...input.contents],
    specialScores: active(input.specialScores),
  };
  const appliedRules: ScoringResponseRule[] = [];
  const activeDeterminants = active(response.determinants);

  if (
    activeDeterminants.some((code) => code === 'Fr' || code === 'rF')
    && response.pair === '(2)'
  ) {
    response.pair = 'none';
    appliedRules.push('reflection_pair');
  }

  if (response.dq === 'v' && response.fq === '+') {
    response.fq = '';
    appliedRules.push('dq_vague_fq');
  }

  if (response.dq === 'v' && response.z.length > 0) {
    response.z = '';
    appliedRules.push('dq_vague_z');
  }

  const formQualityRequirement = getFormQualityRequirement(activeDeterminants);
  if (formQualityRequirement === 'none' && response.fq !== 'none') {
    response.fq = 'none';
    appliedRules.push('formless_fq');
  }

  if (formQualityRequirement === 'form' && response.fq === 'none') {
    // A prior automatic none must not survive a change to FC, F, etc.
    // The scorer must choose the applicable FQ; never infer o/u/- for them.
    response.fq = '';
    appliedRules.push('form_required_fq');
  }

  const previousScores = active(previous?.specialScores ?? []);
  for (const [level1, level2] of SPECIAL_SCORE_LEVEL_PAIRS) {
    if (!response.specialScores.includes(level1) || !response.specialScores.includes(level2)) {
      continue;
    }

    const level1Added = !previousScores.includes(level1);
    const level2Added = !previousScores.includes(level2);
    const removeTarget = level1Added && !level2Added
      ? level2
      : level2Added && !level1Added
        ? level1
        : level2;
    response.specialScores = response.specialScores.filter(
      (score) => score !== removeTarget,
    );
    if (!appliedRules.includes('special_score_level')) {
      appliedRules.push('special_score_level');
    }
  }

  return { response, appliedRules };
}
