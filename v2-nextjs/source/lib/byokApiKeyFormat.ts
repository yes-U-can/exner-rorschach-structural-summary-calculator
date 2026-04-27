import type { Provider } from '@/lib/aiModels';

const MIN_API_KEY_LENGTH = 20;

export function getExpectedApiKeyPrefix(provider: Provider) {
  return provider === 'openai' ? 'sk-' : 'AIza';
}

export function hasValidByokApiKeyFormat(provider: Provider, apiKey: string) {
  const trimmed = apiKey.trim();
  if (trimmed.length < MIN_API_KEY_LENGTH) return false;
  if (/\s/.test(trimmed)) return false;
  return trimmed.startsWith(getExpectedApiKeyPrefix(provider));
}
