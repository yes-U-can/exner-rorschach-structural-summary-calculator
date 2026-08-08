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

  it('removes private authoring metadata from public reference drafts', () => {
    const privatePolicy = ['curated', 'internal', 'reference'].join('-');
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-authoring-'));
    const authoringRoot = path.join(root, 'docs', 'reference-authoring');
    const draftRoot = path.join(root, 'docs', 'reference-authoring', 'drafts', 'en');
    const draftPath = path.join(draftRoot, 'example.md');
    const guidePath = path.join(authoringRoot, 'README.md');
    const generatedRoot = path.join(root, 'generated', 'reference-corpus');
    const generatedPath = path.join(generatedRoot, 'chunks.json');

    try {
      mkdirSync(draftRoot, { recursive: true });
      mkdirSync(generatedRoot, { recursive: true });
      writeFileSync(
        guidePath,
        [
          '# Authoring',
          '',
          `- authorityPolicy: "${privatePolicy}"`,
          '- provenanceNote',
          '',
          '`provenanceNote` must point to notes/corpus-review-ledger.md.',
          '',
          '## 공개 경계',
          '',
          '- docs/reference-authoring/notes/',
          '',
        ].join('\n'),
        'utf8',
      );
      writeFileSync(
        draftPath,
        [
          '---',
          `authorityPolicy: "${privatePolicy}"`,
          'provenanceNote: docs/reference-authoring/notes/example.md',
          '---',
          '',
          '# Example',
          '',
          'Reader-facing text.',
          '',
          '## Evidence Note',
          '',
          'Private authoring evidence.',
          '',
        ].join('\n'),
        'utf8',
      );
      writeFileSync(
        generatedPath,
        JSON.stringify({ chunks: [{ authorityPolicy: privatePolicy }] }),
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

      const published = readFileSync(draftPath, 'utf8');
      expect(published).toContain('authorityPolicy: "curated-reference"');
      expect(published).not.toContain('provenanceNote');
      expect(published).not.toContain('Evidence Note');
      expect(published).not.toContain('Private authoring evidence');

      const guide = readFileSync(guidePath, 'utf8');
      expect(guide).toContain('authorityPolicy: "curated-reference"');
      expect(guide).not.toContain('provenanceNote');
      expect(guide).not.toContain('reference-authoring/notes');
      expect(guide).toContain('frontmatter');

      const generated = readFileSync(generatedPath, 'utf8');
      expect(generated).toContain('curated-reference');
      expect(generated).not.toContain(privatePolicy);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('blocks internal production narrative in reader-facing public documents', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-reader-copy-'));

    try {
      writeFileSync(
        path.join(root, 'README.md'),
        '# Release\n\nThe page number refers to a local PDF viewer.\n',
        'utf8',
      );

      const result = spawnSync(
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

      expect(result.status).not.toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toContain(
        'Internal production narrative remains in reader-facing public documents',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);
});
