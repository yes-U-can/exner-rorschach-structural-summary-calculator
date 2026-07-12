import { describe, expect, it } from 'vitest';
import { classifyChatProviderError } from '@/lib/chatProviderErrors';

describe('chat provider error classification', () => {
  it.each([
    [{ status: 401, code: 'invalid_api_key' }, 'chat_provider_invalid_api_key', 401],
    [{ status: 429, code: 'insufficient_quota' }, 'chat_provider_quota_or_billing', 402],
    [{ status: 429, code: 'rate_limit_exceeded' }, 'chat_provider_rate_limited', 429],
    [{ name: 'APIConnectionTimeoutError', message: 'Request timed out.' }, 'chat_provider_timeout', 504],
    [{ name: 'AbortError', message: 'The operation was aborted.' }, 'chat_request_aborted', 499],
    [{ status: 404, code: 'model_not_found' }, 'chat_provider_model_unavailable', 502],
  ] as const)('classifies %o as %s', (error, expectedCode, expectedStatus) => {
    const result = classifyChatProviderError(error);

    expect(result.code).toBe(expectedCode);
    expect(result.status).toBe(expectedStatus);
    expect(result.publicMessage).toBeTruthy();
  });

  it('does not expose an unknown provider error message', () => {
    const result = classifyChatProviderError(new Error('private upstream detail'));

    expect(result.code).toBe('chat_provider_request_failed');
    expect(result.publicMessage).not.toContain('private upstream detail');
  });
});
