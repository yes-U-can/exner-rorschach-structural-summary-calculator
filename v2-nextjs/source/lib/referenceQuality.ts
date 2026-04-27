import qaReportArtifact from '@/generated/reference-corpus/qa-report.json';
import type { Language } from '@/types';

type QuerySetBucket = 'coding' | 'interpretation' | 'graph-navigation';

export type ReferenceLocaleQuality = {
  structural: {
    totalDocs: number;
    entryDocs: number;
    categoryDocs: number;
    pass: boolean;
  };
  inlineRefs: {
    count: number;
    brokenTargets: Array<{
      sourceRoute: string;
      targetRoute: string;
    }>;
    pass: boolean;
  };
  publicBodySourceTitles: {
    hits: Array<{
      canonicalRoute: string;
      pattern: string;
    }>;
    pass: boolean;
  };
  querySet: {
    filePath: string | null;
    targetCount: number;
    currentCount: number;
    minimums: Partial<Record<QuerySetBucket, number>>;
    bucketCounts: Partial<Record<QuerySetBucket, number>>;
    missingRouteReferences: Array<{
      queryId: string;
      route: string;
      kind: 'expectedTopRoute' | 'expectedIncludedRoute';
    }>;
    coveragePass: boolean;
  };
  runtimeFlags: {
    allRuntimeReady: boolean;
  };
  runtimePromotion: {
    readyToPromote: boolean;
    blockers: string[];
  };
};

type ReferenceQualityArtifact = {
  generatedAt: string;
  locales: Language[];
  localeQuality: Record<Language, ReferenceLocaleQuality>;
};

const qaReport = qaReportArtifact as ReferenceQualityArtifact;

export function getReferenceQualityReport(): ReferenceQualityArtifact {
  return qaReport;
}

export function getReferenceLocaleQuality(locale: Language): ReferenceLocaleQuality {
  return qaReport.localeQuality[locale];
}
