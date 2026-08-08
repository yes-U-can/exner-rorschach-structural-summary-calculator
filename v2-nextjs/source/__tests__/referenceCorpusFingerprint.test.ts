import { describe, expect, it } from 'vitest';

import { buildReferenceCorpusFingerprint } from '@/scripts/lib/referenceCorpusFingerprint.mjs';

function artifact(authorityPolicy: string, contentHash = 'hash-a') {
  return {
    locales: ['en'],
    chunksByLocale: {
      en: [
        {
          chunkId: 'route#1',
          contentHash,
          authorityPolicy,
          text: 'Same embedding input',
        },
      ],
    },
  };
}

describe('reference corpus fingerprint', () => {
  it('tracks embedding identity instead of publication-only metadata', () => {
    expect(buildReferenceCorpusFingerprint(artifact('private-policy'))).toBe(
      buildReferenceCorpusFingerprint(artifact('public-policy')),
    );

    expect(buildReferenceCorpusFingerprint(artifact('public-policy', 'hash-b'))).not.toBe(
      buildReferenceCorpusFingerprint(artifact('public-policy', 'hash-a')),
    );
  });
});
