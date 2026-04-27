import vectorSnapshotArtifact from '@/generated/reference-corpus/vector-release-snapshot.json';
import type { Language } from '@/types';

export type VectorProvider = 'openai' | 'google';

export type ReferenceVectorLocaleSnapshot = {
  locale: Language;
  chunkCount: number;
  embeddedChunkCount: number;
  dimensions: number | null;
  staleEmbeddingCount: number;
  ready: boolean;
  latestRefreshedAt: string | null;
};

export type ReferenceVectorProviderSnapshot = {
  provider: VectorProvider;
  embeddingModel: string | null;
  dimensions: number | null;
  totalEmbeddings: number;
  latestRefreshedAt: string | null;
  locales: Partial<Record<Language, ReferenceVectorLocaleSnapshot>>;
};

export type ReferenceVectorReleaseSnapshot = {
  generatedAt: string | null;
  providers: VectorProvider[];
  totals: {
    localeCount: number;
    readyLocalesByProvider: Record<VectorProvider, number>;
    allProvidersReady: boolean;
  };
  providerSnapshots: Record<VectorProvider, ReferenceVectorProviderSnapshot>;
};

export type ReferenceVectorProviderOverview = {
  provider: VectorProvider;
  embeddingModel: string | null;
  dimensions: number | null;
  totalEmbeddings: number;
  latestRefreshedAt: string | null;
  localeCount: number;
  readyLocaleCount: number;
  pendingLocaleCount: number;
  staleEmbeddingCount: number;
  pendingLocales: Language[];
  ready: boolean;
};

const vectorSnapshot = vectorSnapshotArtifact as ReferenceVectorReleaseSnapshot;

export function getReferenceVectorReleaseSnapshot(): ReferenceVectorReleaseSnapshot {
  return vectorSnapshot;
}

export function getReferenceVectorProviderSnapshot(
  provider: VectorProvider,
): ReferenceVectorProviderSnapshot {
  return vectorSnapshot.providerSnapshots[provider];
}

export function getReferenceVectorProviderOverview(
  provider: VectorProvider,
): ReferenceVectorProviderOverview {
  const providerSnapshot = getReferenceVectorProviderSnapshot(provider);
  const locales = Object.values(providerSnapshot.locales).filter(
    (locale): locale is ReferenceVectorLocaleSnapshot => Boolean(locale),
  );
  const pendingLocales = locales.filter((locale) => !locale.ready).map((locale) => locale.locale);
  const staleEmbeddingCount = locales.reduce((sum, locale) => sum + locale.staleEmbeddingCount, 0);

  return {
    provider,
    embeddingModel: providerSnapshot.embeddingModel,
    dimensions: providerSnapshot.dimensions,
    totalEmbeddings: providerSnapshot.totalEmbeddings,
    latestRefreshedAt: providerSnapshot.latestRefreshedAt,
    localeCount: locales.length,
    readyLocaleCount: locales.filter((locale) => locale.ready).length,
    pendingLocaleCount: pendingLocales.length,
    staleEmbeddingCount,
    pendingLocales,
    ready: pendingLocales.length === 0 && locales.length > 0,
  };
}

export function getReferenceVectorProviderOverviews(): ReferenceVectorProviderOverview[] {
  return vectorSnapshot.providers.map((provider) => getReferenceVectorProviderOverview(provider));
}

export function getReferenceVectorLocaleSnapshot(
  provider: VectorProvider,
  locale: Language,
): ReferenceVectorLocaleSnapshot | null {
  return getReferenceVectorProviderSnapshot(provider).locales[locale] ?? null;
}

export function isReferenceVectorRuntimeReady(
  provider: VectorProvider,
  locale: Language,
): boolean {
  return getReferenceVectorLocaleSnapshot(provider, locale)?.ready === true;
}

export function getReferenceVectorOverview() {
  return {
    generatedAt: vectorSnapshot.generatedAt,
    localeCount: vectorSnapshot.totals.localeCount,
    readyOpenAiLocales: vectorSnapshot.totals.readyLocalesByProvider.openai,
    readyGoogleLocales: vectorSnapshot.totals.readyLocalesByProvider.google,
    allProvidersReady: vectorSnapshot.totals.allProvidersReady,
    openaiModel: vectorSnapshot.providerSnapshots.openai.embeddingModel,
    googleModel: vectorSnapshot.providerSnapshots.google.embeddingModel,
    openaiLatestRefreshedAt: vectorSnapshot.providerSnapshots.openai.latestRefreshedAt,
    googleLatestRefreshedAt: vectorSnapshot.providerSnapshots.google.latestRefreshedAt,
  };
}
