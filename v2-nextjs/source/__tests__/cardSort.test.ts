import { describe, expect, it } from 'vitest';

import {
  detectCardSortDirection,
  getNextCardSortDirection,
  sortResponsesByCard,
} from '@/lib/cardSort';
import type { RorschachResponse } from '@/types';

function response(card: string, memo: string): RorschachResponse {
  return {
    card,
    response: memo,
    location: '',
    dq: '',
    determinants: [],
    fq: '',
    pair: 'none',
    contents: [],
    popular: false,
    z: '',
    specialScores: [],
  };
}

describe('Card row sorting', () => {
  it('switches an already ascending table to descending on the next click', () => {
    const responses = [
      response('I', 'first'),
      response('II', 'second'),
      response('X', 'third'),
    ];

    expect(detectCardSortDirection(responses)).toBe('ascending');
    expect(getNextCardSortDirection(responses)).toBe('descending');
    expect(
      sortResponsesByCard(responses, 'descending').map((item) => item.card),
    ).toEqual(['X', 'II', 'I']);
  });

  it('sorts a mixed table ascending on the first click', () => {
    const responses = [
      response('VIII', 'first'),
      response('II', 'second'),
      response('X', 'third'),
    ];

    expect(detectCardSortDirection(responses)).toBeNull();
    expect(getNextCardSortDirection(responses)).toBe('ascending');
    expect(
      sortResponsesByCard(responses, 'ascending').map((item) => item.card),
    ).toEqual(['II', 'VIII', 'X']);
  });

  it('keeps blank rows last and preserves the order within the same Card', () => {
    const responses = [
      response('', 'blank-1'),
      response('II', 'same-card-1'),
      response('I', 'card-one'),
      response('II', 'same-card-2'),
      response('', 'blank-2'),
    ];

    const sorted = sortResponsesByCard(responses, 'descending');

    expect(sorted.map((item) => item.card)).toEqual(['II', 'II', 'I', '', '']);
    expect(sorted.map((item) => item.response)).toEqual([
      'same-card-1',
      'same-card-2',
      'card-one',
      'blank-1',
      'blank-2',
    ]);
  });
});
