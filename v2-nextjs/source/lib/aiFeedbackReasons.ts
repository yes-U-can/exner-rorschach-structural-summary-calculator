import type { AiFeedbackRating, AiFeedbackReasonCode } from '@/types';

export const AI_FEEDBACK_REASON_SCHEMA_VERSION = 1;

export const AI_FEEDBACK_REASON_CODES_BY_RATING = {
  helpful: [
    'accurate',
    'well_grounded',
    'clear',
    'right_level_of_detail',
    'respects_clinical_boundaries',
  ],
  unhelpful: [
    'incorrect',
    'missed_context',
    'unsupported',
    'overconfident',
    'too_long',
    'too_short',
    'incomplete',
    'unclear',
    'unsafe_or_inappropriate',
    'other',
  ],
} as const satisfies Record<AiFeedbackRating, readonly AiFeedbackReasonCode[]>;

const MAX_REASON_CODES = Math.max(
  ...Object.values(AI_FEEDBACK_REASON_CODES_BY_RATING).map((codes) => codes.length),
);

export function parseAiFeedbackReasonCodes(
  value: unknown,
  rating: AiFeedbackRating | null,
): AiFeedbackReasonCode[] | null {
  const normalizedValue = value === undefined ? [] : value;
  if (!Array.isArray(normalizedValue) || normalizedValue.length > MAX_REASON_CODES) return null;
  if (!normalizedValue.every((code) => typeof code === 'string')) return null;
  if (new Set(normalizedValue).size !== normalizedValue.length) return null;
  if (rating === null) return normalizedValue.length === 0 ? [] : null;

  const allowedCodes = new Set<string>(AI_FEEDBACK_REASON_CODES_BY_RATING[rating]);
  if (!normalizedValue.every((code) => allowedCodes.has(code))) return null;
  return normalizedValue as AiFeedbackReasonCode[];
}
