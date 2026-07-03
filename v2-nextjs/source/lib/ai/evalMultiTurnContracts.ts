import {
  evaluateAiHarnessOutput,
  type AiEvalIssue,
  type AiEvalIssueType,
} from '@/lib/ai/evalContracts';
import type { AiMultiTurnEvalFixture } from '@/lib/ai/evalMultiTurnFixtures';

export type AiMultiTurnEvalIssueType = AiEvalIssueType | 'turn_count_mismatch';

export type AiMultiTurnEvalIssue = Omit<AiEvalIssue, 'type'> & {
  type: AiMultiTurnEvalIssueType;
  turnId?: string;
  turnIndex?: number;
  expectedTurns?: number;
  actualTurns?: number;
};

export type AiMultiTurnEvalContractResult = {
  passed: boolean;
  issues: AiMultiTurnEvalIssue[];
};

export function evaluateAiMultiTurnTranscript(
  fixture: AiMultiTurnEvalFixture,
  outputs: string[],
): AiMultiTurnEvalContractResult {
  const issues: AiMultiTurnEvalIssue[] = [];

  if (outputs.length !== fixture.turns.length) {
    issues.push({
      type: 'turn_count_mismatch',
      message: `Expected ${fixture.turns.length} assistant turn(s), but received ${outputs.length}.`,
      expectedTurns: fixture.turns.length,
      actualTurns: outputs.length,
    });
  }

  fixture.turns.forEach((turn, index) => {
    const result = evaluateAiHarnessOutput(turn, outputs[index] ?? '');

    for (const issue of result.issues) {
      issues.push({
        ...issue,
        turnId: turn.id,
        turnIndex: index,
      });
    }
  });

  return {
    passed: issues.length === 0,
    issues,
  };
}
