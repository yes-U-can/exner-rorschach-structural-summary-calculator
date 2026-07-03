#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  DEFAULT_AI_RELEASE_GATE_STEPS,
  parseAiReleaseGateArgs,
  renderAiReleaseGateMarkdown,
  runAiReleaseGate,
} from './lib/aiReleaseGate.mjs';

function quoteWindowsArg(value) {
  const text = String(value);
  if (!/[\s"]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function runCommand(step, { root }) {
  const command = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : step.command;
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', [step.command, ...step.args].map(quoteWindowsArg).join(' ')]
    : step.args;

  return spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
}

function printHumanReport(result) {
  console.log('AI release gate summary');
  console.log(`- version: ${result.version ?? 'unknown'}`);
  console.log(`- status: ${result.status}`);
  console.log(`- steps: ${result.steps.length}`);

  for (const step of result.steps) {
    const exitCode = step.exitCode === undefined ? '' : ` exit=${step.exitCode}`;
    console.log(`- ${step.status.toUpperCase()} ${step.id}:${exitCode} ${step.commandText}`);
  }

  if (result.findings.length) {
    console.log('\nFindings:');
    for (const finding of result.findings) {
      console.log(`- ${finding.stepId}: ${finding.message}`);
    }
  }
}

const args = parseAiReleaseGateArgs(process.argv.slice(2));
const root = resolve(args.root);

const result = await runAiReleaseGate({
  root,
  dryRun: args.dryRun,
  skip: args.skip,
  steps: DEFAULT_AI_RELEASE_GATE_STEPS,
  runCommand,
});

if (args.markdown) {
  const markdownPath = resolve(root, args.markdown);
  mkdirSync(dirname(markdownPath), { recursive: true });
  writeFileSync(markdownPath, renderAiReleaseGateMarkdown(result, { cwd: root }), 'utf8');
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  printHumanReport(result);
}

if (result.status === 'fail') {
  process.exitCode = 1;
}
