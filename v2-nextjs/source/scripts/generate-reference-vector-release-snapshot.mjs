#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

import pg from 'pg';

import { loadProjectEnv } from './load-project-env.mjs';

const { Pool } = pg;

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const CHUNKS_PATH = path.join(GENERATED_ROOT, 'chunks.json');
const OUTPUT_PATH = path.join(GENERATED_ROOT, 'vector-release-snapshot.json');
const PROVIDERS = ['openai'];

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function buildChunkCounts(chunksArtifact) {
  const counts = {};
  for (const locale of chunksArtifact.locales ?? []) {
    counts[locale] = (chunksArtifact.chunksByLocale?.[locale] ?? []).length;
  }
  return counts;
}

async function queryEmbeddingRows(pool, corpusGeneratedAtIso) {
  const result = await pool.query(
    `
      SELECT
        "provider"::text AS provider,
        "locale",
        COUNT(*)::int AS embedded_count,
        MIN("dimensions")::int AS min_dimensions,
        MAX("dimensions")::int AS max_dimensions,
        MAX("updatedAt") AS latest_refreshed_at,
        SUM(CASE WHEN "updatedAt" < $1::timestamp THEN 1 ELSE 0 END)::int AS stale_count
      FROM "ReferenceChunkEmbedding"
      GROUP BY "provider", "locale"
      ORDER BY "provider", "locale"
    `,
    [corpusGeneratedAtIso],
  );
  return result.rows;
}

async function queryProviderRows(pool) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON ("provider")
        "provider"::text AS provider,
        "embeddingModel",
        "dimensions",
        "updatedAt" AS latest_refreshed_at
      FROM "ReferenceChunkEmbedding"
      ORDER BY "provider", "updatedAt" DESC
    `,
  );
  return result.rows;
}

async function queryProviderTotals(pool) {
  const result = await pool.query(
    `
      SELECT
        "provider"::text AS provider,
        COUNT(*)::int AS total_embeddings
      FROM "ReferenceChunkEmbedding"
      GROUP BY "provider"
    `,
  );
  return result.rows;
}

async function main() {
  loadProjectEnv(ROOT);

  const readDatabaseUrl = process.env.RAG_DATABASE_URL ?? process.env.RAG_WRITE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!readDatabaseUrl) {
    throw new Error('RAG_DATABASE_URL is required to generate vector release snapshots.');
  }

  const chunksArtifact = await readJson(CHUNKS_PATH);
  const localeChunkCounts = buildChunkCounts(chunksArtifact);
  const corpusGeneratedAt = chunksArtifact.generatedAt ?? new Date().toISOString();

  const pool = new Pool({ connectionString: readDatabaseUrl });
  try {
    let embeddingRows = [];
    let providerRows = [];
    let totalRows = [];
    try {
      [embeddingRows, providerRows, totalRows] = await Promise.all([
        queryEmbeddingRows(pool, corpusGeneratedAt),
        queryProviderRows(pool),
        queryProviderTotals(pool),
      ]);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
        console.warn(
          '[reference-vector-release] ReferenceChunkEmbedding table is missing. Writing an empty runtime snapshot instead.',
        );
      } else {
        throw error;
      }
    }

    const providerInfo = new Map(providerRows.map((row) => [row.provider, row]));
    const providerTotals = new Map(totalRows.map((row) => [row.provider, row.total_embeddings]));
    const localeInfo = new Map(
      embeddingRows.map((row) => [`${row.provider}:${row.locale}`, row]),
    );

    const providerSnapshots = Object.fromEntries(
      PROVIDERS.map((provider) => {
        const providerRow = providerInfo.get(provider);
        const locales = Object.fromEntries(
          (chunksArtifact.locales ?? []).map((locale) => {
            const localeRow = localeInfo.get(`${provider}:${locale}`);
            const chunkCount = localeChunkCounts[locale] ?? 0;
            const embeddedChunkCount = Number(localeRow?.embedded_count ?? 0);
            const minDimensions = localeRow ? Number(localeRow.min_dimensions ?? 0) : 0;
            const maxDimensions = localeRow ? Number(localeRow.max_dimensions ?? 0) : 0;
            const dimensions = embeddedChunkCount > 0 && minDimensions === maxDimensions ? maxDimensions : null;
            const staleEmbeddingCount = Number(localeRow?.stale_count ?? 0);
            const ready =
              chunkCount > 0 &&
              embeddedChunkCount === chunkCount &&
              staleEmbeddingCount === 0 &&
              Number.isFinite(dimensions) &&
              dimensions !== null &&
              dimensions > 0;

            return [
              locale,
              {
                locale,
                chunkCount,
                embeddedChunkCount,
                dimensions,
                staleEmbeddingCount,
                ready,
                latestRefreshedAt: localeRow?.latest_refreshed_at
                  ? new Date(localeRow.latest_refreshed_at).toISOString()
                  : null,
              },
            ];
          }),
        );

        return [
          provider,
          {
            provider,
            embeddingModel: providerRow?.embeddingModel ?? null,
            dimensions: providerRow?.dimensions ?? null,
            totalEmbeddings: Number(providerTotals.get(provider) ?? 0),
            latestRefreshedAt: providerRow?.latest_refreshed_at
              ? new Date(providerRow.latest_refreshed_at).toISOString()
              : null,
            locales,
          },
        ];
      }),
    );

    const readyLocalesByProvider = Object.fromEntries(
      PROVIDERS.map((provider) => [
        provider,
        Object.values(providerSnapshots[provider].locales).filter((localeSnapshot) => localeSnapshot.ready).length,
      ]),
    );

    const snapshot = {
      generatedAt: new Date().toISOString(),
      providers: PROVIDERS,
      totals: {
        localeCount: chunksArtifact.locales.length,
        readyLocalesByProvider,
        allProvidersReady: PROVIDERS.every(
          (provider) => readyLocalesByProvider[provider] === chunksArtifact.locales.length,
        ),
      },
      providerSnapshots,
    };

    await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    console.log(`[reference-vector-release] wrote ${OUTPUT_PATH}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[reference-vector-release] failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
