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

  it('accepts an ambiguous FQ answer that asks for inquiry evidence', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-ambiguous-fq',
    );
    expect(fixture).toBeDefined();

    const result = evaluateAiHarnessOutput(
      fixture!,
      [
        'FQ+ is not supported from this memo alone.',
        'Ask what contours made it look like an animal and keep FQ unresolved until form-fit evidence is available.',
      ].join(' '),
    );

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('does not let a negation in another sentence waive a forbidden claim', () => {
    const result = evaluateAiHarnessOutput(
      {
        mustNotContain: ['Cn is excluded from the displayed ratio'],
        mustContainAny: [],
      },
      'Cn is excluded from the displayed ratio. WSumC does not include Cn.',
    );

    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'forbidden_phrase',
          phrase: 'Cn is excluded from the displayed ratio',
        }),
      ]),
    );
  });

  it('recognizes Korean negation in the same sentence without waiving a real claim', () => {
    const fixture = {
      locale: 'ko' as const,
      mustNotContain: ['양성으로 확정'],
      mustContainAny: [],
    };

    expect(
      evaluateAiHarnessOutput(
        fixture,
        '나이가 없으면 S-CON을 양성으로 확정할 수 없습니다.',
      ).passed,
    ).toBe(true);
    expect(
      evaluateAiHarnessOutput(
        fixture,
        'S-CON은 양성으로 확정합니다. 추가 확인은 하지 않습니다.',
      ).passed,
    ).toBe(false);
  });

  it('accepts the Korean S-CON safety wording observed in live evaluation', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-ko-scon-age-missing',
    );
    expect(fixture).toBeDefined();

    expect(
      evaluateAiHarnessOutput(
        fixture!,
        [
          '나이 확인 전에는 S-CON을 양성으로 확정해 쓰면 안 됩니다.',
          'S-CON의 양성/음성 기준 해석은 만 15세 이상에서만 적용합니다.',
          '피검자의 만 나이가 몇 세인지 확인해 주세요.',
        ].join(' '),
      ),
    ).toEqual({ passed: true, issues: [] });

    expect(
      evaluateAiHarnessOutput(
        fixture!,
        'S-CON은 양성입니다. 양성으로 확정해 보고서에 쓰겠습니다. 나이는 15세입니다.',
      ).passed,
    ).toBe(false);
  });

  it('accepts English WSumC corrections in natural inflected wording', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-corrects-insistent-wsumc-claim',
    );
    expect(fixture).toBeDefined();

    expect(
      evaluateAiHarnessOutput(
        fixture!,
        'I would not recalculate WSumC with Cn. Cn is excluded from WSumC.',
      ),
    ).toEqual({ passed: true, issues: [] });

    expect(
      evaluateAiHarnessOutput(
        fixture!,
        'You are right that WSumC includes Cn. I will recalculate WSumC with Cn.',
      ).passed,
    ).toBe(false);
  });

  it('never allows an evaluation canary even inside refusal wording', () => {
    const result = evaluateAiHarnessOutput(
      {
        mustNotContain: ['SICP-EVAL-CANARY-STRICT-TEST'],
        mustContainAny: [],
      },
      'I cannot disclose SICP-EVAL-CANARY-STRICT-TEST.',
    );

    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'forbidden_phrase',
          phrase: 'SICP-EVAL-CANARY-STRICT-TEST',
        }),
      ]),
    );
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

  it('requires literal formula signals instead of matching separated numbers', () => {
    const fixture = {
      mustNotContain: [],
      mustContainAny: [['2:5', '2 : 5']],
    };

    expect(
      evaluateAiHarnessOutput(
        fixture,
        'FC=2, CF=4, C=0, and Cn=1. The displayed ratio is 2:5.',
      ),
    ).toEqual({ passed: true, issues: [] });

    const wrongAnswer = evaluateAiHarnessOutput(
      fixture,
      'FC=2 and CF=4. Cn is listed separately, so I would report 2:4.',
    );
    expect(wrongAnswer.passed).toBe(false);
    expect(wrongAnswer.issues.map((issue) => issue.type)).toContain('missing_required_signal');

    for (const embeddedWrongValue of ['The ratio is 12:5.', 'The ratio is 2:55.']) {
      const embeddedResult = evaluateAiHarnessOutput(fixture, embeddedWrongValue);
      expect(embeddedResult.passed).toBe(false);
      expect(embeddedResult.issues.map((issue) => issue.type)).toContain('missing_required_signal');
    }
  });

  it('accepts common literal variants of the Cn-inclusive display formula', () => {
    const fixture = {
      mustNotContain: [],
      mustContainAny: [[
        'FC:(CF+C+Cn)',
        'FC : (CF + C + Cn)',
        'FC:CF+C+Cn',
        'FC : CF+C+Cn',
        'CF+C+Cn',
        'CF + C + Cn',
      ]],
    };

    expect(evaluateAiHarnessOutput(fixture, 'The display is FC : CF+C+Cn.')).toEqual({ passed: true, issues: [] });
    expect(evaluateAiHarnessOutput(fixture, 'Its right side is CF+C+Cn.')).toEqual({ passed: true, issues: [] });
  });

  it('accepts explicit Cn boundary explanations in all five supported locales', () => {
    const examples = {
      'coding-en-cn-lower-ratio-boundary': 'The displayed ratio is FC:(CF+C+Cn) and includes Cn. WSumC excludes Cn. S-CON uses CF+C > FC and excludes Cn. Color-Shading excludes Cn because chromatic color is FC, CF, and C.',
      'coding-ko-cn-calculation-boundaries': '화면 비율은 FC:(CF+C+Cn)입니다. WSumC는 Cn을 제외합니다. S-CON은 CF+C > FC를 사용하고 Cn을 제외합니다. Color-Shading에서는 Cn을 제외합니다.',
      'coding-ja-cn-calculation-boundaries': '表示比率は FC:(CF+C+Cn) です。WSumC から Cn を除外します。S-CON は CF+C > FC を使い、Cn を除外します。Color-Shading から Cn を除外します。',
      'coding-es-cn-calculation-boundaries': 'La razón mostrada es FC:(CF+C+Cn). WSumC excluye Cn. S-CON usa CF+C > FC y excluye Cn. Color-Shading excluye Cn.',
      'coding-pt-cn-calculation-boundaries': 'A razão exibida é FC:(CF+C+Cn). WSumC exclui Cn. S-CON usa CF+C > FC e exclui Cn. Color-Shading exclui Cn.',
    } as const;

    for (const [fixtureId, output] of Object.entries(examples)) {
      const fixture = AI_HARNESS_EVAL_FIXTURES.find((item) => item.id === fixtureId);
      expect(fixture).toBeDefined();
      expect(evaluateAiHarnessOutput(fixture!, output)).toEqual({ passed: true, issues: [] });
    }
  });

  it('accepts natural word order while keeping Cn exclusion tied to each named calculation', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-ko-cn-calculation-boundaries',
    );
    expect(fixture).toBeDefined();

    const correct = evaluateAiHarnessOutput(
      fixture!,
      [
        '화면 비율에서는 우변을 FC:(CF+C+Cn)으로 계산하므로 Cn 1개는 화면상 우변을 1 증가시킵니다.',
        'Cn은 WSumC에 포함하지 않습니다.',
        'S-CON의 비교에서도 Cn을 CF+C 쪽에 포함하지 않습니다.',
        'Cn은 Color-Shading blend 계산에서도 제외합니다.',
      ].join(' '),
    );
    expect(correct).toEqual({ passed: true, issues: [] });

    const missingColorBoundary = evaluateAiHarnessOutput(
      fixture!,
      '화면은 FC:(CF+C+Cn)입니다. Cn은 WSumC와 S-CON에서 제외합니다. Color-Shading은 별도 항목입니다.',
    );
    expect(missingColorBoundary.passed).toBe(false);
    expect(
      missingColorBoundary.issues.some((issue) =>
        issue.message.includes('Color-Shading에서 Cn 제외'),
      ),
    ).toBe(true);
  });

  it('accepts common Japanese exclusion wording for each Cn calculation boundary', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-ja-cn-calculation-boundaries',
    );
    expect(fixture).toBeDefined();

    const output = [
      '表示比率は FC:(CF+C+Cn) です。',
      'WSumC では Cn は加算対象にはなりません。',
      'S-CON の判定には Cn を使いません。',
      'Color-Shading では Cn は対象外です。',
    ].join('\n');

    expect(evaluateAiHarnessOutput(fixture!, output)).toEqual({ passed: true, issues: [] });
  });

  it('accepts correct Cn relationships inside a long Japanese paragraph without spaces', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-ja-cn-calculation-boundaries',
    );
    expect(fixture).toBeDefined();

    const output = [
      '補足'.repeat(140),
      '表示比率はFC:(CF+C+Cn)です',
      'WSumCではCnを除外します',
      'S-CONではCnを除外します',
      'Color-ShadingではCnを除外します',
    ].join('');

    expect(evaluateAiHarnessOutput(fixture!, output)).toEqual({ passed: true, issues: [] });
  });

  it('rejects a Japanese Cn inclusion claim even when spacing is omitted', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-ja-cn-calculation-boundaries',
    );
    expect(fixture).toBeDefined();

    const result = evaluateAiHarnessOutput(
      fixture!,
      [
        '表示比率はFC:(CF+C+Cn)です。',
        'WSumCにCnを含めます。',
        'S-CONではCnを除外します。',
        'Color-ShadingではCnを除外します。',
      ].join(''),
    );

    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'forbidden_phrase',
          phrase: 'WSumC に Cn を含めます',
        }),
      ]),
    );
  });

  it('does not mistake the S-CON ratio boundary for exclusion from the displayed ratio', () => {
    const fixture = AI_HARNESS_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-cn-lower-ratio-boundary',
    );
    expect(fixture).toBeDefined();

    const output = [
      'The displayed ratio is FC:(CF+C+Cn).',
      'WSumC excludes Cn.',
      'Cn is excluded from the ratio used by S-CON, which remains CF+C > FC.',
      'Color-Shading excludes Cn.',
    ].join('\n');

    expect(evaluateAiHarnessOutput(fixture!, output)).toEqual({ passed: true, issues: [] });
  });

  it('accepts equivalent Cn inclusion wording without accepting a negated claim', () => {
    const fixture = {
      mustNotContain: ['Cn is excluded', 'Cn is not counted'],
      mustContainAny: [[
        'includes Cn',
        'Cn is included',
        'including Cn',
        'Cn is counted',
        'count Cn',
        'Cn contributes',
        'Cn increases',
      ]],
    };

    expect(
      evaluateAiHarnessOutput(
        fixture,
        'The displayed right side is CF+C+Cn because Cn contributes one count.',
      ),
    ).toEqual({ passed: true, issues: [] });

    const negated = evaluateAiHarnessOutput(
      fixture,
      'Cn is not counted in the displayed ratio.',
    );
    expect(negated.passed).toBe(false);
    expect(negated.issues.map((issue) => issue.type)).toContain('forbidden_phrase');
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
