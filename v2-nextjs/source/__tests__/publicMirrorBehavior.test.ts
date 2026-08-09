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

  it('blocks correction banners and internal release-process narration in v2 reader documents', () => {
    const blockedCases = [
      {
        relativePath: 'README.md',
        content:
          '# Public calculator\n\n2026-08-09 문서 정정: 공개 릴리즈 문구와 소스 아카이브를 맞췄습니다.\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'releases', 'v2.2.11', 'README.en.md'),
        content:
          '# v2.2.11\n\n2026-08-09 document correction: release archive dates and order were aligned.\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'releases', 'v2.2.11', 'README.ja.md'),
        content: '# v2.2.11\n\n## 計算根拠の再確認\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'releases', 'v2.2.11', 'README.es.md'),
        content: '# v2.2.11\n\n2026-08-09 corrección del documento: se alineó el archivo.\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'releases', 'v2.2.11', 'README.pt-BR.md'),
        content: '# v2.2.11\n\n2026-08-09 correção do documento: o arquivo foi alinhado.\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'releases', 'v2.2.11', 'README.md'),
        content: '# v2.2.11\n\n버전 아카이브의 날짜와 순서를 현재 문서에 맞춰 정리했습니다.\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'releases', 'v2.2.12', 'README.md'),
        content:
          '# v2.2.12\n\n첫 테스트 실행은 실패했고 재시도 후 42개 테스트가 통과했습니다. DB 재구축에는 로컬 테스트 키를 사용했습니다.\n',
      },
      {
        relativePath: 'README.en.md',
        content: '# Public calculator\n\nReader-facing public guides are available in five languages.\n',
      },
      {
        relativePath: 'README.ja.md',
        content: '# 公開計算機\n\n人が読む公開案内を5言語で提供します。\n',
      },
      {
        relativePath: 'README.es.md',
        content: '# Calculadora pública\n\nGuías públicas dirigidas a lectores están disponibles en cinco idiomas.\n',
      },
      {
        relativePath: 'README.pt-BR.md',
        content: '# Calculadora pública\n\nGuias públicos destinados aos leitores estão disponíveis em cinco idiomas.\n',
      },
      {
        relativePath: path.join('v2-nextjs', 'source', 'lib', 'versionArchive.ts'),
        content: [
          'export const entries = [',
          '  {',
          "    version: 'v2.2.13',",
          "    series: 'v2-nextjs',",
          "    summary: 'The release note was updated after reviewing the internal workflow.',",
          '  },',
          '];',
          '',
        ].join('\n'),
      },
    ];

    for (const blockedCase of blockedCases) {
      const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-release-prose-block-'));
      const documentPath = path.join(root, blockedCase.relativePath);

      try {
        mkdirSync(path.dirname(documentPath), { recursive: true });
        writeFileSync(documentPath, blockedCase.content, 'utf8');

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
          'Internal release-process narrative remains in reader-facing v2 documents',
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  }, 90_000);

  it('blocks undated editorial narration and concrete engineering-process markers', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-release-prose-markers-'));
    const documentPath = path.join(
      root,
      'v2-nextjs',
      'releases',
      'v2.2.13',
      'README.md',
    );
    const blockedLines = [
      '## 릴리즈 노트 문서 정정',
      'We updated this release note after reviewing the internal workflow.',
      'The runtime, fixture, contract, and guardrail were recorded for the release.',
      'CI remained green after npm run build completed after a retry.',
      'The deployed commit abc123 was linked to PR #42.',
      '두 AI가 초안을 검토한 뒤 소유자가 승인했습니다.',
      'The local file path was C:\\Users\\example\\release.md.',
      'The content hash was recorded in the release note.',
    ];
    const blockedMarkers = [
      '## 릴리즈 노트 문서 정정',
      'We updated this release note',
      'The runtime, fixture, contract',
      'CI remained green',
      'The deployed commit abc123',
      '두 AI가 초안을 검토한 뒤 소유자가 승인했습니다.',
      'The local file path',
      'The content hash',
    ];

    try {
      mkdirSync(path.dirname(documentPath), { recursive: true });
      writeFileSync(documentPath, `# v2.2.13\n\n${blockedLines.join('\n')}\n`, 'utf8');

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
      const output = `${result.stdout}\n${result.stderr}`;
      expect(output).toContain('Internal release-process narrative remains');
      for (const blockedMarker of blockedMarkers) {
        expect(output).toContain(blockedMarker);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('does not scan protected v1 notes or broad technical documents for release prose', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-release-prose-scope-'));
    const v1Note = path.join(root, 'v1-gas', 'releases', 'v1.0.0', 'README.md');
    const technicalNote = path.join(root, 'docs', 'ops', 'release-runbook.md');
    const v2Note = path.join(root, 'v2-nextjs', 'releases', 'v2.2.11', 'README.md');
    const versionArchive = path.join(root, 'v2-nextjs', 'lib', 'versionArchive.ts');

    try {
      mkdirSync(path.dirname(v1Note), { recursive: true });
      mkdirSync(path.dirname(technicalNote), { recursive: true });
      mkdirSync(path.dirname(v2Note), { recursive: true });
      mkdirSync(path.dirname(versionArchive), { recursive: true });
      writeFileSync(path.join(root, 'README.md'), '# Public calculator\n', 'utf8');
      writeFileSync(
        v1Note,
        '# v1.0.0\n\n2026-07-17 추가 확인: 첫 테스트 실행이 실패했습니다.\n',
        'utf8',
      );
      writeFileSync(
        technicalNote,
        '# Internal runbook\n\n2026-08-09 문서 정정: build passed after database rebuild.\n',
        'utf8',
      );
      writeFileSync(
        v2Note,
        [
          '# v2.2.11',
          '',
          'Scoring data and OpenAI API keys are not stored in the server database.',
          'Existing protocols entered by the rules do not need recalculation.',
          'Clinicians should review the original response record when a legacy invalid code is found.',
          '공식 채점 규칙에 따라 계산 검증을 완료했습니다.',
          'Verification completed for the affected calculation boundary.',
          'La prueba de Rorschach se completó conforme al procedimiento clínico.',
          'O teste de Rorschach foi concluído conforme ao procedimento clínico.',
          '',
        ].join('\n'),
        'utf8',
      );
      writeFileSync(
        versionArchive,
        [
          'export const entries = [',
          '  {',
          "    version: 'v1.0.0',",
          "    series: 'v1-gas',",
          "    summary: 'Codex recorded an internal workflow, runtime, fixture, and contract.',",
          '  },',
          '  {',
          "    version: 'v2.2.11',",
          "    series: 'v2-nextjs',",
          "    summary: 'Verification completed for the affected calculation boundary.',",
          '  },',
          '];',
          '',
        ].join('\n'),
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

      expect(result.status).toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toContain(
        '[sanitize-only] public mirror boundary verified.',
      );
      expect(existsSync(v1Note)).toBe(true);
      expect(existsSync(technicalNote)).toBe(true);

      const v1RootResult = spawnSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          path.join(process.cwd(), 'scripts', 'publish.ps1'),
          '-SanitizeOnlyRoot',
          path.dirname(v1Note),
        ],
        { cwd: process.cwd(), encoding: 'utf8' },
      );
      expect(v1RootResult.status).toBe(0);
      expect(`${v1RootResult.stdout}\n${v1RootResult.stderr}`).toContain(
        '[sanitize-only] public mirror boundary verified.',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 90_000);

  it('enforces the prose guard during sanitize-only dry runs', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-release-prose-dry-'));
    try {
      writeFileSync(
        path.join(root, 'README.md'),
        '# Public calculator\n\n## 릴리즈 노트 문서 정정\n',
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
          '-DryRun',
        ],
        { cwd: process.cwd(), encoding: 'utf8' },
      );
      expect(result.status).not.toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toContain(
        'Internal release-process narrative remains',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('enforces the prose guard in direct-publish dry runs', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-release-prose-direct-'));
    const script = path.join(process.cwd(), 'scripts', 'publish.ps1');
    try {
      execFileSync('git', ['init', '--quiet'], { cwd: root, stdio: 'ignore' });
      writeFileSync(
        path.join(root, 'README.md'),
        '# Public calculator\n\nWe updated this release note after reviewing the internal workflow.\n',
        'utf8',
      );
      const result = spawnSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          script,
          '-UseCurrentRepo',
          '-DryRun',
          '-SkipVerify',
        ],
        { cwd: root, encoding: 'utf8' },
      );
      expect(result.status).not.toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toContain(
        'Internal release-process narrative remains',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('enforces the prose guard in sync and sync dry-run paths', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'rorschach-public-release-prose-sync-'));
    const sourceRoot = path.join(root, 'source');
    const publishRoot = path.join(root, 'public');
    const targetRoot = path.join(publishRoot, 'v2-nextjs', 'source');
    const script = path.join(process.cwd(), 'scripts', 'publish.ps1');

    try {
      mkdirSync(sourceRoot, { recursive: true });
      mkdirSync(targetRoot, { recursive: true });
      writeFileSync(path.join(sourceRoot, 'README.md'), '# Source mirror\n', 'utf8');
      writeFileSync(
        path.join(publishRoot, 'README.md'),
        '# Public calculator\n\nThe release note correction was recorded after PR #42.\n',
        'utf8',
      );

      for (const dryRun of [true, false]) {
        const args = [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          script,
          '-PublishRoot',
          publishRoot,
          '-PublishTargetRelativePath',
          path.join('v2-nextjs', 'source'),
          '-SyncOnly',
          '-SkipVerify',
        ];
        if (dryRun) {
          args.push('-DryRun');
        }
        const result = spawnSync('powershell.exe', args, {
          cwd: sourceRoot,
          encoding: 'utf8',
        });
        expect(result.status).not.toBe(0);
        expect(`${result.stdout}\n${result.stderr}`).toContain(
          'Internal release-process narrative remains',
        );
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 90_000);
});
