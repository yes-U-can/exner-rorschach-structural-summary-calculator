import { describe, expect, it } from 'vitest';

import {
  V2210_DOMAIN_BOUNDARY_EVAL_FIXTURES,
  V2210_DOMAIN_BOUNDARY_MULTITURN_FIXTURES,
} from '@/lib/ai/evalDomainBoundaryFixtures';
import { evaluateAiHarnessOutput } from '@/lib/ai/evalContracts';

const LOCALES = ['ko', 'en', 'ja', 'es', 'pt'] as const;
const WORKFLOWS = ['coding_assist', 'interpretation'] as const;
const SINGLE_SCENARIOS = [
  'normal-coding',
  'normal-summary',
  'rpas-only',
  'mixed-system',
  'historical-system',
  'cross-test',
  'diagnosis-treatment-legal',
  'unrelated',
  'secret-extraction',
  'case-disguised-injection',
  'normal-followup',
] as const;

describe('v2.2.10 AI domain-boundary coverage', () => {
  it('covers every single-turn scenario in both workflows and all five locales', () => {
    expect(V2210_DOMAIN_BOUNDARY_EVAL_FIXTURES).toHaveLength(
      LOCALES.length * WORKFLOWS.length * SINGLE_SCENARIOS.length,
    );

    const ids = new Set(V2210_DOMAIN_BOUNDARY_EVAL_FIXTURES.map((fixture) => fixture.id));
    for (const workflow of WORKFLOWS) {
      const prefix = workflow === 'coding_assist' ? 'coding' : 'interpretation';
      for (const locale of LOCALES) {
        for (const scenario of SINGLE_SCENARIOS) {
          expect(ids.has(`${prefix}-${locale}-v2210-${scenario}`)).toBe(true);
        }
      }
    }
  });

  it('covers multi-turn domain drift in both workflows and all five locales', () => {
    expect(V2210_DOMAIN_BOUNDARY_MULTITURN_FIXTURES).toHaveLength(
      LOCALES.length * WORKFLOWS.length,
    );

    for (const fixture of V2210_DOMAIN_BOUNDARY_MULTITURN_FIXTURES) {
      expect(fixture.turns).toHaveLength(2);
      expect(fixture.turns[0].expectedTags).toContain('reference-grounded');
      expect(fixture.turns[1].expectedTags).toContain('out-of-scope-refusal');
      expect(fixture.turns[1].expectedTags).not.toContain('reference-grounded');
    }
  });

  it('accepts natural Korean refusal wording for an unrelated request', () => {
    const fixture = V2210_DOMAIN_BOUNDARY_EVAL_FIXTURES.find(
      ({ id }) => id === 'interpretation-ko-v2210-unrelated',
    );

    expect(fixture).toBeDefined();
    expect(
      evaluateAiHarnessOutput(
        fixture!,
        '엑스너 종합체계 전용 도우미라 요리법과 여행 일정 작성은 도와드리기 어렵습니다.',
      ).passed,
    ).toBe(true);
  });
});
