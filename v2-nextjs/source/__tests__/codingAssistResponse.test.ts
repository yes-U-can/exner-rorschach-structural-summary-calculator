import { describe, expect, it } from 'vitest';
import {
  CODING_JSON_END,
  CODING_JSON_START,
  parseCodingAssistSuggestion,
  splitCodingAssistResponse,
} from '@/lib/codingAssistResponse';

describe('coding assist response helpers', () => {
  it('parses a valid suggestion payload', () => {
    const parsed = parseCodingAssistSuggestion({
      summary: 'Need more context before confirming FQ.',
      needsMoreContext: true,
      questions: ['Which part of the blot did the examinee point to?'],
      proposals: [
        {
          field: 'location',
          type: 'string',
          value: 'W',
          reason: 'The memo describes the whole blot.',
          confidence: 'medium',
          citations: [
            {
              id: 'ko::scoring-input::location',
              title: 'Location coding',
              canonicalRoute: null,
              retrievalKind: null,
              locale: null,
              source: null,
            },
          ],
        },
      ],
    });

    expect(parsed).toEqual({
      summary: 'Need more context before confirming FQ.',
      needsMoreContext: true,
      questions: ['Which part of the blot did the examinee point to?'],
      proposals: [
        {
          field: 'location',
          type: 'string',
          value: 'W',
          reason: 'The memo describes the whole blot.',
          confidence: 'medium',
          citations: [
            {
              id: 'ko::scoring-input::location',
              title: 'Location coding',
              canonicalRoute: null,
              retrievalKind: null,
              locale: null,
              source: null,
            },
          ],
        },
      ],
    });
  });

  it('rejects malformed proposals', () => {
    const parsed = parseCodingAssistSuggestion({
      summary: 'test',
      proposals: [
        {
          field: 'bad-field',
          type: 'string',
          value: 'W',
          reason: 'bad',
        },
      ],
    });

    expect(parsed?.proposals).toEqual([]);
  });

  it('splits display text from embedded coding JSON', () => {
    const content = [
      'I need one more detail before I can narrow the coding.',
      CODING_JSON_START,
      JSON.stringify({
        summary: 'Ask about the exact blot area.',
        needsMoreContext: true,
        questions: ['Did the examinee point to the whole blot or one detail?'],
        proposals: [],
      }),
      CODING_JSON_END,
    ].join('\n');

    const result = splitCodingAssistResponse(content);

    expect(result.displayText).toBe('I need one more detail before I can narrow the coding.');
    expect(result.suggestion).toEqual({
      summary: 'Ask about the exact blot area.',
      needsMoreContext: true,
      questions: ['Did the examinee point to the whole blot or one detail?'],
      proposals: [],
    });
  });

  it('returns plain text when no coding JSON is embedded', () => {
    const result = splitCodingAssistResponse('Plain assistant message');

    expect(result.displayText).toBe('Plain assistant message');
    expect(result.suggestion).toBeNull();
  });
});
