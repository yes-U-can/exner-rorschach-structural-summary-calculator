import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function runFeedbackConfig(overrides: Record<string, string>) {
  return spawnSync(process.execPath, ['scripts/validate-feedback-config.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '0',
      AI_FEEDBACK_DATABASE_URL: '',
      AI_FEEDBACK_EDGE_RATE_LIMIT_READY: '0',
      RAG_DATABASE_URL: '',
      RAG_WRITE_DATABASE_URL: '',
      VERCEL: '0',
      VERCEL_ENV: '',
      CI: '',
      ...overrides,
    },
  });
}

function runFeedbackMigration(overrides: Record<string, string>) {
  return spawnSync(process.execPath, ['scripts/migrate-feedback-for-deploy.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '0',
      AI_FEEDBACK_DATABASE_URL: '',
      AI_FEEDBACK_MIGRATION_DRY_RUN: '1',
      ...overrides,
    },
  });
}

describe('AI feedback deployment configuration', () => {
  it('allows local builds while feedback is disabled', () => {
    const result = runFeedbackConfig({});

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"feedbackEnabled":false');
  });

  it('skips feedback migrations when feedback is disabled', () => {
    const result = runFeedbackMigration({});

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"feedbackMigration":"skipped"');
  });

  it('refuses an enabled deployment without a feedback database', () => {
    const result = runFeedbackMigration({
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '1',
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('AI_FEEDBACK_DATABASE_URL is required');
  });

  it('preflights the production migration without exposing the database URL', () => {
    const result = runFeedbackMigration({
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '1',
      AI_FEEDBACK_DATABASE_URL: 'postgresql://feedback.example/feedback',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"feedbackMigration":"ready"');
    expect(result.stdout).not.toContain('postgresql://');
  });

  it('fails a Vercel build when feedback is enabled before the outer rate limit', () => {
    const result = runFeedbackConfig({
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '1',
      AI_FEEDBACK_DATABASE_URL: 'postgresql://feedback.example/feedback',
      VERCEL: '1',
      VERCEL_ENV: 'production',
      CI: '1',
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('AI_FEEDBACK_EDGE_RATE_LIMIT_READY=1');
  });

  it('does not treat locally pulled Vercel variables as a deployment build', () => {
    const result = runFeedbackConfig({
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '1',
      AI_FEEDBACK_DATABASE_URL: 'postgresql://feedback.example/feedback',
      VERCEL: '1',
      VERCEL_ENV: 'production',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"dedicatedDatabaseBoundary":true');
    expect(result.stdout).toContain('"edgeRateLimitReady":false');
  });

  it('accepts a dedicated feedback database after the Vercel rate limit is confirmed', () => {
    const result = runFeedbackConfig({
      NEXT_PUBLIC_AI_FEEDBACK_ENABLED: '1',
      AI_FEEDBACK_DATABASE_URL: 'postgresql://feedback.example/feedback',
      AI_FEEDBACK_EDGE_RATE_LIMIT_READY: '1',
      RAG_DATABASE_URL: 'postgresql://rag.example/reference',
      VERCEL: '1',
      VERCEL_ENV: 'production',
      CI: '1',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"dedicatedDatabaseBoundary":true');
    expect(result.stdout).toContain('"edgeRateLimitReady":true');
  });
});
