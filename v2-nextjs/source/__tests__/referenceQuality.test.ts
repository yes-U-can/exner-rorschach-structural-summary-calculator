import { describe, expect, it } from 'vitest';

import { getReferenceLocaleQuality } from '@/lib/referenceQuality';

describe('reference corpus quality report', () => {
  it('reports a clean KO inline-link and public-body state', () => {
    const quality = getReferenceLocaleQuality('ko');

    expect(quality.structural.pass).toBe(true);
    expect(quality.inlineRefs.pass).toBe(true);
    expect(quality.publicBodySourceTitles.pass).toBe(true);
  });

  it('marks KO as promotion-ready after runtime flags are promoted', () => {
    const quality = getReferenceLocaleQuality('ko');

    expect(quality.querySet.currentCount).toBeGreaterThan(0);
    expect(quality.querySet.currentCount).toBeGreaterThanOrEqual(quality.querySet.targetCount);
    expect(quality.querySet.coveragePass).toBe(true);
    expect(quality.runtimeFlags.allRuntimeReady).toBe(true);
    expect(quality.runtimePromotion.readyToPromote).toBe(true);
    expect(quality.runtimePromotion.blockers).toHaveLength(0);
  });
});
