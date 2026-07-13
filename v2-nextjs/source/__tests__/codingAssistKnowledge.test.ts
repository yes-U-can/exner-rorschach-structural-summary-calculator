import { describe, expect, it } from 'vitest';

import { buildCodingAssistQuery } from '@/lib/codingAssistKnowledge';
import type { CodingAssistContext } from '@/types';

const emptyCodes: CodingAssistContext['existingCodes'] = {
  location: '',
  dq: '',
  determinants: [],
  fq: '',
  pair: '',
  contents: [],
  popular: false,
  z: '',
  specialScores: [],
};

function countOccurrences(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

describe('coding assist embedding query', () => {
  it('includes the focus once and only explicitly selected supporting rows', () => {
    const context: CodingAssistContext = {
      rowIndex: 0,
      focusRowIndex: 0,
      selectedRowIndices: [0, 2],
      card: 'I',
      responseMemo: 'FOCUS_MEMO person lifting an object',
      existingCodes: { ...emptyCodes, determinants: ['M'] },
      sheetRows: [
        {
          rowIndex: 0,
          card: 'I',
          responseMemo: 'FOCUS_MEMO person lifting an object',
          existingCodes: { ...emptyCodes, determinants: ['M'] },
        },
        {
          rowIndex: 1,
          card: 'II',
          responseMemo: 'UNSELECTED_MEMO must not enter retrieval',
          existingCodes: emptyCodes,
        },
        {
          rowIndex: 2,
          card: 'III',
          responseMemo: 'SELECTED_MEMO two people interacting',
          existingCodes: { ...emptyCodes, contents: ['H'] },
        },
      ],
    };

    const query = buildCodingAssistQuery(context);

    expect(countOccurrences(query, 'FOCUS_MEMO')).toBe(1);
    expect(query).toContain('SELECTED_MEMO');
    expect(query).not.toContain('UNSELECTED_MEMO');
    expect(query).toContain('M');
    expect(query).toContain('H');
  });

  it('caps each memo and the complete embedding query', () => {
    const context: CodingAssistContext = {
      rowIndex: 0,
      focusRowIndex: 0,
      selectedRowIndices: Array.from({ length: 20 }, (_, index) => index),
      card: 'I',
      responseMemo: `FOCUS ${'x'.repeat(4_000)}`,
      existingCodes: emptyCodes,
      sheetRows: Array.from({ length: 20 }, (_, index) => ({
        rowIndex: index,
        card: String(index + 1),
        responseMemo: `ROW_${index} ${'y'.repeat(1_200)}`,
        existingCodes: emptyCodes,
      })),
    };

    const query = buildCodingAssistQuery(context);

    expect(query.length).toBeLessThanOrEqual(3_000);
    expect(query).toContain('FOCUS');
    expect(query).not.toContain('ROW_19');
  });
});
