import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config({ path: '.env.local' });

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const feedbackEnabled = process.env.NEXT_PUBLIC_AI_FEEDBACK_ENABLED?.trim() === '1';
const databaseUrl = process.env.AI_FEEDBACK_DATABASE_URL?.trim() ?? '';
const dryRun = process.env.AI_FEEDBACK_MIGRATION_DRY_RUN?.trim() === '1';

if (!feedbackEnabled) {
  console.log(JSON.stringify({ feedbackMigration: 'skipped', reason: 'feedback-disabled' }));
  process.exit(0);
}

if (!databaseUrl || databaseUrl === '[SENSITIVE]') {
  throw new Error(
    'AI_FEEDBACK_DATABASE_URL is required before an enabled feedback deployment can migrate.',
  );
}

if (dryRun) {
  console.log(JSON.stringify({ feedbackMigration: 'ready', dryRun: true }));
  process.exit(0);
}

const prismaCli = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
if (!existsSync(prismaCli)) {
  throw new Error('The local Prisma CLI is unavailable; refusing to deploy without migrations.');
}

const result = spawnSync(
  process.execPath,
  [prismaCli, 'migrate', 'deploy', '--config', 'prisma.feedback.config.ts'],
  {
    cwd: ROOT,
    env: process.env,
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(`Feedback migration failed with exit code ${result.status ?? 'unknown'}.`);
}

console.log(JSON.stringify({ feedbackMigration: 'applied' }));
