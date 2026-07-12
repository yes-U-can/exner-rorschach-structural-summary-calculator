import { describe, expect, it } from 'vitest';
import { MAX_CONTEXT_MESSAGE_CHARS, MAX_CONTEXT_TOTAL_CHARS } from '@/lib/chatEphemeralContext';
import { toEphemeralChatContext, type StoredEphemeralChatMessage } from '@/lib/ephemeralChatStorage';

describe('ephemeral chat storage context handoff', () => {
  it('uses the same bounded context contract as the server', () => {
    const messages: StoredEphemeralChatMessage[] = Array.from({ length: 24 }, (_, index) => ({
      id: index,
      role: index % 2 === 0 ? 'user' : 'ai',
      content: `${index}:${'x'.repeat(5000)}`,
    }));

    const context = toEphemeralChatContext(messages);
    const totalChars = context.reduce((sum, message) => sum + message.content.length, 0);

    expect(context.length).toBeLessThanOrEqual(12);
    expect(context.every((message) => message.content.length <= MAX_CONTEXT_MESSAGE_CHARS)).toBe(true);
    expect(totalChars).toBeLessThanOrEqual(MAX_CONTEXT_TOTAL_CHARS);
    expect(context.at(-1)?.content).toContain('23:');
  });
});
