import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

export const DEFAULT_AI_RELEASE_GATE_STEPS = [
  {
    id: 'contracts',
    label: 'Static AI harness contracts',
    command: 'npm',
    args: ['run', 'ai:evaluate-contracts'],
    required: true,
  },
  {
    id: 'artifacts',
    label: 'Saved AI eval artifact audit',
    command: 'npm',
    args: ['run', 'ai:evaluate-artifacts'],
    required: true,
  },
  {
    id: 'human_records',
    label: 'Human review record scoring gate',
    command: 'npm',
    args: ['run', 'ai:evaluate-human-records', '--', '--require-pass'],
    required: true,
  },
  {
    id: 'secret_scan',
    label: 'Committed secret scan',
    command: 'npm',
    args: ['run', 'security:secrets'],
    required: true,
  },
];

export function parseAiReleaseGateArgs(argv) {
  const args = {
    dryRun: false,
    json: false,
    markdown: null,
    root: process.cwd(),
    skip: new Set(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];

    if (key === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (key === '--json') {
      args.json = true;
      continue;
    }

    const value = argv[index + 1];
    if (key === '--markdown') {
      args.markdown = value;
      index += 1;
      continue;
    }

    if (key === '--root') {
      args.root = value;
      index += 1;
      continue;
    }

    if (key === '--skip') {
      for (const item of String(value ?? '').split(',')) {
        const trimmed = item.trim();
        if (trimmed) args.skip.add(trimmed);
      }
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${key}`);
  }

  if (!args.root) throw new Error('--root must not be empty.');
  if (args.markdown !== null && !args.markdown) throw new Error('--markdown must not be empty.');

  return args;
}

export function getPackageVersion(root) {
  const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  return typeof packageJson.version === 'string' ? packageJson.version : null;
}

export function selectAiReleaseGateSteps(steps, skip = new Set()) {
  return steps.filter((step) => !skip.has(step.id));
}

function formatCommand(step) {
  return [step.command, ...step.args].join(' ');
}

function normalizeExitCode(result) {
  if (typeof result?.exitCode === 'number') return result.exitCode;
  if (typeof result?.status === 'number') return result.status;
  return 1;
}

export async function runAiReleaseGate(options) {
  const root = resolve(options.root ?? process.cwd());
  const steps = selectAiReleaseGateSteps(
    options.steps ?? DEFAULT_AI_RELEASE_GATE_STEPS,
    options.skip ?? new Set(),
  );
  const now = options.now ?? (() => new Date());
  const startedAt = now().toISOString();
  const version = options.version ?? getPackageVersion(root);
  const stepResults = [];
  let status = options.dryRun ? 'planned' : 'pass';

  for (const step of steps) {
    const startedMs = Date.now();

    if (options.dryRun) {
      stepResults.push({
        ...step,
        commandText: formatCommand(step),
        status: 'planned',
        durationMs: 0,
      });
      continue;
    }

    const result = await options.runCommand(step, { root });
    const exitCode = normalizeExitCode(result);
    const stepStatus = exitCode === 0 ? 'pass' : 'fail';

    stepResults.push({
      ...step,
      commandText: formatCommand(step),
      status: stepStatus,
      exitCode,
      durationMs: Date.now() - startedMs,
    });

    if (stepStatus === 'fail' && step.required) {
      status = 'fail';
      break;
    }
  }

  const finishedAt = now().toISOString();

  return {
    schemaVersion: 1,
    kind: 'ai_release_gate',
    version,
    status,
    dryRun: Boolean(options.dryRun),
    root,
    startedAt,
    finishedAt,
    steps: stepResults,
    findings:
      status === 'fail'
        ? stepResults
            .filter((step) => step.status === 'fail')
            .map((step) => ({
              type: 'required_step_failed',
              stepId: step.id,
              message: `Required AI release gate step failed: ${step.label}`,
            }))
        : [],
  };
}

export function renderAiReleaseGateMarkdown(result, options = {}) {
  const title = options.title ?? `AI Release Gate Report`;
  const rootLabel = options.cwd
    ? relative(options.cwd, result.root) || '.'
    : result.root;
  const lines = [
    `# ${title}`,
    '',
    `Version: ${result.version ?? 'unknown'}`,
    `Status: ${result.status}`,
    `Started: ${result.startedAt}`,
    `Finished: ${result.finishedAt}`,
    `Root: ${rootLabel}`,
    '',
    '## Steps',
    '',
    '| Step | Status | Required | Command |',
    '| --- | --- | --- | --- |',
  ];

  for (const step of result.steps) {
    lines.push(
      `| ${step.label} | ${step.status} | ${step.required ? 'yes' : 'no'} | \`${step.commandText}\` |`,
    );
  }

  lines.push('', '## Findings', '');

  if (result.findings.length === 0) {
    lines.push('No findings.');
  } else {
    for (const finding of result.findings) {
      lines.push(`- ${finding.type}: ${finding.message}`);
    }
  }

  lines.push(
    '',
    '## Privacy Boundary',
    '',
    'This report records command names, pass/fail status, and timing only. It does not store raw prompts, raw model answers, API keys, or chat transcripts.',
    '',
  );

  return lines.join('\n');
}
