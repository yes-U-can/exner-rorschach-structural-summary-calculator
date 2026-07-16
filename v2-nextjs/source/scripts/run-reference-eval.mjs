import { spawnSync } from 'node:child_process';

const locale = process.argv[2] ?? 'ko';
const isWindows = process.platform === 'win32';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';
const evalArgs = ['vitest', 'run', '--config', 'vitest.evals.config.ts', 'evals/referenceRetrievalEval.test.ts'];
const command = isWindows ? process.env.ComSpec || 'cmd.exe' : npxCommand;
const commandArgs = isWindows
  ? ['/d', '/s', '/c', [npxCommand, ...evalArgs].join(' ')]
  : evalArgs;

const result = spawnSync(
  command,
  commandArgs,
  {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      REFERENCE_EVAL_LOCALE: locale,
    },
  },
);

process.exitCode = result.status ?? 1;
