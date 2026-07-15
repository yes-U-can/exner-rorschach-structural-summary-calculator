'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/hooks/useTranslation';
import { useChatAutoScroll } from '@/hooks/useChatAutoScroll';
import { useChatRequestControl } from '@/hooks/useChatRequestControl';
import { getCondensedSystemMessage } from '@/lib/chatMessageVisibility';
import { toPlainTextChat } from '@/lib/chatPlainText';
import type {
  AiFeedbackRating,
  AiFeedbackReasonCode,
  ChatMessageMetadata,
  Language,
} from '@/types';
import { getChatPageUi, getChatRuntimeUi } from '@/lib/chatPageUi';
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
  ChatSystemNotice,
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
  subscribeByokSessionDialogClose,
  type ByokSessionStatus,
} from '@/lib/byokSessionClient';
import { isByokSessionMissingError, readChatApiErrorPayload } from '@/lib/chatApiErrors';
import { CHAT_STREAM_PROTOCOL, consumeChatEventStream } from '@/lib/chatStreamProtocol';
import { validateStructuralSummaryCsv } from '@/lib/structuralSummaryCsv';
import {
  AI_RESPONSE_FEEDBACK_ENABLED,
  createClientFeedbackId,
  submitAiResponseFeedback,
} from '@/lib/aiFeedbackClient';
import { FIXED_OPENAI_MODEL_ID } from '@/lib/aiModels';

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
  statusNotice?: string;
  metadata?: ChatMessageMetadata;
};

function ChatPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();
  const pageUi = getChatPageUi(language as Language);
  const chatUi = getChatRuntimeUi(language as Language);
  const messageActionsUi = getChatMessageActionsUi(language);
  const draftCopied = searchParams.get('draft') === 'summary-copied';

  const modelId = FIXED_OPENAI_MODEL_ID;
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessages, setStreamingMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const [loadedSummaryCsvStorageKey, setLoadedSummaryCsvStorageKey] = useState<string | null>(null);
  const [summaryCsvText, setSummaryCsvText] = useState('');
  const [summaryCsvError, setSummaryCsvError] = useState<string | null>(null);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);
  const [activePromptId, setActivePromptId] = useState<number | null>(null);
  const storageKey = useMemo(
    () => buildEphemeralChatStorageKey({
      userId: 'browser',
      mode: 'interpretation',
    }),
    [],
  );
  const summaryCsvStorageKey = storageKey ? `${storageKey}:structural-summary-csv` : null;

  const requiredSessionPromptRef = useRef(false);
  const summaryCsvInputRef = useRef<HTMLTextAreaElement | null>(null);
  const { beginRequest, finishRequest, stopRequest } = useChatRequestControl();
  const latestMessageContent = streamingMessages[streamingMessages.length - 1]?.content ?? '';
  const {
    scrollContainerRef,
    isFollowing,
    isAtBottom,
    pauseFollowing,
    resumeFollowing,
    scrollHandlers,
  } = useChatAutoScroll({
    messageCount: streamingMessages.length,
    latestContent: latestMessageContent,
  });
  useEffect(() => {
    setLoadedStorageKey(null);
    setStreamingMessages(withClientFeedbackIds(
      readEphemeralChatMessages<Message>(storageKey),
      {
        enabled: AI_RESPONSE_FEEDBACK_ENABLED,
        createId: createClientFeedbackId,
      },
    ));
    setLoadedStorageKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!summaryCsvStorageKey || typeof window === 'undefined') return;

    setLoadedSummaryCsvStorageKey(null);
    setSummaryCsvText(sessionStorage.getItem(summaryCsvStorageKey) ?? '');
    setSummaryCsvError(null);
    setSystemNotice(null);
    setLoadedSummaryCsvStorageKey(summaryCsvStorageKey);
  }, [summaryCsvStorageKey]);

  useEffect(() => {
    if (!storageKey || loadedStorageKey !== storageKey) return;
    writeEphemeralChatMessages(storageKey, streamingMessages);
  }, [loadedStorageKey, storageKey, streamingMessages]);

  useEffect(() => {
    if (
      !summaryCsvStorageKey ||
      loadedSummaryCsvStorageKey !== summaryCsvStorageKey ||
      typeof window === 'undefined'
    ) {
      return;
    }

    try {
      if (summaryCsvText.trim()) {
        sessionStorage.setItem(summaryCsvStorageKey, summaryCsvText);
      } else {
        sessionStorage.removeItem(summaryCsvStorageKey);
      }
    } catch {
      // If browser storage is unavailable, keep the value in memory for the current page only.
    }
  }, [loadedSummaryCsvStorageKey, summaryCsvStorageKey, summaryCsvText]);

  useEffect(() => {
    const handleClear = () => {
      setStreamingMessages([]);
      setSummaryCsvText('');
      setSummaryCsvError(null);
      setSystemNotice(null);
    };
    window.addEventListener(EPHEMERAL_CHAT_CLEAR_EVENT, handleClear);
    return () => window.removeEventListener(EPHEMERAL_CHAT_CLEAR_EVENT, handleClear);
  }, []);

  const refreshChatSessionState = useCallback(async () => {
    try {
      const activeSession = await fetchByokSessionStatus();
      setByokStatus(activeSession);
      if (!activeSession.active) {
        clearAllEphemeralChatStorage();
      }
    } catch {
      setByokStatus({
        active: false,
        provider: null,
        masked: null,
        expiresAt: null,
        ttlHours: 24,
      });
    }
  }, []);

  useEffect(() => {
    void refreshChatSessionState();
    return subscribeByokSessionChange(() => {
      void refreshChatSessionState();
    });
  }, [refreshChatSessionState]);

  const isModelStateLoaded = byokStatus !== null;
  const canUseChatInput = isModelStateLoaded && Boolean(
    byokStatus?.active && byokStatus.provider === 'openai',
  );

  useEffect(() => {
    return subscribeByokSessionDialogClose((detail) => {
      if (detail.required && detail.source === 'chat' && !detail.connected) {
        router.replace(`/?lang=${language}`);
      }
    });
  }, [language, router]);

  useEffect(() => {
    if (!isModelStateLoaded) return;
    if (byokStatus?.active) {
      requiredSessionPromptRef.current = false;
      return;
    }
    if (requiredSessionPromptRef.current) return;

    requiredSessionPromptRef.current = true;
    openByokSessionDialog({ required: true, source: 'chat' });
  }, [byokStatus?.active, isModelStateLoaded]);

  const getFriendlyErrorMessage = useCallback(
    (rawError: string) => {
      const message = rawError.toLowerCase();
      if (message.includes('invalid_structural_summary_csv')) {
        return pageUi.summaryCsvInvalid;
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
    },
    [pageUi.summaryCsvInvalid, t],
  );

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
      workflowType: 'interpretation',
      locale: language as Language,
      completionState: args.completionState,
      responseChars: args.responseChars,
      reasonCodes: args.reasonCodes,
    });
    setStreamingMessages((current) => current.map((message) => (
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

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (messageText.trim() === '' || isLoading || !isModelStateLoaded) return;
      const summaryValidation = validateStructuralSummaryCsv(summaryCsvText);
      if (!summaryValidation.ok) {
        const notice = summaryCsvText.trim() ? pageUi.summaryCsvInvalid : pageUi.summaryCsvRequired;
        setSummaryCsvError(notice);
        setSystemNotice(notice);
        return;
      }
      const activeSession = await fetchByokSessionStatus();
      if (!activeSession.active) {
        setByokStatus(activeSession);
        clearAllEphemeralChatStorage();
        openByokSessionDialog({ required: true, source: 'chat' });
        return;
      }
      const userMessageContent = messageText.trim();
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: userMessageContent,
      };
      const newMessages = [...streamingMessages, userMessage];

      resumeFollowing('auto');
      setStreamingMessages(newMessages);
      setInputText('');
      setSummaryCsvError(null);
      setSystemNotice(null);
      setIsLoading(true);
      setIsStreaming(true);
      const requestController = beginRequest();
      let aiMessageId: number | null = null;
      let aiResponseText = '';

      const updateAiMessage = (
        content: string,
        completionState?: ChatMessageMetadata['completionState'],
        statusNotice?: string,
      ) => {
        if (aiMessageId === null) return;
        setStreamingMessages((prev) =>
          prev.map((message) =>
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
              : message,
          ),
        );
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
            message: userMessageContent,
            contextMessages: toEphemeralChatContext(streamingMessages),
            mode: 'interpretation',
            workflowContext: {
              source: draftCopied ? 'calculation-result-copy' : 'chat-page',
              structuralSummaryCsv: summaryValidation.csv,
            },
            lang: language,
          }),
          signal: requestController.signal,
        });

        if (!response.ok) {
          const serverError = await readChatApiErrorPayload(response, chatUi.serverFallbackError);
          if (isByokSessionMissingError(response.status, serverError)) {
            clearAllEphemeralChatStorage();
            openByokSessionDialog({ required: true, source: 'chat' });
            return;
          }
          throw new Error(serverError.message);
        }

        if (!response.body) {
          throw new Error(chatUi.serverFallbackError);
        }

        const nextAiMessageId = Date.now() + 1;
        aiMessageId = nextAiMessageId;

        setStreamingMessages((prev) => [
          ...prev,
          {
            id: nextAiMessageId,
            role: 'ai',
            content: '',
            metadata: {
              workflowType: 'interpretation',
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
                ? chatUi.responseLengthReached
                : terminalEvent.reason === 'timeout'
                  ? chatUi.responseTimedOut
                  : chatUi.streamInterrupted;
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
            console.error('Stream interrupted:', streamError);
          }
          updateAiMessage(
            aiResponseText,
            requestController.signal.aborted ? 'incomplete' : 'failed',
            requestController.signal.aborted ? chatUi.responseStopped : chatUi.streamInterrupted,
          );
        }

      } catch (error) {
        if (requestController.signal.aborted) {
          if (aiMessageId === null) {
            setStreamingMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 2,
                role: 'ai',
                content: '',
                statusNotice: chatUi.responseStopped,
                metadata: {
                  workflowType: 'interpretation',
                  locale: language,
                  modelId,
                  completionState: 'incomplete',
                },
              },
            ]);
          } else {
            updateAiMessage(aiResponseText, 'incomplete', chatUi.responseStopped);
          }
          return;
        }
        console.error(error);
        setStreamingMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: 'ai',
            content: '',
            statusNotice: getFriendlyErrorMessage(error instanceof Error ? error.message : ''),
            metadata: {
              workflowType: 'interpretation',
              locale: language,
              modelId,
              completionState: 'failed',
            },
          },
        ]);
      } finally {
        finishRequest(requestController);
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [
      chatUi.serverFallbackError,
      chatUi.responseLengthReached,
      chatUi.responseStopped,
      chatUi.responseTimedOut,
      chatUi.streamInterrupted,
      beginRequest,
      draftCopied,
      finishRequest,
      getFriendlyErrorMessage,
      isModelStateLoaded,
      isLoading,
      language,
      modelId,
      pageUi.summaryCsvInvalid,
      pageUi.summaryCsvRequired,
      resumeFollowing,
      streamingMessages,
      summaryCsvText,
    ],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(inputText);
  };

  const showConversation = streamingMessages.length > 0 || isStreaming;
  const userPrompts = useMemo(
    () => streamingMessages.filter((message) => message.role === 'user' && message.content.trim()),
    [streamingMessages],
  );
  const userPromptIdsKey = userPrompts.map((message) => message.id).join(':');

  const updateActivePrompt = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const anchors = Array.from(
      container.querySelectorAll<HTMLElement>('[data-chat-prompt-id]'),
    );
    if (anchors.length === 0) {
      setActivePromptId(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const readingLine = containerRect.top + Math.min(container.clientHeight * 0.35, 220);
    let nextPromptId = Number(anchors[0].dataset.chatPromptId);

    for (const anchor of anchors) {
      if (anchor.getBoundingClientRect().top > readingLine) break;
      nextPromptId = Number(anchor.dataset.chatPromptId);
    }

    setActivePromptId((current) => (current === nextPromptId ? current : nextPromptId));
  }, [scrollContainerRef]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !userPromptIdsKey) {
      setActivePromptId(null);
      return;
    }

    let frameId: number | null = null;
    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActivePrompt();
      });
    };

    scheduleUpdate();
    container.addEventListener('scroll', scheduleUpdate, { passive: true });
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', scheduleUpdate);
      resizeObserver.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [scrollContainerRef, updateActivePrompt, userPromptIdsKey]);

  const scrollToPrompt = useCallback((messageId: number) => {
    pauseFollowing();
    setActivePromptId(messageId);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(`chat-prompt-${messageId}`)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [pauseFollowing]);

  const greetingTitle = draftCopied ? pageUi.welcomeCopiedTitle : pageUi.welcomeTitle;
  const inputPlaceholder = streamingMessages.length === 0 ? pageUi.inputPlaceholder : '';
  const showMessageArea = showConversation || Boolean(systemNotice);
  const showInitialState = streamingMessages.length === 0 && !isStreaming && !systemNotice;
  const hasSummaryCsvValidationError = Boolean(summaryCsvError);
  const hasSummaryCsv = Boolean(summaryCsvText.trim());
  const clearSummaryCsvInput = () => {
    setSummaryCsvText('');
    setSummaryCsvError(null);
    setSystemNotice(null);
  };
  const summaryCsvInput = (
    <div
      className={`ui-summary-csv-control ${hasSummaryCsv ? 'is-ready' : ''} ${hasSummaryCsvValidationError ? 'is-error' : ''} ${!canUseChatInput || isLoading ? 'is-disabled' : ''}`}
    >
      {hasSummaryCsv ? (
        <CheckCircleIcon className="ui-summary-csv-icon" aria-hidden="true" />
      ) : (
        <ClipboardDocumentIcon className="ui-summary-csv-icon" aria-hidden="true" />
      )}
      <span className="ui-summary-csv-label" aria-hidden="true">
        {hasSummaryCsv ? pageUi.summaryCsvReadyLabel : pageUi.summaryCsvPlaceholder}
      </span>
      <textarea
        ref={summaryCsvInputRef}
        id="structural-summary-csv"
        value=""
        rows={1}
        onChange={(event) => {
          if (!event.target.value) return;
          setSummaryCsvText(event.target.value);
          setSummaryCsvError(null);
          setSystemNotice(null);
        }}
        onPaste={(event) => {
          event.preventDefault();
          setSummaryCsvText(event.clipboardData.getData('text'));
          setSummaryCsvError(null);
          setSystemNotice(null);
        }}
        onKeyDown={(event) => {
          if ((event.key === 'Backspace' || event.key === 'Delete') && hasSummaryCsv) {
            event.preventDefault();
            clearSummaryCsvInput();
          }
        }}
        disabled={!canUseChatInput || isLoading}
        autoComplete="off"
        spellCheck={false}
        className="ui-summary-csv-paste-target"
        aria-label={`${pageUi.summaryCsvLabel}: ${hasSummaryCsv ? pageUi.summaryCsvReadyLabel : pageUi.summaryCsvPlaceholder}`}
        aria-invalid={hasSummaryCsvValidationError}
      />
      {hasSummaryCsv ? (
        <button
          type="button"
          className="ui-summary-csv-clear"
          onClick={() => {
            clearSummaryCsvInput();
            summaryCsvInputRef.current?.focus();
          }}
          disabled={!canUseChatInput || isLoading}
          aria-label={pageUi.clearSummaryCsv}
          title={pageUi.clearSummaryCsv}
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="ui-chat-page-layout bg-[var(--brand-page)]">
      <main className="ui-chat-workspace">
        <section className="ui-chat-primary">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            ref={scrollContainerRef}
            {...scrollHandlers}
            className="ui-chat-scroll h-full overflow-y-auto overscroll-contain [overflow-anchor:none]"
          >
              {showMessageArea && (
                <div className="ui-chat-conversation mx-auto w-full max-w-3xl px-4 pb-48 pt-6 sm:px-6 sm:pb-44 sm:pt-8 xl:pb-36">
                  <div className="space-y-4">
                    {streamingMessages.map((message) => {
                      const condensed = getCondensedSystemMessage(message.content);
                      if (condensed) {
                        return (
                          <ChatSystemNotice key={message.id}>{condensed}</ChatSystemNotice>
                        );
                      }

                      return (
                        <div
                          key={message.id}
                          id={message.role === 'user' ? `chat-prompt-${message.id}` : undefined}
                          data-chat-prompt-id={message.role === 'user' ? message.id : undefined}
                          className="ui-chat-message-anchor"
                        >
                          <ChatMessageRow role={message.role}>
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
                        </div>
                      );
                    })}
                    {systemNotice && (
                      <ChatSystemNotice>{systemNotice}</ChatSystemNotice>
                    )}
                    {isLoading && streamingMessages[streamingMessages.length - 1]?.role !== 'ai' && (
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
              )}
              {showInitialState && (
                <div className="flex h-full flex-1 items-center justify-center p-8">
                  <div className="w-full max-w-xl text-center">
                    <h2 className="whitespace-pre-line text-sm font-semibold leading-7 text-[var(--text-strong)] sm:text-base">{greetingTitle}</h2>
                    {draftCopied && (
                      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--text-soft)]">
                        {pageUi.copiedDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
          {!isFollowing && showConversation ? (
            <ChatScrollToLatestButton
              label={messageActionsUi.jumpToLatest}
              onClick={() => resumeFollowing('smooth')}
            />
          ) : null}
          {userPrompts.length > 1 ? (
            <nav className="ui-chat-prompt-rail" aria-label={pageUi.conversationOutline}>
              <ol className="ui-chat-prompt-rail-list">
                {userPrompts.map((message, index) => {
                  const isActive = activePromptId === message.id;
                  return (
                    <li key={message.id}>
                      <button
                        type="button"
                        className="ui-chat-prompt-rail-button"
                        onClick={() => scrollToPrompt(message.id)}
                        aria-label={`${pageUi.jumpToPrompt} ${index + 1}: ${message.content}`}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        <span className="ui-chat-prompt-rail-marker" aria-hidden="true" />
                        <span className="ui-chat-prompt-rail-preview" aria-hidden="true">
                          {message.content}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}
        </div>

        <div className="ui-chat-composer">
          <div className="ui-chat-composer-main">
            <div className="ui-chat-summary-slot">{summaryCsvInput}</div>
            <p
              className={`ui-chat-clinical-disclaimer ${isAtBottom ? 'is-visible' : ''}`}
              aria-hidden={!isAtBottom}
            >
              {pageUi.clinicalDisclaimer}
            </p>
            <form onSubmit={handleSubmit} className="ui-chat-composer-form flex w-full items-center gap-2 backdrop-blur-[32px] backdrop-saturate-[1.6]">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder={inputPlaceholder}
                  disabled={!canUseChatInput || isLoading}
                  className="ui-chat-input focus:ring-1"
                />
              </div>
              {isLoading ? (
                <button
                  type="button"
                  className="ui-send-button"
                  onClick={stopRequest}
                  aria-label={chatUi.stopGenerating}
                  title={chatUi.stopGenerating}
                >
                  <StopIcon className="mx-auto h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="ui-send-button"
                  disabled={inputText.trim() === '' || !canUseChatInput}
                  aria-label={pageUi.sendMessage}
                  title={pageUi.sendMessage}
                >
                  <PaperAirplaneIcon className="mx-auto h-5 w-5" />
                </button>
              )}
            </form>
          </div>
        </div>
        </section>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[var(--brand-page)]">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[var(--brand-700)] border-t-transparent"></div>
        </div>
      }
    >
      <ChatPageClient />
    </Suspense>
  );
}
