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

const PROVIDERS: { id: Provider; name: string }[] = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'google', name: 'Google' },
];

export default function ByokSessionDialog() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState<Provider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDetail, setOpenDetail] = useState<ByokSessionDialogOpenDetail>({});
  const providerName = PROVIDERS.find((item) => item.id === provider)?.name ?? provider;
  const hasApiKey = Boolean(apiKey.trim());
  const hasFormatError = hasApiKey && !hasValidByokApiKeyFormat(provider, apiKey);
  const apiKeyPlaceholder = t(
    provider === 'openai'
      ? 'aiSession.apiKeys.openaiPlaceholder'
      : 'aiSession.apiKeys.googlePlaceholder',
  );

  useEffect(() => {
    return subscribeByokSessionDialogOpen((detail) => {
      setOpenDetail(detail);
      setIsOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    void (async () => {
      const status = await fetchByokSessionStatus();
      if (!cancelled && status.provider) {
        setProvider(status.provider);
      }
    })();
    return () => {
      cancelled = true;
    };
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
      await saveByokSession(provider, apiKey);
      showToast({
        type: 'success',
        title: t('toast.apiKeySaved.title'),
        message: t('toast.apiKeySaved.message', { provider: providerName }),
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
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
              {t('aiSession.apiKeys.promptDescription')}
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--text-soft)]">
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
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--surface-muted)] p-1">
            {PROVIDERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setProvider(item.id)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                  provider === item.id
                    ? 'bg-[var(--surface-base)] text-[var(--brand-700)] shadow-sm'
                    : 'text-[var(--text-soft)] hover:text-[var(--text-strong)]'
                }`}
              >
                {item.name} {getDefaultModelForProvider(item.id).label}
              </button>
            ))}
          </div>

          <label htmlFor="byok-session-api-key" className="sr-only">
            {t('aiSession.apiKeys.inputLabel', { provider: providerName })}
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
