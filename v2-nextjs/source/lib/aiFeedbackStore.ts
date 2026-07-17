import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import type {
  AiFeedbackLengthBucket,
  AiFeedbackRating,
  AiFeedbackReasonCode,
  AiMessageCompletionState,
  ChatWorkflowMode,
  Language,
} from '@/types';
import { AI_FEEDBACK_REASON_SCHEMA_VERSION } from '@/lib/aiFeedbackReasons';

type GlobalWithAiFeedbackPool = typeof globalThis & {
  __aiFeedbackPool?: Pool;
  __aiFeedbackMaintenanceAfter?: number;
};

type RateLimitRow = {
  windowStartedAt: Date;
  windowCount: number;
  sessionCount: number;
  expiresAt: Date;
};

const globalForAiFeedback = globalThis as GlobalWithAiFeedbackPool;

export const AI_FEEDBACK_RETENTION_DAYS = 180;
export const AI_FEEDBACK_RATE_WINDOW_SECONDS = 60;
export const AI_FEEDBACK_RATE_WINDOW_LIMIT = 10;
export const AI_FEEDBACK_SESSION_WRITE_LIMIT = 60;

const AI_FEEDBACK_MAINTENANCE_INTERVAL_MS = 60 * 60 * 1000;
const AI_FEEDBACK_MAINTENANCE_BATCH_SIZE = 500;

function getAiFeedbackDatabaseUrl() {
  const databaseUrl = process.env.AI_FEEDBACK_DATABASE_URL;
  if (!databaseUrl) throw new Error('AI feedback database is not configured.');
  return databaseUrl;
}

function getAiFeedbackPool() {
  if (!globalForAiFeedback.__aiFeedbackPool) {
    globalForAiFeedback.__aiFeedbackPool = new Pool({
      connectionString: getAiFeedbackDatabaseUrl(),
      max: 3,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      query_timeout: 5_000,
      statement_timeout: 4_000,
      application_name: 'exner-ai-feedback',
    });
  }
  return globalForAiFeedback.__aiFeedbackPool;
}

async function runBoundedMaintenanceIfDue(pool: Pool) {
  const now = Date.now();
  if ((globalForAiFeedback.__aiFeedbackMaintenanceAfter ?? 0) > now) return;

  globalForAiFeedback.__aiFeedbackMaintenanceAfter = now + AI_FEEDBACK_MAINTENANCE_INTERVAL_MS;
  try {
    await pool.query(
      `
        WITH feedback_candidates AS (
          SELECT ctid
          FROM "AiResponseFeedback"
          WHERE "expiresAt" <= CURRENT_TIMESTAMP
          LIMIT $1
        ), deleted_feedback AS (
          DELETE FROM "AiResponseFeedback"
          WHERE ctid IN (SELECT ctid FROM feedback_candidates)
          RETURNING 1
        ), rate_limit_candidates AS (
          SELECT ctid
          FROM "AiFeedbackRateLimit"
          WHERE "expiresAt" <= CURRENT_TIMESTAMP
          LIMIT $1
        )
        DELETE FROM "AiFeedbackRateLimit"
        WHERE ctid IN (SELECT ctid FROM rate_limit_candidates)
      `,
      [AI_FEEDBACK_MAINTENANCE_BATCH_SIZE],
    );
  } catch {
    globalForAiFeedback.__aiFeedbackMaintenanceAfter = now + 60_000;
  }
}

export function normalizeAiFeedbackCompletion(
  completion: AiMessageCompletionState,
): 'completed' | 'incomplete' | 'unknown' {
  if (completion === 'completed' || completion === 'incomplete') return completion;
  return 'unknown';
}

