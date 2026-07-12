import fs from 'node:fs/promises';
import path from 'node:path';
import { SPECIAL_INDEX_EVIDENCE_TIERS } from './lib/specialIndexEvidence.mjs';
import { writeStableJsonArtifact } from './lib/stableJsonArtifact.mjs';

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const EVALS_ROOT = path.join(ROOT, 'docs', 'reference-authoring', 'evals');
const ROUTE_DOCS_PATH = path.join(GENERATED_ROOT, 'route-docs.json');
const OUTPUT_PATH = path.join(GENERATED_ROOT, 'qa-report.json');
const LOCALES = ['ko', 'en', 'ja', 'es', 'pt'];

const RUNTIME_PROVENANCE_PATTERNS = [
  'authorityPolicy=',
  'docs/reference-authoring/incoming',
];

const SPECIAL_INDEX_PREFIX = 'result-interpretation/special-indices';
const SPECIAL_INDEX_EVIDENCE_ROUTES = Object.fromEntries(
  Object.entries(SPECIAL_INDEX_EVIDENCE_TIERS).map(([key, tier]) => [
    key === 'overview' ? SPECIAL_INDEX_PREFIX : `${SPECIAL_INDEX_PREFIX}/${key}`,
    tier,
  ]),
);

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function decodeCanonicalRef(refTarget) {
  return refTarget
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .join('/');
}

function extractRefTargets(markdown) {
  return [...markdown.matchAll(/\(ref:\/\/([^)]+)\)/g)].map((match) => decodeCanonicalRef(match[1]));
}

async function loadQuerySet(locale) {
  const filePath = path.join(EVALS_ROOT, `${locale}-curated-query-set.json`);
  try {
    const data = await readJson(filePath);
    return {
      filePath: path.relative(ROOT, filePath).replace(/\\/g, '/'),
      data,
    };
  } catch {
    return null;
  }
}

function buildLocaleQuality(locale, docs, querySetEntry) {
  const routeSet = new Set(docs.map((doc) => doc.canonicalRoute));
  const inlineRefErrors = [];
  const runtimeProvenanceHits = [];
  const evidencePolicyErrors = [];
  let inlineRefCount = 0;

  for (const doc of docs) {
    const refs = extractRefTargets(doc.bodyMarkdown);
    inlineRefCount += refs.length;

    for (const ref of refs) {
      if (!routeSet.has(ref)) {
        inlineRefErrors.push({
          sourceRoute: doc.canonicalRoute,
          targetRoute: ref,
        });
      }
    }

    for (const pattern of RUNTIME_PROVENANCE_PATTERNS) {
      if (`${doc.bodyMarkdown}\n${doc.bodyText}`.includes(pattern)) {
        runtimeProvenanceHits.push({
          canonicalRoute: doc.canonicalRoute,
          pattern,
        });
      }
    }

    if (doc.authorityPolicy !== 'curated-internal-reference') {
      runtimeProvenanceHits.push({
        canonicalRoute: doc.canonicalRoute,
        pattern: `authorityPolicy:${doc.authorityPolicy}`,
      });
    }
  }

  for (const [canonicalRoute, expectedTier] of Object.entries(SPECIAL_INDEX_EVIDENCE_ROUTES)) {
    const doc = docs.find((candidate) => candidate.canonicalRoute === canonicalRoute);
    if (!doc || doc.evidenceTier !== expectedTier || !doc.bodyText.includes('[Evidence Strength]')) {
      evidencePolicyErrors.push({
        canonicalRoute,
        expectedTier,
        actualTier: doc?.evidenceTier ?? null,
      });
    }
  }

  const structural = {
    totalDocs: docs.length,
    entryDocs: docs.filter((doc) => doc.kind === 'entry').length,
    categoryDocs: docs.filter((doc) => doc.kind === 'category').length,
  };
  const structuralPass =
    structural.totalDocs === 203 && structural.entryDocs === 180 && structural.categoryDocs === 23;

  let querySet = {
    filePath: null,
    targetCount: 0,
    currentCount: 0,
    minimums: {},
    bucketCounts: {},
    missingRouteReferences: [],
    coveragePass: false,
  };

  if (querySetEntry) {
    const { filePath, data } = querySetEntry;
    const bucketCounts = data.queries.reduce((acc, item) => {
      acc[item.bucket] = (acc[item.bucket] ?? 0) + 1;
      return acc;
    }, {});
    const missingRouteReferences = data.queries.flatMap((item) => {
      const missing = [];
      if (!routeSet.has(item.expectedTopRoute)) {
        missing.push({ queryId: item.id, route: item.expectedTopRoute, kind: 'expectedTopRoute' });
      }
      for (const route of item.expectedIncludedRoutes ?? []) {
        if (!routeSet.has(route)) {
          missing.push({ queryId: item.id, route, kind: 'expectedIncludedRoute' });
        }
      }
      return missing;
    });
    const minimums = data.minimums ?? {};
    const coveragePass =
      data.queries.length >= (data.targetCount ?? 0) &&
      Object.entries(minimums).every(([bucket, minimum]) => (bucketCounts[bucket] ?? 0) >= minimum) &&
      missingRouteReferences.length === 0;

    querySet = {
      filePath,
      targetCount: data.targetCount ?? 0,
      currentCount: data.queries.length,
      minimums,
      bucketCounts,
      missingRouteReferences,
      coveragePass,
    };
  }

  const runtimeFlagPass = docs.every((doc) => doc.runtimeReady);
  const blockers = [];
  if (!structuralPass) blockers.push('shared-203-skeleton-mismatch');
  if (inlineRefErrors.length) blockers.push('broken-inline-ref-targets');
  if (runtimeProvenanceHits.length) blockers.push('runtime-provenance-exposure');
  if (evidencePolicyErrors.length) blockers.push('special-index-evidence-policy-mismatch');
  if (!querySet.coveragePass) blockers.push('query-set-coverage-incomplete');
  if (!runtimeFlagPass) blockers.push('runtime-ready-flags-not-promoted');

  return {
    structural: {
      ...structural,
      pass: structuralPass,
    },
    inlineRefs: {
      count: inlineRefCount,
      brokenTargets: inlineRefErrors,
      pass: inlineRefErrors.length === 0,
    },
    publicBodySourceTitles: {
      hits: runtimeProvenanceHits,
      pass: runtimeProvenanceHits.length === 0,
    },
    specialIndexEvidence: {
      errors: evidencePolicyErrors,
      pass: evidencePolicyErrors.length === 0,
    },
    querySet,
    runtimeFlags: {
      allRuntimeReady: runtimeFlagPass,
    },
    runtimePromotion: {
      readyToPromote: blockers.length === 0,
      blockers,
    },
  };
}

async function main() {
  const routeDocsArtifact = await readJson(ROUTE_DOCS_PATH);
  const localeQuality = {};

  for (const locale of LOCALES) {
    const docs = routeDocsArtifact.docsByLocale[locale] ?? [];
    const querySetEntry = await loadQuerySet(locale);
    localeQuality[locale] = buildLocaleQuality(locale, docs, querySetEntry);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    locales: LOCALES,
    localeQuality,
  };

  await fs.mkdir(GENERATED_ROOT, { recursive: true });
  await writeStableJsonArtifact(OUTPUT_PATH, report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
