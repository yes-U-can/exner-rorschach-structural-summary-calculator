#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';

import { loadProjectEnv } from './load-project-env.mjs';

loadProjectEnv(process.cwd());

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required for the production-like chat route eval.');
}

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
      OPENAI_ROUTE_LIVE_EVAL: '1',
    },
    stdio: 'inherit',
  },
);

child.on('error', (error) => {
  console.error('[openai-route-eval] failed to start');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

child.on('close', (exitCode) => {
  process.exitCode = exitCode ?? 1;
});
