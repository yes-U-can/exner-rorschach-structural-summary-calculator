import { describe, expect, it } from 'vitest';
import { DEFAULT_PROVIDER_MODEL_IDS, getDefaultModelForProvider } from './aiModels';

describe('AI model defaults', () => {
  it('uses GPT-5.5 as the default OpenAI model for v2.0.2', () => {
    const model = getDefaultModelForProvider('openai');

    expect(DEFAULT_PROVIDER_MODEL_IDS.openai).toBe('gpt-5.5');
    expect(model.id).toBe('gpt-5.5');
    expect(model.label).toBe('GPT-5.5');
    expect(model.inputUsdPer1M).toBe(5);
    expect(model.outputUsdPer1M).toBe(30);
  });
});
