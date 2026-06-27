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
      <div className="w-full max-w-xl rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-strong)]">
              {t('aiSession.apiKeys.promptTitle')}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--text-soft)]">
              {t('aiSession.apiKeys.promptDescription')}
            </p>
            <p className="mt-3 whitespace-pre-line text-xs leading-5 text-[var(--text-soft)]">
              {t('aiSession.apiKeys.modelPolicy')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => close(false)}
            className="rounded-full p-2 text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-strong)]"
            aria-label={t('common.close')}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-2xl bg-[var(--surface-muted)] p-1">
            <div className="rounded-xl bg-[var(--surface-base)] px-3 py-2 text-sm font-semibold text-[var(--brand-700)] shadow-sm">
              {PROVIDER_NAME} {defaultModel.label}
            </div>
          </div>

          <label htmlFor="byok-session-api-key" className="sr-only">
            {t('aiSession.apiKeys.inputLabel', { provider: PROVIDER_NAME })}
          </label>
          <div className="ui-api-key-input-wrap">
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
          {hasFormatError && (
            <p className="text-xs leading-5 text-[var(--danger-text)]">
              {t('aiSession.apiKeys.providerFormatError')}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              data-empty={!hasApiKey ? 'true' : undefined}
              data-busy={isSaving ? 'true' : undefined}
              className="ui-api-key-action px-4 py-2"
            >
              {t('aiSession.apiKeys.connectForSession')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
