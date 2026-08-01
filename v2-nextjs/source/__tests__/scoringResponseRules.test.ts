import { describe, expect, it } from 'vitest';

import { applyScoringResponseRules } from '@/lib/scoringResponseRules';
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
    contents: ['A'],
    popular: false,
    z: '',
    specialScores: [],
    ...overrides,
  };
}

describe('shared scoring response rules', () => {
  it('applies the same reflection and vague-DQ constraints to every input path', () => {
    const normalized = applyScoringResponseRules(response({
      dq: 'v',
      determinants: ['Fr'],
      fq: '+',
      pair: '(2)',
      z: 'ZW',
    }));

    expect(normalized.response).toMatchObject({
      fq: '',
      pair: 'none',
      z: '',
    });
    expect(normalized.appliedRules).toEqual([
      'reflection_pair',
      'dq_vague_fq',
      'dq_vague_z',
    ]);
  });

  it('keeps the newly selected level and removes the conflicting prior level', () => {
    const level2Selected = applyScoringResponseRules(
      response({ specialScores: ['DV1', 'DV2'] }),
      response({ specialScores: ['DV1'] }),
    );
    const level1Selected = applyScoringResponseRules(
      response({ specialScores: ['DV2', 'DV1'] }),
      response({ specialScores: ['DV2'] }),
    );

    expect(level2Selected.response.specialScores).toEqual(['DV2']);
    expect(level1Selected.response.specialScores).toEqual(['DV1']);
    expect(level2Selected.response.specialScores).not.toContain('');
    expect(level1Selected.response.specialScores).not.toContain('');
  });

  it('resolves an already-conflicting level pair without leaving empty slots', () => {
    const normalized = applyScoringResponseRules(
      response({ specialScores: ['', 'DV1', 'DV2'] }),
    );

    expect(normalized.response.specialScores).toEqual(['DV1']);
    expect(normalized.appliedRules).toContain('special_score_level');
  });

  it('preserves the legacy desktop result when both levels were already stored', () => {
    const normalized = applyScoringResponseRules(
      response({ response: 'edited memo', specialScores: ['DV1', 'DV2'] }),
      response({ specialScores: ['DV1', 'DV2'] }),
    );

    expect(normalized.response.specialScores).toEqual(['DV1']);
    expect(normalized.appliedRules).toContain('special_score_level');
  });

  it.each(['C', "C'", 'T', 'V', 'Y', 'Cn'])(
    'sets FQ to none for the pure formless determinant %s',
    (determinant) => {
      const normalized = applyScoringResponseRules(response({
        determinants: [determinant],
        fq: 'o',
      }));

      expect(normalized.response.fq).toBe('none');
      expect(normalized.appliedRules).toContain('formless_fq');
    },
  );
});
