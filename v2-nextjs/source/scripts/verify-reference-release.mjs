#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const locales = ['ko', 'es', 'en', 'ja', 'pt'];

function quoteWindowsArg(value) {
  const text = String(value);
  if (!/[\s"]/u.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function run(label, args) {
  console.log(`\n[step] ${label}`);
  const command = isWindows ? process.env.ComSpec || 'cmd.exe' : npmCommand;
  const commandArgs = isWindows
    ? ['/d', '/s', '/c', [npmCommand, ...args].map(quoteWindowsArg).join(' ')]
    : args;
  const result = spawnSync(command, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  });

  if ((result.status ?? 1) !== 0) {
    process.exitCode = result.status ?? 1;
    return false;
  }
  return true;
}

if (!run('generate reference corpus', ['run', 'docs:generate-corpus'])) {
  process.exitCode = process.exitCode || 1;
} else {
  for (const locale of locales) {
    if (!run(`evaluate RAG (${locale})`, ['run', `docs:evaluate-rag:${locale}`])) break;
  }

  if (!process.exitCode) run('assert current-corpus vector runtime', ['run', 'docs:assert-vector-runtime-ready']);
  if (!process.exitCode) run('unit and integration tests', ['test']);
  if (!process.exitCode) run('production build', ['run', 'build']);
}

if (!process.exitCode) {
  console.log('\n[done] Reference release verification completed successfully.');
}
