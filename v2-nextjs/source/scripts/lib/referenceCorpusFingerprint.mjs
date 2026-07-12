import { createHash } from 'node:crypto';

export function buildReferenceCorpusFingerprint(chunksArtifact) {
  const fingerprintPayload = {
    locales: chunksArtifact.locales ?? [],
    chunksByLocale: chunksArtifact.chunksByLocale ?? {},
  };

  return createHash('sha256')
    .update(JSON.stringify(fingerprintPayload), 'utf8')
    .digest('hex');
}
