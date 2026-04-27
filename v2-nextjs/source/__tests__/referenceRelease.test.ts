import { describe, expect, it } from 'vitest';

import {
  getReferenceLocaleGateSummary,
  getReferenceLocaleQualitySummary,
  getReferenceLocaleReleaseSnapshot,
  getReferenceReleaseOverview,
  getReferenceReleaseSnapshot,
} from '@/lib/referenceRelease';

describe('reference release snapshot', () => {
  it('keeps all locales in a ready-to-serve state', () => {
    const snapshot = getReferenceReleaseSnapshot();

    expect(snapshot.locales).toEqual(['ko', 'en', 'ja', 'es', 'pt']);
    expect(snapshot.totals.allLocalesReady).toBe(true);

    for (const locale of snapshot.locales) {
      const localeSnapshot = getReferenceLocaleReleaseSnapshot(locale);
      expect(localeSnapshot.totalDocs).toBe(203);
      expect(localeSnapshot.runtimeReadyDocs).toBe(203);
      expect(localeSnapshot.inlineRefs.brokenTargetsCount).toBe(0);
      expect(localeSnapshot.readyToServe).toBe(true);
    }
  });

  it('summarizes the overall release state', () => {
    const overview = getReferenceReleaseOverview();

    expect(overview.localeCount).toBe(5);
    expect(overview.readyLocales).toBe(5);
    expect(overview.promotedLocales).toBe(5);
    expect(overview.runtimeLocales).toBe(5);
    expect(overview.localesWithBrokenRefsCount).toBe(0);
    expect(overview.localesWithBlockersCount).toBe(0);
    expect(overview.allLocalesReady).toBe(true);
    expect(overview.generatedAt).toBeTruthy();
  });

  it('exposes per-locale gate checks', () => {
    const gate = getReferenceLocaleGateSummary('ko');

    expect(gate.structuralPass).toBe(true);
    expect(gate.queryCoveragePass).toBe(true);
    expect(gate.inlineRefsPass).toBe(true);
    expect(gate.publicBodySourceTitlesPass).toBe(true);
    expect(gate.promotionReady).toBe(true);
    expect(gate.readyToServe).toBe(true);
    expect(gate.blockers).toEqual([]);
  });

  it('exposes per-locale query bucket quality details', () => {
    const quality = getReferenceLocaleQualitySummary('ko');

    expect(quality.missingRouteReferencesCount).toBe(0);
    expect(quality.brokenInlineRefTargetsCount).toBe(0);
    expect(quality.publicBodySourceHitsCount).toBe(0);
    expect(quality.queryBuckets).toEqual([
      { bucket: 'coding', currentCount: 40, minimumCount: 40, pass: true },
      { bucket: 'interpretation', currentCount: 40, minimumCount: 40, pass: true },
      { bucket: 'graph-navigation', currentCount: 20, minimumCount: 20, pass: true },
    ]);
  });
});
