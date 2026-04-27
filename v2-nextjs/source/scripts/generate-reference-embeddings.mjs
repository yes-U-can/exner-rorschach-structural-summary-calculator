#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import OpenAI from 'openai';
import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import pg from 'pg';

import { loadProjectEnv } from './load-project-env.mjs';

const { Pool } = pg;

const ROOT = process.cwd();
const CHUNKS_PATH = path.join(ROOT, 'generated', 'reference-corpus', 'chunks.json');
const PROVIDERS = ['openai', 'google'];

function chunkArray(items, size) {
  const batchSize = Math.max(1, Math.floor(size));
  const batches = [];
  for (let index = 0; index < items.length; index += batchSize) {
    batches.push(items.slice(index, index + batchSize));
  }
  return batches;
}

function normalizeEmbedding(vector) {
  const values = Array.isArray(vector) ? vector.map((value) => Number(value)) : [];
  const length = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(length) || length <= 0) return values;
  return values.map((value) => value / length);
}

function toVectorLiteral(vector) {
  return `[${vector.join(',')}]`;
}

function resolveApiKey(provider) {
  if (provider === 'openai') {
    return (
      process.env.REFERENCE_EMBEDDING_OPENAI_API_KEY ??
      process.env.OPENAI_API_KEY ??
      null
    );
  }

  return (
    process.env.REFERENCE_EMBEDDING_GOOGLE_API_KEY ??
    process.env.GOOGLE_API_KEY ??
    null
  );
}

function buildEmbeddingText(chunk) {
  const headingPath = Array.isArray(chunk.headingPath) ? chunk.headingPath.join(' > ') : '';
  const aliases = Array.isArray(chunk.aliases) && chunk.aliases.length > 0 ? chunk.aliases.join(', ') : '';
  return [
    `[Route] ${chunk.canonicalRoute}`,
    headingPath ? `[Heading] ${headingPath}` : '',
    aliases ? `[Aliases] ${aliases}` : '',
    chunk.text,
  ]
    .filter(Boolean)
    .join('\n');
}

function getBatchSize(provider) {
  const raw =
    provider === 'openai'
      ? process.env.REFERENCE_EMBEDDING_BATCH_SIZE_OPENAI ?? '64'
      : process.env.REFERENCE_EMBEDDING_BATCH_SIZE_GOOGLE ?? '16';
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 16;
}

async function embedChunkBatch(provider, apiKey, chunks) {
  const texts = chunks.map((chunk) => buildEmbeddingText(chunk));
  if (provider === 'openai') {
    const model = process.env.REFERENCE_EMBEDDING_MODEL_OPENAI ?? 'text-embedding-3-large';
    const outputDimensions = Number(process.env.REFERENCE_EMBEDDING_DIMENSIONS_OPENAI ?? '0');
    const client = new OpenAI({ apiKey });
    const response = await client.embeddings.create({
      model,
      input: texts,
      ...(outputDimensions > 0 ? { dimensions: outputDimensions } : {}),
    });
    return {
      embeddingModel: model,
      vectors: response.data
        .slice()
        .sort((left, right) => left.index - right.index)
        .map((entry) => normalizeEmbedding(entry.embedding ?? [])),
    };
  }

  const modelName = process.env.REFERENCE_EMBEDDING_MODEL_GOOGLE ?? 'gemini-embedding-001';
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: modelName });
  const response = await model.batchEmbedContents({
    requests: texts.map((text) => ({
      content: { role: 'user', parts: [{ text }] },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    })),
  });
  return {
    embeddingModel: modelName,
    vectors: (response.embeddings ?? []).map((entry) => normalizeEmbedding(entry.values ?? [])),
  };
}

