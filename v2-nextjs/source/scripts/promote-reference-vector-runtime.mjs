#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { loadProjectEnv } from './load-project-env.mjs';

const ROOT = process.cwd();
const VALID_PROVIDERS = ['openai'];

function printHelp() {
  console.log(`Usage: node scripts/promote-reference-vector-runtime.mjs [options] [locale...]

Options:
  --skip-migrate           Skip "prisma migrate deploy"
  --provider=<name[,..]>   Run only the selected provider(s): openai
  --require-full-gate      Fail unless every provider and locale is vector-ready
  --help                   Show this help message

Examples:
  npm.cmd run ops:promote-vectors
  npm.cmd run ops:promote-vectors -- --skip-migrate
  npm.cmd run ops:promote-vectors -- --provider=openai ko ja
  npm.cmd run ops:promote-vectors -- --provider=openai ko
`);
}

function parseArgs(argv) {
  const options = {
    runMigrate: true,
    requireFullGate: false,
    providers: [...VALID_PROVIDERS],
    locales: [],
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg === '--skip-migrate') {
      options.runMigrate = false;
      continue;
    }

    if (arg === '--require-full-gate') {
      options.requireFullGate = true;
      continue;
    }

    if (arg.startsWith('--provider=')) {
      const providers = arg
        .slice('--provider='.length)
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

      const invalidProviders = providers.filter((provider) => !VALID_PROVIDERS.includes(provider));
      if (invalidProviders.length > 0) {
        throw new Error(`Unsupported provider: ${invalidProviders.join(', ')}`);
      }

      if (providers.length === 0) {
        throw new Error('At least one provider must be supplied to --provider.');
      }

      options.providers = providers;
      continue;
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.locales.push(arg);
  }

  return options;
}

function runStep(command, args, label) {
  console.log(`[vector-promotion] ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 'unknown'}.`);
  }
}

function getPrismaArgs() {
  const prismaCliPath = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
  return [prismaCliPath, 'migrate', 'deploy'];
}

function shouldRequireFullGate(options) {
  return (
    options.requireFullGate ||
    (options.providers.length === VALID_PROVIDERS.length && options.locales.length === 0)
  );
}

async function main() {
  loadProjectEnv(ROOT);

  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  console.log(
    `[vector-promotion] providers=${options.providers.join(',')} locales=${
      options.locales.length > 0 ? options.locales.join(',') : 'all'
    } migrate=${options.runMigrate ? 'yes' : 'no'} fullGate=${
      shouldRequireFullGate(options) ? 'yes' : 'no'
    }`,
  );

  if (options.runMigrate) {
    runStep(process.execPath, getPrismaArgs(), 'Applying Prisma migrations');
  }

  for (const provider of options.providers) {
    runStep(
      process.execPath,
      [path.join(ROOT, 'scripts', 'generate-reference-embeddings.mjs'), provider, ...options.locales],
      `Generating ${provider} embeddings`,
    );
  }

  runStep(
    process.execPath,
    [path.join(ROOT, 'scripts', 'generate-reference-vector-release-snapshot.mjs')],
    'Refreshing vector release snapshot',
  );
  if (shouldRequireFullGate(options)) {
    runStep(
      process.execPath,
      [path.join(ROOT, 'scripts', 'assert-reference-vector-runtime-ready.mjs')],
      'Verifying vector runtime gate',
    );
  } else {
    console.log('[vector-promotion] partial scope detected, skipping full runtime gate');
  }
  runStep(
    process.execPath,
    [path.join(ROOT, 'scripts', 'show-reference-vector-status.mjs')],
    'Printing vector runtime status',
  );

  console.log('[vector-promotion] complete');
}

main().catch((error) => {
  console.error('[vector-promotion] failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
