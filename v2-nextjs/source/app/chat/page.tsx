'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { getCondensedSystemMessage } from '@/lib/chatMessageVisibility';
import { toPlainTextChat } from '@/lib/chatPlainText';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { ChatMessageMetadata, Language } from '@/types';
import ChatCitationList from '@/components/chat/ChatCitationList';
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

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
  metadata?: ChatMessageMetadata;
};

type AttachedTextFile = {
  name: string;
  size: number;
  type: string;
  content: string;
};

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

function decodeHeaderJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

const MAX_CHAT_ATTACHMENT_BYTES = 48 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}

function isSupportedChatAttachment(file: File) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return (
    name.endsWith('.csv') ||
    name.endsWith('.txt') ||
    type === 'text/csv' ||
    type === 'text/plain'
  );
}

function buildMessageWithAttachment(messageText: string, attachment: AttachedTextFile | null) {
  const trimmed = messageText.trim();
  if (!attachment) return trimmed;

  const languageHint = attachment.name.toLowerCase().endsWith('.csv') ? 'csv' : 'text';
  return [
    trimmed,
    `[Attached file for interpretation context: ${attachment.name}, ${attachment.size} bytes]`,
    `\`\`\`${languageHint}`,
    attachment.content.trim(),
    '```',
  ].filter(Boolean).join('\n\n');
}

function getVisibleUserMessage(content: string) {
  return content.split('\n\n[Attached file for interpretation context:')[0]?.trim() || content;
}

function hasFilesInDragEvent(event: React.DragEvent<HTMLElement>) {
  return Array.from(event.dataTransfer.types).includes('Files');
}

function ChatPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();
  const pageUi = getChatPageUi(language as Language);
  const chatUi = getChatRuntimeUi(language as Language);
  const draftCopied = searchParams.get('draft') === 'summary-copied';

  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-5.4');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessages, setStreamingMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachedTextFile | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const storageKey = useMemo(
    () => buildEphemeralChatStorageKey({
      userId: 'browser',
      mode: 'interpretation',
    }),
    [],
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);
  const requiredSessionPromptRef = useRef(false);

  useEffect(() => {
    setLoadedStorageKey(null);
    setStreamingMessages(readEphemeralChatMessages<Message>(storageKey));
    setLoadedStorageKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || loadedStorageKey !== storageKey) return;
    writeEphemeralChatMessages(storageKey, streamingMessages);
  }, [loadedStorageKey, storageKey, streamingMessages]);

  useEffect(() => {
    const handleClear = () => setStreamingMessages([]);
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
    [t],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamingMessages]);

  const sendMessage = useCallback(
    async (messageText: string, fileForContext: AttachedTextFile | null) => {
      if (messageText.trim() === '' || isLoading || !isModelStateLoaded) return;
      const activeSession = await fetchByokSessionStatus();
      if (!activeSession.active) {
        setByokStatus(activeSession);
        clearAllEphemeralChatStorage();
        openByokSessionDialog({ required: true, source: 'chat' });
        return;
      }
      if (!hasSelectableModel) return;

      const userMessageContent = buildMessageWithAttachment(messageText, fileForContext);
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: userMessageContent,
        metadata: fileForContext
          ? {
              attachments: [{
                name: fileForContext.name,
                size: fileForContext.size,
                mimeType: fileForContext.type || 'text/plain',
              }],
            }
          : undefined,
      };
      const newMessages = [...streamingMessages, userMessage];

      setStreamingMessages(newMessages);
      setInputText('');
      setAttachedFile(null);
      setAttachmentError(null);
      setIsLoading(true);
      setIsStreaming(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessageContent,
            contextMessages: toEphemeralChatContext(streamingMessages),
            mode: 'interpretation',
            workflowContext: { source: draftCopied ? 'calculation-result-copy' : 'chat-page' },
            lang: language,
          }),
        });

        if (response.status === 401) {
          clearAllEphemeralChatStorage();
          openByokSessionDialog({ required: true, source: 'chat' });
          throw new Error('Unauthorized');
        }

        if (!response.ok || !response.body) {
          let serverError: string = chatUi.serverFallbackError;
          try {
            const data = await response.json();
            if (data?.code && typeof data.code === 'string') {
              serverError = data.code;
            } else if (data?.error && typeof data.error === 'string') {
              serverError = data.error;
            }
          } catch {
            try {
              const text = await response.text();
              if (text) serverError = text;
            } catch {
              // no-op
            }
          }
          throw new Error(serverError);
        }

        const citations = decodeHeaderJson<ChatMessageMetadata['citations']>(
          response.headers.get('X-Chat-Citations'),
        ) ?? [];
        const aiMetadata = citations.length > 0 ? { citations } : undefined;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponseText = '';
        const aiMessageId = Date.now() + 1;

        setStreamingMessages((prev) => [
          ...prev,
          { id: aiMessageId, role: 'ai', content: '', metadata: aiMetadata },
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
      streamingMessages,
    ],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(inputText, attachedFile);
  };

  const handleAttachFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setAttachmentError(null);

    if (!isSupportedChatAttachment(file)) {
      setAttachedFile(null);
      setAttachmentError(pageUi.attachmentUnsupported);
      return;
    }

    if (file.size > MAX_CHAT_ATTACHMENT_BYTES) {
      setAttachedFile(null);
      setAttachmentError(pageUi.attachmentTooLarge);
      return;
    }

    try {
      const content = await file.text();
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        content,
      });
    } catch {
      setAttachedFile(null);
      setAttachmentError(pageUi.attachmentReadFailed);
    }
  }, [pageUi.attachmentReadFailed, pageUi.attachmentTooLarge, pageUi.attachmentUnsupported]);

  const handleAttachFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    if (fileArray.length > 1) {
      setAttachedFile(null);
      setAttachmentError(pageUi.attachmentOneFileOnly);
      return;
    }
    await handleAttachFile(fileArray[0]);
  }, [handleAttachFile, pageUi.attachmentOneFileOnly]);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!canUseChatInput || !hasFilesInDragEvent(event)) return;
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingFile(true);
  }, [canUseChatInput]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!canUseChatInput || !hasFilesInDragEvent(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, [canUseChatInput]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!canUseChatInput || !hasFilesInDragEvent(event)) return;
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDraggingFile(false);
  }, [canUseChatInput]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!hasFilesInDragEvent(event)) return;
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDraggingFile(false);
    if (!canUseChatInput) return;
    void handleAttachFiles(event.dataTransfer.files);
  }, [canUseChatInput, handleAttachFiles]);

  const showConversation = streamingMessages.length > 0 || isStreaming;
  const showEmptyState = streamingMessages.length === 0 && !isStreaming;
  const greetingTitle = draftCopied ? pageUi.welcomeCopiedTitle : pageUi.welcomeTitle;
  const inputPlaceholder = pageUi.inputPlaceholder;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-page)]">
      <Header />
      <div className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="ui-chat-panel relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDraggingFile && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--brand-500)] bg-[var(--surface-base)]/85 p-6 text-center shadow-inner backdrop-blur-sm">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-5 py-4 text-sm font-semibold text-[var(--text-strong)] shadow-lg">
                {pageUi.attachmentDropHint}
              </div>
            </div>
          )}
          <main className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[var(--surface-muted)] to-[var(--surface-base)]">
              {showConversation && (
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
                              {message.role === 'ai' ? toPlainTextChat(message.content) : getVisibleUserMessage(message.content)}
                            </ChatMessageText>
                            {message.role === 'user' && (message.metadata?.attachments?.length ?? 0) > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {message.metadata?.attachments?.map((attachment) => (
                                  <span
                                    key={`${message.id}-${attachment.name}`}
                                    className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-soft)] ring-1 ring-[var(--border-subtle)]"
                                  >
                                    {pageUi.attachmentReady}: {attachment.name} ({formatBytes(attachment.size)})
                                  </span>
                                ))}
                              </div>
                            )}
                            {message.role === 'ai' &&
                              (message.metadata?.citations?.length ?? 0) > 0 && (
                                <ChatCitationList
                                  citations={message.metadata?.citations ?? []}
                                  language={language as Language}
                                  title={pageUi.citationTitle}
                                  openLabel={pageUi.citationOpen}
                                  className="mt-3 border-t border-[var(--border-subtle)] pt-3"
                                />
                              )}
                          </ChatBubble>
                        </ChatMessageRow>
                      );
                    })}
                    {isLoading && streamingMessages[streamingMessages.length - 1]?.role !== 'ai' && (
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
              )}
              {showEmptyState && (
                <div className="flex h-full flex-1 items-center justify-center p-8">
                  <div className="w-full max-w-xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-[var(--text-strong)] sm:text-lg">{greetingTitle}</h2>
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
              {(attachedFile || attachmentError) && (
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  {attachedFile && (
                    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 text-[var(--text-body)]">
                      <PaperClipIcon className="h-3.5 w-3.5 shrink-0 text-[var(--text-soft)]" />
                      <span className="truncate">
                        {pageUi.attachmentReady}: {attachedFile.name} ({formatBytes(attachedFile.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachedFile(null);
                          setAttachmentError(null);
                        }}
                        className="rounded-full p-0.5 text-[var(--text-soft)] transition hover:bg-[var(--surface-base)] hover:text-[var(--text-body)]"
                        aria-label={pageUi.removeAttachment}
                        title={pageUi.removeAttachment}
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  {attachmentError && (
                    <span className="text-[var(--danger-text)]">{attachmentError}</span>
                  )}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,text/csv,text/plain"
                  className="hidden"
                  onChange={(event) => {
                    void handleAttachFiles(event.target.files ?? []);
                    event.currentTarget.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canUseChatInput || isLoading}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-soft)] transition hover:border-[var(--brand-300)] hover:bg-[var(--brand-100)] hover:text-[var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={pageUi.attachFile}
                  title={pageUi.attachFile}
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder={inputPlaceholder}
                  disabled={!canUseChatInput || isLoading}
                  className="ui-chat-input focus:ring-1"
                />
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
