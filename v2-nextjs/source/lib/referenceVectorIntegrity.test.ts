import { describe, expect, it } from 'vitest';
import { filterCurrentReferenceVectorHits } from '@/lib/referenceVectorIntegrity';
import type { ReferenceChunkRecord } from '@/lib/referenceCorpus';
import type { ReferenceVectorHit } from '@/lib/referenceVectorStore';

const chunk = {
  locale: 'en',
  canonicalRoute: 'scoring-input/fq/o',
  chunkId: 'scoring-input/fq/o#1',
  contentHash: 'current-hash',
  headingPath: ['FQ'],
  text: 'Current corpus text',
  aliases: ['FQ'],
  relatedRoutes: [],
  authorityPolicy: 'curated-internal-reference',
  evidenceTier: null,
  status: 'reviewed',
  runtimeReady: true,
} satisfies ReferenceChunkRecord;

function hit(contentHash: string): ReferenceVectorHit {
  return {
    chunkId: chunk.chunkId,
    canonicalRoute: chunk.canonicalRoute,
    locale: 'en',
    provider: 'openai',
    similarity: 0.9,
    embeddingModel: 'test-model',
    dimensions: 3,
    contentHash,
  };
}

describe('reference vector content integrity', () => {
  it('keeps only vectors generated from the current chunk content', () => {
    expect(filterCurrentReferenceVectorHits([hit('stale-hash'), hit('current-hash')], [chunk])).toEqual([
      hit('current-hash'),
    ]);
  });

  it('rejects rows without a matching current chunk', () => {
    expect(filterCurrentReferenceVectorHits([hit('current-hash')], [])).toEqual([]);
  });
});
