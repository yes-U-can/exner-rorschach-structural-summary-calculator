export type Provider = 'openai' | 'google';

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
  openai: 'gpt-5.4',
  google: 'gemini-2.5-pro',
};

const MODEL_CATALOG: AIModelConfig[] = [
  {
    id: DEFAULT_PROVIDER_MODEL_IDS.openai,
    provider: 'openai',
    label: 'GPT-5.4',
    description: 'Stable high-end GPT model for coding and professional reasoning.',
    descriptionKo: '부호화와 전문적 추론에 맞춘 안정적인 고급 GPT 모델입니다.',
    contextWindowTokens: 1_000_000,
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'balanced',
    inputUsdPer1M: 2.5,
    outputUsdPer1M: 15,
    maxOutputTokens: 4096,
    recommended: true,
  },
  {
    id: DEFAULT_PROVIDER_MODEL_IDS.google,
    provider: 'google',
    label: 'Gemini 2.5 Pro',
    description: 'Stable Gemini model for deep reasoning, coding, and long-context work.',
    descriptionKo: '깊은 추론, 부호화 보조, 긴 문맥 처리에 맞춘 안정적인 Gemini 모델입니다.',
    contextWindowTokens: 1_048_576,
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'deep',
    inputUsdPer1M: 1.25,
    outputUsdPer1M: 10,
    maxOutputTokens: 4096,
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
