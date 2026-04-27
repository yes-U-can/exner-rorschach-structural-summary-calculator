#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const locales = ['ko', 'es', 'en', 'ja', 'pt'];

function run(label, args) {
  console.log(`\n[step] ${label}`);
  const result = spawnSync(npmCommand, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: isWindows,
    env: process.env,
  });

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('generate reference corpus', ['run', 'docs:generate-corpus']);

for (const locale of locales) {
  run(`evaluate RAG (${locale})`, ['run', `docs:evaluate-rag:${locale}`]);
}

run('unit and integration tests', ['test']);
run('production build', ['run', 'build']);

console.log('\n[done] Reference release verification completed successfully.');
