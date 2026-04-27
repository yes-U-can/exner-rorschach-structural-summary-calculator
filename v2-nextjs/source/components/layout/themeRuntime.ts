'use client';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'sicp-theme';
const THEME_EVENT = 'sicp-theme-change';
const TRANSITION_BLOCK_CLASS = 'theme-switching';

function normalizeTheme(value: string | null | undefined): ThemeMode {
  return value === 'dark' ? 'dark' : 'light';
}

function readStoredTheme(): ThemeMode {
  try {
    return normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'light';
  }
}

export function getThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return normalizeTheme(document.documentElement.dataset.theme) ?? readStoredTheme();
}

function persistTheme(theme: ThemeMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore storage errors
  }
}

function temporarilyDisableTransitions() {
  const root = document.documentElement;
  root.classList.add(TRANSITION_BLOCK_CLASS);
  let removed = false;

  const removeTransitionBlock = () => {
    if (removed) return;
    removed = true;
    root.classList.remove(TRANSITION_BLOCK_CLASS);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      removeTransitionBlock();
    });
  });

  window.setTimeout(removeTransitionBlock, 450);
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === 'undefined') return;

  temporarilyDisableTransitions();
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
}

export function setTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  applyTheme(theme);
  persistTheme(theme);
  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: theme }));
}

export function toggleTheme() {
  setTheme(getThemeMode() === 'dark' ? 'light' : 'dark');
}
