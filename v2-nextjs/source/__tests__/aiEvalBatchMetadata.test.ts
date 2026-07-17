import { describe, expect, it } from 'vitest';
import { classifyRunFailure } from '../scripts/lib/liveEvalBatch.mjs';

describe('AI live-eval batch metadata', () => {
  it('does not report a failure reason for a successful run', () => {
    expect(classifyRunFailure({ exitCode: 0, stdout: '', stderr: '' }, [{}])).toBeNull();
  });

  it('records a privacy-safe failure category without storing raw diagnostics', () => {
    expect(
      classifyRunFailure(
        { exitCode: 1, stdout: '', stderr: 'OpenAI request failed: insufficient_quota' },
        [],
      ),
    ).toBe('provider_quota_exceeded');
  });

  it('distinguishes assertion failures from runs that produced no fixtures', () => {
    expect(
      classifyRunFailure({ exitCode: 1, stdout: 'Failed Tests 1', stderr: '' }, [{}]),
    ).toBe('evaluation_assertion_failed');
    expect(classifyRunFailure({ exitCode: 1, stdout: '', stderr: '' }, [])).toBe(
      'no_fixture_results',
    );
  });
});
