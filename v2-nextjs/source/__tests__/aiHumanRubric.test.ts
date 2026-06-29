import { describe, expect, it } from 'vitest';
import rubric from '@/docs/ai-evals/human-rubric-v2.1.x.json';

const WORKFLOW_MODES = new Set(['coding_assist', 'interpretation']);

describe('AI human rubric', () => {
  it('has unique dimension and blocking failure ids', () => {
    const dimensionIds = rubric.dimensions.map((dimension) => dimension.id);
    const blockingFailureIds = rubric.blockingFailures.map((failure) => failure.id);

    expect(new Set(dimensionIds).size).toBe(dimensionIds.length);
    expect(new Set(blockingFailureIds).size).toBe(blockingFailureIds.length);
  });

  it('defines valid workflow applicability for dimensions and blocking failures', () => {
    for (const dimension of rubric.dimensions) {
      expect(dimension.appliesTo.length).toBeGreaterThan(0);
      for (const workflowMode of dimension.appliesTo) {
        expect(WORKFLOW_MODES.has(workflowMode)).toBe(true);
      }
    }

    for (const failure of rubric.blockingFailures) {
      expect(failure.appliesTo.length).toBeGreaterThan(0);
      for (const workflowMode of failure.appliesTo) {
        expect(WORKFLOW_MODES.has(workflowMode)).toBe(true);
      }
    }
  });

  it('keeps each workflow profile weighted to 100 using applicable dimensions', () => {
    const dimensionsById = new Map(rubric.dimensions.map((dimension) => [dimension.id, dimension]));

    for (const [workflowMode, profile] of Object.entries(rubric.workflowProfiles)) {
      let totalWeight = 0;

      for (const [dimensionId, weight] of Object.entries(profile.dimensionWeights)) {
        const dimension = dimensionsById.get(dimensionId);

        expect(dimension).toBeDefined();
        expect(dimension?.appliesTo).toContain(workflowMode);
        expect(Number.isInteger(weight)).toBe(true);
        expect(weight).toBeGreaterThan(0);

        totalWeight += weight;
      }

      expect(totalWeight).toBe(100);
    }
  });

  it('keeps the review record schema decision values explicit', () => {
    expect(rubric.reviewRecordSchema.requiredFields).toEqual(
      expect.arrayContaining([
        'artifactId',
        'fixtureId',
        'workflowMode',
        'locale',
        'model',
        'dimensionScores',
        'blockingFailures',
        'weightedScore',
        'decision',
      ]),
    );
    expect(rubric.reviewRecordSchema.decisionValues).toEqual(['pass', 'revise', 'fail']);
  });
});
