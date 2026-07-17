import { createHash } from 'node:crypto';

export function buildReferenceEmbeddingText(chunk) {
  const headingPath = Array.isArray(chunk.headingPath) ? chunk.headingPath.join(' > ') : '';
  const aliases = Array.isArray(chunk.aliases) && chunk.aliases.length > 0 ? chunk.aliases.join(', ') : '';
  return [
    `[Route] ${chunk.canonicalRoute}`,
    headingPath ? `[Heading] ${headingPath}` : '',
    aliases ? `[Aliases] ${aliases}` : '',
    chunk.text,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildReferenceChunkContentHash(chunk) {
  return createHash('sha256')
    .update(buildReferenceEmbeddingText(chunk), 'utf8')
    .digest('hex');
}
