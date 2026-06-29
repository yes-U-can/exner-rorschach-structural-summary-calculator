import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT_PATH = path.resolve('scripts/summarize-ai-eval-artifacts.mjs');
const TEMP_DIRS: string[] = [];

function makeTempDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'sicp-ai-eval-artifacts-'));
  TEMP_DIRS.push(dir);
  return dir;
}

function fixtureResult(overrides: Record<string, unknown> = {}) {
  return {
    type: 'fixture_result',
    round: 1,
    locale: 'en',
    model: 'gpt-4o-mini',
    retrieval: 'runtime',
    costUsd: 0.00012345,
    fixtureId: 'coding-en-no-auto-apply',
    status: 'completed',
    incompleteReason: null,
    outputChars: 180,
    issueTypes: [],
    usage: {
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
    },
    ...overrides,
  };
}

function writeJsonl(dir: string, fileName: string, records: unknown[]) {
  writeFileSync(
    path.join(dir, fileName),
    `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
    'utf8',
  );
}

function writePassingFinalPass(dir: string) {
  writeJsonl(dir, 'sample-final-pass.jsonl', [
    {
      type: 'batch_start',
      startedAt: '2026-06-28T00:00:00.000Z',
      model: 'gpt-4o-mini',
      locales: ['en'],
      rounds: 1,
      retrieval: 'runtime',
      budgetUsd: 1,
      ids: null,
    },
    fixtureResult(),
    {
      type: 'run_end',
      round: 1,
      locale: 'en',
      exitCode: 0,
      fixtureCount: 1,
      runCostUsd: 0.00012345,
      totalCostUsd: 0.00012345,
    },
    {
      type: 'batch_summary',
      finishedAt: '2026-06-28T00:01:00.000Z',
      model: 'gpt-4o-mini',
      locales: ['en'],
      rounds: 1,
      retrieval: 'runtime',
      totalCalls: 1,
      failedRuns: 0,
      totalCostUsd: 0.00012345,
      issueCounts: {},
    },
  ]);
}

function runAudit(dir: string) {
  return spawnSync(process.execPath, [SCRIPT_PATH, '--dir', dir], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

afterEach(() => {
  while (TEMP_DIRS.length) {
    const dir = TEMP_DIRS.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('AI eval artifact audit script', () => {
  it('summarizes clean final-pass JSONL artifacts', () => {
    const dir = makeTempDir();
    writePassingFinalPass(dir);

    const output = execFileSync(process.execPath, [SCRIPT_PATH, '--dir', dir, '--json'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const result = JSON.parse(output);

    expect(result.total.fixtureResults).toBe(1);
    expect(result.total.finalPassFixtureResults).toBe(1);
    expect(result.total.finalPassIssueBearingFixtureResults).toBe(0);
    expect(result.total.findings).toEqual([]);
  });

  it('fails final-pass artifacts with issue-bearing fixture results', () => {
    const dir = makeTempDir();
    writeJsonl(dir, 'issue-final-pass.jsonl', [
      fixtureResult({ issueTypes: ['forbidden_phrase'] }),
      {
        type: 'batch_summary',
        totalCalls: 1,
        failedRuns: 0,
        totalCostUsd: 0.00012345,
        issueCounts: { forbidden_phrase: 1 },
      },
    ]);

    const result = runAudit(dir);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('final_pass_regression');
  });

  it('fails artifacts that include raw model output fields', () => {
    const dir = makeTempDir();
    writeJsonl(dir, 'raw-output-final-pass.jsonl', [
      fixtureResult({ output: 'raw model answer should not be stored' }),
      {
        type: 'batch_summary',
        totalCalls: 1,
        failedRuns: 0,
        totalCostUsd: 0.00012345,
        issueCounts: {},
      },
    ]);

    const result = runAudit(dir);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('raw_model_output_field');
  });
});
