'use client';

import { useEffect, useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { getDefaultModelForProvider, type Provider } from '@/lib/aiModels';
import { hasValidByokApiKeyFormat } from '@/lib/byokApiKeyFormat';
import {
  closeByokSessionDialog,
  fetchByokSessionStatus,
  saveByokSession,
  type ByokSessionDialogOpenDetail,
  subscribeByokSessionDialogOpen,
} from '@/lib/byokSessionClient';

const PROVIDER: Provider = 'openai';
const PROVIDER_NAME = 'OpenAI';

export default function ByokSessionDialog() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDetail, setOpenDetail] = useState<ByokSessionDialogOpenDetail>({});
  const defaultModel = getDefaultModelForProvider(PROVIDER);
  const hasApiKey = Boolean(apiKey.trim());
  const hasFormatError = hasApiKey && !hasValidByokApiKeyFormat(PROVIDER, apiKey);
  const apiKeyPlaceholder = t('aiSession.apiKeys.openaiPlaceholder');

  useEffect(() => {
    return subscribeByokSessionDialogOpen((detail) => {
      setOpenDetail(detail);
      setIsOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void fetchByokSessionStatus();
  }, [isOpen]);

  const close = (connected = false) => {
    setApiKey('');
    setShowKey(false);
    setIsOpen(false);
    closeByokSessionDialog({
      ...openDetail,
      connected,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiKey.trim() || isSaving) return;
    if (hasFormatError) {
      showToast({
        type: 'error',
        title: t('toast.apiKeyError.title'),
        message: t('aiSession.apiKeys.providerFormatError'),
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveByokSession(PROVIDER, apiKey);
      showToast({
        type: 'success',
        title: t('toast.apiKeySaved.title'),
        message: t('toast.apiKeySaved.message', { provider: PROVIDER_NAME }),
      });
      close(true);
    } catch {
      showToast({
        type: 'error',
        title: t('toast.apiKeyError.title'),
        message: t('toast.apiKeyError.message'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[17000] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="byok-session-dialog-title"
        className="relative w-full max-w-xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => close(false)}
          className="absolute right-3 top-3 rounded-full p-2 text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]"
          aria-label={t('common.close')}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 id="byok-session-dialog-title" className="sr-only">
            {t('aiSession.apiKeys.promptTitle')}
          </h2>
          <p className="px-8 whitespace-pre-line text-sm leading-6 text-[var(--text-soft)]">
            {t('aiSession.apiKeys.promptDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label htmlFor="byok-session-api-key" className="sr-only">
            {t('aiSession.apiKeys.inputLabel', { provider: PROVIDER_NAME })}
          </label>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 w-full shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 text-center text-sm font-semibold text-[var(--brand-700)] shadow-sm sm:w-44">
              {PROVIDER_NAME} {defaultModel.label}
            </div>
            <div className="ui-api-key-input-wrap h-11 w-full min-w-0 sm:flex-1">
              <div className="ui-api-key-icon">
                <KeyIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="byok-session-api-key"
                type={showKey ? 'text' : 'password'}
                className="ui-api-key-input"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder={apiKeyPlaceholder}
                autoComplete="off"
                aria-invalid={hasFormatError}
                aria-describedby={hasFormatError ? 'byok-session-api-key-error' : undefined}
              />
              <button
                type="button"
                className="ui-api-key-reveal"
                onClick={() => setShowKey((prev) => !prev)}
                aria-label={showKey ? t('aiSession.apiKeys.hideKey') : t('aiSession.apiKeys.showKey')}
              >
                {showKey ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <p
              id="byok-session-api-key-error"
              className="flex h-10 items-center justify-center text-center text-xs leading-5 text-[var(--danger-text)] sm:justify-start sm:pl-4 sm:text-left"
              aria-live="polite"
            >
              {hasFormatError ? t('aiSession.apiKeys.providerFormatError') : ''}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-2 text-sm font-semibold text-[var(--text-body)] transition-colors hover:bg-[var(--surface-muted)]"
              >
                {t('aiSession.apiKeys.promptLater')}
              </button>
              <button
                type="submit"
                disabled={!hasApiKey || hasFormatError || isSaving}
                data-inactive={!hasApiKey || hasFormatError ? 'true' : undefined}
                data-busy={isSaving ? 'true' : undefined}
                className="ui-api-key-action px-4 py-2"
              >
                {t('aiSession.apiKeys.connectForSession')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
