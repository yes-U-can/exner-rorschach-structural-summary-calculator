import type { Provider } from '@/lib/aiModels';

const MIN_API_KEY_LENGTH = 20;

export function getExpectedApiKeyPrefix(_provider: Provider) {
  void _provider;
  return 'sk-';
}

export function hasValidByokApiKeyFormat(_provider: Provider, apiKey: string) {
  const trimmed = apiKey.trim();
  if (trimmed.length < MIN_API_KEY_LENGTH) return false;
  if (/\s/.test(trimmed)) return false;
  return trimmed.startsWith('sk-');
}
