import { describe, expect, it } from 'vitest';

import { buildReferenceCorpusFingerprint } from '@/scripts/lib/referenceCorpusFingerprint.mjs';

function artifact(authorityPolicy: string, contentHash = 'hash-a', chunkId = 'route#1') {
  return {
    locales: ['en'],
    chunksByLocale: {
      en: [
        {
          chunkId,
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

    expect(buildReferenceCorpusFingerprint(artifact('public-policy', 'hash-a', 'route#2'))).not.toBe(
      buildReferenceCorpusFingerprint(artifact('public-policy', 'hash-a', 'route#1')),
    );
  });
});
