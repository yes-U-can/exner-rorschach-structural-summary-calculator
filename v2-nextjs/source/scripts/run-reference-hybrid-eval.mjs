#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';

import { loadProjectEnv } from './load-project-env.mjs';

const ROOT = process.cwd();

function readOption(name, fallback = '') {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}

loadProjectEnv(ROOT);

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required for the live hybrid retrieval evaluation.');
}
if (!process.env.RAG_DATABASE_URL) {
  throw new Error('RAG_DATABASE_URL is required for the live hybrid retrieval evaluation.');
}

const setPath = readOption(
  'set',
  'docs/reference-authoring/evals/hybrid-retrieval-dev-v1.json',
);
const outputPath = readOption('output');
const vitestPath = path.join(ROOT, 'node_modules', 'vitest', 'vitest.mjs');
const child = spawn(
  process.execPath,
  [
    vitestPath,
    'run',
    '--config',
    'vitest.evals.config.ts',
    'evals/referenceHybridRetrieval.openai.test.ts',
    '--reporter=verbose',
  ],
  {
    cwd: ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      REFERENCE_HYBRID_EVAL: '1',
      REFERENCE_HYBRID_EVAL_ENFORCE: hasFlag('enforce') ? '1' : '0',
      REFERENCE_HYBRID_EVAL_SET: setPath,
      ...(outputPath ? { REFERENCE_HYBRID_EVAL_OUTPUT: outputPath } : {}),
    },
  },
);

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`[reference-hybrid-eval] terminated by signal ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});

child.on('error', (error) => {
  console.error('[reference-hybrid-eval] failed to start');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
