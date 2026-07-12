import { describe, expect, it } from 'vitest';
import {
  consumeChatEventStream,
  encodeChatStreamEvent,
  type ChatStreamEvent,
} from '@/lib/chatStreamProtocol';

function buildStream(events: ChatStreamEvent[], splitAt?: number) {
  const encoded = new TextEncoder().encode(
    events.map((event) => `${JSON.stringify(event)}\n`).join(''),
  );

  return new ReadableStream<Uint8Array>({
    start(controller) {
      if (splitAt && splitAt > 0 && splitAt < encoded.length) {
        controller.enqueue(encoded.slice(0, splitAt));
        controller.enqueue(encoded.slice(splitAt));
      } else {
        controller.enqueue(encoded);
      }
      controller.close();
    },
  });
}

describe('chat stream protocol', () => {
  it('preserves deltas split across arbitrary byte chunks and returns completion', async () => {
    const deltas: string[] = [];
    const terminal = await consumeChatEventStream(
      buildStream(
        [
          { type: 'delta', text: '첫 번째 ' },
          { type: 'delta', text: '답변' },
          { type: 'complete' },
        ],
        17,
      ),
      (delta) => deltas.push(delta),
    );

    expect(deltas.join('')).toBe('첫 번째 답변');
    expect(terminal).toEqual({ type: 'complete' });
  });

  it('returns explicit incomplete and provider error terminal events', async () => {
    await expect(
      consumeChatEventStream(
        buildStream([{ type: 'incomplete', reason: 'max_output_tokens' }]),
        () => {},
      ),
    ).resolves.toEqual({ type: 'incomplete', reason: 'max_output_tokens' });

    const errorEvent = { type: 'error', code: 'chat_provider_quota_or_billing', message: 'Quota problem.' } as const;
    expect(new TextDecoder().decode(encodeChatStreamEvent(errorEvent))).toContain('chat_provider_quota_or_billing');
    await expect(consumeChatEventStream(buildStream([errorEvent]), () => {})).resolves.toEqual(errorEvent);
  });

  it('rejects a silently truncated stream with no terminal event', async () => {
    await expect(
      consumeChatEventStream(buildStream([{ type: 'delta', text: 'partial answer' }]), () => {}),
    ).rejects.toThrow('without a terminal event');
  });
});
