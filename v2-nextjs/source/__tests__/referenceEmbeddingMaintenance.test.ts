import { describe, expect, it, vi } from 'vitest';

describe('reference embedding maintenance', () => {
  it('prunes obsolete rows against chunk IDs from the same locale only', async () => {
    const { pruneProviderRows } = await import('../scripts/lib/referenceEmbeddingMaintenance.mjs');
    const query = vi.fn().mockResolvedValue({ rowCount: 0 });

    await pruneProviderRows(
      { query },
      'openai',
      ['ko', 'en'],
      [
        { locale: 'ko', chunkId: 'shared#1' },
        { locale: 'ko', chunkId: 'ko-only#1' },
        { locale: 'en', chunkId: 'shared#1' },
        { locale: 'en', chunkId: 'en-only#1' },
      ],
    );

    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[0]?.[1]).toEqual([
      'openai',
      'ko',
      ['shared#1', 'ko-only#1'],
    ]);
    expect(query.mock.calls[1]?.[1]).toEqual([
      'openai',
      'en',
      ['shared#1', 'en-only#1'],
    ]);
  });
});