export async function consumeAiFeedbackRateLimit(args: {
  sessionKey: string;
  sessionExpiresAt: number;
}) {
  const pool = getAiFeedbackPool();
  const result = await pool.query<RateLimitRow>(
    `
      INSERT INTO "AiFeedbackRateLimit" AS current_limit (
        "sessionKey", "windowStartedAt", "windowCount", "sessionCount",
        "expiresAt", "updatedAt"
      ) VALUES (
        $1, CURRENT_TIMESTAMP, 1, 1, $2, CURRENT_TIMESTAMP
      )
      ON CONFLICT ("sessionKey") DO UPDATE SET
        "windowStartedAt" = CASE
          WHEN current_limit."expiresAt" <= CURRENT_TIMESTAMP THEN CURRENT_TIMESTAMP
          WHEN current_limit."windowStartedAt" <= CURRENT_TIMESTAMP - ($3::int * INTERVAL '1 second')
            THEN CURRENT_TIMESTAMP
          ELSE current_limit."windowStartedAt"
        END,
        "windowCount" = CASE
          WHEN current_limit."expiresAt" <= CURRENT_TIMESTAMP THEN 1
          WHEN current_limit."windowStartedAt" <= CURRENT_TIMESTAMP - ($3::int * INTERVAL '1 second')
            THEN 1
          ELSE LEAST(current_limit."windowCount" + 1, $4::int + 1)
        END,
        "sessionCount" = CASE
          WHEN current_limit."expiresAt" <= CURRENT_TIMESTAMP THEN 1
          ELSE LEAST(current_limit."sessionCount" + 1, $5::int + 1)
        END,
        "expiresAt" = CASE
          WHEN current_limit."expiresAt" <= CURRENT_TIMESTAMP THEN EXCLUDED."expiresAt"
          ELSE GREATEST(current_limit."expiresAt", EXCLUDED."expiresAt")
        END,
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING "windowStartedAt", "windowCount", "sessionCount", "expiresAt"
    `,
    [
      args.sessionKey,
      new Date(args.sessionExpiresAt),
      AI_FEEDBACK_RATE_WINDOW_SECONDS,
      AI_FEEDBACK_RATE_WINDOW_LIMIT,
      AI_FEEDBACK_SESSION_WRITE_LIMIT,
    ],
  );

  const row = result.rows[0];
  if (!row) throw new Error('AI feedback rate limit state was not returned.');

  const windowExceeded = row.windowCount > AI_FEEDBACK_RATE_WINDOW_LIMIT;
  const sessionExceeded = row.sessionCount > AI_FEEDBACK_SESSION_WRITE_LIMIT;
  const allowed = !windowExceeded && !sessionExceeded;
  const resetAt = sessionExceeded
    ? new Date(row.expiresAt).getTime()
    : new Date(row.windowStartedAt).getTime() + AI_FEEDBACK_RATE_WINDOW_SECONDS * 1000;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  return {
    allowed,
    retryAfterSeconds,
    windowCount: row.windowCount,
    sessionCount: row.sessionCount,
  };
}

export async function saveAiResponseFeedback(args: {
  feedbackKey: string;
  rating: AiFeedbackRating;
  workflow: ChatWorkflowMode;
  locale: Language;
  modelId: string;
  harnessVersion: string;
  completion: AiMessageCompletionState;
  lengthBucket: AiFeedbackLengthBucket;
  reasonCodes: AiFeedbackReasonCode[];
}) {
  const pool = getAiFeedbackPool();
  await pool.query(
    `
      INSERT INTO "AiResponseFeedback" (
        "id", "feedbackKey", "rating", "workflow", "locale", "modelId",
        "harnessVersion", "completion", "lengthBucket", "reasonCodes",
        "reasonSchemaVersion", "updatedAt", "expiresAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '180 days'
      )
      ON CONFLICT ("feedbackKey") DO UPDATE SET
        "rating" = EXCLUDED."rating",
        "workflow" = EXCLUDED."workflow",
        "locale" = EXCLUDED."locale",
        "modelId" = EXCLUDED."modelId",
        "harnessVersion" = EXCLUDED."harnessVersion",
        "completion" = EXCLUDED."completion",
        "lengthBucket" = EXCLUDED."lengthBucket",
        "reasonCodes" = EXCLUDED."reasonCodes",
        "reasonSchemaVersion" = EXCLUDED."reasonSchemaVersion",
        "updatedAt" = CURRENT_TIMESTAMP,
        "expiresAt" = CURRENT_TIMESTAMP + INTERVAL '180 days'
    `,
    [
      randomUUID(),
      args.feedbackKey,
      args.rating,
      args.workflow,
      args.locale,
      args.modelId,
      args.harnessVersion,
      normalizeAiFeedbackCompletion(args.completion),
      args.lengthBucket,
      args.reasonCodes,
      AI_FEEDBACK_REASON_SCHEMA_VERSION,
    ],
  );
  await runBoundedMaintenanceIfDue(pool);
}

export async function deleteAiResponseFeedback(feedbackKey: string) {
  const pool = getAiFeedbackPool();
  await pool.query(
    `
      DELETE FROM "AiResponseFeedback"
      WHERE "feedbackKey" = $1
    `,
    [feedbackKey],
  );
  await runBoundedMaintenanceIfDue(pool);
}

export async function disconnectAiFeedbackStore() {
  const pool = globalForAiFeedback.__aiFeedbackPool;
  if (!pool) return;
  globalForAiFeedback.__aiFeedbackPool = undefined;
  globalForAiFeedback.__aiFeedbackMaintenanceAfter = undefined;
  await pool.end();
}
