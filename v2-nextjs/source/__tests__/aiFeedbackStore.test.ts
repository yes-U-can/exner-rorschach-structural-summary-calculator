import { describe, expect, it } from 'vitest';
import { getAiFeedbackLengthBucket } from '@/lib/aiFeedback';
import { normalizeAiFeedbackCompletion } from '@/lib/aiFeedbackStore';

describe('privacy-safe AI feedback aggregation', () => {
  it.each([
    [0, 'under_500'],
    [499, 'under_500'],
    [500, 'from_500_to_1499'],
    [1_500, 'from_1500_to_2999'],
    [3_000, 'from_3000_to_5999'],
    [6_000, 'over_6000'],
  ] as const)('maps %i characters to %s', (characters, bucket) => {
    expect(getAiFeedbackLengthBucket(characters)).toBe(bucket);
  });

  it('keeps only completion states useful for aggregate quality analysis', () => {
    expect(normalizeAiFeedbackCompletion('completed')).toBe('completed');
    expect(normalizeAiFeedbackCompletion('incomplete')).toBe('incomplete');
    expect(normalizeAiFeedbackCompletion('failed')).toBe('unknown');
    expect(normalizeAiFeedbackCompletion('streaming')).toBe('unknown');
  });
});
