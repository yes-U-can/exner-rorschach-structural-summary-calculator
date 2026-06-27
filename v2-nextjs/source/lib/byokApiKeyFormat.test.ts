import { describe, expect, it } from 'vitest';
import { getExpectedApiKeyPrefix, hasValidByokApiKeyFormat } from './byokApiKeyFormat';

describe('BYOK API key format checks', () => {
  it('accepts OpenAI API key prefixes', () => {
    expect(hasValidByokApiKeyFormat('openai', 'sk-proj-example-openai-key-1234567890')).toBe(true);
  });

  it('rejects Gemini key shapes', () => {
    expect(hasValidByokApiKeyFormat('openai', 'AQ.example-google-auth-key-1234567890')).toBe(false);
    expect(hasValidByokApiKeyFormat('openai', 'AIzaSyD-example-legacy-key-1234567890')).toBe(false);
  });

  it('rejects blank, short, or whitespace-containing keys', () => {
    expect(hasValidByokApiKeyFormat('openai', '')).toBe(false);
    expect(hasValidByokApiKeyFormat('openai', 'sk-short')).toBe(false);
    expect(hasValidByokApiKeyFormat('openai', 'sk-example key with space')).toBe(false);
  });

  it('describes the supported OpenAI prefix for the UI', () => {
    expect(getExpectedApiKeyPrefix('openai')).toBe('sk-');
  });
});
