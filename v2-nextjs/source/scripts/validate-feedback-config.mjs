#!/usr/bin/env node

import { config } from 'dotenv';

config({ path: '.env.local' });

const enabled = process.env.NEXT_PUBLIC_AI_FEEDBACK_ENABLED === '1';
const feedbackUrl = process.env.AI_FEEDBACK_DATABASE_URL?.trim() ?? '';
const edgeRateLimitReady = process.env.AI_FEEDBACK_EDGE_RATE_LIMIT_READY === '1';
const isVercelBuild = process.env.VERCEL === '1';

function databaseIdentity(rawUrl, variableName) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL URL.`);
  }

  if (!['postgresql:', 'postgres:'].includes(parsed.protocol)) {
    throw new Error(`${variableName} must use the postgresql:// or postgres:// scheme.`);
  }

  return `postgresql://${parsed.hostname.toLowerCase()}:${parsed.port || '5432'}${parsed.pathname}`;
}

if (!enabled) {
  console.log(JSON.stringify({ status: 'pass', feedbackEnabled: false, edgeRateLimitReady }));
  process.exit(0);
}

if (!feedbackUrl) {
  throw new Error(
    'AI_FEEDBACK_DATABASE_URL is required when NEXT_PUBLIC_AI_FEEDBACK_ENABLED=1.',
  );
}

if (isVercelBuild && !edgeRateLimitReady) {
  throw new Error(
    'AI_FEEDBACK_EDGE_RATE_LIMIT_READY=1 is required on Vercel when AI response feedback is enabled. Publish the documented Firewall rule before setting it.',
  );
}

const feedbackIdentity = databaseIdentity(feedbackUrl, 'AI_FEEDBACK_DATABASE_URL');
for (const variableName of ['RAG_DATABASE_URL', 'RAG_WRITE_DATABASE_URL']) {
  const value = process.env[variableName]?.trim();
  if (!value) continue;
  if (feedbackIdentity === databaseIdentity(value, variableName)) {
    throw new Error(`AI feedback must not reuse the database addressed by ${variableName}.`);
  }
}

console.log(JSON.stringify({
  status: 'pass',
  feedbackEnabled: true,
  dedicatedDatabaseBoundary: true,
  edgeRateLimitReady,
}));
