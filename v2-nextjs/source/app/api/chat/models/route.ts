import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { logApiError } from '@/lib/apiError';
import {
  getModelCatalog,
  getDefaultModelForProvider,
  toPsychologyLabel,
  type Provider,
} from '@/lib/aiModels';
import { readByokSessionFromRequest } from '@/lib/byokSession';

export async function GET(request: Request) {
  const requestId = randomUUID();

  try {
    const byokSession = readByokSessionFromRequest(request);

    const keyStatus: Record<Provider, boolean> = {
      openai: byokSession?.provider === 'openai',
    };

    const models = getModelCatalog().map((model) => ({
      ...model,
      byokAvailable: byokSession?.provider === model.provider,
      psychologyLabel: toPsychologyLabel(model.qualityLevel),
    }));
    const defaultModel = byokSession ? getDefaultModelForProvider(byokSession.provider) : null;

    const response = NextResponse.json({
      models,
      keyStatus,
      defaultProvider: byokSession?.provider ?? null,
      defaultModelId: defaultModel?.id ?? null,
    });
    response.headers.set('X-Request-Id', requestId);
    return response;
  } catch (error) {
    logApiError('chat_models_failed', requestId, error);
    return NextResponse.json(
      {
        models: getModelCatalog().map((model) => ({
          ...model,
          byokAvailable: false,
          psychologyLabel: toPsychologyLabel(model.qualityLevel),
        })),
        keyStatus: { openai: false },
        defaultProvider: null,
        defaultModelId: null,
      },
      { status: 200 },
    );
  }
}
