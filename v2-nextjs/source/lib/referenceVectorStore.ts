import { Pool } from 'pg';
import type { Language } from '@/types';
import type { EmbeddingProvider } from '@/lib/referenceEmbeddings';

type GlobalWithReferenceVectorPool = typeof globalThis & {
  __referenceVectorPool?: Pool;
};

export type ReferenceVectorHit = {
  chunkId: string;
  canonicalRoute: string;
  locale: Language;
  provider: EmbeddingProvider;
  similarity: number;
  embeddingModel: string;
  dimensions: number;
};

const globalForVectorPool = globalThis as GlobalWithReferenceVectorPool;

function getDatabaseUrl() {
  const databaseUrl = process.env.RAG_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('RAG_DATABASE_URL is not set');
  }
  return databaseUrl;
}

function getVectorPool(): Pool {
  if (!globalForVectorPool.__referenceVectorPool) {
    globalForVectorPool.__referenceVectorPool = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  return globalForVectorPool.__referenceVectorPool;
}

function toVectorLiteral(values: number[]): string {
  return `[${values.map((value) => Number(value.toFixed(8))).join(',')}]`;
}

export async function searchReferenceChunkEmbeddings(params: {
  locale: Language;
  provider: EmbeddingProvider;
  queryVector: number[];
  limit: number;
  routePrefix?: string;
}): Promise<ReferenceVectorHit[]> {
  const pool = getVectorPool();
  const vectorLiteral = toVectorLiteral(params.queryVector);
  const query = `
    SELECT
      "chunkId",
      "canonicalRoute",
      "locale",
      "provider",
      "embeddingModel",
      "dimensions",
      1 - ("vector" <=> $1::vector) AS similarity
    FROM "ReferenceChunkEmbedding"
    WHERE "locale" = $2
      AND "provider" = $3
      AND ($4::text IS NULL OR "canonicalRoute" LIKE $4)
    ORDER BY "vector" <=> $1::vector
    LIMIT $5
  `;
  const routePrefix = params.routePrefix ? `${params.routePrefix}%` : null;
  const result = await pool.query(query, [
    vectorLiteral,
    params.locale,
    params.provider,
    routePrefix,
    params.limit,
  ]);

  return result.rows.map((row) => ({
    chunkId: String(row.chunkId),
    canonicalRoute: String(row.canonicalRoute),
    locale: row.locale as Language,
    provider: row.provider as EmbeddingProvider,
    similarity: Number(row.similarity ?? 0),
    embeddingModel: String(row.embeddingModel),
    dimensions: Number(row.dimensions),
  }));
}
