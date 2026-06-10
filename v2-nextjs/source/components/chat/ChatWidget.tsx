'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { toPlainTextChat } from '@/lib/chatPlainText';
import { useTranslation } from '@/hooks/useTranslation';
import type {
  ChatMessageMetadata,
  CodingAssistContext,
  Language,
} from '@/types';
import { getCodingAssistWidgetUi } from '@/lib/codingAssistUi';
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
import { isByokSessionMissingError, readChatApiErrorPayload } from '@/lib/chatApiErrors';

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
};

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
}: ChatWidgetProps) {
  const { t, language } = useTranslation();
  const ui = getCodingAssistWidgetUi(language as Language);

  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-5.5');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

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

  const updateAutoScrollPreference = useCallback(() => {
    const scrollElement = messagesScrollRef.current;
    if (!scrollElement) return;
    const distanceFromBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 96;
  }, []);

  const lastMessageContent = messages[messages.length - 1]?.content ?? '';

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, [messages.length, lastMessageContent]);

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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          contextMessages: toEphemeralChatContext(messages),
          mode: 'coding_assist',
          workflowContext: currentWorkflow.context,
          lang: language,
        }),
      });

      if (!response.ok) {
        const serverError = await readChatApiErrorPayload(response, ui.serverFallbackError);
        if (isByokSessionMissingError(response.status, serverError)) {
          clearAllEphemeralChatStorage();
          openByokSessionDialog({ source: 'widget' });
          return;
        }
        throw new Error(serverError.message);
      }

      if (!response.body) {
        throw new Error(ui.serverFallbackError);
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
        setMessages((prev) => prev.map((message) => (
          message.id === aiMessageId ? { ...message, content: aiResponseText } : message
        )));
      }
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

        <div
          ref={messagesScrollRef}
          onScroll={updateAutoScrollPreference}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-3"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessageRow key={message.id} role={message.role}>
                <ChatBubble role={message.role}>
                  <ChatMessageText>
                    {message.role === 'ai' ? toPlainTextChat(message.content) : message.content}
                  </ChatMessageText>
                </ChatBubble>
              </ChatMessageRow>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'ai' && (
              <div className="flex justify-start">
                <div className="ui-chat-message ui-chat-message-ai">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[var(--text-soft)] [animation-delay:-0.6s]" />
                    <div className="h-2 w-2 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[var(--text-soft)] [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-[var(--text-soft)]" />
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
