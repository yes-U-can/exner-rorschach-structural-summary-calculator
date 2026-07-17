import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getReferenceDocumentUi } from '@/lib/referenceDocumentUi';

const referenceMarkdownSource = readFileSync('components/ref/ReferenceMarkdown.tsx', 'utf8');

describe('reference document UI copy', () => {
  it('provides complete copy feedback for every supported language', () => {
    const expectedKeys = Object.keys(getReferenceDocumentUi('en')).sort();

    for (const language of SUPPORTED_LANGUAGES) {
      const copy = getReferenceDocumentUi(language);
      expect(Object.keys(copy).sort()).toEqual(expectedKeys);
      for (const value of Object.values(copy)) {
        expect(value.trim()).not.toBe('');
      }
    }
  });

  it('uses Korean labels in the Korean environment', () => {
    expect(getReferenceDocumentUi('ko')).toMatchObject({
      copy: '복사',
      copiedTitle: '복사됨',
      copiedMessage: '참조 문서를 클립보드에 복사했습니다.',
    });
  });

  it('uses the theme-aware red palette for inline reference code', () => {
    expect(referenceMarkdownSource).toContain('bg-[var(--danger-hover-bg)]');
    expect(referenceMarkdownSource).toContain('text-[var(--danger-text)]');
  });
});
