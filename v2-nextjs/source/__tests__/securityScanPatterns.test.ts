import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { findSecretPatterns } from '../scripts/lib/securityPatterns.mjs';

describe('security scan patterns', () => {
  const openAiStyleTestKey = ['sk', 'example_abcdefghijklmnopqrstuvwxyz'].join('-');

  it.each([
    `OPENAI_API_KEY=${openAiStyleTestKey}`,
    `  OPENAI_API_KEY = ${openAiStyleTestKey}`,
    `\texport OPENAI_API_KEY=${openAiStyleTestKey}`,
  ])('detects indented and exported environment assignments: %s', (text) => {
    expect(findSecretPatterns(text)).toEqual(expect.arrayContaining([
      expect.objectContaining({ pattern: 'Committed env secret assignment' }),
    ]));
  });

  it.each([
    'OPENAI_API_KEY=<your-api-key>',
    'DATABASE_URL=<your-database-url>',
    'export BYOK_COOKIE_SECRET=<high-entropy-cookie-secret>',
  ])('allows documented placeholders: %s', (text) => {
    expect(findSecretPatterns(text)).toEqual([]);
  });

  it('scans untracked files that are candidates for the next commit', () => {
    const repo = mkdtempSync(join(tmpdir(), 'exner-security-scan-'));
    const scanner = resolve('scripts/security-scan.mjs');
    const untrackedSecret = ['sk', 'untracked_abcdefghijklmnopqrstuvwxyz'].join('-');

    try {
      execFileSync('git', ['init'], { cwd: repo, stdio: 'ignore' });
      writeFileSync(join(repo, 'tracked.txt'), 'safe\n', 'utf8');
      writeFileSync(join(repo, 'candidate.txt'), `${untrackedSecret}\n`, 'utf8');
      execFileSync('git', ['add', 'tracked.txt'], { cwd: repo, stdio: 'ignore' });

      const result = spawnSync(process.execPath, [scanner], {
        cwd: repo,
        encoding: 'utf8',
      });

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('candidate.txt');
      expect(result.stderr).toContain('OpenAI-style secret key');
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
