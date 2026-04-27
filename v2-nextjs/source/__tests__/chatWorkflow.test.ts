import { describe, expect, it } from 'vitest';
import {
  buildChatRetrievalQuery,
  buildCodingAssistContext,
  normalizeChatWorkflowMode,
  normalizeCodingAssistContext,
  normalizeWorkflowLocale,
  parseChatWorkflowMode,
  summarizeWorkflowContext,
} from '@/lib/chatWorkflow';
import type { RorschachResponse } from '@/types';

function createResponse(): RorschachResponse {
  return {
    card: 'I',
    response: 'Looks like a bat.',
    location: 'W',
    dq: '+',
    determinants: ['F'],
    fq: 'o',
    pair: 'none',
    contents: ['A'],
    popular: false,
    z: 'ZA',
    specialScores: [],
  };
}

describe('chat workflow helpers', () => {
  it('parses and normalizes workflow modes safely', () => {
    expect(parseChatWorkflowMode('coding_assist')).toBe('coding_assist');
    expect(parseChatWorkflowMode('unknown')).toBeNull();
    expect(normalizeChatWorkflowMode('coding_assist')).toBe('coding_assist');
    expect(normalizeChatWorkflowMode('bad')).toBe('interpretation');
  });

  it('normalizes workflow locale with fallback', () => {
    expect(normalizeWorkflowLocale('ko')).toBe('ko');
    expect(normalizeWorkflowLocale('bad-locale')).toBe('ko');
  });

  it('builds and normalizes coding assist context', () => {
    const response = createResponse();
    const built = buildCodingAssistContext({
      focusRowIndex: 3,
      responses: [{ ...createResponse(), response: '' }, { ...createResponse(), response: '' }, { ...createResponse(), response: '' }, response],
      selectedRowIndices: [3],
    });
    const normalized = normalizeCodingAssistContext(built);

    expect(normalized).toEqual({
      rowIndex: 3,
      focusRowIndex: 3,
      selectedRowIndices: [3],
      sheetRows: [
        {
          rowIndex: 3,
          card: 'I',
          responseMemo: 'Looks like a bat.',
          existingCodes: {
            location: 'W',
            dq: '+',
            determinants: ['F'],
            fq: 'o',
            pair: 'none',
            contents: ['A'],
            popular: false,
            z: 'ZA',
            specialScores: [],
          },
        },
      ],
      card: 'I',
      responseMemo: 'Looks like a bat.',
      existingCodes: {
        location: 'W',
        dq: '+',
        determinants: ['F'],
        fq: 'o',
        pair: 'none',
        contents: ['A'],
        popular: false,
        z: 'ZA',
        specialScores: [],
      },
    });
  });

  it('rejects invalid coding assist context payloads', () => {
    expect(normalizeCodingAssistContext(null)).toBeNull();
    expect(normalizeCodingAssistContext({ card: '', responseMemo: 'x' })).toBeNull();
    expect(normalizeCodingAssistContext({ card: 'I', responseMemo: '' })).toBeNull();
  });

  it('summarizes coding assist context without keeping the full memo text', () => {
    const summary = summarizeWorkflowContext('coding_assist', {
      rowIndex: 1,
      card: 'II',
      responseMemo: 'The examinee hesitated and then said it looked like two animals.',
      existingCodes: {
        location: 'D',
        dq: 'o',
        determinants: ['FC'],
        fq: '+',
        pair: '(2)',
        contents: ['A'],
        popular: false,
        z: 'ZD',
        specialScores: ['DV1'],
      },
    });

    expect(summary).toMatchObject({
      rowIndex: 1,
      card: 'II',
      responseMemoLength: 64,
      existingCodes: {
        location: 'D',
        dq: 'o',
        determinants: ['FC'],
      },
    });
    expect(summary).not.toHaveProperty('responseMemo');
  });

  it('builds a retrieval query from recent unique user turns', () => {
    const query = buildChatRetrievalQuery({
      mode: 'interpretation',
      messages: [
        { role: 'user', content: 'What is the difference between DQ and Form Quality?' },
        { role: 'ai', content: 'Which part do you want to focus on?' },
        { role: 'user', content: 'Please explain DQ+ and DQv again.' },
        { role: 'user', content: 'Please explain DQ+ and DQv again.' },
        { role: 'user', content: 'How should I separate DQ+ from DQo in practice?' },
      ],
    });

    expect(query).toBe(
      [
        'What is the difference between DQ and Form Quality?',
        'Please explain DQ+ and DQv again.',
        'How should I separate DQ+ from DQo in practice?',
      ].join('\n'),
    );
  });

  it('falls back to the latest user turn for coding assist retrieval', () => {
    const query = buildChatRetrievalQuery({
      mode: 'coding_assist',
      messages: [
        { role: 'user', content: 'It looked like a bat.' },
        { role: 'ai', content: 'Which part of the blot did they use?' },
        { role: 'user', content: 'They said it was the whole shape in the middle.' },
      ],
    });

    expect(query).toBe('They said it was the whole shape in the middle.');
  });
});
