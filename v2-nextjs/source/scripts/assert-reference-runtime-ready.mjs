#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const generatedDir = path.join(root, 'generated', 'reference-corpus');
const manifestPath = path.join(generatedDir, 'manifest.json');
const routeDocsPath = path.join(generatedDir, 'route-docs.json');
const qaReportPath = path.join(generatedDir, 'qa-report.json');
const releaseSnapshotPath = path.join(generatedDir, 'release-snapshot.json');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing generated artifact: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function summarizeLocale(locale, manifestSummary, qualitySummary, releaseSummary) {
  return {
    locale,
    totalDocs: manifestSummary?.totalDocs ?? 0,
    runtimeReadyDocs: manifestSummary?.runtimeReadyDocs ?? 0,
    queryCoveragePass: Boolean(qualitySummary?.querySet?.coveragePass),
    inlineRefsPass: Boolean(qualitySummary?.inlineRefs?.pass),
    publicBodyPass: Boolean(qualitySummary?.publicBodySourceTitles?.pass),
    readyToPromote: Boolean(qualitySummary?.runtimePromotion?.readyToPromote),
    readyToServe: Boolean(releaseSummary?.readyToServe),
  };
}

function main() {
  const manifest = readJson(manifestPath);
  const routeDocs = readJson(routeDocsPath);
  const qaReport = readJson(qaReportPath);
  const releaseSnapshot = readJson(releaseSnapshotPath);

  const locales = releaseSnapshot.locales ?? [];
  assert(locales.length > 0, 'Release snapshot must contain at least one locale.');
  assert(
    Array.isArray(manifest.locales) && manifest.locales.length === locales.length,
    'Manifest locales and release snapshot locales must match.',
  );
  assert(
    releaseSnapshot.totals?.allLocalesReady === true,
    'Release snapshot reports locales that are not ready to serve.',
  );
  assert(
    (releaseSnapshot.totals?.localesWithBrokenRefs ?? []).length === 0,
    'Release snapshot reports locales with broken inline references.',
  );
  assert(
    (releaseSnapshot.totals?.localesWithBlockers ?? []).length === 0,
    'Release snapshot reports locales with promotion blockers.',
  );

  const rows = [];

  for (const locale of locales) {
    for (const doc of routeDocs.docsByLocale?.[locale] ?? []) {
      assert(
        !Object.hasOwn(doc, 'sourcePath') && !Object.hasOwn(doc, 'provenanceNote'),
        `Locale "${locale}" exposes an internal authoring path in route-docs.json (${doc.canonicalRoute}).`,
      );
    }
  }

  for (const locale of locales) {
    const manifestSummary = manifest.localeSummaries?.[locale];
    const qualitySummary = qaReport.localeQuality?.[locale];
    const releaseSummary = releaseSnapshot.localeSnapshots?.[locale];

    assert(manifestSummary, `Missing manifest locale summary for "${locale}".`);
    assert(qualitySummary, `Missing QA locale quality for "${locale}".`);
    assert(releaseSummary, `Missing release snapshot locale for "${locale}".`);

    assert(
      manifestSummary.activeRuntimeSource === 'reference-corpus',
      `Locale "${locale}" is not using reference-corpus as runtime source.`,
    );
    assert(
      manifestSummary.runtimeReadyDocs === manifestSummary.totalDocs,
      `Locale "${locale}" has runtime docs mismatch (${manifestSummary.runtimeReadyDocs}/${manifestSummary.totalDocs}).`,
    );
    assert(
      qualitySummary.querySet.coveragePass === true,
      `Locale "${locale}" failed query coverage gate.`,
    );
    assert(
      qualitySummary.inlineRefs.pass === true &&
        (qualitySummary.inlineRefs.brokenTargets?.length ?? 0) === 0,
      `Locale "${locale}" has broken inline references.`,
    );
    assert(
      qualitySummary.publicBodySourceTitles.pass === true &&
        (qualitySummary.publicBodySourceTitles.hits?.length ?? 0) === 0,
      `Locale "${locale}" still contains public body source title leaks.`,
    );
    assert(
      qualitySummary.runtimePromotion.readyToPromote === true &&
        (qualitySummary.runtimePromotion.blockers?.length ?? 0) === 0,
      `Locale "${locale}" is not ready to promote.`,
    );
    assert(
      releaseSummary.readyToServe === true,
      `Locale "${locale}" is not ready to serve in release snapshot.`,
    );

    rows.push(summarizeLocale(locale, manifestSummary, qualitySummary, releaseSummary));
  }

  console.log('[reference-runtime-ready]');
  console.table(rows);
  console.log(
    `All ${rows.length} locale corpora are promoted, runtime-ready, and safe to serve.`,
  );
}

try {
  main();
} catch (error) {
  console.error('[reference-runtime-ready] failed');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
