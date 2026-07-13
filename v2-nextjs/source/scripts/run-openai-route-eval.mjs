#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { loadProjectEnv } from './load-project-env.mjs';
import { getSourceMetadata } from './lib/sourceMetadata.mjs';

loadProjectEnv(process.cwd());

const apiKey = process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required for the production-like chat route eval.');
}

function resolveOutputPath(argv) {
  const outputIndex = argv.indexOf('--output');
  if (outputIndex >= 0 && argv[outputIndex + 1]) {
    return path.resolve(argv[outputIndex + 1]);
  }

  return path.resolve(
    'docs',
    'ai-evals',
    `route-live-eval-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`,
  );
}

function parseEvalEvents(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{') && line.endsWith('}'))
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((event) => event && typeof event.fixtureId === 'string');
}

const outputPath = resolveOutputPath(process.argv.slice(2));
const source = getSourceMetadata(process.cwd());
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `${JSON.stringify({
    type: 'route_eval_start',
    startedAt: new Date().toISOString(),
    source,
  })}\n`,
);

const vitestPath = path.join(process.cwd(), 'node_modules', 'vitest', 'vitest.mjs');
const child = spawn(
  process.execPath,
  [
    vitestPath,
    'run',
    '--config',
    'vitest.evals.config.ts',
    'evals/chatRoute.openai.test.ts',
    '--reporter=verbose',
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      OPENAI_API_KEY: apiKey,
      OPENAI_ROUTE_LIVE_EVAL: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

let stdout = '';
let startError = null;

child.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  stdout += text;
  process.stdout.write(text);
});

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk.toString());
});

child.on('error', (error) => {
  startError = error;
  console.error('[openai-route-eval] failed to start');
  console.error(error instanceof Error ? error.message : String(error));
});

child.on('close', (exitCode) => {
  const events = parseEvalEvents(stdout);
  for (const event of events) {
    appendFileSync(
      outputPath,
      `${JSON.stringify({ type: 'route_eval_result', ...event, source })}\n`,
    );
  }

  const effectiveExitCode = startError ? 1 : (exitCode ?? 1);
  appendFileSync(
    outputPath,
    `${JSON.stringify({
      type: 'route_eval_summary',
      finishedAt: new Date().toISOString(),
      exitCode: effectiveExitCode,
      eventCount: events.length,
      source,
    })}\n`,
  );
  console.log(`[openai-route-eval] evidence=${outputPath} events=${events.length}`);
  process.exitCode = effectiveExitCode === 0 && events.length > 0 ? 0 : 1;
});
