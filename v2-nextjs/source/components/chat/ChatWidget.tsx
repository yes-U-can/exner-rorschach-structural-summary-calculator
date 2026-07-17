'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SparklesIcon, StopIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { toPlainTextChat } from '@/lib/chatPlainText';
import { useTranslation } from '@/hooks/useTranslation';
import { useChatAutoScroll } from '@/hooks/useChatAutoScroll';
import { useChatRequestControl } from '@/hooks/useChatRequestControl';
import type {
  AiFeedbackRating,
  AiFeedbackReasonCode,
  ChatMessageMetadata,
  CodingAssistContext,
  Language,
} from '@/types';
import { getCodingAssistWidgetUi } from '@/lib/codingAssistUi';
import { getChatRuntimeUi } from '@/lib/chatPageUi';
import { getChatMessageActionsUi } from '@/lib/chatMessageActionsUi';
import {
  shouldShowChatMessageActions,
  withClientFeedbackIds,
} from '@/lib/chatMessageActions';
import {
  ChatBubble,
  ChatMessageGroup,
  ChatMessageRow,
  ChatMessageText,
} from '@/components/chat/ChatBubble';
import { ChatMessageActions } from '@/components/chat/ChatMessageActions';
import { ChatScrollToLatestButton } from '@/components/chat/ChatScrollToLatestButton';
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
import { CHAT_STREAM_PROTOCOL, consumeChatEventStream } from '@/lib/chatStreamProtocol';
import {
  AI_RESPONSE_FEEDBACK_ENABLED,
  createClientFeedbackId,
  submitAiResponseFeedback,
} from '@/lib/aiFeedbackClient';

type Provider = 'openai';
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
  statusNotice?: string;
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

