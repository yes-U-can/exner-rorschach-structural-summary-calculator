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
};

const globalForAiFeedback = globalThis as GlobalWithAiFeedbackPool;
export const AI_FEEDBACK_RETENTION_DAYS = 180;

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
    });
  }
  return globalForAiFeedback.__aiFeedbackPool;
}

export function normalizeAiFeedbackCompletion(
  completion: AiMessageCompletionState,
): 'completed' | 'incomplete' | 'unknown' {
  if (completion === 'completed' || completion === 'incomplete') return completion;
  return 'unknown';
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
      WITH purge_expired AS (
        DELETE FROM "AiResponseFeedback"
        WHERE "expiresAt" <= CURRENT_TIMESTAMP
      )
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
}

export async function deleteAiResponseFeedback(feedbackKey: string) {
  await getAiFeedbackPool().query(
    `
      DELETE FROM "AiResponseFeedback"
      WHERE "feedbackKey" = $1
         OR "expiresAt" <= CURRENT_TIMESTAMP
    `,
    [feedbackKey],
  );
}

export async function disconnectAiFeedbackStore() {
  const pool = globalForAiFeedback.__aiFeedbackPool;
  if (!pool) return;
  globalForAiFeedback.__aiFeedbackPool = undefined;
  await pool.end();
}
