import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { selectRelevantKnowledge, type KnowledgeItem } from '@/lib/chatKnowledge';
import { getReferenceChunks, getReferenceDocs } from '@/lib/referenceCorpus';

type EvalLocale = 'ko' | 'es' | 'en' | 'ja' | 'pt';

type CuratedQuery = {
  id: string;
  bucket: 'coding' | 'interpretation' | 'graph-navigation';
  query: string;
  expectedTopRoute: string;
  expectedIncludedRoutes?: string[];
};

type CuratedQuerySet = {
  locale: EvalLocale;
  version: string;
  targetCount: number;
  minimums: Record<string, number>;
  queries: CuratedQuery[];
};

function getEvalLocale(): EvalLocale {
  if (process.env.REFERENCE_EVAL_LOCALE === 'es') {
    return 'es';
  }
  if (process.env.REFERENCE_EVAL_LOCALE === 'en') {
    return 'en';
  }
  if (process.env.REFERENCE_EVAL_LOCALE === 'ja') {
    return 'ja';
  }
  if (process.env.REFERENCE_EVAL_LOCALE === 'pt') {
    return 'pt';
  }
  return 'ko';
}

function loadQuerySet(locale: EvalLocale): CuratedQuerySet {
  const filePath = path.join(
    process.cwd(),
    'docs',
    'reference-authoring',
    'evals',
    `${locale}-curated-query-set.json`,
  );
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CuratedQuerySet;
}

function buildDraftKnowledge(locale: EvalLocale): KnowledgeItem[] {
  const docs = getReferenceDocs(locale);
  const chunks = getReferenceChunks(locale);

  const routeSummaries: KnowledgeItem[] = docs.map((doc) => ({
    id: `route:${doc.canonicalRoute}`,
    title: doc.title,
    content: doc.excerpt || doc.bodyText,
    source: 'builtin',
    aliases: doc.aliases,
    canonicalRoute: doc.canonicalRoute,
    relatedRoutes: doc.relatedRoutes,
    retrievalKind: 'runtime-route-summary',
  }));

  const chunkKnowledge: KnowledgeItem[] = chunks.map((chunk) => {
    const sectionLabel = chunk.headingPath[chunk.headingPath.length - 1] ?? chunk.canonicalRoute;
    return {
      id: `chunk:${chunk.chunkId}`,
      title: `${chunk.headingPath[0]} / ${sectionLabel}`,
      content: chunk.text,
      source: 'builtin',
      aliases: chunk.aliases,
      canonicalRoute: chunk.canonicalRoute,
      relatedRoutes: chunk.relatedRoutes,
      retrievalKind: 'runtime-chunk',
    };
  });

  return [...routeSummaries, ...chunkKnowledge];
}

describe(`${getEvalLocale().toUpperCase()} curated retrieval seed set`, () => {
  const locale = getEvalLocale();
  const querySet = loadQuerySet(locale);
  const builtInKnowledge = buildDraftKnowledge(locale);

  it('keeps the seed query file shape intact', () => {
    expect(querySet.locale).toBe(locale);
    expect(querySet.queries.length).toBeGreaterThan(0);
    expect(querySet.queries.length).toBeGreaterThanOrEqual(querySet.targetCount);
  });

  for (const item of querySet.queries) {
    it(`retrieves ${item.id}`, () => {
      const selected = selectRelevantKnowledge(item.query, builtInKnowledge, locale);
      const selectedRoutes = selected
        .map((entry) => entry.canonicalRoute)
        .filter((route): route is string => Boolean(route));

      expect(selectedRoutes[0]).toBe(item.expectedTopRoute);
      for (const route of item.expectedIncludedRoutes ?? []) {
        expect(selectedRoutes).toContain(route);
      }
    });
  }
});
