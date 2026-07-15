export type AppShortcutAction = 'toggle-sidebar';

type AppShortcutEvent = Pick<
  KeyboardEvent,
  'altKey' | 'code' | 'ctrlKey' | 'defaultPrevented' | 'key' | 'metaKey' | 'repeat' | 'shiftKey'
>;

export function getAppShortcutAction(
  event: AppShortcutEvent,
  options: { isEditableTarget?: boolean } = {},
): AppShortcutAction | null {
  if (event.defaultPrevented || event.repeat) return null;

  const key = typeof event.key === 'string' ? event.key.toLowerCase() : '';
  const primaryModifier = event.ctrlKey || event.metaKey;
  const primaryOnly = primaryModifier && !event.altKey && !event.shiftKey;

  if (options.isEditableTarget) return null;

  if (primaryOnly && (event.code === 'KeyB' || key === 'b')) {
    return 'toggle-sidebar';
  }

  return null;
}

export function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}
