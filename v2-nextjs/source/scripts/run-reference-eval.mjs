import { spawnSync } from 'node:child_process';

const locale = process.argv[2] ?? 'ko';
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(
  command,
  ['vitest', 'run', '--config', 'vitest.evals.config.ts', 'evals/referenceRetrievalEval.test.ts'],
  {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      REFERENCE_EVAL_LOCALE: locale,
    },
  },
);

process.exit(result.status ?? 1);
