import { describe, expect, it } from 'vitest';
import {
  getReferenceVectorLocaleSnapshot,
  getReferenceVectorOverview,
  getReferenceVectorProviderOverview,
  getReferenceVectorProviderOverviews,
  getReferenceVectorReleaseSnapshot,
  isReferenceVectorRuntimeReady,
} from '@/lib/referenceVectorRuntime';

describe('referenceVectorRuntime', () => {
  it('exposes both supported vector providers', () => {
    const snapshot = getReferenceVectorReleaseSnapshot();

    expect(snapshot.providers).toEqual(['openai', 'google']);
  });

  it('reports not-ready runtime while embeddings are still missing', () => {
    const overview = getReferenceVectorOverview();

    expect(overview.readyOpenAiLocales).toBeGreaterThanOrEqual(0);
    expect(overview.readyOpenAiLocales).toBeLessThanOrEqual(overview.localeCount);
    expect(overview.readyGoogleLocales).toBeGreaterThanOrEqual(0);
    expect(overview.readyGoogleLocales).toBeLessThanOrEqual(overview.localeCount);
    expect(overview.allProvidersReady).toBe(
      overview.readyOpenAiLocales === overview.localeCount &&
        overview.readyGoogleLocales === overview.localeCount,
    );
  });

  it('returns locale snapshots for both providers', () => {
    const openAiKo = getReferenceVectorLocaleSnapshot('openai', 'ko');
    const googleKo = getReferenceVectorLocaleSnapshot('google', 'ko');

    expect(openAiKo).not.toBeNull();
    expect(googleKo).not.toBeNull();
    expect(openAiKo?.locale).toBe('ko');
    expect(googleKo?.locale).toBe('ko');
    expect(isReferenceVectorRuntimeReady('openai', 'ko')).toBe(openAiKo?.ready === true);
    expect(isReferenceVectorRuntimeReady('google', 'ko')).toBe(googleKo?.ready === true);
  });

  it('summarizes provider readiness and pending locales', () => {
    const openAiOverview = getReferenceVectorProviderOverview('openai');
    const googleOverview = getReferenceVectorProviderOverview('google');

    expect(openAiOverview.readyLocaleCount + openAiOverview.pendingLocaleCount).toBe(
      openAiOverview.localeCount,
    );
    expect(googleOverview.readyLocaleCount + googleOverview.pendingLocaleCount).toBe(
      googleOverview.localeCount,
    );
    expect(openAiOverview.pendingLocales.length).toBe(openAiOverview.pendingLocaleCount);
    expect(googleOverview.pendingLocales.length).toBe(googleOverview.pendingLocaleCount);
    expect(openAiOverview.ready).toBe(openAiOverview.pendingLocaleCount === 0 && openAiOverview.localeCount > 0);
    expect(googleOverview.ready).toBe(googleOverview.pendingLocaleCount === 0 && googleOverview.localeCount > 0);
  });

  it('returns provider overviews for the two supported providers', () => {
    const overviews = getReferenceVectorProviderOverviews();

    expect(overviews.map((overview) => overview.provider)).toEqual(['openai', 'google']);
  });
});
