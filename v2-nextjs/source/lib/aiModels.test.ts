import { describe, expect, it } from 'vitest';
import {
  AI_MODEL_POLICY_ID,
  DEFAULT_PROVIDER_MODEL_IDS,
  FIXED_OPENAI_MODEL_ID,
  getDefaultModelForProvider,
  getModelCatalog,
} from './aiModels';

describe('AI model defaults', () => {
  it('uses GPT-5.5 as the single OpenAI default model', () => {
    const model = getDefaultModelForProvider('openai');

    expect(DEFAULT_PROVIDER_MODEL_IDS.openai).toBe('gpt-5.5');
    expect(FIXED_OPENAI_MODEL_ID).toBe('gpt-5.5');
    expect(AI_MODEL_POLICY_ID).toBe('openai-gpt-5.5-fixed-v1');
    expect(getModelCatalog().map((entry) => entry.id)).toEqual(['gpt-5.5']);
    expect(model.id).toBe('gpt-5.5');
    expect(model.label).toBe('GPT-5.5');
    expect(model.inputUsdPer1M).toBe(5);
    expect(model.outputUsdPer1M).toBe(30);
  });
});
