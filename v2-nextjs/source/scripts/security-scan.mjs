import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { findSecretPatterns } from './lib/securityPatterns.mjs';

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function getCandidateFiles() {
  const output = execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--full-name', '--', '.'],
    { encoding: 'utf8' },
  );
  return output.split('\0').filter(Boolean);
}

const findings = [];
const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();

for (const file of getCandidateFiles()) {
  const absolutePath = resolve(repoRoot, file);
  let stats;
  try {
    stats = statSync(absolutePath);
  } catch {
    continue;
  }
  if (!stats.isFile() || stats.size > MAX_FILE_BYTES) continue;

  const text = readFileSync(absolutePath, 'utf8');
  for (const match of findSecretPatterns(text)) {
    findings.push({
      file: relative(repoRoot, absolutePath),
      ...match,
    });
  }
}

if (findings.length > 0) {
  console.error('Potential committed secrets found:');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.pattern} at byte ${finding.index}`);
  }
  process.exit(1);
}

console.log('No obvious secrets found in tracked or untracked release-candidate files.');
