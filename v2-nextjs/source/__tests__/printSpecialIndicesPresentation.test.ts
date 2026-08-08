import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/result/print/PrintSpecialIndices.tsx'),
  'utf8',
);

describe('PDF Special Indices presentation', () => {
  it('renders the overall decision checkbox for every index with a threshold summary', () => {
    expect(source).toContain('<Checkbox checked={Boolean(isPositive)} />');

    for (const key of ['SCON', 'DEPI', 'CDI', 'HVI', 'OBS']) {
      expect(source).toContain(`isPositive={isPositive(data.${key})}`);
    }
  });

  it('separates the overall decision from the criteria and keeps the HVI summary compact', () => {
    expect(source).toContain(
      'flex items-start gap-1 border-b border-slate-200 pb-1',
    );
    expect(source).toContain('summaryTextClassName="text-[7px]"');
  });

  it('separates the fourth OBS rule from the three preceding rule combinations', () => {
    expect(source).toContain(
      "{ label: 'FQ+ > 3 & X+% > .89', met: data.obs_rules.r4, dividerBefore: true }",
    );
    expect(source).toContain(
      "item.dividerBefore ? 'border-t border-slate-200 pt-1' : ''",
    );
  });
});
