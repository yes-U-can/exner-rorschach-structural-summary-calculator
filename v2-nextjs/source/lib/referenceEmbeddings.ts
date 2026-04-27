import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import { OpenAI } from 'openai';
import type { Provider } from '@/lib/aiModels';

export type EmbeddingProvider = Extract<Provider, 'openai' | 'google'>;

const OPENAI_EMBEDDING_MODEL =
  process.env.REFERENCE_EMBEDDING_MODEL_OPENAI ?? 'text-embedding-3-large';
const GOOGLE_EMBEDDING_MODEL =
  process.env.REFERENCE_EMBEDDING_MODEL_GOOGLE ?? 'gemini-embedding-001';
const OPENAI_OUTPUT_DIMENSIONS = Number(process.env.REFERENCE_EMBEDDING_DIMENSIONS_OPENAI ?? '0');

function normalizeEmbedding(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(magnitude) || magnitude === 0) {
    return values;
  }
  return values.map((value) => value / magnitude);
}

export function getReferenceEmbeddingModel(provider: EmbeddingProvider): string {
  return provider === 'openai' ? OPENAI_EMBEDDING_MODEL : GOOGLE_EMBEDDING_MODEL;
}

export async function embedReferenceQuery(params: {
  provider: EmbeddingProvider;
  apiKey: string;
  text: string;
}): Promise<{ vector: number[]; model: string; dimensions: number }> {
  const text = params.text.trim();
  if (!text) {
    throw new Error('Embedding text cannot be empty.');
  }

  if (params.provider === 'openai') {
    const client = new OpenAI({ apiKey: params.apiKey });
    const response = await client.embeddings.create({
      model: OPENAI_EMBEDDING_MODEL,
      input: text,
      ...(OPENAI_OUTPUT_DIMENSIONS > 0 ? { dimensions: OPENAI_OUTPUT_DIMENSIONS } : {}),
    });
    const vector = normalizeEmbedding(response.data[0]?.embedding ?? []);
    return {
      vector,
      model: response.model,
      dimensions: vector.length,
    };
  }

  const genAI = new GoogleGenerativeAI(params.apiKey);
  const model = genAI.getGenerativeModel({ model: GOOGLE_EMBEDDING_MODEL });
  const response = await model.embedContent({
    content: {
      role: 'user',
      parts: [{ text }],
    },
    taskType: TaskType.RETRIEVAL_QUERY,
  });
  const vector = normalizeEmbedding(response.embedding.values ?? []);
  return {
    vector,
    model: GOOGLE_EMBEDDING_MODEL,
    dimensions: vector.length,
  };
}