async function readChunks(targetLocales) {
  const raw = await fs.readFile(CHUNKS_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  const locales =
    Array.isArray(targetLocales) && targetLocales.length > 0
      ? targetLocales
      : parsed.locales;
  const chunks = locales.flatMap((locale) => parsed.chunksByLocale?.[locale] ?? []);
  return { locales, chunks };
}

async function upsertEmbeddingBatch(pool, provider, chunks, embeddingModel, vectors) {
  if (chunks.length !== vectors.length) {
    throw new Error(`Batch upsert received ${chunks.length} chunks but ${vectors.length} vectors.`);
  }

  const valuesSql = [];
  const parameters = [];

  chunks.forEach((chunk, index) => {
    const vector = vectors[index] ?? [];
    const offset = index * 8;
    valuesSql.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}::"EmbeddingProvider", $${offset + 6}, $${offset + 7}, $${offset + 8}::vector, NOW(), NOW())`,
    );
    parameters.push(
      randomUUID(),
      chunk.chunkId,
      chunk.canonicalRoute,
      chunk.locale,
      provider,
      embeddingModel,
      vector.length,
      toVectorLiteral(vector),
    );
  });

  await pool.query(
    `
      INSERT INTO "ReferenceChunkEmbedding" (
        "id",
        "chunkId",
        "canonicalRoute",
        "locale",
        "provider",
        "embeddingModel",
        "dimensions",
        "vector",
        "createdAt",
        "updatedAt"
      )
      VALUES ${valuesSql.join(',\n')}
      ON CONFLICT ("chunkId", "locale", "provider")
      DO UPDATE SET
        "canonicalRoute" = EXCLUDED."canonicalRoute",
        "locale" = EXCLUDED."locale",
        "embeddingModel" = EXCLUDED."embeddingModel",
        "dimensions" = EXCLUDED."dimensions",
        "vector" = EXCLUDED."vector",
        "updatedAt" = NOW()
    `,
    parameters,
  );
}

async function pruneProviderRows(pool, provider, locales, chunkIds) {
  if (chunkIds.length === 0) {
    await pool.query(`DELETE FROM "ReferenceChunkEmbedding" WHERE "provider" = $1::"EmbeddingProvider"`, [
      provider,
    ]);
    return;
  }

  await pool.query(
    `
      DELETE FROM "ReferenceChunkEmbedding"
      WHERE "provider" = $1::"EmbeddingProvider"
        AND "locale" = ANY($2::text[])
        AND NOT ("chunkId" = ANY($3::text[]))
    `,
    [provider, locales, chunkIds],
  );
}

async function main() {
  loadProjectEnv(ROOT);

  const provider = process.argv[2]?.trim().toLowerCase();
  const targetLocales = process.argv
    .slice(3)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!provider || !PROVIDERS.includes(provider)) {
    throw new Error('Usage: node scripts/generate-reference-embeddings.mjs <openai|google> [locale ...]');
  }

  const apiKey = resolveApiKey(provider);
  if (!apiKey) {
    throw new Error(`Missing API key for ${provider} embeddings. Set the provider key in your env files before running this script.`);
  }

  const writeDatabaseUrl = process.env.RAG_WRITE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!writeDatabaseUrl) {
    throw new Error('RAG_WRITE_DATABASE_URL is required to generate reference embeddings.');
  }

  const { locales, chunks } = await readChunks(targetLocales);
  if (chunks.length === 0) {
    const localeLabel = targetLocales.length > 0 ? ` for locales "${targetLocales.join(', ')}"` : '';
    throw new Error(`No reference chunks found${localeLabel}.`);
  }

  const pool = new Pool({ connectionString: writeDatabaseUrl });
  try {
    console.log(`[reference-embeddings] provider=${provider} locales=${locales.join(',')} chunks=${chunks.length}`);

    const batchSize = getBatchSize(provider);
    const batches = chunkArray(chunks, batchSize);
    let completed = 0;
    for (const batch of batches) {
      const { embeddingModel, vectors } = await embedChunkBatch(provider, apiKey, batch);
      if (vectors.length !== batch.length) {
        throw new Error(
          `Embedding provider returned ${vectors.length} vectors for a batch of ${batch.length} chunks (${provider}).`,
        );
      }

      for (let index = 0; index < batch.length; index += 1) {
        const vector = vectors[index] ?? [];
        if (vector.length === 0) {
          throw new Error(`Embedding provider returned an empty vector for chunk ${batch[index].chunkId}.`);
        }
      }

      await upsertEmbeddingBatch(pool, provider, batch, embeddingModel, vectors);
      completed += batch.length;

      if (completed === batch.length || completed % Math.max(batchSize, 25) === 0 || completed === chunks.length) {
        console.log(`[reference-embeddings] ${completed}/${chunks.length} chunks embedded`);
      }
    }

    await pruneProviderRows(
      pool,
      provider,
      locales,
      chunks.map((chunk) => chunk.chunkId),
    );

    console.log(`[reference-embeddings] completed provider=${provider} locales=${locales.join(',')}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[reference-embeddings] failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
