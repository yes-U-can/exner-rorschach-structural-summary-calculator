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

  it('serializes ready embedding timestamps as UTC instants after corpus generation', () => {
    const snapshot = getReferenceVectorReleaseSnapshot();
    const corpusGeneratedAt = Date.parse(snapshot.corpus?.generatedAt ?? '');
    const openAiSnapshot = snapshot.providerSnapshots.openai;

    expect(corpusGeneratedAt).not.toBeNaN();
    expect(Date.parse(openAiSnapshot.latestRefreshedAt ?? '')).toBeGreaterThanOrEqual(
      corpusGeneratedAt,
    );
    for (const localeSnapshot of Object.values(openAiSnapshot.locales)) {
      if (!localeSnapshot?.ready) continue;
      expect(Date.parse(localeSnapshot.latestRefreshedAt ?? '')).toBeGreaterThanOrEqual(
        corpusGeneratedAt,
      );
    }
  });

  it('reports unsupported provider rows instead of hiding them', () => {
    const snapshot = getReferenceVectorReleaseSnapshot();
    const unexpectedEmbeddingCount = snapshot.providerAudit.unexpectedProviders.reduce(
      (sum, provider) => sum + provider.totalEmbeddings,
      0,
    );

    expect(snapshot.providerAudit.expectedProviders).toEqual(['openai']);
    expect(snapshot.providerAudit.unexpectedEmbeddingCount).toBe(unexpectedEmbeddingCount);
    expect(snapshot.providerAudit.clean).toBe(unexpectedEmbeddingCount === 0);
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
