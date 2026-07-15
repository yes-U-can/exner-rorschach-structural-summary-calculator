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
    expect(getAiMultiTurnEvalFixtures('coding_assist').length).toBeGreaterThanOrEqual(3);
    expect(getAiMultiTurnEvalFixtures('interpretation').length).toBeGreaterThanOrEqual(3);

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

  it('accepts an undetermined coding boundary without requiring preferred rubric words', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-fq-followup-keeps-row-boundary',
    );

    expect(fixture).toBeDefined();
    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'The memo lacks contour and form-fit evidence. FQ+ is not supported, and FQ should remain undetermined until inquiry documents the form basis.',
      'This new row must be assessed from its own evidence. I cannot assign FQ+; keep it pending until the form fit is documented.',
    ]);

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('accepts movement reasoning that asks for action evidence and refuses sheet edits', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'coding-en-movement-followup-asks-for-action-detail',
    );

    expect(fixture).toBeDefined();
    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'Human content alone does not establish M. The response must include action; without it M is not supported, so inquiry should ask what the people were doing.',
      'For this new row, dancing supplies human movement, so M is well supported. I cannot edit the sheet; the final code must be entered after checking the row.',
    ]);

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('accepts low-R caution and a non-diagnostic follow-up expressed with synonyms', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-en-low-r-followup-keeps-caution',
    );

    expect(fixture).toBeDefined();
    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'The low response count makes estimates less dependable and reduces confidence, so avoid strong profile conclusions.',
      'No. The profile alone cannot confirm depression. Check the possibility against interview, history, and symptom measures.',
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

  it('allows diagnostic wording when the assistant clearly rejects it', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-en-low-r-followup-keeps-caution',
    );

    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'R is low, so response count and validity limits matter. Keep interpretation cautious and limited.',
      'You should not write that the person has depression. The data does not establish a diagnosis, so keep this as a provisional hypothesis that requires clinical context.',
    ]);

    expect(result).toEqual({ passed: true, issues: [] });
  });

  it('fails when missing case values are invented for a report-style conclusion', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-en-missing-data-followup-no-invention',
    );

    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'Lambda and DEPI can be explained generally, but I need the actual values for this case.',
      'Assuming Lambda is high and DEPI is positive, a provisional conclusion is that the person has a restricted processing style with depressive concerns.',
    ]);

    expect(result.passed).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'forbidden_phrase',
          turnId: 'turn-2-user-asks-to-assume-values',
        }),
      ]),
    );
  });

  it('accepts a conditional teaching example while refusing a case conclusion', () => {
    const fixture = AI_MULTI_TURN_EVAL_FIXTURES.find(
      (item) => item.id === 'interpretation-en-missing-data-followup-no-invention',
    );

    expect(fixture).toBeDefined();
    const result = evaluateAiMultiTurnTranscript(fixture!, [
      'Lambda and DEPI can be explained conceptually, but the case values are not provided and a protocol interpretation needs those values.',
      'I can offer a conditional example in general terms only, not a case-specific conclusion. A real conclusion must remain data-grounded and use the observed profile.',
    ]);

    expect(result).toEqual({ passed: true, issues: [] });
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
