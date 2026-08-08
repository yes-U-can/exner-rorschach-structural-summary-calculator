import { createHash } from 'node:crypto';

export function buildReferenceCorpusFingerprint(chunksArtifact) {
  const locales = Array.isArray(chunksArtifact.locales) ? chunksArtifact.locales : [];
  const fingerprintPayload = {
    locales,
    chunksByLocale: Object.fromEntries(
      locales.map((locale) => [
        locale,
        (chunksArtifact.chunksByLocale?.[locale] ?? []).map((chunk) => ({
          chunkId: String(chunk.chunkId ?? ''),
          contentHash: String(chunk.contentHash ?? ''),
        })),
      ]),
    ),
  };

  return createHash('sha256')
    .update(JSON.stringify(fingerprintPayload), 'utf8')
    .digest('hex');
}
