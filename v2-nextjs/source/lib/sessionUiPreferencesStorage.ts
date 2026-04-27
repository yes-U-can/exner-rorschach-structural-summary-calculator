'use client';

import {
  getDefaultSessionUiPreferences,
  normalizeSessionUiPreferences,
} from '@/lib/chatWorkflow';
import type { SessionUiPreferences } from '@/types';

export const SESSION_UI_PREFERENCES_CLEAR_EVENT = 'rorschach:session-ui-preferences-clear';

const STORAGE_KEY = 'rorschach_session_ui_preferences_v1';

export type StoredSessionUiPreferences = Required<SessionUiPreferences>;

export function readSessionUiPreferences(): StoredSessionUiPreferences {
  if (typeof window === 'undefined') return getDefaultSessionUiPreferences();

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return normalizeSessionUiPreferences(raw ? JSON.parse(raw) : null);
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return getDefaultSessionUiPreferences();
  }
}

export function writeSessionUiPreferences(preferences: StoredSessionUiPreferences) {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // If browser storage is unavailable, keep the preference in memory only.
  }
}

export function clearSessionUiPreferencesStorage() {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_UI_PREFERENCES_CLEAR_EVENT));
}

export function subscribeSessionUiPreferencesClear(listener: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(SESSION_UI_PREFERENCES_CLEAR_EVENT, listener);
  return () => window.removeEventListener(SESSION_UI_PREFERENCES_CLEAR_EVENT, listener);
}
