import { describe, expect, it } from 'vitest';
import {
  shouldShowChatMessageActions,
  withClientFeedbackIds,
} from '@/lib/chatMessageActions';
import type { ChatMessageMetadata } from '@/types';

type TestChatMessage = {
  id: number;
  role: 'user' | 'ai';
  content: string;
  uiOnly?: boolean;
  metadata?: ChatMessageMetadata;
};

describe('chat message action visibility', () => {
  it('shows actions for both user messages and completed AI messages', () => {
    expect(shouldShowChatMessageActions({ content: 'user question' })).toBe(true);
    expect(shouldShowChatMessageActions({
      content: 'assistant answer',
      completionState: 'completed',
    })).toBe(true);
  });

  it('hides actions for blank, UI-only, and streaming messages', () => {
    expect(shouldShowChatMessageActions({ content: '   ' })).toBe(false);
    expect(shouldShowChatMessageActions({ content: 'system note', uiOnly: true })).toBe(false);
    expect(shouldShowChatMessageActions({
      content: 'partial answer',
      completionState: 'streaming',
    })).toBe(false);
  });
});

describe('feedback id recovery', () => {
  it('adds stable client ids only to feedback-eligible legacy AI messages', () => {
    let sequence = 0;
    const messages: TestChatMessage[] = [
      { id: 1, role: 'user' as const, content: 'question' },
      { id: 2, role: 'ai' as const, content: 'answer', metadata: { completionState: 'completed' as const } },
      { id: 3, role: 'ai' as const, content: 'partial', metadata: { completionState: 'streaming' as const } },
      { id: 4, role: 'ai' as const, content: 'error', metadata: { completionState: 'failed' as const } },
      { id: 5, role: 'ai' as const, content: 'notice', uiOnly: true },
    ];

    const result = withClientFeedbackIds(messages, {
      enabled: true,
      createId: () => `feedback-${++sequence}`,
    });

    expect(result[0].metadata?.clientFeedbackId).toBeUndefined();
    expect(result[1].metadata?.clientFeedbackId).toBe('feedback-1');
    expect(result[2].metadata?.clientFeedbackId).toBeUndefined();
    expect(result[3].metadata?.clientFeedbackId).toBeUndefined();
    expect(result[4].metadata?.clientFeedbackId).toBeUndefined();
  });

  it('preserves the original array when feedback is disabled', () => {
    const messages = [{ id: 1, role: 'ai' as const, content: 'answer' }];
    expect(withClientFeedbackIds(messages, {
      enabled: false,
      createId: () => 'unused',
    })).toBe(messages);
  });
});
