import { describe, expect, it } from 'vitest';

import { buildReferenceSearchExcerpt } from '@/lib/referenceSearchExcerpt';

describe('reference search excerpts', () => {
  it('removes authoring metadata from result previews', () => {
    const excerpt = buildReferenceSearchExcerpt([
      '[Title] Developmental Quality',
      '[Aliases] DQ, \uBC1C\uB2EC\uC9C8',
      '## \uD575\uC2EC \uC815\uC758',
      'DQ\uB294 \uBC18\uC751\uC744 \uAD6C\uC131\uD558\uB294 \uBC29\uC2DD\uC774 \uC5BC\uB9C8\uB098 \uD1B5\uD569\uC801\uC774\uACE0 \uC815\uAD50\uD55C\uC9C0\uB97C \uAE30\uB85D\uD558\uB294 \uBD80\uD638\uB2E4.',
    ].join('\n'));

    expect(excerpt).toBe('\uD575\uC2EC \uC815\uC758 DQ\uB294 \uBC18\uC751\uC744 \uAD6C\uC131\uD558\uB294 \uBC29\uC2DD\uC774 \uC5BC\uB9C8\uB098 \uD1B5\uD569\uC801\uC774\uACE0 \uC815\uAD50\uD55C\uC9C0\uB97C \uAE30\uB85D\uD558\uB294 \uBD80\uD638\uB2E4.');
    expect(excerpt).not.toContain('[Title]');
    expect(excerpt).not.toContain('[Aliases]');
  });

  it('limits long previews without exceeding the requested length', () => {
    const excerpt = buildReferenceSearchExcerpt('\uAC00'.repeat(300), 80);

    expect(excerpt).toHaveLength(80);
    expect(excerpt.endsWith('...')).toBe(true);
  });
});
