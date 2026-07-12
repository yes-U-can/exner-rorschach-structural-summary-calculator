export type Provider = 'openai';

export const FIXED_OPENAI_MODEL_ID = 'gpt-5.5' as const;
export const AI_MODEL_POLICY_ID = 'openai-gpt-5.5-fixed-v1' as const;

export type ModelQualityLevel = 'basic' | 'standard' | 'advanced';
export type ModelPriceLevel = 'low' | 'medium' | 'high';
export type ModelSpeedLevel = 'fast' | 'balanced' | 'deep';

export type AIModelConfig = {
  id: string;
  provider: Provider;
  label: string;
  description: string;
  descriptionKo: string;
  contextWindowTokens?: number;
  qualityLevel: ModelQualityLevel;
  priceLevel: ModelPriceLevel;
  speedLevel: ModelSpeedLevel;
  inputUsdPer1M: number;
  outputUsdPer1M: number;
  maxOutputTokens: number;
  recommended: boolean;
};

export const DEFAULT_PROVIDER_MODEL_IDS: Record<Provider, string> = {
  openai: FIXED_OPENAI_MODEL_ID,
};

const MODEL_CATALOG: AIModelConfig[] = [
  {
    id: DEFAULT_PROVIDER_MODEL_IDS.openai,
    provider: 'openai',
    label: 'GPT-5.5',
    description: 'Newest frontier GPT model for complex professional reasoning and coding.',
    descriptionKo: '부호화와 전문적 추론에 맞춘 안정적인 고급 GPT 모델입니다.',
    contextWindowTokens: 1_050_000,
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'balanced',
    inputUsdPer1M: 5,
    outputUsdPer1M: 30,
    maxOutputTokens: 128000,
    recommended: true,
  },
];

export function getModelCatalog(): AIModelConfig[] {
  return MODEL_CATALOG;
}

export function getModelById(modelId: string): AIModelConfig | null {
  return MODEL_CATALOG.find((model) => model.id === modelId) ?? null;
}

export function getDefaultModelForProvider(provider: Provider): AIModelConfig {
  const modelId = DEFAULT_PROVIDER_MODEL_IDS[provider];
  const model = getModelById(modelId);
  if (!model) {
    throw new Error(`Default model config missing for provider: ${provider}`);
  }
  return model;
}

export function estimateTokens(text: string): number {
  const normalized = text.trim();
  if (!normalized) return 0;
  return Math.max(1, Math.ceil(normalized.length / 3.6));
}

export function toPsychologyLabel(level: ModelQualityLevel): string {
  if (level === 'advanced') return 'Clinical specialist level';
  if (level === 'standard') return 'Graduate trainee level';
  return 'Assistant summary level';
}
