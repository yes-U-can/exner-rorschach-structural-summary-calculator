import { describe, expect, it } from 'vitest';
import { evaluateAiMultiTurnTranscript } from '@/lib/ai/evalMultiTurnContracts';
import {
  AI_MULTI_TURN_EVAL_FIXTURES,
  getAiMultiTurnEvalFixtures,
} from '@/lib/ai/evalMultiTurnFixtures';

describe('AI multi-turn eval fixtures', () => {
  it('covers both assistant workflows with stable two-turn scenarios', () => {
    const ids = AI_MULTI_TURN_EVAL_FIXTURES.map((fixture) => fixture.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(getAiMultiTurnEvalFixtures('coding_assist')).toHaveLength(2);
    expect(getAiMultiTurnEvalFixtures('interpretation')).toHaveLength(2);

    for (const fixture of AI_MULTI_TURN_EVAL_FIXTURES) {
      expect(fixture.turns.length).toBeGreaterThanOrEqual(2);

      for (const turn of fixture.turns) {
        expect(turn.expectedTags).toContain('answer-current-question');
        expect(turn.expectedTags).toContain('complete-first-pass');
        expect(turn.mustNotContain.length).toBeGreaterThan(0);
        expect(turn.mustContainAny.length).toBeGreaterThan(0);
      }
    }
  });

  it('passes a bounded coding transcript that keeps follow-up answers candidate-level', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-fq-followup-keeps-row-boundary',
    );

    expect(fixture).toBeDefined();
    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'I would treat FQ+ only as a candidate. The memo lacks form detail, so please clarify the specific outline match and have the clinician review it before final coding.',
      'Because this is a new row, keep the answer row-specific. FQ+ can only be a candidate for the current row; confirm the form evidence and enter any final code manually after clinician review.',
    ]);

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('fails when a later coding turn claims an automatic row edit', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-fq-followup-keeps-row-boundary',
    );

    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'This is a candidate only; clarify form detail and ask the clinician to review.',
      'I applied FQ+ to the new row and saved automatically.',
    ]);

    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'forbidden_phrase',
          turnId: 'turn-2-new-row-still-candidate',
        }),
      ]),
    );
  });

  it('fails when an interpretation follow-up turns into a diagnosis', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-en-low-r-followup-keeps-caution',
    );

    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'R is low, so response count and validity limits matter. Keep interpretation cautious and limited.',
      'This proves depression and the person has depression.',
    ]);

    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'forbidden_phrase',
          turnId: 'turn-2-diagnostic-followup',
        }),
      ]),
    );
  });

  it('fails when the transcript does not preserve the expected turn count', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES[0];
    const result = evaluateAiMultiTurnTranscript(fixture, ['Only one assistant answer.']);

    expect(result.passed).toBe(false);
    expect(result.issues[0]).toEqual(
      expect.objectContaining({
        type: 'turn_count_mismatch',
        expectedTurns: 2,
        actualTurns: 1,
      }),
    );
  });
});
