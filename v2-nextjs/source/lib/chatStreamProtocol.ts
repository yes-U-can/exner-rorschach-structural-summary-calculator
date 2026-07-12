export const CHAT_STREAM_PROTOCOL = 'ndjson-v1';
export const CHAT_STREAM_CONTENT_TYPE = 'application/x-ndjson; charset=utf-8';

export type ChatStreamDeltaEvent = {
  type: 'delta';
  text: string;
};

export type ChatStreamTerminalEvent =
  | { type: 'complete' }
  | { type: 'incomplete'; reason?: string }
  | { type: 'error'; code: string; message: string };

export type ChatStreamEvent = ChatStreamDeltaEvent | ChatStreamTerminalEvent;

function parseChatStreamEvent(line: string): ChatStreamEvent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    throw new Error('Chat stream contained invalid JSON.');
  }

  if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
    throw new Error('Chat stream event is missing a type.');
  }

  const event = parsed as Record<string, unknown>;
  if (event.type === 'delta' && typeof event.text === 'string') {
    return { type: 'delta', text: event.text };
  }
  if (event.type === 'complete') {
    return { type: 'complete' };
  }
  if (event.type === 'incomplete') {
    return {
      type: 'incomplete',
      ...(typeof event.reason === 'string' && event.reason ? { reason: event.reason } : {}),
    };
  }
  if (
    event.type === 'error' &&
    typeof event.code === 'string' &&
    typeof event.message === 'string'
  ) {
    return { type: 'error', code: event.code, message: event.message };
  }

  throw new Error('Chat stream contained an unsupported event.');
}

export function encodeChatStreamEvent(event: ChatStreamEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

class ChatStreamEventParser {
  private buffer = '';

  push(text: string): ChatStreamEvent[] {
    this.buffer += text;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';
    return lines.filter((line) => line.trim()).map(parseChatStreamEvent);
  }

  finish(): ChatStreamEvent[] {
    const tail = this.buffer.trim();
    this.buffer = '';
    return tail ? [parseChatStreamEvent(tail)] : [];
  }
}

export async function consumeChatEventStream(
  stream: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void,
): Promise<ChatStreamTerminalEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const parser = new ChatStreamEventParser();
  let terminalEvent: ChatStreamTerminalEvent | null = null;

  const consumeEvents = (events: ChatStreamEvent[]) => {
    for (const event of events) {
      if (terminalEvent) {
        throw new Error('Chat stream continued after its terminal event.');
      }
      if (event.type === 'delta') {
        onDelta(event.text);
      } else {
        terminalEvent = event;
      }
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      consumeEvents(parser.push(decoder.decode(value, { stream: true })));
    }

    consumeEvents(parser.push(decoder.decode()));
    consumeEvents(parser.finish());
  } finally {
    reader.releaseLock();
  }

  if (!terminalEvent) {
    throw new Error('Chat stream ended without a terminal event.');
  }

  return terminalEvent;
}
