'use client';

import { ArrowRightOnRectangleIcon, KeyIcon } from '@heroicons/react/24/outline';
import type { ByokSessionStatus } from '@/lib/byokSessionClient';
import LanguageSelector from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';

type HeaderAuthControlsProps = {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  byokStatus: ByokSessionStatus;
  startLabel: string;
  logoutLabel: string;
  onStartSession: () => void;
  onChangeSession: () => void;
  onLogout: () => void;
};

export default function HeaderAuthControls({
  status,
  byokStatus,
  startLabel,
  logoutLabel,
  onStartSession,
  onChangeSession,
  onLogout,
}: HeaderAuthControlsProps) {
  if (status === 'loading') {
    return (
      <div className="ui-header-control-row">
        <div className="h-10 w-36 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
        <div className="ui-header-divider" />
        <div className="ui-header-settings-cluster">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    const providerLabel = 'OpenAI';
    return (
      <div className="ui-header-control-row">
        <div className="ui-header-session-chip">
          <button
            type="button"
            onClick={onChangeSession}
            className="ui-header-session-label"
            title={`${providerLabel} ${byokStatus.masked ?? ''}`}
            aria-label={`${providerLabel} API key session`}
          >
            <KeyIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="block min-w-0 truncate text-xs font-semibold">
              {providerLabel} {byokStatus.masked ?? ''}
            </span>
          </button>
          <span className="ui-header-chip-divider" />
          <button type="button" onClick={onLogout} className="ui-header-logout-button">
            <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
            <span>{logoutLabel}</span>
          </button>
        </div>
        <div className="ui-header-divider" />
        <div className="ui-header-settings-cluster">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="ui-header-control-row">
      <button type="button" onClick={onStartSession} className="ui-header-logout-button">
        <KeyIcon className="h-4 w-4" aria-hidden="true" />
        <span>{startLabel}</span>
      </button>
      <div className="ui-header-divider" />
      <div className="ui-header-settings-cluster">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
}
