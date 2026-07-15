import { describe, expect, it } from 'vitest';
import {
  AI_FEEDBACK_REASON_CODES_BY_RATING,
  parseAiFeedbackReasonCodes,
} from '@/lib/aiFeedbackReasons';
import { getChatFeedbackReasonsUi } from '@/lib/chatFeedbackReasonsUi';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

describe('structured AI feedback reasons', () => {
  it('accepts unique reason codes that belong to the selected rating', () => {
    expect(parseAiFeedbackReasonCodes(['accurate', 'clear'], 'helpful')).toEqual([
      'accurate',
      'clear',
    ]);
    expect(parseAiFeedbackReasonCodes(['incorrect', 'incomplete'], 'unhelpful')).toEqual([
      'incorrect',
      'incomplete',
    ]);
  });

  it('rejects duplicates, unknown codes, and codes from the opposite rating', () => {
    expect(parseAiFeedbackReasonCodes(['accurate', 'accurate'], 'helpful')).toBeNull();
    expect(parseAiFeedbackReasonCodes(['free_text_reason'], 'helpful')).toBeNull();
    expect(parseAiFeedbackReasonCodes(['incorrect'], 'helpful')).toBeNull();
    expect(parseAiFeedbackReasonCodes(['accurate'], 'unhelpful')).toBeNull();
  });

  it('allows only an empty reason list when removing a rating', () => {
    expect(parseAiFeedbackReasonCodes([], null)).toEqual([]);
    expect(parseAiFeedbackReasonCodes(['accurate'], null)).toBeNull();
  });

  it('treats a missing reason list as empty for already-open legacy clients', () => {
    expect(parseAiFeedbackReasonCodes(undefined, 'helpful')).toEqual([]);
    expect(parseAiFeedbackReasonCodes(undefined, null)).toEqual([]);
  });

  it('has visible labels for every reason in all five languages', () => {
    const allReasonCodes = Object.values(AI_FEEDBACK_REASON_CODES_BY_RATING).flat();
    for (const language of SUPPORTED_LANGUAGES) {
      const ui = getChatFeedbackReasonsUi(language);
      for (const reasonCode of allReasonCodes) {
        expect(ui.reasonLabels[reasonCode].trim()).not.toBe('');
      }
    }
  });

  it('keeps Korean feedback copy concise and category-based', () => {
    const ui = getChatFeedbackReasonsUi('ko');
    expect(ui.title).toBe('의견 보내기');
    expect(Object.values(ui.reasonLabels)).not.toContain('내용이 정확했어요');
    for (const label of Object.values(ui.reasonLabels)) {
      expect(label).not.toMatch(/했어요|해주세요|되었나요/);
    }
    expect(ui.privacyNote).toContain('대화 내용은 저장되지 않습니다');
  });
});
