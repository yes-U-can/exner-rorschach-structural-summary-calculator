export type ChatProviderFailure = {
  code: string;
  publicMessage: string;
  status: number;
};

export function classifyChatProviderError(error: unknown): ChatProviderFailure {
  const candidate = error as {
    name?: string;
    status?: number;
    code?: string;
    type?: string;
    message?: string;
    error?: { code?: string; type?: string; message?: string };
  };
  const status = Number(candidate?.status ?? 0);
  const name = String(candidate?.name ?? '').toLowerCase();
  const code = String(candidate?.code ?? candidate?.error?.code ?? '').toLowerCase();
  const type = String(candidate?.type ?? candidate?.error?.type ?? '').toLowerCase();
  const message = String(candidate?.message ?? candidate?.error?.message ?? '').toLowerCase();
  const haystack = [name, code, type, message].join(' ');

  if (status === 401 || haystack.includes('invalid_api_key') || haystack.includes('api key')) {
    return {
      code: 'chat_provider_invalid_api_key',
      publicMessage: 'The API key was rejected by the AI provider.',
      status: 401,
    };
  }

  if (
    status === 402 ||
    haystack.includes('insufficient_quota') ||
    haystack.includes('billing') ||
    haystack.includes('payment')
  ) {
    return {
      code: 'chat_provider_quota_or_billing',
      publicMessage: 'The AI provider reported a billing or quota problem.',
      status: 402,
    };
  }

  if (
    status === 429 ||
    haystack.includes('rate_limit') ||
    haystack.includes('rate limit') ||
    haystack.includes('too many requests')
  ) {
    return {
      code: 'chat_provider_rate_limited',
      publicMessage: 'The AI provider is temporarily rate limited. Please try again shortly.',
      status: 429,
    };
  }

  if (
    status === 408 ||
    status === 504 ||
    haystack.includes('timeout') ||
    haystack.includes('timed out')
  ) {
    return {
      code: 'chat_provider_timeout',
      publicMessage: 'The AI provider took too long to respond. Please try again.',
      status: 504,
    };
  }

  if (name === 'aborterror' || haystack.includes('request aborted')) {
    return {
      code: 'chat_request_aborted',
      publicMessage: 'The AI request was canceled before it completed.',
      status: 499,
    };
  }

  if (
    status === 404 ||
    haystack.includes('model_not_found') ||
    (haystack.includes('model') && (
      haystack.includes('does not exist') ||
      haystack.includes('not found') ||
      haystack.includes('not available') ||
      haystack.includes('not supported') ||
      haystack.includes('access')
    ))
  ) {
    return {
      code: 'chat_provider_model_unavailable',
      publicMessage: 'The selected AI model is not available for this API key.',
      status: 502,
    };
  }

  return {
    code: 'chat_provider_request_failed',
    publicMessage: 'AI provider rejected the request. Check your API key access or model availability.',
    status: 502,
  };
}
