import { describe, expect, it } from 'vitest';

import { calculateStructuralSummary } from '@/lib/calculator';
import { findScoringInputIssues, summarizeScoringInputIssues } from '@/lib/scoringInputValidation';
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

function completeProtocol(): RorschachResponse[] {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'I', 'II', 'III', 'IV']
    .map((card) => response({ card }));
}

describe('scored response completeness', () => {
  it.each([
    { field: 'location', value: '' },
    { field: 'location', value: '   ' },
    { field: 'dq', value: '' },
    { field: 'dq', value: '   ' },
    { field: 'determinants', value: [] },
    { field: 'determinants', value: [''] },
    { field: 'contents', value: [] },
    { field: 'contents', value: [''] },
  ] as const)('rejects a participating row with missing $field ($value)', ({ field, value }) => {
    const protocol = completeProtocol();
    protocol[5] = { ...protocol[5], [field]: value } as RorschachResponse;

    const result = calculateStructuralSummary(protocol);

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: `responses.5.${field}` }),
    ]));
  });

  it('does not manufacture a fourteenth response from an unanswered Card VI with only FQ none', () => {
    const actualResponses = ['I', 'I', 'II', 'II', 'III', 'III', 'IV', 'V', 'VII', 'VIII', 'IX', 'X', 'X']
      .map((card) => response({ card }));
    const unansweredCard = response({
      card: 'VI',
      location: '',
      dq: '',
      determinants: [],
      fq: 'none',
      contents: [],
    });

    const result = calculateStructuralSummary([...actualResponses, unansweredCard]);

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toEqual(expect.arrayContaining(
      ['location', 'dq', 'determinants', 'contents'].map((field) =>
        expect.objectContaining({ field: `responses.13.${field}` })),
    ));
  });

  it('rejects a cleared location instead of raising WDA by excluding the poor-form response', () => {
    const protocol = completeProtocol();
    protocol[1].fq = '-';
    const baseline = calculateStructuralSummary(protocol);
    expect(baseline.success).toBe(true);
    expect(baseline.data?.lower_section.WDA_percent).toBe('0.93');

    protocol[1].location = '';
    const incomplete = calculateStructuralSummary(protocol);

    expect(incomplete.success).toBe(false);
    expect(incomplete.data).toBeUndefined();
  });

  it('rejects a cleared determinant instead of treating it as a non-F response in Lambda', () => {
    const protocol = completeProtocol();
    protocol[0].determinants = ['Ma'];
    const baseline = calculateStructuralSummary(protocol);
    expect(baseline.success).toBe(true);
    expect(baseline.data?.lower_section.Lambda).toBe('13.00');

    protocol[2].determinants = [''];
    const incomplete = calculateStructuralSummary(protocol);

    expect(incomplete.success).toBe(false);
    expect(incomplete.data).toBeUndefined();
  });

  it('does not require a response memo or optional pair, Popular, Z, or special scores', () => {
    const result = calculateStructuralSummary(completeProtocol());

    expect(result.success).toBe(true);
    expect(result.data?.lower_section.R).toBe(14);
  });

  it('does not count an untouched blank row as a response', () => {
    const untouched = response({
      card: '',
      location: '',
      dq: '',
      determinants: [],
      fq: '',
      contents: [],
    });
    const result = calculateStructuralSummary([...completeProtocol(), untouched]);

    expect(result.success).toBe(true);
    expect(result.data?.lower_section.R).toBe(14);
    expect(result.data?.row_calculations).toHaveLength(14);
    expect(result.data?.lower_section.XA_percent).toBe('1.00');
  });
});

describe('FQ none represents an actual formless response', () => {
  it.each([
    { determinants: ['Ma', 'FD'], fq: 'none', accepted: false },
    { determinants: ['FMa'], fq: 'none', accepted: false },
    { determinants: ['mp'], fq: 'none', accepted: false },
    { determinants: ['C', 'Y'], fq: 'o', accepted: false },
    { determinants: ['C', 'Y'], fq: 'none', accepted: true },
    { determinants: ['C', "FC'"], fq: 'o', accepted: true },
    { determinants: ['Ma'], fq: 'o', accepted: true },
  ])('validates $determinants with FQ $fq (accepted=$accepted)', ({ determinants, fq, accepted }) => {
    expect(calculateStructuralSummary([response({ determinants, fq })]).success).toBe(accepted);
  });

  it.each(['C', "C'", 'T', 'V', 'Y', 'Cn'])(
    'accepts a fully coded %s response with FQ none',
    (determinant) => {
      const result = calculateStructuralSummary([response({
        determinants: [determinant],
        dq: 'v',
        fq: 'none',
        contents: ['Id'],
      })]);

      expect(result.success).toBe(true);
      expect(result.data?.lower_section.R).toBe(1);
      expect(result.data?.upper_section.formQuality.none.fqx).toBe(1);
    },
  );

  it.each([
    { determinants: ['Ma'] },
    { determinants: ['Mp'] },
    { determinants: ['Ma-p'] },
    { determinants: ['Mp', "C'"] },
  ])('preserves formless human movement $determinants', ({ determinants }) => {
    const result = calculateStructuralSummary([response({
      determinants,
      dq: 'v',
      fq: 'none',
      contents: ['Hx'],
      specialScores: ['AB'],
    })]);

    expect(result.success).toBe(true);
    expect(result.data?.lower_section.Mnone).toBe(1);
    expect(result.data?.upper_section.formQuality.none.fqx).toBe(1);
  });

  it('rejects FC with FQ none before it can add a false PHR to thirteen good human responses', () => {
    const protocol = completeProtocol();
    protocol[13] = response({ card: 'IV', determinants: ['FC'], fq: 'none' });

    const contradictory = calculateStructuralSummary(protocol);

    expect(contradictory.success).toBe(false);
    expect(contradictory.data).toBeUndefined();
    expect(contradictory.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'responses.13.fq' }),
    ]));

    protocol[13].fq = 'o';
    const reviewed = calculateStructuralSummary(protocol);

    expect(reviewed.success).toBe(true);
    expect(reviewed.data?.special_indices.GHR).toBe(14);
    expect(reviewed.data?.special_indices.PHR).toBe(0);
    expect(reviewed.data?.lower_section.XA_percent).toBe('1.00');
  });
});

describe('scoring warning locations', () => {
  it('identifies original row numbers and combines missing fields into one row warning', () => {
    const protocol = [
      response({ card: '', fq: '' }),
      response({ location: '', dq: '', determinants: [], contents: [], fq: 'none' }),
      response({ determinants: ['FC'], fq: 'none' }),
    ];
    const summary = summarizeScoringInputIssues(findScoringInputIssues(protocol));
    expect(summary.missingRequiredFieldsRows).toBe('2');
    expect(summary.incompatibleFormQualityRows).toBe('3');
    const result = calculateStructuralSummary(protocol);
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'responses.1.location' }),
      expect.objectContaining({ field: 'responses.2.fq' }),
    ]));
  });
});
