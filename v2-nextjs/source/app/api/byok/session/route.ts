import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { buildSafeApiErrorResponse, logApiError } from '@/lib/apiError';
import {
  clearByokSessionCookie,
  createByokSession,
  getByokNetworkRateLimitKey,
  normalizeByokApiKey,
  normalizeByokProvider,
  readByokSessionFromRequest,
  setByokSessionCookie,
  toByokSessionStatus,
} from '@/lib/byokSession';
import { consumeByokSessionRateLimit } from '@/lib/byokSessionRateLimit';
import { hasValidByokApiKeyFormat } from '@/lib/byokApiKeyFormat';
import { parseJsonWithSizeLimit } from '@/lib/requestBodyGuard';

const BYOK_BODY_POLICY = {
  maxBytes: 8 * 1024,
  publicMessage: 'API key request is too large.',
};

export function GET(request: Request) {
  const response = NextResponse.json(toByokSessionStatus(readByokSessionFromRequest(request)));
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function POST(request: Request) {
  const requestId = randomUUID();

  try {
    const rateLimit = consumeByokSessionRateLimit(
      getByokNetworkRateLimitKey(request, 'session'),
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many AI session attempts. Please wait and try again.',
          code: 'byok_session_rate_limited',
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': String(rateLimit.retryAfterSeconds),
            'X-Request-Id': requestId,
          },
        },
      );
    }

    const parsedBody = await parseJsonWithSizeLimit<{
      provider?: unknown;
      apiKey?: unknown;
    }>(request, BYOK_BODY_POLICY);
    if (!parsedBody.ok) {
      return parsedBody.response;
    }

    if (
      !parsedBody.value
      || typeof parsedBody.value !== 'object'
      || Array.isArray(parsedBody.value)
    ) {
      return NextResponse.json(
        {
          error: 'Invalid JSON request body.',
          code: 'invalid_byok_request',
        },
        { status: 400 },
      );
    }

    const provider = normalizeByokProvider(parsedBody.value.provider);
    const apiKey = normalizeByokApiKey(parsedBody.value.apiKey);
    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Enter a valid OpenAI API key.', code: 'invalid_byok_session' },
        { status: 400 },
      );
    }
    if (!hasValidByokApiKeyFormat(provider, apiKey)) {
      return NextResponse.json(
        {
          error: 'The selected provider does not match the API key format.',
          code: 'invalid_byok_api_key_format',
        },
        { status: 400 },
      );
    }

    const session = createByokSession(provider, apiKey);
    const response = NextResponse.json(toByokSessionStatus(session));
    setByokSessionCookie(response, session);
    response.headers.set('X-Request-Id', requestId);
    return response;
  } catch (error) {
    logApiError('byok_session_post_failed', requestId, error);
    return buildSafeApiErrorResponse({
      requestId,
      publicMessage: 'Failed to start the AI session.',
      status: 500,
      code: 'byok_session_post_failed',
    });
  }
}

export function DELETE() {
  const response = NextResponse.json(toByokSessionStatus(null));
  clearByokSessionCookie(response);
  return response;
}
