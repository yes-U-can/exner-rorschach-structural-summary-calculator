import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const GENERATED_CORPUS_FILES = [
  'generated/reference-corpus/chunks.json',
  'generated/reference-corpus/route-docs.json',
] as const;

const NON_EXNER_RAW_TEXT_MARKERS = [
  'R-PAS',
  'Rorschach Performance Assessment System',
  'Klopfer',
  'Piotrowski',
  'Basic Rorschach',
  'Herm',
  'French-school Rorschach',
  '实用罗夏墨迹测验',
] as const;

describe('production reference-corpus system boundary', () => {
  it('does not mix audited non-Exner source text into production RAG', () => {
    for (const relativePath of GENERATED_CORPUS_FILES) {
      const contents = readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
      for (const marker of NON_EXNER_RAW_TEXT_MARKERS) {
        expect(
          contents.includes(marker),
          `${relativePath} must not contain raw non-Exner marker: ${marker}`,
        ).toBe(false);
      }
    }
  });

  it('does not expose French-school determinant codes as corpus tokens', () => {
    const contents = GENERATED_CORPUS_FILES
      .map((relativePath) =>
        readFileSync(path.resolve(process.cwd(), relativePath), 'utf8'),
      )
      .join('\n');

    expect(contents).not.toMatch(/\b(?:kan|kob|clob)\b/iu);
  });
});
