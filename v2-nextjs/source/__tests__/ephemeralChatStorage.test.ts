import { describe, expect, it } from 'vitest';
import { MAX_CONTEXT_MESSAGE_CHARS, MAX_CONTEXT_TOTAL_CHARS } from '@/lib/chatEphemeralContext';
import {
  stripLegacyStreamStatus,
  toEphemeralChatContext,
  type StoredEphemeralChatMessage,
} from '@/lib/ephemeralChatStorage';

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

  it('keeps legacy UI-only interruption labels out of future model context', () => {
    const partial = '여기까지는 실제 AI 응답입니다.';
    expect(stripLegacyStreamStatus(`${partial}\n\n[응답 스트림이 중단되었습니다]`)).toBe(partial);

    const context = toEphemeralChatContext([
      { id: 1, role: 'user', content: '계속 설명해줘.' },
      { id: 2, role: 'ai', content: `${partial}\n\n[응답 스트림이 중단되었습니다]` },
    ]);
    expect(context.at(-1)?.content).toBe(partial);
  });

  it('excludes status-only failure notices from future model context', () => {
    const context = toEphemeralChatContext([
      { id: 1, role: 'user', content: '설명해줘.' },
      {
        id: 2,
        role: 'ai',
        content: '',
        statusNotice: '[응답 스트림이 중단되었습니다]',
        metadata: { completionState: 'failed' },
      },
    ]);
    expect(context).toEqual([{ role: 'user', content: '설명해줘.' }]);
  });
});
