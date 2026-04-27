import { NextResponse } from 'next/server';

type SafeApiErrorResponseArgs = {
  requestId: string;
  publicMessage: string;
  status: number;
  code?: string;
};

export function logApiError(
  label: string,
  requestId: string,
  error: unknown,
  context?: Record<string, unknown>,
) {
  if (context) {
    console.error(`[${label}] requestId=${requestId}`, context, error);
    return;
  }
  console.error(`[${label}] requestId=${requestId}`, error);
}

export function buildSafeApiErrorResponse(args: SafeApiErrorResponseArgs) {
  const body: Record<string, unknown> = {
    error: `${args.publicMessage} (Reference ID: ${args.requestId})`,
    requestId: args.requestId,
  };

  if (args.code) {
    body.code = args.code;
  }

  const response = NextResponse.json(body, { status: args.status });
  response.headers.set('X-Request-Id', args.requestId);
  return response;
}
