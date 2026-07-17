import type { ReferenceChunkRecord } from '@/lib/referenceCorpus';
import type { ReferenceVectorHit } from '@/lib/referenceVectorStore';

export function filterCurrentReferenceVectorHits(
  hits: ReferenceVectorHit[],
  chunks: ReferenceChunkRecord[],
): ReferenceVectorHit[] {
  const currentHashes = new Map(chunks.map((chunk) => [chunk.chunkId, chunk.contentHash]));
  return hits.filter(
    (hit) => Boolean(hit.contentHash) && currentHashes.get(hit.chunkId) === hit.contentHash,
  );
}
