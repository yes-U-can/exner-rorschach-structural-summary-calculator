import { OpenAI } from 'openai';
import type { Provider } from '@/lib/aiModels';

export type EmbeddingProvider = Extract<Provider, 'openai'>;

const OPENAI_EMBEDDING_MODEL =
  process.env.REFERENCE_EMBEDDING_MODEL_OPENAI ?? 'text-embedding-3-large';
const OPENAI_OUTPUT_DIMENSIONS = Number(process.env.REFERENCE_EMBEDDING_DIMENSIONS_OPENAI ?? '0');
export const REFERENCE_QUERY_EMBEDDING_TIMEOUT_MS = 30_000;
export const REFERENCE_QUERY_EMBEDDING_MAX_RETRIES = 1;

function normalizeEmbedding(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(magnitude) || magnitude === 0) {
    return values;
  }
  return values.map((value) => value / magnitude);
}

export function getReferenceEmbeddingModel(_provider: EmbeddingProvider): string {
  void _provider;
  return OPENAI_EMBEDDING_MODEL;
}

export async function embedReferenceQuery(params: {
  provider: EmbeddingProvider;
  apiKey: string;
  text: string;
  signal?: AbortSignal;
}): Promise<{ vector: number[]; model: string; dimensions: number }> {
  const text = params.text.trim();
  if (!text) {
    throw new Error('Embedding text cannot be empty.');
  }

  const client = new OpenAI({
    apiKey: params.apiKey,
    timeout: REFERENCE_QUERY_EMBEDDING_TIMEOUT_MS,
    maxRetries: REFERENCE_QUERY_EMBEDDING_MAX_RETRIES,
  });
  const response = await client.embeddings.create(
    {
      model: OPENAI_EMBEDDING_MODEL,
      input: text,
      ...(OPENAI_OUTPUT_DIMENSIONS > 0 ? { dimensions: OPENAI_OUTPUT_DIMENSIONS } : {}),
    },
    {
      signal: params.signal,
      timeout: REFERENCE_QUERY_EMBEDDING_TIMEOUT_MS,
      maxRetries: REFERENCE_QUERY_EMBEDDING_MAX_RETRIES,
    },
  );
  const vector = normalizeEmbedding(response.data[0]?.embedding ?? []);
  return {
    vector,
    model: response.model,
    dimensions: vector.length,
  };
}
