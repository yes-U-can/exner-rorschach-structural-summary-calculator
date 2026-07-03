import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import rubric from '@/docs/ai-evals/human-rubric-v2.1.x.json';

const SCRIPT_PATH = path.resolve('scripts/score-ai-human-review-records.mjs');
const TEMP_DIRS: string[] = [];

type WorkflowMode = keyof typeof rubric.workflowProfiles;

function makeTempDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'sicp-ai-human-review-'));
  TEMP_DIRS.push(dir);
  return dir;
}

function dimensionScoresFor(workflowMode: WorkflowMode, score: number) {
  return Object.fromEntries(
    Object.keys(rubric.workflowProfiles[workflowMode].dimensionWeights).map((dimensionId) => [
      dimensionId,
      score,
    ]),
  );
}

function reviewRecord(overrides: Record<string, unknown> = {}) {
  return {
    type: 'human_review_record',
    artifactId: '2026-07-03-v2.1.4-example',
    fixtureId: 'coding-en-fq-followup-keeps-row-boundary',
    workflowMode: 'coding_assist',
    locale: 'en',
    model: 'gpt-5.5',
    reviewerRole: 'clinical_reviewer',
    dimensionScores: dimensionScoresFor('coding_assist', 4),
    blockingFailures: [],
    weightedScore: 100,
    decision: 'pass',
    notes: 'Synthetic review record used to verify rubric math and metadata shape.',
    ...overrides,
  };
}

function writeJsonl(dir: string, records: unknown[]) {
  const filePath = path.join(dir, 'records.jsonl');
  writeFileSync(filePath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8');
  return filePath;
}

function runScorer(input: string, extraArgs: string[] = []) {
  return spawnSync(process.execPath, [SCRIPT_PATH, '--input', input, ...extraArgs], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

afterEach(() => {
  while (TEMP_DIRS.length) {
    const dir = TEMP_DIRS.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('AI human review record scorer', () => {
  it('validates clean JSONL records and recomputes rubric decisions', () => {
    const dir = makeTempDir();
    writeJsonl(dir, [reviewRecord()]);

    const result = runScorer(dir, ['--json']);
    const parsed = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(parsed.total.records).toBe(1);
    expect(parsed.total.decisionCounts).toEqual({ pass: 1 });
    expect(parsed.total.averageWeightedScore).toBe(100);
    expect(parsed.total.findings).toEqual([]);
  });

  it('fails records with a stale weighted score', () => {
    const dir = makeTempDir();
    writeJsonl(dir, [reviewRecord({ weightedScore: 75 })]);

    const result = runScorer(dir);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('weighted_score_mismatch');
  });

  it('fails records that keep a pass decision despite a blocking failure', () => {
    const dir = makeTempDir();
    writeJsonl(dir, [
      reviewRecord({
        blockingFailures: ['auto_applied_or_claimed_edit'],
        decision: 'pass',
      }),
    ]);

    const result = runScorer(dir);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('decision_mismatch');
  });

  it('fails records that include raw model output fields', () => {
    const dir = makeTempDir();
    writeJsonl(dir, [reviewRecord({ output: 'raw model output must not be stored' })]);

    const result = runScorer(dir);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('raw_model_output_field');
  });

  it('can enforce a release gate that requires every reviewed record to pass', () => {
    const dir = makeTempDir();
    writeJsonl(dir, [
      reviewRecord({
        dimensionScores: dimensionScoresFor('coding_assist', 2),
        weightedScore: 50,
        decision: 'fail',
      }),
    ]);

    const result = runScorer(dir, ['--require-pass']);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('non_passing_review_record');
  });
});
