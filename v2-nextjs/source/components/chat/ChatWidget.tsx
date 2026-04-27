'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { toPlainTextChat } from '@/lib/chatPlainText';
import { useTranslation } from '@/hooks/useTranslation';
import { splitCodingAssistResponse } from '@/lib/codingAssistResponse';
import type {
  ChatMessageMetadata,
  CodingAssistContext,
  CodingAssistFieldProposal,
  Language,
} from '@/types';
import { getCodingAssistFieldLabels, getCodingAssistWidgetUi } from '@/lib/codingAssistUi';
import { toChatCitationHref } from '@/lib/chatMessageMetadata';
import { ChatBubble, ChatMessageRow, ChatMessageText } from '@/components/chat/ChatBubble';
import {
  buildEphemeralChatStorageKey,
  clearAllEphemeralChatStorage,
  EPHEMERAL_CHAT_CLEAR_EVENT,
  readEphemeralChatMessages,
  toEphemeralChatContext,
  writeEphemeralChatMessages,
} from '@/lib/ephemeralChatStorage';
import {
  fetchByokSessionStatus,
  openByokSessionDialog,
  subscribeByokSessionChange,
  type ByokSessionStatus,
} from '@/lib/byokSessionClient';

type Provider = 'openai' | 'google';
type ModelOption = {
  id: string;
  provider: Provider;
  label: string;
  description: string;
  qualityLevel: 'basic' | 'standard' | 'advanced';
  priceLevel: 'low' | 'medium' | 'high';
  speedLevel: 'fast' | 'balanced' | 'deep';
  psychologyLabel: string;
  byokAvailable: boolean;
};

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
  uiOnly?: boolean;
  metadata?: ChatMessageMetadata;
};

type CodingAssistWorkflow = {
  mode: 'coding_assist';
  starterMessage: string;
  context: CodingAssistContext | null;
};

type ChatWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  workflow?: CodingAssistWorkflow | null;
  onApplyCodingProposal?: (proposal: CodingAssistFieldProposal) => void;
};

function formatProposalValue(value: CodingAssistFieldProposal['value'], language: string): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') {
    if (language === 'ko') return value ? '\uC608' : '\uC544\uB2C8\uC694';
    if (language === 'ja') return value ? '\u306F\u3044' : '\u3044\u3044\u3048';
    if (language === 'es') return value ? 'S\u00ED' : 'No';
    if (language === 'pt') return value ? 'Sim' : 'N\u00E3o';
    return value ? 'Yes' : 'No';
  }
  return value;
}

function buildContextScope(context: CodingAssistContext | null) {
  if (!context) return 'no-context';
  const focusScope = context.focusRowIndex === null ? 'sheet' : context.focusRowIndex;
  const source = [
    focusScope,
    context.card,
    context.responseMemo,
    context.selectedRowIndices.join(','),
  ].join('|');
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = Math.imul(31, hash) + source.charCodeAt(index);
  }
  return `row-${focusScope}-${Math.abs(hash).toString(36)}`;
}

