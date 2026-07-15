import type { AiMessageCompletionState, ChatMessageMetadata } from '@/types';

type ChatActionMessage = {
  role: 'ai' | 'user';
  content: string;
  uiOnly?: boolean;
  metadata?: ChatMessageMetadata;
};

export function shouldShowChatMessageActions(message: {
  content: string;
  uiOnly?: boolean;
  completionState?: AiMessageCompletionState;
}) {
  return Boolean(
    !message.uiOnly &&
    message.content.trim() &&
    message.completionState !== 'streaming',
  );
}

export function withClientFeedbackIds<T extends ChatActionMessage>(
  messages: T[],
  options: {
    enabled: boolean;
    createId: () => string;
  },
): T[] {
  if (!options.enabled) return messages;

  let changed = false;
  const nextMessages = messages.map((message) => {
    const completionState = message.metadata?.completionState;
    const needsFeedbackId =
      message.role === 'ai' &&
      !message.uiOnly &&
      Boolean(message.content.trim()) &&
      completionState !== 'streaming' &&
      completionState !== 'failed' &&
      !message.metadata?.clientFeedbackId;

    if (!needsFeedbackId) return message;
    changed = true;
    return {
      ...message,
      metadata: {
        ...message.metadata,
        clientFeedbackId: options.createId(),
      },
    } as T;
  });

  return changed ? nextMessages : messages;
}
