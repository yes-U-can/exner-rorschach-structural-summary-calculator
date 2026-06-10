import { describe, expect, it } from 'vitest';
import {
  BYOK_SESSION_MISSING_CODE,
  isByokSessionMissingError,
  readChatApiErrorPayload,
} from './chatApiErrors';

describe('chat API error handling', () => {
  it('opens the BYOK session dialog only for missing app sessions', () => {
    expect(
      isByokSessionMissingError(401, {
        code: BYOK_SESSION_MISSING_CODE,
        message: BYOK_SESSION_MISSING_CODE,
      }),
    ).toBe(true);

    expect(
      isByokSessionMissingError(401, {
        code: 'chat_provider_invalid_api_key',
        message: 'chat_provider_invalid_api_key',
      }),
    ).toBe(false);

    expect(
      isByokSessionMissingError(401, {
        code: null,
        message: 'Legacy API key not found response',
      }),
    ).toBe(true);
  });

  it('keeps structured provider error codes for friendly chat messages', async () => {
    const response = Response.json(
      {
        error: 'The API key was rejected by the AI provider.',
        code: 'chat_provider_invalid_api_key',
      },
      { status: 401 },
    );

    await expect(readChatApiErrorPayload(response, 'fallback')).resolves.toEqual({
      code: 'chat_provider_invalid_api_key',
      message: 'chat_provider_invalid_api_key',
    });
  });

  it('falls back to text responses when the server does not return JSON', async () => {
    const response = new Response('plain failure', { status: 502 });

    await expect(readChatApiErrorPayload(response, 'fallback')).resolves.toEqual({
      code: null,
      message: 'plain failure',
    });
  });
});
