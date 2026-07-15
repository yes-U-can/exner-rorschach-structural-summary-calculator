import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getChatPageUi } from '@/lib/chatPageUi';

describe('chat page UI copy', () => {
  it('provides complete prompt-navigation and summary-input copy in all five languages', () => {
    const expectedKeys = Object.keys(getChatPageUi('ko')).sort();

    for (const language of SUPPORTED_LANGUAGES) {
      const copy = getChatPageUi(language);
      expect(Object.keys(copy).sort()).toEqual(expectedKeys);
      expect(copy.conversationOutline.trim()).not.toBe('');
      expect(copy.jumpToPrompt.trim()).not.toBe('');
      expect(copy.clinicalDisclaimer.trim()).not.toBe('');
      expect(copy.inputPlaceholder.trim()).not.toBe('');
      expect(copy.summaryCsvPlaceholder.trim()).not.toBe('');
      expect(copy.summaryCsvReadyLabel.trim()).not.toBe('');
      expect(copy.clearSummaryCsv.trim()).not.toBe('');
      expect(copy.summaryCsvReadyLabel).not.toContain('✅');
    }
  });

  it('keeps the interpretation prompt text without an example prefix', () => {
    const copy = getChatPageUi('en');
    expect(copy.conversationOutline).toBe('Conversation outline');
    expect(copy.jumpToPrompt).toBe('Go to prompt');
    expect(copy.inputPlaceholder).toBe(
      'This is a 31-year-old woman’s profile. How can affect regulation and interpersonal patterns be interpreted?',
    );
    expect(getChatPageUi('ko').inputPlaceholder).toBe(
      '31세 여성의 프로파일입니다. 정서조절과 대인관계는 어떻게 해석할 수 있을까요?',
    );

    expect(getChatPageUi('ja').inputPlaceholder).not.toMatch(/^例[:：]/);
    expect(getChatPageUi('es').inputPlaceholder).not.toMatch(/^Ejemplo:/);
    expect(getChatPageUi('pt').inputPlaceholder).not.toMatch(/^Exemplo:/);
  });
});
