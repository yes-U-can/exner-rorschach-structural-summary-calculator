import { describe, expect, it } from 'vitest';
import { normalizeLanguage, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getAppShellUi } from '@/lib/appShellUi';

describe('app shell UI copy', () => {
  it('provides complete sidebar labels in all five languages', () => {
    const expectedKeys = Object.keys(getAppShellUi('ko')).sort();
    for (const language of SUPPORTED_LANGUAGES) {
      const copy = getAppShellUi(language);
      expect(Object.keys(copy).sort()).toEqual(expectedKeys);
      for (const value of Object.values(copy)) {
        expect(value.trim()).not.toBe('');
      }
    }
  });

  it('keeps the Korean shell labels concise', () => {
    const copy = getAppShellUi('ko');
    expect(copy.workspace).toBe('작업공간');
    expect(copy.settings).toBe('설정');
    expect(copy.about).toBe('서비스 소개');
  });

  it('accepts only the five supported request languages', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(normalizeLanguage(language)).toBe(language);
    }
    expect(normalizeLanguage('fr')).toBeNull();
    expect(normalizeLanguage(undefined)).toBeNull();
  });
});
