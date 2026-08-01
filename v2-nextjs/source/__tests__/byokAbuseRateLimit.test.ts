import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  consumeChatNetworkRateLimit,
  consumeChatRateLimit,
  resetChatRateLimitForTests,
} from '@/lib/chatRateLimit';
import {
  consumeByokSessionRateLimit,
  resetByokSessionRateLimitForTests,
} from '@/lib/byokSessionRateLimit';
import {
  createByokSession,
  decryptByokSession,
  encryptByokSession,
  getByokNetworkRateLimitKey,
  readByokSessionFromRequest,
} from '@/lib/byokSession';

const TEST_OPENAI_API_KEY = ['sk', 'local-format-only-test-key'].join('-');

describe('BYOK abuse boundaries', () => {
  beforeEach(() => {
    vi.stubEnv('BYOK_COOKIE_SECRET', 'local-test-secret-that-is-longer-than-32-characters');
    resetChatRateLimitForTests();
    resetByokSessionRateLimitForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('keeps a shared anonymous network limit across rotated session ids', () => {
    const request = new Request('https://example.test/api/chat', {
      headers: { 'x-vercel-forwarded-for': '203.0.113.10' },
    });
    const networkKey = getByokNetworkRateLimitKey(request, 'chat');

    for (let index = 0; index < 60; index += 1) {
      const session = createByokSession('openai', TEST_OPENAI_API_KEY);
      expect(consumeChatRateLimit(`session-${session.sessionId}`, 1_000).allowed).toBe(true);
      expect(consumeChatNetworkRateLimit(networkKey, 1_000).allowed).toBe(true);
    }

    expect(consumeChatNetworkRateLimit(networkKey, 1_000)).toMatchObject({ allowed: false });
  });

  it('limits repeated AI session issuance attempts per anonymous network key', () => {
    for (let index = 0; index < 10; index += 1) {
      expect(consumeByokSessionRateLimit('network-key', 1_000).allowed).toBe(true);
    }
    expect(consumeByokSessionRateLimit('network-key', 1_000)).toMatchObject({ allowed: false });
  });

  it('does not silently swallow a missing production cookie secret', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BYOK_COOKIE_SECRET', '');

    expect(() => decryptByokSession('v1.a.b.c')).toThrow(/BYOK_COOKIE_SECRET/);
    expect(() => readByokSessionFromRequest(new Request('https://example.test', {
      headers: { Cookie: '__Host-sicp-byok=v1.a.b.c' },
    }))).toThrow(/BYOK_COOKIE_SECRET/);
  });

  it('still treats malformed ciphertext as an invalid session with a valid secret', () => {
    const session = createByokSession('openai', TEST_OPENAI_API_KEY);
    const encrypted = encryptByokSession(session);

    expect(decryptByokSession(encrypted)).toMatchObject({ sessionId: session.sessionId });
    expect(decryptByokSession(`${encrypted}tampered`)).toBeNull();
  });
});
