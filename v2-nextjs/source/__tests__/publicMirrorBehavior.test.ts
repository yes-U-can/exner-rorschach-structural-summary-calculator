import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe.skipIf(process.platform !== 'win32')('public mirror sanitization behavior', () => {
  it('refuses sanitize-only roots that overlap the private source tree', () => {
    const script = path.join(process.cwd(), 'scripts', 'publish.ps1');
    const overlappingRoots = [
      process.cwd(),
      path.dirname(process.cwd()),
      path.join(process.cwd(), 'docs'),
    ];

    for (const root of overlappingRoots) {
      const result = spawnSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          script,
          '-SanitizeOnlyRoot',
          root,
          '-DryRun',
        ],
        { cwd: process.cwd(), encoding: 'utf8' },
      );

      expect(result.status).not.toBe(0);
      // Windows PowerShell may hard-wrap error text at the host width, even in
      // captured output (for example, splitting "source" across two lines).
      // Compare the stable message after removing presentation whitespace.
      expect(`${result.stdout}\n${result.stderr}`.replace(/\s+/g, '')).toContain(
        'Refusingtosanitizeapaththatoverlapstheprivatesourceroot.',
      );
    }
  }, 60_000);

  it('removes hidden secrets and preserves JSON collection shapes', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-mirror-'));
    const evalRoot = path.join(root, 'docs', 'ai-evals');
    const dependencyRoot = path.join(root, 'node_modules', 'react-is');
    const dependencyMetadata = path.join(dependencyRoot, 'build-info.json');
    const hiddenSecret = path.join(root, '.env.local');

    try {
      mkdirSync(evalRoot, { recursive: true });
      mkdirSync(dependencyRoot, { recursive: true });
      writeFileSync(hiddenSecret, 'OPENAI_API_KEY=private-test-value\n', 'utf8');
      execFileSync('attrib.exe', ['+h', hiddenSecret]);
      writeFileSync(dependencyMetadata, JSON.stringify({ commit: 'third-party-build' }), 'utf8');
      writeFileSync(
        path.join(evalRoot, 'single-array.json'),
        JSON.stringify([{ gitCommit: 'private-commit', kept: 'yes' }]),
        'utf8',
      );
      writeFileSync(
        path.join(evalRoot, 'single-line.jsonl'),
        `${JSON.stringify({ baseCommit: 'private-base', kept: 'yes' })}\n`,
        'utf8',
      );

      execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          path.join(process.cwd(), 'scripts', 'publish.ps1'),
          '-SanitizeOnlyRoot',
          root,
        ],
        { cwd: process.cwd(), encoding: 'utf8' },
      );

      expect(existsSync(hiddenSecret)).toBe(false);
      expect(existsSync(dependencyMetadata)).toBe(true);

      const jsonValue = JSON.parse(readFileSync(path.join(evalRoot, 'single-array.json'), 'utf8'));
      expect(Array.isArray(jsonValue)).toBe(true);
      expect(jsonValue).toEqual([{ kept: 'yes' }]);

      const jsonlValue = JSON.parse(
        readFileSync(path.join(evalRoot, 'single-line.jsonl'), 'utf8').trim(),
      );
      expect(jsonlValue).toEqual({ kept: 'yes' });
    } finally {
      if (existsSync(hiddenSecret)) {
        try {
          execFileSync('attrib.exe', ['-h', hiddenSecret]);
        } catch {
          // Best-effort cleanup of a failed hidden-file test.
        }
      }
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('does not delete private artifacts during a sanitize-only dry run', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-mirror-dry-run-'));
    const hiddenSecret = path.join(root, '.env.local');

    try {
      writeFileSync(hiddenSecret, 'OPENAI_API_KEY=private-test-value\n', 'utf8');
      execFileSync('attrib.exe', ['+h', hiddenSecret]);

      const output = execFileSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          path.join(process.cwd(), 'scripts', 'publish.ps1'),
          '-SanitizeOnlyRoot',
          root,
          '-DryRun',
        ],
        { cwd: process.cwd(), encoding: 'utf8' },
      );

      expect(existsSync(hiddenSecret)).toBe(true);
      expect(output).toContain('[dry-run] sanitize-only simulation completed.');
    } finally {
      if (existsSync(hiddenSecret)) {
        try {
          execFileSync('attrib.exe', ['-h', hiddenSecret]);
        } catch {
          // Best-effort cleanup of a failed hidden-file test.
        }
      }
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);
});
