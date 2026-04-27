import fs from 'node:fs/promises';
import path from 'node:path';
import { writeStableJsonArtifact } from './lib/stableJsonArtifact.mjs';

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const MANIFEST_PATH = path.join(GENERATED_ROOT, 'manifest.json');
const QA_REPORT_PATH = path.join(GENERATED_ROOT, 'qa-report.json');
const PROMOTION_PATH = path.join(ROOT, 'docs', 'reference-authoring', 'runtime-promotion.json');
const OUTPUT_PATH = path.join(GENERATED_ROOT, 'release-snapshot.json');

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function buildLocaleSnapshot(locale, manifestSummary, qualitySummary, promotionConfig) {
  const inlineBrokenCount = qualitySummary.inlineRefs.brokenTargets.length;
  const publicSourceHitCount = qualitySummary.publicBodySourceTitles.hits.length;
  const readyToServe =
    manifestSummary.activeRuntimeSource === 'reference-corpus' &&
    manifestSummary.runtimeReadyDocs === manifestSummary.totalDocs &&
    qualitySummary.runtimePromotion.readyToPromote &&
    inlineBrokenCount === 0 &&
    publicSourceHitCount === 0;

  return {
    locale,
    totalDocs: manifestSummary.totalDocs,
    entryDocs: manifestSummary.entryDocs,
    categoryDocs: manifestSummary.categoryDocs,
    runtimeReadyDocs: manifestSummary.runtimeReadyDocs,
    statusCounts: manifestSummary.statusCounts,
    activeRuntimeSource: manifestSummary.activeRuntimeSource,
    authorityPolicies: manifestSummary.authorityPolicies,
    promotionEnabled: manifestSummary.promotionEnabled,
    promotedAt: manifestSummary.promotedAt,
    promotionReason: manifestSummary.promotionReason,
    version: promotionConfig.version ?? null,
    structural: qualitySummary.structural,
    querySet: {
      filePath: qualitySummary.querySet.filePath,
      currentCount: qualitySummary.querySet.currentCount,
      targetCount: qualitySummary.querySet.targetCount,
      coveragePass: qualitySummary.querySet.coveragePass,
      bucketCounts: qualitySummary.querySet.bucketCounts,
    },
    inlineRefs: {
      count: qualitySummary.inlineRefs.count,
      brokenTargetsCount: inlineBrokenCount,
      pass: qualitySummary.inlineRefs.pass,
    },
    publicBodySourceTitles: {
      hitsCount: publicSourceHitCount,
      pass: qualitySummary.publicBodySourceTitles.pass,
    },
    runtimePromotion: {
      readyToPromote: qualitySummary.runtimePromotion.readyToPromote,
      blockers: qualitySummary.runtimePromotion.blockers,
    },
    runtimeFlags: qualitySummary.runtimeFlags,
    readyToServe,
  };
}

async function main() {
  const manifest = await readJson(MANIFEST_PATH);
  const qaReport = await readJson(QA_REPORT_PATH);
  const promotionConfig = await readJson(PROMOTION_PATH);
  const localeSnapshots = {};

  for (const locale of manifest.locales) {
    localeSnapshots[locale] = buildLocaleSnapshot(
      locale,
      manifest.localeSummaries[locale],
      qaReport.localeQuality[locale],
      promotionConfig,
    );
  }

  const locales = manifest.locales;
  const allLocalesReady = locales.every((locale) => localeSnapshots[locale].readyToServe);
  const promotedLocales = locales.filter((locale) => localeSnapshots[locale].promotionEnabled).length;
  const runtimeLocales = locales.filter(
    (locale) => localeSnapshots[locale].activeRuntimeSource === 'reference-corpus',
  ).length;
  const localesWithBrokenRefs = locales.filter(
    (locale) => localeSnapshots[locale].inlineRefs.brokenTargetsCount > 0,
  );
  const localesWithBlockers = locales.filter(
    (locale) => localeSnapshots[locale].runtimePromotion.blockers.length > 0,
  );

  const snapshot = {
    generatedAt: new Date().toISOString(),
    version: promotionConfig.version ?? null,
    locales,
    totals: {
      localeCount: locales.length,
      promotedLocales,
      runtimeLocales,
      allLocalesReady,
      localesWithBrokenRefs,
      localesWithBlockers,
    },
    localeSnapshots,
  };

  await fs.mkdir(GENERATED_ROOT, { recursive: true });
  await writeStableJsonArtifact(OUTPUT_PATH, snapshot);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
