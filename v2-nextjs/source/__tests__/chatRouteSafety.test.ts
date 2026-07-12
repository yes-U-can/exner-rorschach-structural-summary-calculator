import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/chat/route';
import {
  createByokSession,
  encryptByokSession,
  getByokCookieName,
} from '@/lib/byokSession';
import { CHAT_STREAM_PROTOCOL, consumeChatEventStream } from '@/lib/chatStreamProtocol';

function buildSafetyRequest(structured: boolean) {
  const localFormatOnlyKey = ['s', 'k', '-local-test-key-not-sent-to-provider'].join('');
  const session = createByokSession('openai', localFormatOnlyKey);
  const headers = new Headers({
    'Content-Type': 'application/json',
    Cookie: `${getByokCookieName()}=${encodeURIComponent(encryptByokSession(session))}`,
  });
  if (structured) {
    headers.set('X-Chat-Stream-Protocol', CHAT_STREAM_PROTOCOL);
  }

  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: '나는 죽고 싶고 지금 나를 해칠 것 같아요.',
      mode: 'interpretation',
      contextMessages: [],
      lang: 'ko',
    }),
  });
}

describe('chat route safety response', () => {
  it('delivers a localized safety intervention through the structured stream protocol', async () => {
    const response = await POST(buildSafetyRequest(true));
    const deltas: string[] = [];

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Chat-Safety-Intervention')).toBe('true');
    expect(response.headers.get('X-Chat-Stream-Protocol')).toBe(CHAT_STREAM_PROTOCOL);
    expect(response.body).not.toBeNull();

    const terminal = await consumeChatEventStream(response.body!, (delta) => deltas.push(delta));
    expect(terminal).toEqual({ type: 'complete' });
    expect(deltas.join('')).toContain('109');
    expect(deltas.join('')).not.toContain('1577-0199');
  });

  it('keeps plain-text compatibility for a previous browser deployment', async () => {
    const response = await POST(buildSafetyRequest(false));

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Chat-Stream-Protocol')).toBeNull();
    expect(response.headers.get('Content-Type')).toContain('text/plain');
    await expect(response.text()).resolves.toContain('109');
  });
});
