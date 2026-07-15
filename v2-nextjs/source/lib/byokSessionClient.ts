'use client';

import type { Provider } from '@/lib/aiModels';
import { clearSessionUiPreferencesStorage } from '@/lib/sessionUiPreferencesStorage';

export type ByokSessionStatus = {
  active: boolean;
  provider: Provider | null;
  masked: string | null;
  expiresAt: string | null;
  ttlHours: number;
};

const CHANGE_EVENT = 'sicp-byok-session-change';
const OPEN_DIALOG_EVENT = 'sicp-byok-session-dialog-open';
const CLOSE_DIALOG_EVENT = 'sicp-byok-session-dialog-close';

export type ByokSessionDialogOpenDetail = {
  required?: boolean;
  source?: 'chat' | 'header' | 'sidebar' | 'widget' | 'unknown';
};

export type ByokSessionDialogCloseDetail = ByokSessionDialogOpenDetail & {
  connected: boolean;
};

const INACTIVE_BYOK_STATUS: ByokSessionStatus = {
  active: false,
  provider: null,
  masked: null,
  expiresAt: null,
  ttlHours: 24,
};

let cachedByokSessionStatus: ByokSessionStatus | null = null;

function notifyByokSessionChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getCachedByokSessionStatus(): ByokSessionStatus | null {
  return cachedByokSessionStatus;
}

function setCachedByokSessionStatus(status: ByokSessionStatus): ByokSessionStatus {
  cachedByokSessionStatus = status;
  return status;
}

export async function fetchByokSessionStatus(): Promise<ByokSessionStatus> {
  const response = await fetch('/api/byok/session', {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
  });

  if (!response.ok) {
    return setCachedByokSessionStatus(INACTIVE_BYOK_STATUS);
  }

  return setCachedByokSessionStatus((await response.json()) as ByokSessionStatus);
}

export async function saveByokSession(provider: Provider, apiKey: string): Promise<ByokSessionStatus> {
  const response = await fetch('/api/byok/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ provider, apiKey }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error ?? 'Failed to save API key for this AI session.');
  }

  clearSessionUiPreferencesStorage();
  setCachedByokSessionStatus(payload as ByokSessionStatus);
  notifyByokSessionChange();
  return payload as ByokSessionStatus;
}

export async function clearByokSession(): Promise<void> {
  await fetch('/api/byok/session', {
    method: 'DELETE',
    credentials: 'include',
  });
  clearSessionUiPreferencesStorage();
  setCachedByokSessionStatus(INACTIVE_BYOK_STATUS);
  notifyByokSessionChange();
}

export function openByokSessionDialog(detail: ByokSessionDialogOpenDetail = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ByokSessionDialogOpenDetail>(OPEN_DIALOG_EVENT, {
    detail,
  }));
}

export function closeByokSessionDialog(detail: ByokSessionDialogCloseDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ByokSessionDialogCloseDetail>(CLOSE_DIALOG_EVENT, {
    detail,
  }));
}

export function subscribeByokSessionChange(listener: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export function subscribeByokSessionDialogOpen(listener: (detail: ByokSessionDialogOpenDetail) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    listener((event as CustomEvent<ByokSessionDialogOpenDetail>).detail ?? {});
  };
  window.addEventListener(OPEN_DIALOG_EVENT, handler);
  return () => window.removeEventListener(OPEN_DIALOG_EVENT, handler);
}

export function subscribeByokSessionDialogClose(listener: (detail: ByokSessionDialogCloseDetail) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ByokSessionDialogCloseDetail>).detail;
    if (detail) listener(detail);
  };
  window.addEventListener(CLOSE_DIALOG_EVENT, handler);
  return () => window.removeEventListener(CLOSE_DIALOG_EVENT, handler);
}