export default function ChatWidget({
  isOpen,
  onClose,
  workflow,
}: ChatWidgetProps) {
  const { t, language } = useTranslation();
  const ui = getCodingAssistWidgetUi(language as Language);
  const chatRuntimeUi = getChatRuntimeUi(language as Language);
  const messageActionsUi = getChatMessageActionsUi(language);

  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-5.5');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { beginRequest, finishRequest, stopRequest } = useChatRequestControl();
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const latestMessageContent = messages[messages.length - 1]?.content ?? '';
  const {
    scrollContainerRef,
    isFollowing,
    resumeFollowing,
    scrollHandlers,
  } = useChatAutoScroll({
    messageCount: messages.length,
    latestContent: latestMessageContent,
  });

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
      scope: 'coding-assist-session',
    }),
    [],
  );

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
    if (loadedStorageKey === storageKey) return;

    const starter: Message = {
      id: Date.now(),
      role: 'ai',
      content: currentWorkflow.starterMessage,
      uiOnly: true,
    };

    setLoadedStorageKey(null);

    const storedMessages = withClientFeedbackIds(
      readEphemeralChatMessages<Message>(storageKey),
      {
        enabled: AI_RESPONSE_FEEDBACK_ENABLED,
        createId: createClientFeedbackId,
      },
    );
    setMessages(storedMessages.length > 0 ? storedMessages : currentWorkflow.context ? [starter] : []);
    setLoadedStorageKey(storageKey);
  }, [currentWorkflow.context, currentWorkflow.starterMessage, isOpen, loadedStorageKey, storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    if (!storageKey || loadedStorageKey !== storageKey) return;
    writeEphemeralChatMessages(storageKey, messages);
  }, [isOpen, loadedStorageKey, messages, storageKey]);

  useEffect(() => {
    const handleClear = () => {
      setLoadedStorageKey(null);
      setMessages([]);
    };
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
    if (message.includes('chat_app_rate_limited')) {
      return t('chat.appRateLimited');
    }
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

  const saveMessageFeedback = useCallback(async (args: {
    messageId: number;
    feedbackId: string;
    completionState: NonNullable<ChatMessageMetadata['completionState']>;
    responseChars: number;
    rating: AiFeedbackRating | null;
    reasonCodes: AiFeedbackReasonCode[];
  }) => {
    await submitAiResponseFeedback({
      feedbackId: args.feedbackId,
      rating: args.rating,
      workflowType: 'coding_assist',
      locale: language as Language,
      completionState: args.completionState,
      responseChars: args.responseChars,
      reasonCodes: args.reasonCodes,
    });
    setMessages((current) => current.map((message) => (
      message.id === args.messageId
        ? {
            ...message,
            metadata: {
              ...message.metadata,
              feedbackRating: args.rating,
              feedbackReasonCodes: args.rating ? args.reasonCodes : [],
            },
          }
        : message
    )));
  }, [language]);

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
    resumeFollowing('auto');
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    const requestController = beginRequest();
    let aiMessageId: number | null = null;
    let aiResponseText = '';

    const updateAiMessage = (
      content: string,
      completionState?: ChatMessageMetadata['completionState'],
      statusNotice?: string,
    ) => {
      if (aiMessageId === null) return;
      setMessages((prev) => prev.map((message) => (
        message.id === aiMessageId
          ? {
              ...message,
              content,
              statusNotice,
              metadata: {
                ...message.metadata,
                ...(completionState ? { completionState } : {}),
              },
            }
          : message
      )));
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Chat-Stream-Protocol': CHAT_STREAM_PROTOCOL,
        },
        body: JSON.stringify({
          message: messageText,
          contextMessages: toEphemeralChatContext(messages),
          mode: 'coding_assist',
          workflowContext: currentWorkflow.context,
          lang: language,
        }),
        signal: requestController.signal,
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

      const nextAiMessageId = Date.now() + 1;
      aiMessageId = nextAiMessageId;
      setMessages((prev) => [
        ...prev,
        {
          id: nextAiMessageId,
          role: 'ai',
          content: '',
          metadata: {
            workflowType: 'coding_assist',
            locale: language,
            modelId,
            ...(AI_RESPONSE_FEEDBACK_ENABLED
              ? { clientFeedbackId: createClientFeedbackId() }
              : {}),
            completionState: 'streaming',
          },
        },
      ]);
      try {
        const terminalEvent = await consumeChatEventStream(response.body, (delta) => {
          aiResponseText += delta;
          updateAiMessage(aiResponseText);
        });
        if (terminalEvent.type !== 'complete') {
          const notice = terminalEvent.type === 'error'
            ? getFriendlyErrorMessage(terminalEvent.message)
            : terminalEvent.reason === 'max_output_tokens'
              ? chatRuntimeUi.responseLengthReached
              : terminalEvent.reason === 'timeout'
                ? chatRuntimeUi.responseTimedOut
                : chatRuntimeUi.streamInterrupted;
          updateAiMessage(
            aiResponseText,
            terminalEvent.type === 'error' ? 'failed' : 'incomplete',
            notice,
          );
        } else {
          updateAiMessage(aiResponseText, 'completed');
        }
      } catch (streamError) {
        if (!requestController.signal.aborted) {
          console.error('Coding assistant stream interrupted:', streamError);
        }
        updateAiMessage(
          aiResponseText,
          requestController.signal.aborted ? 'incomplete' : 'failed',
          requestController.signal.aborted
            ? chatRuntimeUi.responseStopped
            : chatRuntimeUi.streamInterrupted,
        );
      }
    } catch (error) {
      if (requestController.signal.aborted) {
        if (aiMessageId === null) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              role: 'ai',
              content: '',
              statusNotice: chatRuntimeUi.responseStopped,
              metadata: {
                workflowType: 'coding_assist',
                locale: language,
                modelId,
                completionState: 'incomplete',
              },
            },
          ]);
        } else {
          updateAiMessage(
            aiResponseText,
            'incomplete',
            chatRuntimeUi.responseStopped,
          );
        }
        return;
      }
      const friendly = getFriendlyErrorMessage(error instanceof Error ? error.message : '');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'ai',
          content: '',
          statusNotice: friendly,
          metadata: {
            workflowType: 'coding_assist',
            locale: language,
            modelId,
            completionState: 'failed',
          },
        },
      ]);
    } finally {
      finishRequest(requestController);
      setIsLoading(false);
    }
  }, [beginRequest, chatRuntimeUi.responseLengthReached, chatRuntimeUi.responseStopped, chatRuntimeUi.responseTimedOut, chatRuntimeUi.streamInterrupted, currentWorkflow.context, finishRequest, getFriendlyErrorMessage, hasSelectableModel, isLoading, isModelStateLoaded, language, messages, modelId, resumeFollowing, ui.serverFallbackError]);

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

        <div className="ui-coding-chat-scroll-region relative min-h-0 flex-1 overflow-hidden">
          <div
            ref={scrollContainerRef}
            {...scrollHandlers}
            className="h-full overflow-y-auto overscroll-contain px-4 py-4 pb-3 [overflow-anchor:none]"
          >
            <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessageRow key={message.id} role={message.role}>
                <ChatMessageGroup role={message.role}>
                  {message.content.trim() ? (
                    <ChatBubble role={message.role}>
                      <ChatMessageText>
                        {message.role === 'ai' ? toPlainTextChat(message.content) : message.content}
                      </ChatMessageText>
                    </ChatBubble>
                  ) : null}
                  {message.statusNotice ? (
                    <p className="ui-chat-message-status" role="status">{message.statusNotice}</p>
                  ) : null}
                  {shouldShowChatMessageActions({
                    content: message.content,
                    uiOnly: message.uiOnly,
                    completionState: message.metadata?.completionState,
                  }) ? (
                    <ChatMessageActions
                      content={message.role === 'ai' ? toPlainTextChat(message.content) : message.content}
                      language={language as Language}
                      feedbackRating={message.role === 'ai' ? message.metadata?.feedbackRating : undefined}
                      onFeedback={
                        message.role === 'ai' &&
                        AI_RESPONSE_FEEDBACK_ENABLED &&
                        message.metadata?.clientFeedbackId &&
                        message.metadata.completionState !== 'failed'
                          ? (rating, reasonCodes) => saveMessageFeedback({
                              messageId: message.id,
                              feedbackId: message.metadata!.clientFeedbackId!,
                              completionState: message.metadata?.completionState ?? 'unknown',
                              responseChars: toPlainTextChat(message.content).length,
                              rating,
                              reasonCodes,
                            })
                          : undefined
                      }
                    />
                  ) : null}
                </ChatMessageGroup>
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
            </div>
          </div>
          {!isFollowing && messages.length > 0 ? (
            <ChatScrollToLatestButton
              label={messageActionsUi.jumpToLatest}
              onClick={() => resumeFollowing('smooth')}
            />
          ) : null}
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
            {isLoading ? (
              <button
                type="button"
                className="ui-send-button"
                onClick={stopRequest}
                aria-label={chatRuntimeUi.stopGenerating}
                title={chatRuntimeUi.stopGenerating}
              >
                <StopIcon className="mx-auto h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="ui-send-button"
                disabled={inputDisabled || inputText.trim() === ''}
                aria-label={ui.send}
                title={ui.send}
              >
                <PaperAirplaneIcon className="mx-auto h-5 w-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
