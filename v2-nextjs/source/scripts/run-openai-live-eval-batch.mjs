#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadProjectEnv } from './load-project-env.mjs';

const PRICE_PER_1M_TOKENS = {
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-5.5': { input: 5, output: 30 },
};

function parseArgs(argv) {
  const args = {
    model: 'gpt-4o-mini',
    locales: ['ko', 'en'],
    rounds: 1,
    retrieval: 'runtime',
    suite: 'single',
    output: `docs/ai-evals/live-eval-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`,
    budgetUsd: 5,
    ids: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key.startsWith('--')) continue;
    index += 1;

    if (key === '--model') args.model = value;
    else if (key === '--locales') args.locales = value.split(',').map((item) => item.trim()).filter(Boolean);
    else if (key === '--rounds') args.rounds = Number.parseInt(value, 10);
    else if (key === '--retrieval') args.retrieval = value;
    else if (key === '--suite') args.suite = value;
    else if (key === '--output') args.output = value;
    else if (key === '--budget-usd') args.budgetUsd = Number.parseFloat(value);
    else if (key === '--ids') args.ids = value;
  }

  if (!Number.isFinite(args.rounds) || args.rounds < 1) {
    throw new Error('--rounds must be a positive integer.');
  }
  if (!Number.isFinite(args.budgetUsd) || args.budgetUsd <= 0) {
    throw new Error('--budget-usd must be a positive number.');
  }
  if (!args.locales.length) {
    throw new Error('--locales must include at least one locale.');
  }
  if (!PRICE_PER_1M_TOKENS[args.model]) {
    throw new Error(`No price table is configured for model: ${args.model}`);
  }
  if (!['single', 'multiturn'].includes(args.suite)) {
    throw new Error('--suite must be either single or multiturn.');
  }

  return args;
}

function costUsdForUsage(model, usage) {
  const price = PRICE_PER_1M_TOKENS[model];
  const inputTokens = usage?.inputTokens ?? 0;
  const outputTokens = usage?.outputTokens ?? 0;
  return (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
}

function quoteWindowsArg(value) {
  const text = String(value);
  if (!/[\s"]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function runCommand(command, args, env) {
  return new Promise((resolveRun) => {
    const childCommand = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : command;
    const childArgs = process.platform === 'win32'
      ? ['/d', '/s', '/c', [command, ...args].map(quoteWindowsArg).join(' ')]
      : args;
    const child = spawn(childCommand, childArgs, {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on('close', (exitCode) => {
      resolveRun({ exitCode, stdout, stderr });
    });
  });
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

const args = parseArgs(process.argv.slice(2));
loadProjectEnv(process.cwd());

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required in the environment.');
}

const outputPath = resolve(args.output);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `${JSON.stringify({
    type: 'batch_start',
    startedAt: new Date().toISOString(),
    model: args.model,
    locales: args.locales,
    rounds: args.rounds,
    retrieval: args.retrieval,
    suite: args.suite,
    budgetUsd: args.budgetUsd,
    ids: args.ids || null,
  })}\n`,
);

let totalCostUsd = 0;
let totalCalls = 0;
let failedRuns = 0;
const issueCounts = new Map();
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const evalScript = args.suite === 'multiturn'
  ? 'ai:evaluate-live:openai:multiturn'
  : 'ai:evaluate-live:openai';

for (let round = 1; round <= args.rounds; round += 1) {
  for (const locale of args.locales) {
    if (totalCostUsd >= args.budgetUsd) {
      throw new Error(`Budget exceeded before round ${round} ${locale}: $${totalCostUsd.toFixed(4)}`);
    }

    const env = {
      ...process.env,
      OPENAI_LIVE_EVAL_MODEL: args.model,
      OPENAI_LIVE_EVAL_RETRIEVAL: args.retrieval,
      OPENAI_LIVE_EVAL_LOCALE: locale,
      OPENAI_LIVE_EVAL_LIMIT: '999',
      ...(args.ids ? { OPENAI_LIVE_EVAL_IDS: args.ids } : {}),
    };

    console.log(`\n[ai-live-eval-batch] suite=${args.suite} model=${args.model} locale=${locale} round=${round}/${args.rounds}`);
    const result = await runCommand(npmCommand, ['run', evalScript], env);
    const events = parseEvalEvents(result.stdout);

    let runCostUsd = 0;
    for (const event of events) {
      const eventCostUsd = costUsdForUsage(args.model, event.usage);
      runCostUsd += eventCostUsd;
      totalCostUsd += eventCostUsd;
      totalCalls += 1;
      for (const issueType of event.issueTypes ?? []) {
        issueCounts.set(issueType, (issueCounts.get(issueType) ?? 0) + 1);
      }
      appendFileSync(
        outputPath,
        `${JSON.stringify({
          type: 'fixture_result',
          round,
          locale,
          model: args.model,
          retrieval: args.retrieval,
          costUsd: Number(eventCostUsd.toFixed(8)),
          ...event,
        })}\n`,
      );
    }

    const runRecord = {
      type: 'run_end',
      round,
      locale,
      exitCode: result.exitCode,
      fixtureCount: events.length,
      runCostUsd: Number(runCostUsd.toFixed(8)),
      totalCostUsd: Number(totalCostUsd.toFixed(8)),
    };
    appendFileSync(outputPath, `${JSON.stringify(runRecord)}\n`);
    console.log(`[ai-live-eval-batch] runCost=$${runCostUsd.toFixed(4)} totalCost=$${totalCostUsd.toFixed(4)}`);

    if (result.exitCode !== 0) {
      failedRuns += 1;
    }
  }
}

const summary = {
  type: 'batch_summary',
  finishedAt: new Date().toISOString(),
  model: args.model,
  locales: args.locales,
  rounds: args.rounds,
  retrieval: args.retrieval,
  suite: args.suite,
  totalCalls,
  failedRuns,
  totalCostUsd: Number(totalCostUsd.toFixed(8)),
  issueCounts: Object.fromEntries([...issueCounts.entries()].sort()),
};
appendFileSync(outputPath, `${JSON.stringify(summary)}\n`);
console.log(`\n[ai-live-eval-batch] summary ${JSON.stringify(summary, null, 2)}`);

if (failedRuns > 0) {
  process.exitCode = 1;
}
