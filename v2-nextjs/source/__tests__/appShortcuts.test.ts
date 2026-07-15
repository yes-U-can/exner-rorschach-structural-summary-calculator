import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getAppShortcutAction } from '@/lib/appShortcuts';
import { getKeyboardShortcutsUi } from '@/lib/keyboardShortcutsUi';

function shortcutEvent(overrides: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    altKey: false,
    code: '',
    ctrlKey: false,
    defaultPrevented: false,
    key: '',
    metaKey: false,
    repeat: false,
    shiftKey: false,
    ...overrides,
  } as KeyboardEvent;
}

describe('app shortcuts', () => {
  it('keeps only the documented sidebar shortcut', () => {
    expect(getAppShortcutAction(shortcutEvent({ metaKey: true, code: 'KeyB', key: 'b' })))
      .toBe('toggle-sidebar');
  });

  it('does not intercept the sidebar shortcut while the user is typing', () => {
    expect(getAppShortcutAction(
      shortcutEvent({ ctrlKey: true, code: 'KeyB', key: 'b' }),
      { isEditableTarget: true },
    )).toBeNull();
  });

  it('ignores repeats and removed shortcut combinations', () => {
    expect(getAppShortcutAction(shortcutEvent({ ctrlKey: true, code: 'KeyB', key: 'b', repeat: true })))
      .toBeNull();
    expect(getAppShortcutAction(shortcutEvent({ ctrlKey: true, code: 'Slash', key: '/' }))).toBeNull();
    expect(getAppShortcutAction(shortcutEvent({ altKey: true, code: 'Digit1', key: '1' }))).toBeNull();
    expect(getAppShortcutAction(shortcutEvent({ altKey: true, code: 'Digit2', key: '2' }))).toBeNull();
    expect(getAppShortcutAction(shortcutEvent({ altKey: true, code: 'Digit3', key: '3' }))).toBeNull();
  });

  it('ignores incomplete keyboard events without throwing', () => {
    expect(getAppShortcutAction({
      ...shortcutEvent({ ctrlKey: true }),
      key: undefined,
    } as unknown as KeyboardEvent)).toBeNull();
  });

  it('provides complete dialog copy in all five languages', () => {
    const expectedKeys = Object.keys(getKeyboardShortcutsUi('ko')).sort();
    for (const language of SUPPORTED_LANGUAGES) {
      const copy = getKeyboardShortcutsUi(language);
      expect(Object.keys(copy).sort()).toEqual(expectedKeys);
      for (const value of Object.values(copy)) expect(value.trim()).not.toBe('');
    }
  });

  it('documents the scoring shortcuts that already exist in the calculator', () => {
    const copy = getKeyboardShortcutsUi('ko');
    expect([
      copy.undo,
      copy.redo,
      copy.selectAllRows,
      copy.selectRowRange,
      copy.toggleRowSelection,
      copy.zoomScoringCanvas,
      copy.panScoringCanvas,
      copy.toggleCodingAssistant,
    ]).toEqual([
      '변경 취소',
      '다시 실행',
      '모든 반응 행 선택 (데스크톱)',
      '연속 반응 행 범위 선택',
      '개별 반응 행 추가/해제',
      '채점 화면 확대/축소',
      '채점 화면 이동',
      '코딩 도우미 열기/닫기',
    ]);
  });
});
