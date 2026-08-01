import { describe, expect, it } from 'vitest';

import { v1GasVersions, v2NextVersions } from '@/lib/versionArchive';

describe('version archive dates', () => {
  it('keeps the corrected release dates from v2.1.8 through v2.2.8', () => {
    const dates = Object.fromEntries(
      v2NextVersions
        .filter(({ version }) => [
          'v2.2.8',
          'v2.2.7',
          'v2.2.6',
          'v2.2.5',
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
      'v2.2.8': '2026-07-31',
      'v2.2.7': '2026-07-23',
      'v2.2.6': '2026-07-20',
      'v2.2.5': '2026-07-19',
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

  it('keeps the corrected early v1 release chronology', () => {
    const dates = Object.fromEntries(
      v1GasVersions
        .filter(({ version }) => [
          'v1.0.1',
          'v1.0.2',
          'v1.0.3',
          'v1.0.4',
        ].includes(version))
        .map(({ version, publishedAt }) => [version, publishedAt]),
    );

    expect(dates).toEqual({
      'v1.0.1': '2025-10-17',
      'v1.0.2': '2025-10-18',
      'v1.0.3': '2025-10-18',
      'v1.0.4': '2025-10-20',
    });
  });
});
