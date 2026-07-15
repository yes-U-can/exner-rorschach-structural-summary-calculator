import type { AiFeedbackLengthBucket } from '@/types';

export function getAiFeedbackLengthBucket(responseChars: number): AiFeedbackLengthBucket {
  if (responseChars < 500) return 'under_500';
  if (responseChars < 1_500) return 'from_500_to_1499';
  if (responseChars < 3_000) return 'from_1500_to_2999';
  if (responseChars < 6_000) return 'from_3000_to_5999';
  return 'over_6000';
}
