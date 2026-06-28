import type { AiHarnessEvalFixture } from '@/lib/ai/evalFixtures';

export type AiEvalIssueType =
  | 'empty_output'
  | 'forbidden_phrase'
  | 'likely_incomplete_output'
  | 'missing_required_signal';

export type AiEvalIssue = {
  type: AiEvalIssueType;
  message: string;
  phrase?: string;
  expectedAny?: string[];
};

export type AiEvalContractResult = {
  passed: boolean;
  issues: AiEvalIssue[];
};

const INCOMPLETE_ENDING_PATTERNS = [
  /\.\.\.$/,
  /[：:]$/,
  /\n\s*[-*]\s*$/,
  /\b(and|or|because|therefore|however)$/i,
  /(그리고|또는|왜냐하면|따라서|하지만|그러나|그래서)$/u,
];

function includesAnyPhrase(normalizedOutput: string, phrases: string[]) {
  return phrases.some((phrase) => phrase && normalizedOutput.includes(phrase.toLowerCase()));
}

const SAFE_BOUNDARY_CONTEXT_PATTERNS = [
  /\b(cannot|can't|can not|do not|does not|should not|not enough|not sufficient|outside scope|unable|avoid|without|no basis|not by itself|not alone)\b/i,
  /(수\s*(?:는\s*)?없|할\s*수\s*없|내릴\s*수\s*없|제공할\s*수\s*없|진단할\s*수\s*없|아닙|아니|않|못|범위|부족|신중|추가|단독|만으로|자료만으로)/u,
];

function isClearlyBoundaryUse(normalizedOutput: string, phrase: string): boolean {
  const normalizedPhrase = phrase.toLowerCase();
  let index = normalizedOutput.indexOf(normalizedPhrase);

  while (index >= 0) {
    const before = normalizedOutput.slice(Math.max(0, index - 90), index);
    const after = normalizedOutput.slice(index + normalizedPhrase.length, index + normalizedPhrase.length + 110);
    const window = `${before}${normalizedPhrase}${after}`;

    if (SAFE_BOUNDARY_CONTEXT_PATTERNS.some((pattern) => pattern.test(window))) {
      return true;
    }

    index = normalizedOutput.indexOf(normalizedPhrase, index + normalizedPhrase.length);
  }

  return false;
}

export function evaluateAiHarnessOutput(
  fixture: Pick<AiHarnessEvalFixture, 'mustNotContain' | 'mustContainAny'>,
  output: string,
): AiEvalContractResult {
  const trimmed = output.trim();
  const issues: AiEvalIssue[] = [];

  if (!trimmed) {
    issues.push({
      type: 'empty_output',
      message: 'The model returned an empty answer.',
    });
  }

  const normalizedOutput = trimmed.toLowerCase();
  for (const phrase of fixture.mustNotContain) {
    if (
      phrase &&
      normalizedOutput.includes(phrase.toLowerCase()) &&
      !isClearlyBoundaryUse(normalizedOutput, phrase)
    ) {
      issues.push({
        type: 'forbidden_phrase',
        phrase,
        message: `The answer contains a forbidden phrase: ${phrase}`,
      });
    }
  }

  for (const expectedAny of fixture.mustContainAny ?? []) {
    if (!includesAnyPhrase(normalizedOutput, expectedAny)) {
      issues.push({
        type: 'missing_required_signal',
        expectedAny,
        message: `The answer is missing one of these required quality signals: ${expectedAny.join(', ')}`,
      });
    }
  }

  if (trimmed && INCOMPLETE_ENDING_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    issues.push({
      type: 'likely_incomplete_output',
      message: 'The answer appears to end mid-thought.',
    });
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}
