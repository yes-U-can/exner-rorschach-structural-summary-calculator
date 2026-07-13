#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';

import pg from 'pg';

const ROOT = process.cwd();
const databaseUrl = process.env.MIGRATION_REPLAY_DATABASE_URL?.trim();

if (process.env.ALLOW_FRESH_MIGRATION_REPLAY !== '1') {
  throw new Error('ALLOW_FRESH_MIGRATION_REPLAY=1 is required for this destructive test.');
}

if (!databaseUrl) {
  throw new Error('MIGRATION_REPLAY_DATABASE_URL is required.');
}

const parsedUrl = new URL(databaseUrl);
if (!['127.0.0.1', 'localhost', '::1'].includes(parsedUrl.hostname)) {
  throw new Error('Fresh migration replay is restricted to a loopback database host.');
}

const prismaCliPath = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
const migrationRoot = path.join(ROOT, 'prisma', 'migrations');
const expectedMigrationCount = readdirSync(migrationRoot, { withFileTypes: true }).filter((entry) =>
  entry.isDirectory(),
).length;
const childEnv = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  RAG_DATABASE_URL: databaseUrl,
  RAG_WRITE_DATABASE_URL: databaseUrl,
};

function runPrisma(...args) {
  const result = spawnSync(process.execPath, [prismaCliPath, ...args], {
    cwd: ROOT,
    env: childEnv,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`prisma ${args.join(' ')} failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

runPrisma('migrate', 'deploy');
runPrisma('migrate', 'status');

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();

try {
  const migrationResult = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM _prisma_migrations
    WHERE finished_at IS NOT NULL
      AND rolled_back_at IS NULL
  `);
  const providerResult = await client.query(`
    SELECT enumlabel
    FROM pg_enum
    JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
    WHERE pg_type.typname = 'EmbeddingProvider'
    ORDER BY enumsortorder
  `);
  const vectorResult = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM "ReferenceChunkEmbedding"
  `);
  const indexResult = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'ReferenceChunkEmbedding_chunkId_locale_provider_key'
  `);

  const actualMigrationCount = migrationResult.rows[0]?.count ?? 0;
  const providers = providerResult.rows.map((row) => row.enumlabel);
  const vectorRows = vectorResult.rows[0]?.count ?? -1;
  const uniqueIndexCount = indexResult.rows[0]?.count ?? 0;

  if (actualMigrationCount !== expectedMigrationCount) {
    throw new Error(
      `Expected ${expectedMigrationCount} applied migrations, found ${actualMigrationCount}.`,
    );
  }
  if (providers.length !== 1 || providers[0] !== 'openai') {
    throw new Error(`Expected OpenAI-only EmbeddingProvider enum, found: ${providers.join(', ')}`);
  }
  if (vectorRows !== 0) {
    throw new Error(`Expected an empty fresh embedding table, found ${vectorRows} rows.`);
  }
  if (uniqueIndexCount !== 1) {
    throw new Error('Expected the locale-aware embedding uniqueness index.');
  }

  const preparationMigration = '20260314141000_prepare_reference_chunk_embeddings';
  const preservationProbeId = 'migration-replay-preservation-probe';
  await client.query(
    `
      INSERT INTO "ReferenceChunkEmbedding" (
        "id", "chunkId", "canonicalRoute", "locale", "provider",
        "embeddingModel", "dimensions", "vector", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, 'en', 'openai', 'replay-probe', 1, '[0.1]'::vector, NOW(), NOW())
    `,
    [preservationProbeId, preservationProbeId, 'result-interpretation'],
  );
  await client.query('DELETE FROM _prisma_migrations WHERE migration_name = $1', [
    preparationMigration,
  ]);

  runPrisma('migrate', 'deploy');
  runPrisma('migrate', 'status');

  const preservationResult = await client.query(
    'SELECT COUNT(*)::int AS count FROM "ReferenceChunkEmbedding" WHERE "id" = $1',
    [preservationProbeId],
  );
  const preparationResult = await client.query(
    `
      SELECT COUNT(*)::int AS count
      FROM _prisma_migrations
      WHERE migration_name = $1
        AND finished_at IS NOT NULL
        AND rolled_back_at IS NULL
    `,
    [preparationMigration],
  );
  const preservedRows = preservationResult.rows[0]?.count ?? 0;
  const reappliedPreparationCount = preparationResult.rows[0]?.count ?? 0;

  if (preservedRows !== 1 || reappliedPreparationCount !== 1) {
    throw new Error('Late application of the preparation migration was not data-preserving.');
  }

  await client.query('DELETE FROM "ReferenceChunkEmbedding" WHERE "id" = $1', [
    preservationProbeId,
  ]);

  console.log(
    JSON.stringify({
      status: 'pass',
      migrations: actualMigrationCount,
      providers,
      vectorRows,
      localeAwareUniqueIndex: true,
      latePreparationReplayPreservedData: true,
    }),
  );
} finally {
  await client.end();
}
