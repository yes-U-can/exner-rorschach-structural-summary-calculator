import { SCORING_CONFIG } from './constants';
import type { RorschachResponse } from '@/types';

export type GphrClassification = 'GHR' | 'PHR' | '';

/**
 * Applies the ordered seven-step GHR/PHR decision sequence.
 * The order is part of the scoring rule and must not be rearranged.
 */
export function classifyGPHR(response: RorschachResponse): GphrClassification {
  const hasAnyContent = (codes: readonly string[]) =>
    response.contents.some((content) => codes.includes(content));
  const hasAnySpecialScore = (codes: readonly string[]) =>
    response.specialScores.some((score) => codes.includes(score));
  const hasAnyDeterminant = (codes: readonly string[]) =>
    response.determinants.some((determinant) => codes.includes(determinant));

  const hasHumanContent = hasAnyContent(SCORING_CONFIG.CODES.HUMAN_CONTENT_GPHR);
  const hasHumanMovement = hasAnyDeterminant(SCORING_CONFIG.CODES.HUMAN_MOVEMENT);
  const hasAnimalMovement = hasAnyDeterminant(SCORING_CONFIG.CODES.ANIMAL_MOVEMENT);
  const hasCopOrAg = hasAnySpecialScore(SCORING_CONFIG.CODES.COP_OR_AG);
  const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);

  if (!isEligible) return '';

  const isGoodFQ = SCORING_CONFIG.CODES.FQ_GOOD.includes(response.fq as never);
  const isBadFQ = SCORING_CONFIG.CODES.FQ_BAD.includes(response.fq as never);

  // Step 1: well-formed pure-H representations without disqualifying scores.
  if (
    hasAnyContent(SCORING_CONFIG.CODES.PURE_H) &&
    isGoodFQ &&
    !hasAnySpecialScore(SCORING_CONFIG.CODES.COGNITIVE_SS_BAD) &&
    !hasAnySpecialScore(SCORING_CONFIG.CODES.AG_OR_MOR)
  ) {
    return 'GHR';
  }

  // Step 2: poor/absent FQ, or good FQ with ALOG, CONTAM, or any Level 2 score.
  if (
    isBadFQ ||
    (isGoodFQ && (
      hasAnySpecialScore(SCORING_CONFIG.CODES.LEVEL_2_SS) ||
      hasAnySpecialScore(['ALOG', 'CONTAM'])
    ))
  ) {
    return 'PHR';
  }

  // Steps 3-7 must remain ordered because an earlier rule takes precedence.
  if (hasAnySpecialScore(['COP']) && !hasAnySpecialScore(['AG'])) return 'GHR';
  if (hasAnySpecialScore(['FABCOM1', 'MOR']) || hasAnyContent(['An'])) return 'PHR';
  if (response.popular && SCORING_CONFIG.CODES.GPHR_POPULAR_CARDS.includes(response.card as never)) return 'GHR';
  if (hasAnySpecialScore(['AG', 'INCOM1', 'DR1']) || hasAnyContent(['Hd'])) return 'PHR';
  return 'GHR';
}
