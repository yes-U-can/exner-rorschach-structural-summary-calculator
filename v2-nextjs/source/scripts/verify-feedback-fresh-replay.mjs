#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';

import pg from 'pg';

const ROOT = process.cwd();
const databaseUrl = process.env.FEEDBACK_MIGRATION_REPLAY_DATABASE_URL?.trim();

if (process.env.ALLOW_FRESH_FEEDBACK_MIGRATION_REPLAY !== '1') {
  throw new Error(
    'ALLOW_FRESH_FEEDBACK_MIGRATION_REPLAY=1 is required for this destructive test.',
  );
}

if (!databaseUrl) {
  throw new Error('FEEDBACK_MIGRATION_REPLAY_DATABASE_URL is required.');
}

const parsedUrl = new URL(databaseUrl);
if (!['127.0.0.1', 'localhost', '::1'].includes(parsedUrl.hostname)) {
  throw new Error('Fresh feedback migration replay is restricted to a loopback database host.');
}

const prismaCliPath = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
const configPath = path.join(ROOT, 'prisma.feedback.config.ts');
const migrationRoot = path.join(ROOT, 'prisma', 'feedback', 'migrations');
const expectedMigrationCount = readdirSync(migrationRoot, { withFileTypes: true }).filter(
  (entry) => entry.isDirectory(),
).length;
const childEnv = {
  ...process.env,
  AI_FEEDBACK_DATABASE_URL: databaseUrl,
};

function runPrisma(...args) {
  const result = spawnSync(
    process.execPath,
    [prismaCliPath, ...args, '--config', configPath],
    {
      cwd: ROOT,
      env: childEnv,
      stdio: 'inherit',
    },
  );

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
  const columnsResult = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'AiResponseFeedback'
    ORDER BY column_name
  `);
  const rateLimitColumnsResult = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'AiFeedbackRateLimit'
    ORDER BY column_name
  `);
  const ragTableResult = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'ReferenceChunkEmbedding'
  `);

  const actualMigrationCount = migrationResult.rows[0]?.count ?? 0;
  const columns = columnsResult.rows.map((row) => row.column_name);
  const rateLimitColumns = rateLimitColumnsResult.rows.map((row) => row.column_name);
  const expectedColumns = [
    'completion',
    'createdAt',
    'expiresAt',
    'feedbackKey',
    'harnessVersion',
    'id',
    'lengthBucket',
    'locale',
    'modelId',
    'rating',
    'reasonCodes',
    'reasonSchemaVersion',
    'updatedAt',
    'workflow',
  ].sort();
  const expectedRateLimitColumns = [
    'expiresAt',
    'sessionCount',
    'sessionKey',
    'updatedAt',
    'windowCount',
    'windowStartedAt',
  ].sort();

  if (actualMigrationCount !== expectedMigrationCount) {
    throw new Error(
      `Expected ${expectedMigrationCount} applied feedback migrations, found ${actualMigrationCount}.`,
    );
  }
  if (columns.join(',') !== expectedColumns.join(',')) {
    throw new Error(`Unexpected AI feedback columns: ${columns.join(', ')}`);
  }
  if (rateLimitColumns.join(',') !== expectedRateLimitColumns.join(',')) {
    throw new Error(`Unexpected AI feedback rate-limit columns: ${rateLimitColumns.join(', ')}`);
  }
  if ((ragTableResult.rows[0]?.count ?? -1) !== 0) {
    throw new Error('The dedicated feedback database must not contain the RAG vector table.');
  }

  const probeId = randomUUID();
  await client.query(
    `
      INSERT INTO "AiResponseFeedback" (
        "id", "feedbackKey", "rating", "workflow", "locale", "modelId",
        "harnessVersion", "completion", "lengthBucket", "updatedAt"
      ) VALUES ($1, $1, 'helpful', 'interpretation', 'ko', 'gpt-5.5',
        'migration-replay', 'completed', 'under_500', CURRENT_TIMESTAMP)
    `,
    [probeId],
  );
  const retentionResult = await client.query(
    `
      SELECT EXTRACT(EPOCH FROM ("expiresAt" - CURRENT_TIMESTAMP)) / 86400 AS days,
             "reasonCodes", "reasonSchemaVersion"
      FROM "AiResponseFeedback"
      WHERE "id" = $1
    `,
    [probeId],
  );
  const retentionDays = Number(retentionResult.rows[0]?.days ?? 0);
  if (retentionDays < 179 || retentionDays > 181) {
    throw new Error(`Expected an approximately 180-day feedback retention window, found ${retentionDays}.`);
  }
  if (retentionResult.rows[0]?.reasonCodes?.length !== 0) {
    throw new Error('Expected a new feedback row to default to an empty reason-code array.');
  }
  if (retentionResult.rows[0]?.reasonSchemaVersion !== 1) {
    throw new Error('Expected a new feedback row to use reason-schema version 1.');
  }

  const rateLimitProbeKey = `migration-replay-${randomUUID()}`;
  await client.query(
    `
      INSERT INTO "AiFeedbackRateLimit" (
        "sessionKey", "windowStartedAt", "windowCount", "sessionCount",
        "expiresAt", "updatedAt"
      ) VALUES (
        $1, CURRENT_TIMESTAMP, 1, 1,
        CURRENT_TIMESTAMP + INTERVAL '24 hours', CURRENT_TIMESTAMP
      )
    `,
    [rateLimitProbeKey],
  );
  const rateLimitResult = await client.query(
    `
      SELECT "windowCount", "sessionCount"
      FROM "AiFeedbackRateLimit"
      WHERE "sessionKey" = $1
    `,
    [rateLimitProbeKey],
  );
  if (rateLimitResult.rows[0]?.windowCount !== 1 || rateLimitResult.rows[0]?.sessionCount !== 1) {
    throw new Error('Expected the feedback session counter probe to be stored without user content.');
  }
  await client.query('DELETE FROM "AiResponseFeedback" WHERE "id" = $1', [probeId]);
  await client.query('DELETE FROM "AiFeedbackRateLimit" WHERE "sessionKey" = $1', [rateLimitProbeKey]);

  console.log(JSON.stringify({
    status: 'pass',
    migrations: actualMigrationCount,
    aggregateOnlyColumns: true,
    structuredReasonDefaults: true,
    sessionRateLimitTable: true,
    ragDatabaseBoundaryPreserved: true,
    retentionDays: 180,
  }));
} finally {
  await client.end();
}
