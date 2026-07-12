import { describe, expect, it } from 'vitest';
import { detectChatSafetyAssessment } from '@/lib/chatSafety';

describe('chat safety assessment', () => {
  it('returns the current Korean crisis route for an explicit first-person signal', () => {
    const result = detectChatSafetyAssessment({
      text: '나는 죽고 싶고 지금 나를 해칠 것 같아요.',
      locale: 'ko',
    });

    expect(result.level).toBe('high');
    expect(result.interventionTriggered).toBe(true);
    expect(result.safeResponse).toContain('109');
    expect(result.safeResponse).toContain('119');
    expect(result.safeResponse).toContain('112');
    expect(result.safeResponse).not.toContain('1577-0199');
  });

  it.each([
    ['en', 'I want to die and I may hurt myself.', 'local emergency services'],
    ['ja', '死にたい。自分の安全を保てません。', '緊急サービス'],
    ['es', 'Quiero morir y quiero hacerme daño.', 'servicios de emergencia'],
    ['pt', 'Quero morrer e quero me machucar.', 'serviço de emergência'],
  ] as const)('returns a localized non-Korean crisis response for %s', (locale, text, expected) => {
    const result = detectChatSafetyAssessment({ text, locale });

    expect(result.interventionTriggered).toBe(true);
    expect(result.safeResponse).toContain(expected);
    expect(result.safeResponse).not.toContain('109');
    expect(result.safeResponse).not.toContain('South Korea');
  });

  it('does not mistake an educational S-CON question for a personal crisis disclosure', () => {
    const result = detectChatSafetyAssessment({
      text: 'What does the suicide constellation S-CON mean in the Exner system?',
      locale: 'en',
    });

    expect(result.level).toBe('none');
    expect(result.interventionTriggered).toBe(false);
  });

  it('marks diagnosis requests for guardrail context without blocking the conversation', () => {
    const result = detectChatSafetyAssessment({
      text: '이 결과만 보고 무슨 장애인지 진단해 주세요.',
      locale: 'ko',
    });

    expect(result.level).toBe('medium');
    expect(result.type).toBe('diagnostic_attempt');
    expect(result.interventionTriggered).toBe(false);
  });
});