export default function ChatWidget({
  isOpen,
  onClose,
  workflow,
  onApplyCodingProposal,
}: ChatWidgetProps) {
  const { t, language } = useTranslation();
  const ui = getCodingAssistWidgetUi(language as Language);
  const fieldLabels = getCodingAssistFieldLabels(language as Language);

  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-5.4');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentWorkflow = useMemo(
    () =>
      workflow ?? {
        mode: 'coding_assist' as const,
        starterMessage: ui.noContext,
        context: null,
      },
    [ui.noContext, workflow],
  );
  const storageKey = useMemo(
    () => buildEphemeralChatStorageKey({
      userId: 'browser',
      mode: 'coding_assist',
      scope: buildContextScope(currentWorkflow.context),
    }),
    [currentWorkflow.context],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    let frameId = 0;
    const root = document.documentElement;

    const resetFloatingPosition = () => {
      root.classList.remove('coding-chat-open');
      root.style.removeProperty('--coding-chat-footer-clearance');
      root.style.removeProperty('--coding-chat-panel-max-height');
    };

    const updateFloatingPosition = () => {
      frameId = 0;

      if (window.innerWidth < 640) {
        resetFloatingPosition();
        return;
      }

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const footer = document.querySelector<HTMLElement>('[data-site-footer]');
      const footerRect = footer?.getBoundingClientRect();
      const visibleFooterHeight = footerRect
        ? Math.max(0, Math.min(footerRect.bottom, viewportHeight) - Math.max(footerRect.top, 0))
        : 0;
      const footerClearance = visibleFooterHeight > 0 ? Math.ceil(visibleFooterHeight + 16) : 0;
      const maxPanelHeight = Math.max(320, Math.floor(viewportHeight - footerClearance - 48));

      root.classList.add('coding-chat-open');
      root.style.setProperty('--coding-chat-footer-clearance', `${footerClearance}px`);
      root.style.setProperty('--coding-chat-panel-max-height', `${maxPanelHeight}px`);
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateFloatingPosition);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('scroll', scheduleUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('scroll', scheduleUpdate);
      resetFloatingPosition();
    };
  }, [isOpen]);

  const loadChatModelState = useCallback(async () => {
    const activeSession = await fetchByokSessionStatus();
    setByokStatus(activeSession);
    if (!activeSession.active || !activeSession.provider) {
      clearAllEphemeralChatStorage();
      setModels([]);
      return;
    }

    try {
      const res = await fetch('/api/chat/models');
      if (!res.ok) return;
      const data = (await res.json()) as {
        models: ModelOption[];
        defaultProvider: Provider | null;
        defaultModelId: string | null;
      };
      const allModels = data.models ?? [];
      const available = allModels.filter((m) => m.provider === activeSession.provider);

      setModels(available);

      const defaultModel =
        available.find((model) => model.provider === activeSession.provider && model.byokAvailable) ??
        available[0];
      if (defaultModel) {
        setModelId(defaultModel.id);
        setProvider(activeSession.provider);
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void loadChatModelState();
    return subscribeByokSessionChange(() => {
      void loadChatModelState();
    });
  }, [isOpen, loadChatModelState]);

  const isModelStateLoaded = byokStatus !== null;
  const hasSelectableModel = Boolean(byokStatus?.active) && models.length > 0;

  useEffect(() => {
    if (!byokStatus?.provider || models.length === 0) return;
    const current = models.find((m) => m.id === modelId);
    const next = current ?? models.find((m) => m.provider === byokStatus.provider) ?? models[0];
    if (!next) return;
    if (next.id !== modelId) setModelId(next.id);
    if (provider !== byokStatus.provider) setProvider(byokStatus.provider);
  }, [byokStatus?.provider, modelId, models, provider]);

  useEffect(() => {
    if (!isOpen) return;

    const starter: Message = {
      id: Date.now(),
      role: 'ai',
      content: currentWorkflow.starterMessage,
      uiOnly: true,
    };

    setLoadedStorageKey(null);

    const storedMessages = readEphemeralChatMessages<Message>(storageKey);
    setMessages(storedMessages.length > 0 ? storedMessages : currentWorkflow.context ? [starter] : []);
    setLoadedStorageKey(storageKey);
  }, [currentWorkflow, isOpen, storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    if (!storageKey || loadedStorageKey !== storageKey) return;
    writeEphemeralChatMessages(storageKey, messages);
  }, [isOpen, loadedStorageKey, messages, storageKey]);

  useEffect(() => {
    const handleClear = () => setMessages([]);
    window.addEventListener(EPHEMERAL_CHAT_CLEAR_EVENT, handleClear);
    return () => window.removeEventListener(EPHEMERAL_CHAT_CLEAR_EVENT, handleClear);
  }, []);

  const inputDisabled = !currentWorkflow.context || !isModelStateLoaded || isLoading;
  const selectedRowSummary = currentWorkflow.context?.selectedRowIndices.length
    ? currentWorkflow.context.selectedRowIndices.map((rowIndex) => rowIndex + 1).join(', ')
    : '-';
  const statusNotice = !currentWorkflow.context
    ? ui.noContext
    : null;
  const getFriendlyErrorMessage = useCallback((rawError: string) => {
    const message = rawError.toLowerCase();
    if (message.includes('chat_provider_invalid_api_key')) {
      return t('chat.invalidApiKey');
    }
    if (message.includes('chat_provider_quota_or_billing')) {
      return t('chat.billingOrQuota');
    }
    if (message.includes('chat_provider_model_unavailable')) {
      return t('chat.modelUnavailable');
    }
    if (message.includes('chat_provider_request_failed')) {
      return t('chat.providerRejected');
    }
    if (message.includes('api key not found') || message.includes('api key not configured')) {
      return t('chat.apiKeyMissing');
    }
    if (
      message.includes('insufficient_quota') ||
      message.includes('quota') ||
      message.includes('billing')
    ) {
      return t('chat.billingOrQuota');
    }
    if (message.includes('invalid') && message.includes('key')) {
      return t('chat.invalidApiKey');
    }
    if (message.includes('model') && (message.includes('unavailable') || message.includes('not found'))) {
      return t('chat.modelUnavailable');
    }
    return t('chat.errorMessage');
  }, [t]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!currentWorkflow.context || messageText.trim() === '' || isLoading || !isModelStateLoaded) return;
    const activeSession = await fetchByokSessionStatus();
    if (!activeSession.active) {
      setByokStatus(activeSession);
      clearAllEphemeralChatStorage();
      openByokSessionDialog();
      return;
    }
    if (!hasSelectableModel) return;

    const newMessages = [...messages, { id: Date.now(), role: 'user' as const, content: messageText }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          contextMessages: toEphemeralChatContext(messages),
          mode: 'coding_assist',
          workflowContext: currentWorkflow.context,
          lang: language,
        }),
      });

      if (response.status === 401) {
        clearAllEphemeralChatStorage();
        openByokSessionDialog();
        throw new Error('Unauthorized');
      }

      if (!response.ok || !response.body) {
        let serverError: string = ui.serverFallbackError;
        try {
          const data = await response.json();
          if (data?.code && typeof data.code === 'string') {
            serverError = data.code;
          } else if (data?.error && typeof data.error === 'string') {
            serverError = data.error;
          }
        } catch {
          // no-op
        }
        throw new Error(serverError);
      }

      const aiMessageId = Date.now() + 1;
      setMessages((prev) => [...prev, { id: aiMessageId, role: 'ai', content: '' }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiResponseText += decoder.decode(value, { stream: true });
          setMessages((prev) => prev.map((message) => (
            message.id === aiMessageId ? { ...message, content: aiResponseText } : message
          )));
        }
        const tail = decoder.decode();
        if (tail) {
          aiResponseText += tail;
          setMessages((prev) => prev.map((message) => (
            message.id === aiMessageId ? { ...message, content: aiResponseText } : message
          )));
        }
      } catch {
        aiResponseText = `${aiResponseText}\n\n${ui.streamInterrupted}`;
      }

      const parsed = splitCodingAssistResponse(aiResponseText);
      setMessages((prev) => prev.map((message) => (
        message.id === aiMessageId
          ? {
              ...message,
              content: parsed.displayText || aiResponseText,
              metadata: { codingSuggestion: parsed.suggestion },
            }
          : message
      )));
    } catch (error) {
      const friendly = getFriendlyErrorMessage(error instanceof Error ? error.message : '');
      setMessages((prev) => [...prev, { id: Date.now() + 2, role: 'ai', content: friendly }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkflow.context, getFriendlyErrorMessage, hasSelectableModel, isLoading, isModelStateLoaded, language, messages, ui.serverFallbackError, ui.streamInterrupted]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(inputText);
  };

  if (!isOpen) return null;

  return (
    <div className="ui-coding-chat-overlay">
      <div className="ui-coding-chat-mobile-surface" />
      <div className="ui-coding-chat-panel">
        <div className="pt-safe flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-gradient-to-r from-[var(--surface-muted)] via-[var(--surface-base)] to-[var(--surface-muted)] px-4 py-3 sm:rounded-t-2xl">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-700)] text-[var(--on-brand)] shadow-sm">
              <SparklesIcon className="h-5 w-5" />
            </span>
            <h3 className="truncate text-sm font-bold text-[var(--text-strong)]">{ui.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label={ui.close}
            className="rounded-md p-2 text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-body)]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-3">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessageRow key={message.id} role={message.role}>
                <ChatBubble role={message.role}>
                  <ChatMessageText>
                    {message.role === 'ai' ? toPlainTextChat(message.content) : message.content}
                  </ChatMessageText>
                  {message.role === 'ai' && message.metadata?.codingSuggestion && (
                    <div className="mt-3 space-y-3 border-t border-[var(--border-subtle)] pt-3">
                      {message.metadata.codingSuggestion.questions.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-soft)]">
                            {ui.questionsTitle}
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-[var(--text-body)]">
                            {message.metadata.codingSuggestion.questions.map((question) => (
                              <li key={question}>{question}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {message.metadata.codingSuggestion.proposals.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-soft)]">
                            {ui.proposalTitle}
                          </p>
                          <div className="mt-2 space-y-2">
                            {message.metadata.codingSuggestion.proposals.map((proposal, index) => (
                              <div key={`${proposal.field}-${index}`} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-xs font-semibold text-[var(--text-body)]">
                                      {fieldLabels[proposal.field]}
                                    </p>
                                    <p className="mt-0.5 text-sm text-[var(--text-strong)]">
                                      {formatProposalValue(proposal.value, language)}
                                    </p>
                                  </div>
                                  <span className="rounded-full bg-[var(--surface-base)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-soft)] ring-1 ring-[var(--border-subtle)]">
                                    {ui.confidence[proposal.confidence]}
                                  </span>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-[var(--text-body)]">{proposal.reason}</p>
                                {proposal.citations.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-[11px] font-medium text-[var(--text-soft)]">{ui.citationTitle}</p>
                                    <ul className="mt-1 space-y-1 text-[11px] text-[var(--text-soft)]">
                                      {proposal.citations.map((citation) => (
                                        <li key={citation.id} className="flex items-start gap-1.5">
                                          <ClipboardDocumentCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-soft)]" />
                                          <div className="min-w-0">
                                            <p>{citation.title}</p>
                                            {toChatCitationHref(citation, language as Language) && (
                                              <Link
                                                href={toChatCitationHref(citation, language as Language)!}
                                                target="_blank"
                                                className="text-[10px] font-medium text-[var(--brand-700)] hover:underline"
                                              >
                                                {ui.citationOpen}
                                              </Link>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {onApplyCodingProposal && (
                                  <button
                                    type="button"
                                    onClick={() => onApplyCodingProposal(proposal)}
                                    className="mt-3 rounded-lg border border-[var(--brand-300)] bg-[var(--surface-base)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-700)] transition-colors hover:bg-[var(--brand-100)]"
                                  >
                                    {ui.apply}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ChatBubble>
              </ChatMessageRow>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'ai' && (
              <div className="flex justify-start">
                <div className="ui-chat-message ui-chat-message-ai">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--text-soft)] [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--text-soft)] [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--text-soft)]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="pb-safe rounded-b-2xl border-t border-[var(--border-subtle)] bg-[var(--surface-base)] p-3 md:p-4">
          {(statusNotice || currentWorkflow.context) && (
            <div className="mb-3 space-y-2">
              {statusNotice && (
                <div className="ui-warning-panel px-3 py-2 text-xs">
                  {statusNotice}
                </div>
              )}

              {currentWorkflow.context && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--text-body)]">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[var(--text-soft)]">
                    {selectedRowSummary !== '-' ? (
                      <span className="rounded-full bg-[var(--surface-base)] px-2 py-0.5 ring-1 ring-[var(--border-subtle)]">
                        {ui.selectedRowsLabel} {selectedRowSummary}
                      </span>
                    ) : null}
                    {currentWorkflow.context.focusRowIndex !== null ? (
                      <span className="rounded-full bg-[var(--surface-base)] px-2 py-0.5 ring-1 ring-[var(--border-subtle)]">
                        {ui.focusRowLabel} {currentWorkflow.context.focusRowIndex + 1}
                      </span>
                    ) : null}
                  </div>
                  {currentWorkflow.context.responseMemo ? (
                    <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-xs leading-5 text-[var(--text-body)]">
                      {currentWorkflow.context.responseMemo}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder={ui.placeholder}
              disabled={inputDisabled}
              className="ui-chat-input focus:ring-1"
            />
            <button
              type="submit"
              className="ui-send-button"
              disabled={inputDisabled || inputText.trim() === ''}
              aria-label={ui.send}
            >
              <PaperAirplaneIcon className="mx-auto h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
