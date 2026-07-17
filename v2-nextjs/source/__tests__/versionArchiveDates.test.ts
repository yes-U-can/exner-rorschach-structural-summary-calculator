import { describe, expect, it } from 'vitest';

import { v2NextVersions } from '@/lib/versionArchive';

describe('version archive dates', () => {
  it('keeps the corrected release dates from v2.1.8 through v2.2.4', () => {
    const dates = Object.fromEntries(
      v2NextVersions
        .filter(({ version }) => [
          'v2.2.4',
          'v2.2.3',
          'v2.2.2',
          'v2.2.1',
          'v2.2.0',
          'v2.1.10',
          'v2.1.9',
          'v2.1.8',
        ].includes(version))
        .map(({ version, publishedAt }) => [version, publishedAt]),
    );

    expect(dates).toEqual({
      'v2.2.4': '2026-07-18',
      'v2.2.3': '2026-07-17',
      'v2.2.2': '2026-07-16',
      'v2.2.1': '2026-07-15',
      'v2.2.0': '2026-07-14',
      'v2.1.10': '2026-07-13',
      'v2.1.9': '2026-07-12',
      'v2.1.8': '2026-07-11',
    });
  });
});
