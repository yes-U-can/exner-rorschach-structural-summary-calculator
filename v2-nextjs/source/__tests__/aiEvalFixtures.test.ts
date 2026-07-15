import { describe, expect, it } from 'vitest';
import {
  AI_HARNESS_EVAL_FIXTURES,
  getAiHarnessEvalFixtures,
  type AiEvalExpectationTag,
} from '@/lib/ai/evalFixtures';

const REQUIRED_SHARED_TAGS: AiEvalExpectationTag[] = [
  'answer-current-question',
  'complete-first-pass',
];
const LIKELY_MOJIBAKE_PATTERN = /[�諛援吏寃洹移묐뺤젙臾竊쨌]/u;

describe('AI harness eval fixtures', () => {
  it('covers both assistant workflows with privacy-safe artificial prompts', () => {
    const codingFixtures = getAiHarnessEvalFixtures('coding_assist');
    const interpretationFixtures = getAiHarnessEvalFixtures('interpretation');

    expect(codingFixtures.length).toBeGreaterThanOrEqual(6);
    expect(interpretationFixtures.length).toBeGreaterThanOrEqual(6);

    for (const fixture of AI_HARNESS_EVAL_FIXTURES) {
      expect(fixture.id).toMatch(/^(coding|interpretation)-/);
      expect(fixture.userMessage.length).toBeGreaterThan(8);
      expect(fixture.userMessage).not.toMatch(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/);
      expect(fixture.mustNotContain.length).toBeGreaterThan(0);
      expect(fixture.mustContainAny?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it('keeps HITL and safety expectations explicit', () => {
    const codingTags = new Set(
      getAiHarnessEvalFixtures('coding_assist').flatMap((fixture) => fixture.expectedTags),
    );
    const interpretationTags = new Set(
      getAiHarnessEvalFixtures('interpretation').flatMap((fixture) => fixture.expectedTags),
    );

    expect(codingTags.has('candidate-not-final')).toBe(true);
    expect(codingTags.has('clinician-confirmation')).toBe(true);
    expect(codingTags.has('no-auto-apply')).toBe(true);
    expect(interpretationTags.has('no-diagnosis')).toBe(true);
    expect(interpretationTags.has('no-treatment-advice')).toBe(true);
    expect(interpretationTags.has('provisional-language')).toBe(true);
    expect(codingTags.has('exner-only-boundary')).toBe(true);
    expect(codingTags.has('no-internal-disclosure')).toBe(true);
    expect(interpretationTags.has('exner-only-boundary')).toBe(true);
    expect(interpretationTags.has('no-internal-disclosure')).toBe(true);
    expect(interpretationTags.has('out-of-scope-refusal')).toBe(true);
  });

  it('requires every fixture to expect a complete first-pass answer', () => {
    for (const fixture of AI_HARNESS_EVAL_FIXTURES) {
      const tags = new Set(fixture.expectedTags);
      for (const requiredTag of REQUIRED_SHARED_TAGS) {
        expect(tags.has(requiredTag), `${fixture.id} should include ${requiredTag}`).toBe(true);
      }
    }
  });

  it('keeps localized fixture text readable instead of mojibake', () => {
    for (const fixture of AI_HARNESS_EVAL_FIXTURES) {
      const localizedText = [
        fixture.userMessage,
        ...fixture.mustNotContain,
      ].join('\n');

      expect(localizedText, `${fixture.id} should not contain mojibake`).not.toMatch(
        LIKELY_MOJIBAKE_PATTERN,
      );
    }
  });
});
