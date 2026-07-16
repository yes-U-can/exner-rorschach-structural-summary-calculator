import { describe, expect, it } from 'vitest';

import { classifyGPHR } from '@/lib/gphr';
import type { RorschachResponse } from '@/types';

function response(overrides: Partial<RorschachResponse> = {}): RorschachResponse {
  return {
    card: 'I',
    response: '',
    location: 'W',
    dq: 'o',
    determinants: ['F'],
    fq: 'o',
    pair: 'none',
    contents: ['H'],
    popular: false,
    z: '',
    specialScores: [],
    ...overrides,
  };
}

describe('shared GHR/PHR decision sequence', () => {
  it('applies Step 1 to good-FQ Pure H, including the DV1 exception', () => {
    expect(classifyGPHR(response())).toBe('GHR');
    expect(classifyGPHR(response({ specialScores: ['DV1'] }))).toBe('GHR');
    expect(classifyGPHR(response({ specialScores: ['AG'] }))).not.toBe('GHR');
    expect(classifyGPHR(response({ specialScores: ['MOR'] }))).not.toBe('GHR');
  });

  it('applies Step 2 to poor or absent FQ', () => {
    expect(classifyGPHR(response({ fq: '-' }))).toBe('PHR');
    expect(classifyGPHR(response({ determinants: ['C'], fq: 'none' }))).toBe('PHR');
  });

  it.each(['ALOG', 'CONTAM', 'DV2', 'INCOM2', 'DR2', 'FABCOM2'])(
    'applies Step 2 to good-FQ %s',
    (score) => expect(classifyGPHR(response({ specialScores: [score] }))).toBe('PHR'),
  );

  it('applies Step 3 and keeps COP precedence ahead of later MOR/An rules', () => {
    expect(classifyGPHR(response({
      contents: ['(H)', 'An'],
      specialScores: ['COP', 'MOR'],
    }))).toBe('GHR');
    expect(classifyGPHR(response({ contents: ['(H)'], specialScores: ['COP', 'AG'] }))).not.toBe('GHR');
  });

  it.each([
    { contents: ['(H)'], specialScores: ['FABCOM1'] },
    { contents: ['(H)'], specialScores: ['MOR'] },
    { contents: ['(H)', 'An'], specialScores: [] },
  ])('applies Step 4 to remaining FABCOM1, MOR, or An representations', (overrides) => {
    expect(classifyGPHR(response(overrides))).toBe('PHR');
  });

  it.each(['III', 'IV', 'VII', 'IX'])(
    'applies Step 5 to a remaining Popular on Card %s',
    (card) => {
      expect(classifyGPHR(response({
        card,
        contents: ['(H)'],
        popular: true,
        specialScores: ['DR1'],
      }))).toBe('GHR');
    },
  );

  it.each([
    { contents: ['(H)'], specialScores: ['AG'] },
    { contents: ['(H)'], specialScores: ['INCOM1'] },
    { contents: ['(H)'], specialScores: ['DR1'] },
    { contents: ['Hd'], specialScores: [] },
  ])('applies Step 6 to remaining AG, INCOM1, DR1, or Hd representations', (overrides) => {
    expect(classifyGPHR(response(overrides))).toBe('PHR');
  });

  it('applies Step 7 to every remaining eligible representation', () => {
    expect(classifyGPHR(response({ contents: ['(H)'] }))).toBe('GHR');
    expect(classifyGPHR(response({ contents: ['(Hd)'] }))).toBe('GHR');
    expect(classifyGPHR(response({ contents: ['Hx'] }))).toBe('GHR');
  });

  it('requires human content, human movement, or animal movement with COP/AG', () => {
    expect(classifyGPHR(response({ contents: ['A'], determinants: ['F'] }))).toBe('');
    expect(classifyGPHR(response({ contents: ['A'], determinants: ['FM'] }))).toBe('');
    expect(classifyGPHR(response({ contents: ['A'], determinants: ['Ma'] }))).toBe('GHR');
    expect(classifyGPHR(response({ contents: ['A'], determinants: ['FM'], specialScores: ['COP'] }))).toBe('GHR');
    expect(classifyGPHR(response({ contents: ['A'], determinants: ['FM'], specialScores: ['AG'] }))).toBe('PHR');
  });
});
