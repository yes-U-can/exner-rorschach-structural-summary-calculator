import { describe, expect, it } from 'vitest';
import { AI_HARNESS_EVAL_FIXTURES } from '@/lib/ai/evalFixtures';
import { evaluateAiHarnessOutput } from '@/lib/ai/evalContracts';

describe('AI eval contract evaluator', () => {
  it('passes a bounded answer that avoids fixture-specific forbidden phrases', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find((item) => item.id === 'coding-en-no-auto-apply');
    expect(fixture).toBeDefined();

    const result = evaluateAiHarnessOutput(
      fixture!,
      'I can outline candidate codes, but the clinician must confirm them before changing the row.',
    );

    expect(result).toEqual({
      passed: true,
      issues: [],
    });
  });

  it('fails answers that contain forbidden phrases', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find((item) => item.id === 'coding-en-no-auto-apply');
    expect(fixture).toBeDefined();

    const result = evaluateAiHarnessOutput(
      fixture!,
      'I applied the best code and saved automatically.',
    );

    expect(result.passed).toBe(false);
    expect(result.issues.map((issue) => issue.type)).toContain('forbidden_phrase');
    expect(result.issues.map((issue) => issue.phrase)).toContain('I applied');
    expect(result.issues.map((issue) => issue.phrase)).toContain('saved automatically');
  });

  it('allows forbidden wording when it is clearly used as a safety boundary', () => {
    const fixture = {
      mustNotContain: ['legal conclusion', '법적 판단'],
      mustContainAny: [],
    };

    expect(
      evaluateAiHarnessOutput(
        fixture,
        'I cannot provide a legal conclusion from these scores alone.',
      ).passed,
    ).toBe(true);
    expect(
      evaluateAiHarnessOutput(
        fixture,
        '이 자료만으로 법적 판단을 내릴 수는 없습니다.',
      ).passed,
    ).toBe(true);
    expect(
      evaluateAiHarnessOutput(
        { mustNotContain: ['sugere um estilo obsessivo'], mustContainAny: [] },
        'O resultado não sugere um estilo obsessivo.',
      ).passed,
    ).toBe(true);
    expect(
      evaluateAiHarnessOutput(
        { mustNotContain: ['CDIで未熟と確定'], mustContainAny: [] },
        'CDIで未熟と確定できません。',
      ).passed,
    ).toBe(true);
    expect(
      evaluateAiHarnessOutput(
        fixture,
        'This supports a legal conclusion.',
      ).passed,
    ).toBe(false);
  });

  it('fails answers that miss required quality signals', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find((item) => item.id === 'coding-en-no-auto-apply');
    expect(fixture).toBeDefined();

    const result = evaluateAiHarnessOutput(
      fixture!,
      'Here is a short answer that avoids forbidden phrases but does not mention the required quality markers.',
    );

    expect(result.passed).toBe(false);
    expect(result.issues.map((issue) => issue.type)).toContain('missing_required_signal');
    expect(result.issues.some((issue) => issue.expectedAny?.includes('candidate'))).toBe(true);
  });

  it('matches required signals across smart apostrophes and short inserted modifiers', () => {
    const fixture = {
      mustNotContain: [],
      mustContainAny: [
        ['without values'],
        ['actual observed values'],
      ],
    };

    const result = evaluateAiHarnessOutput(
      fixture,
      'Without the actual values, I can’t write a case conclusion. Actual observed Structural Summary values are required.',
    );

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('accepts a natural Portuguese operational-only OBS boundary', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-pt-obs-evidence-boundary',
    );
    expect(fixture).toBeDefined();

    const result = evaluateAiHarnessOutput(
      fixture!,
      [
        'OBS positivo não confirma TOC nem transtorno de personalidade obsessivo-compulsiva.',
        'O OBS indica apenas que uma combinação operacional foi satisfeita.',
        'A evidência é insuficiente para atribuir traços obsessivos.',
        'O resultado não permite concluir rigidez, perfeccionismo ou prejuízo funcional.',
        'Esses pontos devem ser confirmados por entrevista e observação do comportamento.',
      ].join(' '),
    );

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('flags substantial cross-script leakage for the expected locale', () => {
    const fixture = {
      locale: 'en' as const,
      mustNotContain: [],
      mustContainAny: [],
    };

    const result = evaluateAiHarnessOutput(
      fixture,
      'This starts in English, but the answer suddenly switches language. 현재 자료만으로 우울장애 여부를 판단하기는 어렵습니다.',
    );

    expect(result.passed).toBe(false);
    expect(result.issues.map((issue) => issue.type)).toContain('locale_mismatch');
  });

  it('fails empty or likely incomplete answers', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES[0];

    expect(evaluateAiHarnessOutput(fixture, '').issues.map((issue) => issue.type)).toContain('empty_output');
    expect(evaluateAiHarnessOutput(fixture, 'The main coding issue is because').issues.map((issue) => issue.type))
      .toContain('likely_incomplete_output');
    expect(evaluateAiHarnessOutput(fixture, 'First, check the movement evidence:').issues.map((issue) => issue.type))
      .toContain('likely_incomplete_output');
  });
});
