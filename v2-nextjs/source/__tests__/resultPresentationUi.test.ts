import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homePageSource = readFileSync('app/page.tsx', 'utf8');
const specialIndicesSource = readFileSync('components/result/SpecialIndices.tsx', 'utf8');

describe('result presentation UI', () => {
  it('keeps active and inactive result tabs visibly bounded', () => {
    expect(homePageSource).toContain('inline-flex min-w-max gap-1 rounded-lg border');
    expect(homePageSource).toContain('rounded-md border px-4 py-2');
    expect(homePageSource).toContain(
      'border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)]',
    );
  });

  it('aligns the summary checkbox independently from criterion rows', () => {
    expect(specialIndicesSource).toContain('alignWithSummary?: boolean;');
    expect(specialIndicesSource).toContain(
      "alignWithSummary ? (compact ? 'mt-1' : 'mt-1.5') : 'mt-0.5'",
    );
    expect(specialIndicesSource).toContain(
      '<Checkbox checked={isPositive} compact={compact} alignWithSummary />',
    );
  });
});
