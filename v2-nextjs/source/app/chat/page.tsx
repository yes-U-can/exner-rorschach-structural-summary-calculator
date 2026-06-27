'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { getCondensedSystemMessage } from '@/lib/chatMessageVisibility';
import { toPlainTextChat } from '@/lib/chatPlainText';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Language } from '@/types';
import { getChatPageUi, getChatRuntimeUi } from '@/lib/chatPageUi';
import { ChatBubble, ChatMessageRow, ChatMessageText, ChatSystemNotice } from '@/components/chat/ChatBubble';
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
import { validateStructuralSummaryCsv } from '@/lib/structuralSummaryCsv';

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
};

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

function ChatPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();
  const pageUi = getChatPageUi(language as Language);
  const chatUi = getChatRuntimeUi(language as Language);
  const draftCopied = searchParams.get('draft') === 'summary-copied';

  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-5.5');
  const [models, setModels] = useState<ModelOption[]>([]);
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
  const storageKey = useMemo(
    () => buildEphemeralChatStorageKey({
      userId: 'browser',
      mode: 'interpretation',
    }),
    [],
  );
  const summaryCsvStorageKey = storageKey ? `${storageKey}:structural-summary-csv` : null;

  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const requiredSessionPromptRef = useRef(false);
  useEffect(() => {
    setLoadedStorageKey(null);
    setStreamingMessages(readEphemeralChatMessages<Message>(storageKey));
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
      const available = allModels.filter((model) => model.provider === activeSession.provider);
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
    void loadChatModelState();
    return subscribeByokSessionChange(() => {
      void loadChatModelState();
    });
  }, [loadChatModelState]);

  const isModelStateLoaded = byokStatus !== null;
  const hasSelectableModel = Boolean(byokStatus?.active) && models.length > 0;
  const canUseChatInput = isModelStateLoaded && hasSelectableModel;

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

  useEffect(() => {
    if (!byokStatus?.provider || models.length === 0) return;
    const current = models.find((model) => model.id === modelId);
    const next = current ?? models.find((model) => model.provider === byokStatus.provider) ?? models[0];
    if (!next) return;

    if (next.id !== modelId) setModelId(next.id);
    if (provider !== byokStatus.provider) setProvider(byokStatus.provider);
  }, [byokStatus?.provider, modelId, models, provider]);

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

  const updateAutoScrollPreference = useCallback(() => {
    const scrollElement = messagesScrollRef.current;
    if (!scrollElement) return;
    const distanceFromBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 120;
  }, []);

  const lastMessageContent = streamingMessages[streamingMessages.length - 1]?.content ?? '';

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, [streamingMessages.length, lastMessageContent]);

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
      if (!hasSelectableModel) return;

      const userMessageContent = messageText.trim();
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: userMessageContent,
      };
      const newMessages = [...streamingMessages, userMessage];

      setStreamingMessages(newMessages);
      setInputText('');
      setSummaryCsvError(null);
      setSystemNotice(null);
      setIsLoading(true);
      setIsStreaming(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
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

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponseText = '';
        const aiMessageId = Date.now() + 1;

        setStreamingMessages((prev) => [
          ...prev,
          { id: aiMessageId, role: 'ai', content: '' },
        ]);

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            aiResponseText += decoder.decode(value, { stream: true });
            setStreamingMessages((prev) =>
              prev.map((message) =>
                message.id === aiMessageId ? { ...message, content: aiResponseText } : message,
              ),
            );
          }

          const tail = decoder.decode();
          if (tail) {
            aiResponseText += tail;
            setStreamingMessages((prev) =>
              prev.map((message) =>
                message.id === aiMessageId ? { ...message, content: aiResponseText } : message,
              ),
            );
          }
        } catch (streamError) {
          console.error('Stream interrupted:', streamError);
          if (aiResponseText) {
            setStreamingMessages((prev) =>
              prev.map((message) =>
                message.id === aiMessageId
                  ? { ...message, content: `${aiResponseText}\n\n${chatUi.streamInterrupted}` }
                  : message,
              ),
            );
          }
        }

      } catch (error) {
        console.error(error);
        setStreamingMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: 'ai',
            content: getFriendlyErrorMessage(error instanceof Error ? error.message : ''),
          },
        ]);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [
      chatUi.serverFallbackError,
      chatUi.streamInterrupted,
      draftCopied,
      getFriendlyErrorMessage,
      hasSelectableModel,
      isModelStateLoaded,
      isLoading,
      language,
      pageUi.summaryCsvInvalid,
      pageUi.summaryCsvRequired,
      streamingMessages,
      summaryCsvText,
    ],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(inputText);
  };

  const showConversation = streamingMessages.length > 0 || isStreaming;
  const greetingTitle = draftCopied ? pageUi.welcomeCopiedTitle : pageUi.welcomeTitle;
  const inputPlaceholder = streamingMessages.length === 0 ? pageUi.inputPlaceholder : '';
  const showMessageArea = showConversation || Boolean(systemNotice);
  const showInitialState = streamingMessages.length === 0 && !isStreaming && !systemNotice;
  const hasSummaryCsvValidationError = Boolean(summaryCsvError);
  const clearSummaryCsvInput = () => {
    setSummaryCsvText('');
    setSummaryCsvError(null);
    setSystemNotice(null);
  };
  const summaryCsvInput = (
    <input
      type="text"
      id="structural-summary-csv"
      value={summaryCsvText.trim() ? pageUi.summaryCsvReadyLabel : ''}
      onChange={(event) => {
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
        if ((event.key === 'Backspace' || event.key === 'Delete') && summaryCsvText.trim()) {
          event.preventDefault();
          clearSummaryCsvInput();
        }
      }}
      placeholder={pageUi.summaryCsvPlaceholder}
      disabled={!canUseChatInput || isLoading}
      spellCheck={false}
      className={`ui-summary-csv-inline-input ${hasSummaryCsvValidationError ? 'is-error' : ''}`}
      aria-label={pageUi.summaryCsvLabel}
      title={pageUi.summaryCsvLabel}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-page)]">
      <Header />
      <div className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="ui-chat-panel relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm">
          <main className="flex min-h-0 flex-1 flex-col">
            <div
              ref={messagesScrollRef}
              onScroll={updateAutoScrollPreference}
              className="flex-1 overflow-y-auto bg-gradient-to-b from-[var(--surface-muted)] to-[var(--surface-base)]"
            >
              {showMessageArea && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {streamingMessages.map((message) => {
                      const condensed = getCondensedSystemMessage(message.content);
                      if (condensed) {
                        return (
                          <ChatSystemNotice key={message.id}>{condensed}</ChatSystemNotice>
                        );
                      }

                      return (
                        <ChatMessageRow key={message.id} role={message.role}>
                          <ChatBubble role={message.role}>
                            <ChatMessageText>
                              {message.role === 'ai' ? toPlainTextChat(message.content) : message.content}
                            </ChatMessageText>
                          </ChatBubble>
                        </ChatMessageRow>
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
                    <div ref={messagesEndRef} />
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

            <div className="pb-safe rounded-b-2xl border-t border-[var(--border-subtle)] bg-[var(--surface-base)] p-3 md:p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {summaryCsvInput}
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
                <button
                  type="submit"
                  className="ui-send-button"
                  disabled={inputText.trim() === '' || isLoading || !canUseChatInput}
                >
                  <PaperAirplaneIcon className="mx-auto h-5 w-5" />
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
      <Footer />
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
