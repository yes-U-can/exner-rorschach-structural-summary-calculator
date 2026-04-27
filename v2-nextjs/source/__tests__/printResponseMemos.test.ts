import { describe, expect, it } from 'vitest';
import { buildPrintResponseMemoGroups, PRINT_CARD_ORDER } from '@/lib/printResponseMemos';
import type { RorschachResponse } from '@/types';

function makeResponse(partial: Partial<RorschachResponse>): RorschachResponse {
  return {
    card: '',
    response: '',
    location: '',
    dq: '',
    determinants: [],
    fq: '',
    pair: '',
    contents: [],
    popular: false,
    z: '',
    specialScores: [],
    ...partial,
  };
}

describe('print response memo grouping', () => {
  it('always returns ten card groups in card order', () => {
    const groups = buildPrintResponseMemoGroups([]);

    expect(groups).toHaveLength(10);
    expect(groups.map((group) => group.cardLabel)).toEqual([...PRINT_CARD_ORDER]);
  });

  it('groups multiple responses under the same card while preserving row order', () => {
    const groups = buildPrintResponseMemoGroups([
      makeResponse({ card: 'II', response: 'first response' }),
      makeResponse({ card: 'IV', response: 'another response' }),
      makeResponse({ card: 'II', response: 'second response' }),
    ]);

    expect(groups.find((group) => group.cardLabel === 'II')?.responses).toEqual([
      'first response',
      'second response',
    ]);
    expect(groups.find((group) => group.cardLabel === 'IV')?.responses).toEqual(['another response']);
  });

  it('ignores empty memos and non-standard card labels', () => {
    const groups = buildPrintResponseMemoGroups([
      makeResponse({ card: 'III', response: 'kept' }),
      makeResponse({ card: 'III', response: '   ' }),
      makeResponse({ card: 'row 1', response: 'ignored' }),
    ]);

    expect(groups.find((group) => group.cardLabel === 'III')?.responses).toEqual(['kept']);
    expect(groups.every((group) => !group.responses.includes('ignored'))).toBe(true);
  });
});
