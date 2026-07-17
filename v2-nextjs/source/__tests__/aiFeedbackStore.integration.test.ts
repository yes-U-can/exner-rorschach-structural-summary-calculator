import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  AI_FEEDBACK_RATE_WINDOW_LIMIT,
  consumeAiFeedbackRateLimit,
  deleteAiResponseFeedback,
  disconnectAiFeedbackStore,
  saveAiResponseFeedback,
} from '@/lib/aiFeedbackStore';

const databaseUrl = process.env.AI_FEEDBACK_INTEGRATION_DATABASE_URL?.trim();
const shouldRun = Boolean(databaseUrl);
let client: pg.Client;

describe.runIf(shouldRun)('AI feedback store PostgreSQL integration', () => {
  beforeAll(async () => {
    process.env.AI_FEEDBACK_DATABASE_URL = databaseUrl!;
    client = new pg.Client({ connectionString: databaseUrl! });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    await disconnectAiFeedbackStore();
    delete process.env.AI_FEEDBACK_DATABASE_URL;
  });

  it('saves, updates, deletes, and purges content-free feedback rows', async () => {
    const feedbackKey = randomUUID();
    const expiredKey = randomUUID();
    await client.query(
      `
        INSERT INTO "AiResponseFeedback" (
          "id", "feedbackKey", "rating", "workflow", "locale", "modelId",
          "harnessVersion", "completion", "lengthBucket", "updatedAt", "expiresAt"
        ) VALUES (
          $1, $1, 'helpful', 'interpretation', 'ko', 'gpt-5.5',
          'integration-probe', 'completed', 'under_500', CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP - INTERVAL '1 day'
        )
      `,
      [expiredKey],
    );

    await saveAiResponseFeedback({
      feedbackKey,
      rating: 'helpful',
      workflow: 'interpretation',
      locale: 'ko',
      modelId: 'gpt-5.5',
      harnessVersion: 'integration-probe',
      completion: 'completed',
      lengthBucket: 'from_1500_to_2999',
      reasonCodes: ['accurate', 'well_grounded'],
    });

    const inserted = await client.query(
      `
        SELECT "rating"::text, "workflow"::text, "completion"::text, "lengthBucket"::text,
               "reasonCodes", "reasonSchemaVersion"
        FROM "AiResponseFeedback"
        WHERE "feedbackKey" = $1
      `,
      [feedbackKey],
    );
    expect(inserted.rows).toEqual([{
      rating: 'helpful',
      workflow: 'interpretation',
      completion: 'completed',
      lengthBucket: 'from_1500_to_2999',
      reasonCodes: ['accurate', 'well_grounded'],
      reasonSchemaVersion: 1,
    }]);

    const expired = await client.query(
      'SELECT COUNT(*)::int AS count FROM "AiResponseFeedback" WHERE "feedbackKey" = $1',
      [expiredKey],
    );
    expect(expired.rows[0]?.count).toBe(0);

    await saveAiResponseFeedback({
      feedbackKey,
      rating: 'unhelpful',
      workflow: 'coding_assist',
      locale: 'en',
      modelId: 'gpt-5.5',
      harnessVersion: 'integration-probe-v2',
      completion: 'incomplete',
      lengthBucket: 'over_6000',
      reasonCodes: ['incomplete', 'too_long'],
    });
    const updated = await client.query(
      `
        SELECT "rating"::text, "workflow"::text, "completion"::text, "lengthBucket"::text,
               "reasonCodes", "reasonSchemaVersion"
        FROM "AiResponseFeedback"
        WHERE "feedbackKey" = $1
      `,
      [feedbackKey],
    );
    expect(updated.rows).toEqual([{
      rating: 'unhelpful',
      workflow: 'coding_assist',
      completion: 'incomplete',
      lengthBucket: 'over_6000',
      reasonCodes: ['incomplete', 'too_long'],
      reasonSchemaVersion: 1,
    }]);

    await deleteAiResponseFeedback(feedbackKey);
    const deleted = await client.query(
      'SELECT COUNT(*)::int AS count FROM "AiResponseFeedback" WHERE "feedbackKey" = $1',
      [feedbackKey],
    );
    expect(deleted.rows[0]?.count).toBe(0);
  });

  it('atomically limits repeated writes from one encrypted AI session', async () => {
    const sessionKey = `integration-${randomUUID()}`;
    const attempts = await Promise.all(
      Array.from({ length: AI_FEEDBACK_RATE_WINDOW_LIMIT + 1 }, () =>
        consumeAiFeedbackRateLimit({
          sessionKey,
          sessionExpiresAt: Date.now() + 60 * 60 * 1000,
        }),
      ),
    );

    expect(attempts.filter((attempt) => attempt.allowed)).toHaveLength(AI_FEEDBACK_RATE_WINDOW_LIMIT);
    expect(attempts.filter((attempt) => !attempt.allowed)).toHaveLength(1);

    const stored = await client.query(
      `
        SELECT "windowCount", "sessionCount"
        FROM "AiFeedbackRateLimit"
        WHERE "sessionKey" = $1
      `,
      [sessionKey],
    );
    expect(stored.rows).toEqual([{
      windowCount: AI_FEEDBACK_RATE_WINDOW_LIMIT + 1,
      sessionCount: AI_FEEDBACK_RATE_WINDOW_LIMIT + 1,
    }]);

    await client.query('DELETE FROM "AiFeedbackRateLimit" WHERE "sessionKey" = $1', [sessionKey]);
  });
});

describe.skipIf(shouldRun)('AI feedback store PostgreSQL integration', () => {
  it('requires AI_FEEDBACK_INTEGRATION_DATABASE_URL', () => {});
});
