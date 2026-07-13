import vectorSnapshotArtifact from '@/generated/reference-corpus/vector-release-snapshot.json';
import chunksArtifact from '@/generated/reference-corpus/chunks.json';
import type { Language } from '@/types';

export type VectorProvider = 'openai';

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
  corpus?: {
    generatedAt: string;
    fingerprint: string;
    chunkCounts: Partial<Record<Language, number>>;
  };
  totals: {
    localeCount: number;
    readyLocalesByProvider: Record<VectorProvider, number>;
    allProvidersReady: boolean;
  };
  providerAudit: {
    expectedProviders: VectorProvider[];
    unexpectedProviders: Array<{
      provider: string;
      totalEmbeddings: number;
    }>;
    unexpectedEmbeddingCount: number;
    clean: boolean;
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
const currentChunks = chunksArtifact as {
  generatedAt: string;
  corpusFingerprint?: string;
};
const SUPPORTED_VECTOR_PROVIDERS: VectorProvider[] = ['openai'];

export function isReferenceVectorSnapshotCurrent(): boolean {
  return Boolean(
    currentChunks.corpusFingerprint &&
      vectorSnapshot.corpus?.fingerprint === currentChunks.corpusFingerprint &&
      vectorSnapshot.corpus?.generatedAt === currentChunks.generatedAt,
  );
}

export function getReferenceVectorReleaseSnapshot(): ReferenceVectorReleaseSnapshot {
  const snapshotCurrent = isReferenceVectorSnapshotCurrent();
  const readyOpenAiLocales = snapshotCurrent
    ? vectorSnapshot.totals.readyLocalesByProvider.openai
    : 0;

  return {
    ...vectorSnapshot,
    providers: SUPPORTED_VECTOR_PROVIDERS,
    totals: {
      ...vectorSnapshot.totals,
      readyLocalesByProvider: {
        openai: readyOpenAiLocales,
      },
      allProvidersReady:
        readyOpenAiLocales === vectorSnapshot.totals.localeCount,
    },
    providerSnapshots: {
      openai: vectorSnapshot.providerSnapshots.openai,
    },
  };
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
  const snapshotCurrent = isReferenceVectorSnapshotCurrent();
  const locales = Object.values(providerSnapshot.locales).filter(
    (locale): locale is ReferenceVectorLocaleSnapshot => Boolean(locale),
  );
  const pendingLocales = locales
    .filter((locale) => !snapshotCurrent || !locale.ready)
    .map((locale) => locale.locale);
  const readyLocaleCount = snapshotCurrent
    ? locales.filter((locale) => locale.ready).length
    : 0;
  const staleEmbeddingCount = snapshotCurrent
    ? locales.reduce((sum, locale) => sum + locale.staleEmbeddingCount, 0)
    : providerSnapshot.totalEmbeddings;

  return {
    provider,
    embeddingModel: providerSnapshot.embeddingModel,
    dimensions: providerSnapshot.dimensions,
    totalEmbeddings: providerSnapshot.totalEmbeddings,
    latestRefreshedAt: providerSnapshot.latestRefreshedAt,
    localeCount: locales.length,
    readyLocaleCount,
    pendingLocaleCount: pendingLocales.length,
    staleEmbeddingCount,
    pendingLocales,
    ready: pendingLocales.length === 0 && locales.length > 0,
  };
}

export function getReferenceVectorProviderOverviews(): ReferenceVectorProviderOverview[] {
  return SUPPORTED_VECTOR_PROVIDERS.map((provider) => getReferenceVectorProviderOverview(provider));
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
  return (
    isReferenceVectorSnapshotCurrent() &&
    getReferenceVectorLocaleSnapshot(provider, locale)?.ready === true
  );
}

export function getReferenceVectorOverview() {
  const snapshotCurrent = isReferenceVectorSnapshotCurrent();
  const readyOpenAiLocales = snapshotCurrent
    ? vectorSnapshot.totals.readyLocalesByProvider.openai
    : 0;

  return {
    generatedAt: vectorSnapshot.generatedAt,
    snapshotCurrent,
    localeCount: vectorSnapshot.totals.localeCount,
    readyOpenAiLocales,
    allProvidersReady:
      readyOpenAiLocales === vectorSnapshot.totals.localeCount,
    openaiModel: vectorSnapshot.providerSnapshots.openai.embeddingModel,
    openaiLatestRefreshedAt: vectorSnapshot.providerSnapshots.openai.latestRefreshedAt,
    providerResidueFree: vectorSnapshot.providerAudit.clean,
    unexpectedEmbeddingCount: vectorSnapshot.providerAudit.unexpectedEmbeddingCount,
  };
}
