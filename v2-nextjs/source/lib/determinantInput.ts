import { DETERMINANT_INPUT_CODES } from '@/lib/options';
import type { RorschachResponse } from '@/types';

const determinantInputCodeSet = new Set<string>(DETERMINANT_INPUT_CODES);

export interface InvalidDeterminantInput {
  responseIndex: number;
  code: string;
}

export function findInvalidDeterminantInputs(
  responses: readonly RorschachResponse[],
): InvalidDeterminantInput[] {
  return responses.flatMap((response, responseIndex) =>
    response.determinants
      .filter((code) => code.trim().length > 0 && !determinantInputCodeSet.has(code))
      .map((code) => ({ responseIndex, code })),
  );
}

export function summarizeInvalidDeterminantInputs(
  issues: readonly InvalidDeterminantInput[],
): { rows: string; codes: string } {
  const rows = [...new Set(issues.map((issue) => issue.responseIndex + 1))].join(', ');
  const codes = [...new Set(issues.map((issue) => issue.code))].join(', ');
  return { rows, codes };
}
