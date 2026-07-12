import { describe, expect, it } from 'vitest';
import path from 'node:path';

const modulePath = path.resolve('scripts/lib/aiReleaseGate.mjs');

describe('AI release gate runner', () => {
  it('plans the default gate without executing commands in dry-run mode', async () => {
    const gate = await import(modulePath);
    const result = await gate.runAiReleaseGate({
      root: process.cwd(),
      dryRun: true,
      version: '2.1.5-test',
      now: () => new Date('2026-07-03T00:00:00.000Z'),
      runCommand: async () => {
        throw new Error('dry-run should not execute commands');
      },
    });

    expect(result.status).toBe('planned');
    expect(result.steps.map((step: { id: string }) => step.id)).toEqual([
      'reference_retrieval',
      'vector_runtime',
      'contracts',
      'artifacts',
      'human_records',
      'secret_scan',
      'dependency_audit',
    ]);
    expect(result.steps.every((step: { status: string }) => step.status === 'planned')).toBe(true);
  });

  it('stops on the first required failed step and records a finding', async () => {
    const gate = await import(modulePath);
    const calls: string[] = [];
    const steps = [
      {
        id: 'first',
        label: 'First required step',
        command: 'node',
        args: ['first.js'],
        required: true,
      },
      {
        id: 'second',
        label: 'Second required step',
        command: 'node',
        args: ['second.js'],
        required: true,
      },
    ];

    const result = await gate.runAiReleaseGate({
      root: process.cwd(),
      version: '2.1.5-test',
      steps,
      now: () => new Date('2026-07-03T00:00:00.000Z'),
      runCommand: async (step: { id: string }) => {
        calls.push(step.id);
        return { exitCode: 1 };
      },
    });

    expect(calls).toEqual(['first']);
    expect(result.status).toBe('fail');
    expect(result.findings).toEqual([
      expect.objectContaining({
        type: 'required_step_failed',
        stepId: 'first',
      }),
    ]);
  });

  it('renders a privacy-safe markdown report without command output', async () => {
    const gate = await import(modulePath);
    const result = await gate.runAiReleaseGate({
      root: process.cwd(),
      dryRun: true,
      version: '2.1.5-test',
      now: () => new Date('2026-07-03T00:00:00.000Z'),
      runCommand: async () => ({ exitCode: 0 }),
    });
    const markdown = gate.renderAiReleaseGateMarkdown(result, { cwd: process.cwd() });

    expect(markdown).toContain('AI Release Gate Report');
    expect(markdown).toContain('Version: 2.1.5-test');
    expect(markdown).toContain('Privacy Boundary');
    expect(markdown).not.toContain('stdout');
    expect(markdown).not.toContain('stderr');
  });

  it('parses skip lists and selects the remaining steps', async () => {
    const gate = await import(modulePath);
    const args = gate.parseAiReleaseGateArgs(['--skip', 'artifacts,human_records', '--dry-run']);
    const selected = gate.selectAiReleaseGateSteps(gate.DEFAULT_AI_RELEASE_GATE_STEPS, args.skip);

    expect(args.dryRun).toBe(true);
    expect(selected.map((step: { id: string }) => step.id)).toEqual([
      'reference_retrieval',
      'vector_runtime',
      'contracts',
      'secret_scan',
      'dependency_audit',
    ]);
  });
});
