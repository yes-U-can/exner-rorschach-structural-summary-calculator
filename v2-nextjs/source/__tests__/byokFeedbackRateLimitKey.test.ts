import { describe, expect, it, vi } from 'vitest';
import {
  createByokSession,
  decryptByokSession,
  encryptByokSession,
  getByokFeedbackRateLimitKey,
} from '@/lib/byokSession';

describe('BYOK feedback rate-limit identity', () => {
  it('uses a stable one-way session key without exposing the API key', () => {
    vi.stubEnv('BYOK_COOKIE_SECRET', 'local-test-secret-that-is-longer-than-32-characters');
    const apiKey = ['s', 'k', '-local-feedback-rate-key-never-sent'].join('');
    const session = createByokSession('openai', apiKey);

    const first = getByokFeedbackRateLimitKey(session);
    const second = getByokFeedbackRateLimitKey(session);

    expect(first).toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(first).not.toContain(apiKey);
    vi.unstubAllEnvs();
  });

  it('keeps the random session identifier inside the encrypted cookie', () => {
    vi.stubEnv('BYOK_COOKIE_SECRET', 'local-test-secret-that-is-longer-than-32-characters');
    const session = createByokSession('openai', ['s', 'k', '-local-cookie-test-never-sent'].join(''));
    const encrypted = encryptByokSession(session);
    const restored = decryptByokSession(encrypted);

    expect(encrypted).not.toContain(session.sessionId);
    expect(restored?.sessionId).toBe(session.sessionId);
    vi.unstubAllEnvs();
  });
});
