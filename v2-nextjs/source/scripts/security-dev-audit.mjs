#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const allowedAdvisoryUrls = new Set([
  'https://github.com/advisories/GHSA-mh99-v99m-4gvg',
]);
const allowedPackageChain = new Set([
  '@eslint/config-array',
  '@eslint/eslintrc',
  'brace-expansion',
  'eslint',
  'minimatch',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'eslint-config-next',
]);
const exceptionExpiresAt = Date.parse('2026-08-31T23:59:59+09:00');

const command = process.platform === 'win32'
  ? (process.env.ComSpec ?? 'cmd.exe')
  : 'npm';
const args = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npm audit --json']
  : ['audit', '--json'];
const result = spawnSync(command, args, {
  cwd: process.cwd(),
  encoding: 'utf8',
  shell: false,
});

if (result.error) throw result.error;

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  process.stderr.write(result.stderr);
  throw new Error('Could not parse npm audit JSON output.');
}

const vulnerabilities = report.vulnerabilities ?? {};
const names = Object.keys(vulnerabilities);
if (names.length === 0) {
  console.log('Development dependency audit passed with no findings.');
  process.exit(0);
}

function collectAdvisoryUrls(name, visited = new Set()) {
  if (visited.has(name)) return new Set();
  visited.add(name);

  const urls = new Set();
  for (const cause of vulnerabilities[name]?.via ?? []) {
    if (typeof cause === 'string') {
      for (const url of collectAdvisoryUrls(cause, visited)) urls.add(url);
    } else if (cause?.url) {
      urls.add(cause.url);
    }
  }
  return urls;
}

const unexpectedPackages = names.filter((name) => !allowedPackageChain.has(name));
const advisoryUrls = new Set(names.flatMap((name) => [...collectAdvisoryUrls(name)]));
const unexpectedAdvisories = [...advisoryUrls].filter((url) => !allowedAdvisoryUrls.has(url));
const criticalCount = report.metadata?.vulnerabilities?.critical ?? 0;

if (
  Date.now() > exceptionExpiresAt
  || criticalCount > 0
  || unexpectedPackages.length > 0
  || unexpectedAdvisories.length > 0
  || advisoryUrls.size === 0
) {
  process.stderr.write(result.stdout);
  throw new Error('Development dependency audit contains an unapproved or expired finding.');
}

console.warn(JSON.stringify({
  status: 'pass_with_expiring_dev_only_exception',
  advisoryUrls: [...advisoryUrls],
  affectedPackageChain: names,
  reason: 'The compatible Next.js ESLint plugin chain has not yet adopted the fixed brace-expansion major. Production dependencies are audited separately and must remain clean.',
  expiresAt: '2026-08-31T23:59:59+09:00',
}));
