import { beforeEach, describe, expect, it } from 'vitest';
import { consumeChatRateLimit, resetChatRateLimitForTests } from './chatRateLimit';

describe('chat rate limit', () => {
  beforeEach(() => resetChatRateLimitForTests());

  it('allows a normal request pace and blocks a burst after twelve requests', () => {
    const now = 1_000_000;
    for (let index = 0; index < 12; index += 1) {
      expect(consumeChatRateLimit('session-a', now).allowed).toBe(true);
    }

    expect(consumeChatRateLimit('session-a', now)).toEqual({
      allowed: false,
      retryAfterSeconds: 60,
    });
  });

  it('isolates sessions and releases the burst window after one minute', () => {
    const now = 2_000_000;
    for (let index = 0; index < 12; index += 1) {
      consumeChatRateLimit('session-a', now);
    }

    expect(consumeChatRateLimit('session-b', now).allowed).toBe(true);
    expect(consumeChatRateLimit('session-a', now + 60_000).allowed).toBe(true);
  });
});
