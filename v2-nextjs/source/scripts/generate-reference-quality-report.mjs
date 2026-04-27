import fs from 'node:fs/promises';
import path from 'node:path';
import { writeStableJsonArtifact } from './lib/stableJsonArtifact.mjs';

const ROOT = process.cwd();
const GENERATED_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const EVALS_ROOT = path.join(ROOT, 'docs', 'reference-authoring', 'evals');
const ROUTE_DOCS_PATH = path.join(GENERATED_ROOT, 'route-docs.json');
const OUTPUT_PATH = path.join(GENERATED_ROOT, 'qa-report.json');
const LOCALES = ['ko', 'en', 'ja', 'es', 'pt'];

const SOURCE_TITLE_PATTERNS = [
  'The Rorschach: A Comprehensive System',
  'Manual de Codificación del Rorschach',
  'Principles of Rorschach Interpretation',
  'Contemporary Rorschach Interpretation',
  'Psychoanalytic Theory and the Rorschach',
  'The Handbook of Forensic Rorschach Assessment',
  'Integrating the Rorschach and the MMPI-2',
  '로샤 종합체계 부호화 및 해석 한글 가이드라인',
  'Exner',
];

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
  const sourceTitleHits = [];
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

    for (const pattern of SOURCE_TITLE_PATTERNS) {
      if (doc.bodyMarkdown.includes(pattern)) {
        sourceTitleHits.push({
          canonicalRoute: doc.canonicalRoute,
          pattern,
        });
      }
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
  if (sourceTitleHits.length) blockers.push('public-source-title-exposure');
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
      hits: sourceTitleHits,
      pass: sourceTitleHits.length === 0,
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
