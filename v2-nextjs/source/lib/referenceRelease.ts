import releaseSnapshotArtifact from '@/generated/reference-corpus/release-snapshot.json';
import qaReportArtifact from '@/generated/reference-corpus/qa-report.json';
import type { Language } from '@/types';

export type ReferenceReleaseLocaleSnapshot = {
  locale: Language;
  totalDocs: number;
  entryDocs: number;
  categoryDocs: number;
  runtimeReadyDocs: number;
  statusCounts: Record<'stub' | 'draft' | 'reviewed' | 'locked', number>;
  activeRuntimeSource: 'reference-corpus';
  authorityPolicies: string[];
  promotionEnabled: boolean;
  promotedAt: string | null;
  promotionReason: string | null;
  version: string | null;
  structural: {
    totalDocs: number;
    entryDocs: number;
    categoryDocs: number;
    pass: boolean;
  };
  querySet: {
    filePath: string | null;
    currentCount: number;
    targetCount: number;
    coveragePass: boolean;
    bucketCounts: Record<string, number>;
  };
  inlineRefs: {
    count: number;
    brokenTargetsCount: number;
    pass: boolean;
  };
  publicBodySourceTitles: {
    hitsCount: number;
    pass: boolean;
  };
  runtimePromotion: {
    readyToPromote: boolean;
    blockers: string[];
  };
  runtimeFlags: {
    allRuntimeReady: boolean;
  };
  readyToServe: boolean;
};

type ReferenceReleaseSnapshot = {
  generatedAt: string;
  version: string | null;
  locales: Language[];
  totals: {
    localeCount: number;
    promotedLocales: number;
    runtimeLocales: number;
    allLocalesReady: boolean;
    localesWithBrokenRefs: Language[];
    localesWithBlockers: Language[];
  };
  localeSnapshots: Record<Language, ReferenceReleaseLocaleSnapshot>;
};

const releaseSnapshot = releaseSnapshotArtifact as ReferenceReleaseSnapshot;
type QaLocaleBucketCounts = Record<string, number>;
type QaLocaleQuality = {
  querySet: {
    targetCount: number;
    currentCount: number;
    minimums: QaLocaleBucketCounts;
    bucketCounts: QaLocaleBucketCounts;
    missingRouteReferences: string[];
    coveragePass: boolean;
  };
  inlineRefs: {
    count: number;
    brokenTargets: string[];
    pass: boolean;
  };
  publicBodySourceTitles: {
    hits: string[];
    pass: boolean;
  };
};
type ReferenceQaReport = {
  localeQuality: Record<Language, QaLocaleQuality>;
};

const qaReport = qaReportArtifact as ReferenceQaReport;

export type ReferenceReleaseOverview = {
  generatedAt: string;
  version: string | null;
  localeCount: number;
  readyLocales: number;
  promotedLocales: number;
  runtimeLocales: number;
  localesWithBrokenRefsCount: number;
  localesWithBlockersCount: number;
  allLocalesReady: boolean;
};

export type ReferenceReleaseLocaleGateSummary = {
  structuralPass: boolean;
  queryCoveragePass: boolean;
  inlineRefsPass: boolean;
  publicBodySourceTitlesPass: boolean;
  promotionReady: boolean;
  readyToServe: boolean;
  blockers: string[];
};

export type ReferenceReleaseQueryBucketSummary = {
  bucket: string;
  currentCount: number;
  minimumCount: number;
  pass: boolean;
};

export type ReferenceReleaseLocaleQualitySummary = {
  queryBuckets: ReferenceReleaseQueryBucketSummary[];
  missingRouteReferencesCount: number;
  brokenInlineRefTargetsCount: number;
  publicBodySourceHitsCount: number;
};

export function getReferenceReleaseSnapshot(): ReferenceReleaseSnapshot {
  return releaseSnapshot;
}

export function getReferenceLocaleReleaseSnapshot(
  locale: Language,
): ReferenceReleaseLocaleSnapshot {
  return releaseSnapshot.localeSnapshots[locale];
}

export function getReferenceReleaseOverview(): ReferenceReleaseOverview {
  const readyLocales = releaseSnapshot.locales.filter(
    (locale) => releaseSnapshot.localeSnapshots[locale].readyToServe,
  ).length;

  return {
    generatedAt: releaseSnapshot.generatedAt,
    version: releaseSnapshot.version,
    localeCount: releaseSnapshot.totals.localeCount,
    readyLocales,
    promotedLocales: releaseSnapshot.totals.promotedLocales,
    runtimeLocales: releaseSnapshot.totals.runtimeLocales,
    localesWithBrokenRefsCount: releaseSnapshot.totals.localesWithBrokenRefs.length,
    localesWithBlockersCount: releaseSnapshot.totals.localesWithBlockers.length,
    allLocalesReady: releaseSnapshot.totals.allLocalesReady,
  };
}

export function getReferenceLocaleGateSummary(
  locale: Language,
): ReferenceReleaseLocaleGateSummary {
  const snapshot = getReferenceLocaleReleaseSnapshot(locale);

  return {
    structuralPass: snapshot.structural.pass,
    queryCoveragePass: snapshot.querySet.coveragePass,
    inlineRefsPass: snapshot.inlineRefs.pass,
    publicBodySourceTitlesPass: snapshot.publicBodySourceTitles.pass,
    promotionReady: snapshot.runtimePromotion.readyToPromote,
    readyToServe: snapshot.readyToServe,
    blockers: snapshot.runtimePromotion.blockers,
  };
}

export function getReferenceLocaleQualitySummary(
  locale: Language,
): ReferenceReleaseLocaleQualitySummary {
  const localeQuality = qaReport.localeQuality[locale];
  const minimums = localeQuality?.querySet.minimums ?? {};
  const bucketCounts = localeQuality?.querySet.bucketCounts ?? {};
  const bucketNames = Array.from(
    new Set([...Object.keys(minimums), ...Object.keys(bucketCounts)]),
  );

  return {
    queryBuckets: bucketNames.map((bucket) => ({
      bucket,
      currentCount: bucketCounts[bucket] ?? 0,
      minimumCount: minimums[bucket] ?? 0,
      pass: (bucketCounts[bucket] ?? 0) >= (minimums[bucket] ?? 0),
    })),
    missingRouteReferencesCount: localeQuality?.querySet.missingRouteReferences.length ?? 0,
    brokenInlineRefTargetsCount: localeQuality?.inlineRefs.brokenTargets.length ?? 0,
    publicBodySourceHitsCount: localeQuality?.publicBodySourceTitles.hits.length ?? 0,
  };
}
