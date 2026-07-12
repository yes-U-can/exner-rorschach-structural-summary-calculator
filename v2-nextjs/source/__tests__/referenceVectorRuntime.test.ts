import { describe, expect, it } from 'vitest';
import {
  getReferenceVectorLocaleSnapshot,
  getReferenceVectorOverview,
  getReferenceVectorProviderOverview,
  getReferenceVectorProviderOverviews,
  getReferenceVectorReleaseSnapshot,
  isReferenceVectorSnapshotCurrent,
  isReferenceVectorRuntimeReady,
} from '@/lib/referenceVectorRuntime';

describe('referenceVectorRuntime', () => {
  it('exposes the supported OpenAI vector provider', () => {
    const snapshot = getReferenceVectorReleaseSnapshot();

    expect(snapshot.providers).toEqual(['openai']);
    expect(snapshot.corpus?.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(isReferenceVectorSnapshotCurrent()).toBe(true);
  });

  it('reports not-ready runtime while embeddings are still missing', () => {
    const overview = getReferenceVectorOverview();

    expect(overview.readyOpenAiLocales).toBeGreaterThanOrEqual(0);
    expect(overview.readyOpenAiLocales).toBeLessThanOrEqual(overview.localeCount);
    expect(overview.allProvidersReady).toBe(overview.readyOpenAiLocales === overview.localeCount);
    expect(overview.snapshotCurrent).toBe(isReferenceVectorSnapshotCurrent());
  });

  it('returns locale snapshots for OpenAI', () => {
    const openAiKo = getReferenceVectorLocaleSnapshot('openai', 'ko');

    expect(openAiKo).not.toBeNull();
    expect(openAiKo?.locale).toBe('ko');
    expect(isReferenceVectorRuntimeReady('openai', 'ko')).toBe(
      isReferenceVectorSnapshotCurrent() && openAiKo?.ready === true,
    );
  });

  it('summarizes provider readiness and pending locales', () => {
    const openAiOverview = getReferenceVectorProviderOverview('openai');

    expect(openAiOverview.readyLocaleCount + openAiOverview.pendingLocaleCount).toBe(
      openAiOverview.localeCount,
    );
    expect(openAiOverview.pendingLocales.length).toBe(openAiOverview.pendingLocaleCount);
    expect(openAiOverview.ready).toBe(openAiOverview.pendingLocaleCount === 0 && openAiOverview.localeCount > 0);
  });

  it('returns provider overviews for the supported provider', () => {
    const overviews = getReferenceVectorProviderOverviews();

    expect(overviews.map((overview) => overview.provider)).toEqual(['openai']);
  });
});
