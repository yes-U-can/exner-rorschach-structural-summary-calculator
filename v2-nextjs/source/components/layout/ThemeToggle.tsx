'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { toggleTheme } from '@/components/layout/themeRuntime';
import { useTranslation } from '@/hooks/useTranslation';

const LABELS = {
  ko: '라이트/다크 모드 전환',
  en: 'Toggle light and dark mode',
  ja: 'ライト/ダークモード切り替え',
  es: 'Cambiar entre modo claro y oscuro',
  pt: 'Alternar entre modo claro e escuro',
} as const;

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { language } = useTranslation();
  const label = LABELS[language] ?? LABELS.en;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-theme-allow-transition="true"
      className={`theme-toggle ${compact ? 'is-compact' : ''}`}
    >
      <span className="sr-only">{label}</span>
      <span className="theme-toggle-icon theme-toggle-icon-light">
        <SunIcon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon-dark">
        <MoonIcon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span
        data-theme-allow-transition="true"
        className="theme-toggle-knob"
      >
        <SunIcon className="theme-toggle-knob-sun h-4 w-4" aria-hidden="true" />
        <MoonIcon className="theme-toggle-knob-moon h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
}
