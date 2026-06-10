import routeDocsArtifact from '@/generated/reference-corpus/route-docs.json';
import chunksArtifact from '@/generated/reference-corpus/chunks.json';
import manifestArtifact from '@/generated/reference-corpus/manifest.json';
import { buildReferenceHrefFromSlug, buildReferenceUrlSlug } from '@/lib/referenceRoutes';
import type { Language } from '@/types';

export type ReferenceDocStatus = 'stub' | 'draft' | 'reviewed' | 'locked';
export type ReferenceDocKind =
  | 'coding-entry'
  | 'coding-overview'
  | 'interpretation-entry'
  | 'interpretation-overview';

export type ReferenceDocRecord = {
  canonicalRoute: string;
  locale: Language;
  kind: 'entry' | 'category';
  docKind: ReferenceDocKind;
  id: string;
  slug: string[];
  title: string;
  bodyMarkdown: string;
  bodyText: string;
  excerpt: string;
  aliases: string[];
  relatedRoutes: string[];
  authorityPolicy: string;
  status: ReferenceDocStatus;
  runtimeReady: boolean;
  provenanceNote: string;
  sourcePath: string;
};

export type ReferenceChunkRecord = {
  locale: Language;
  canonicalRoute: string;
  chunkId: string;
  headingPath: string[];
  text: string;
  aliases: string[];
  relatedRoutes: string[];
  authorityPolicy: string;
  status: ReferenceDocStatus;
  runtimeReady: boolean;
};

type RouteDocsArtifact = {
  generatedAt: string;
  locales: Language[];
  docsByLocale: Record<Language, ReferenceDocRecord[]>;
};

type ChunksArtifact = {
  generatedAt: string;
  locales: Language[];
  chunksByLocale: Record<Language, ReferenceChunkRecord[]>;
};

type ManifestArtifact = {
  generatedAt: string;
  locales: Language[];
  localeSummaries: Record<
    Language,
    {
      totalDocs: number;
      entryDocs: number;
      categoryDocs: number;
      runtimeReadyDocs: number;
      statusCounts: Record<ReferenceDocStatus, number>;
      activeRuntimeSource: 'reference-corpus';
      authorityPolicies: string[];
      promotionEnabled: boolean;
      promotedAt: string | null;
      promotionReason: string | null;
    }
  >;
};

const routeDocs = routeDocsArtifact as RouteDocsArtifact;
const chunks = chunksArtifact as ChunksArtifact;
const manifest = manifestArtifact as ManifestArtifact;

const docsByLocaleMap = new Map<Language, Map<string, ReferenceDocRecord>>();
const chunksByLocaleMap = new Map<Language, ReferenceChunkRecord[]>();
const runtimeDocsByLocaleMap = new Map<Language, ReferenceDocRecord[]>();
const runtimeDocsBySlugMap = new Map<Language, Map<string, ReferenceDocRecord>>();
const runtimeDocsByCanonicalRouteMap = new Map<Language, Map<string, ReferenceDocRecord>>();
const runtimeDocChildrenByLocaleMap = new Map<Language, Map<string, ReferenceDocRecord[]>>();

for (const locale of routeDocs.locales) {
  const localeDocs = routeDocs.docsByLocale[locale] ?? [];
  const runtimeDocs = localeDocs.filter((doc) => doc.runtimeReady);
  const runtimeDocsBySlug = new Map<string, ReferenceDocRecord>();
  const runtimeDocsByCanonicalRoute = new Map<string, ReferenceDocRecord>();
  const runtimeChildren = new Map<string, ReferenceDocRecord[]>();

  docsByLocaleMap.set(
    locale,
    new Map(localeDocs.map((doc) => [doc.canonicalRoute, doc])),
  );
  chunksByLocaleMap.set(locale, chunks.chunksByLocale[locale] ?? []);
  runtimeDocsByLocaleMap.set(locale, runtimeDocs);

  for (const doc of runtimeDocs) {
    runtimeDocsBySlug.set(doc.slug.join('/'), doc);
    runtimeDocsByCanonicalRoute.set(doc.canonicalRoute, doc);
    const parentKey = doc.slug.slice(0, -1).join('/');
    const siblings = runtimeChildren.get(parentKey) ?? [];
    siblings.push(doc);
    runtimeChildren.set(parentKey, siblings);
  }

  for (const siblings of runtimeChildren.values()) {
    siblings.sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === 'category' ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
  }

  runtimeDocsBySlugMap.set(locale, runtimeDocsBySlug);
  runtimeDocsByCanonicalRouteMap.set(locale, runtimeDocsByCanonicalRoute);
  runtimeDocChildrenByLocaleMap.set(locale, runtimeChildren);
}

function legacySlugToCanonicalRoute(slug: string[]): string {
  const parts: string[] = [];

  for (let index = 0; index < slug.length; index += 1) {
    const current = slug[index];

    if (current === 'v-plus') {
      parts.push('v', '+');
      continue;
    }

    if (current === 'plus') {
      parts.push('+');
      continue;
    }

    if (current === 'minus') {
      parts.push('-');
      continue;
    }

    parts.push(current);
  }

  return parts.join('/');
}

export function getReferenceLocales(): Language[] {
  return manifest.locales;
}

export function getReferenceManifest() {
  return manifest;
}

export function getReferenceLocaleSummary(locale: Language) {
  return manifest.localeSummaries[locale];
}

export function isReferenceCorpusActive(locale: Language): boolean {
  return getReferenceLocaleSummary(locale).activeRuntimeSource === 'reference-corpus';
}

export function getReferenceDocs(locale: Language): ReferenceDocRecord[] {
  return routeDocs.docsByLocale[locale] ?? [];
}

export function getReferenceDocByCanonicalRoute(
  locale: Language,
  canonicalRoute: string,
): ReferenceDocRecord | undefined {
  return docsByLocaleMap.get(locale)?.get(canonicalRoute);
}

export function getReferenceRelatedDocs(
  locale: Language,
  relatedRoutes: string[],
): ReferenceDocRecord[] {
  return relatedRoutes
    .map((route) => getReferenceDocByCanonicalRoute(locale, route))
    .filter((doc): doc is ReferenceDocRecord => Boolean(doc));
}

export function getActiveReferenceDocByCanonicalRoute(
  locale: Language,
  canonicalRoute: string,
): ReferenceDocRecord | undefined {
  if (!isReferenceCorpusActive(locale)) return undefined;
  return getReferenceDocByCanonicalRoute(locale, canonicalRoute);
}

export function getReferenceRuntimeDocs(locale: Language): ReferenceDocRecord[] {
  return runtimeDocsByLocaleMap.get(locale) ?? [];
}

export function getReferenceChunks(locale: Language): ReferenceChunkRecord[] {
  return chunksByLocaleMap.get(locale) ?? [];
}

export function getReferenceRuntimeChunks(locale: Language): ReferenceChunkRecord[] {
  return getReferenceChunks(locale).filter((chunk) => chunk.runtimeReady);
}

export function buildReferenceDocHref(canonicalRoute: string, locale: Language): string {
  const doc = docsByLocaleMap.get(locale)?.get(canonicalRoute);
  const slug = doc?.slug ?? buildReferenceUrlSlug(canonicalRoute);
  return buildReferenceHrefFromSlug(slug, locale);
}

export function getReferenceRuntimeDocBySlug(
  locale: Language,
  slug: string[],
): ReferenceDocRecord | undefined {
  const directMatch = runtimeDocsBySlugMap.get(locale)?.get(slug.join('/'));
  if (directMatch) return directMatch;

  const legacyCanonicalRoute = legacySlugToCanonicalRoute(slug);
  return runtimeDocsByCanonicalRouteMap.get(locale)?.get(legacyCanonicalRoute);
}

export function getReferenceRuntimeDocChildren(
  locale: Language,
  parentSlug: string[],
): ReferenceDocRecord[] {
  return runtimeDocChildrenByLocaleMap.get(locale)?.get(parentSlug.join('/')) ?? [];
}

export function getReferenceRuntimeStaticSlugs(): string[][] {
  const slugs = new Set<string>();

  for (const locale of routeDocs.locales) {
    for (const doc of getReferenceRuntimeDocs(locale)) {
      slugs.add(doc.slug.join('/'));
    }
  }

  return [...slugs].map((slug) => slug.split('/'));
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function buildSearchTokens(query: string): string[] {
  return normalizeSearchValue(query)
    .split(/[\s/]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

function scoreTokenMatch(haystack: string, token: string, weight: number): number {
  if (!token || !haystack.includes(token)) return 0;
  if (haystack === token) return weight * 2;
  if (haystack.startsWith(token)) return Math.round(weight * 1.5);
  return weight;
}

function scoreReferenceRuntimeDoc(doc: ReferenceDocRecord, query: string): number {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return 0;

  const title = normalizeSearchValue(doc.title);
  const excerpt = normalizeSearchValue(doc.excerpt);
  const bodyText = normalizeSearchValue(doc.bodyText);
  const canonicalRoute = normalizeSearchValue(doc.canonicalRoute);
  const slug = normalizeSearchValue(doc.slug.join('/'));
  const aliases = doc.aliases.map((alias) => normalizeSearchValue(alias)).filter(Boolean);
  const aliasText = aliases.join(' ');
  const tokens = buildSearchTokens(normalizedQuery);

  let score = 0;

  if (title === normalizedQuery) score += 180;
  if (canonicalRoute === normalizedQuery || slug === normalizedQuery) score += 170;
  if (aliases.includes(normalizedQuery)) score += 165;

  if (title.startsWith(normalizedQuery)) score += 120;
  if (canonicalRoute.startsWith(normalizedQuery) || slug.startsWith(normalizedQuery)) score += 110;
  if (aliasText.includes(normalizedQuery)) score += 95;
  if (excerpt.includes(normalizedQuery)) score += 40;
  if (bodyText.includes(normalizedQuery)) score += 20;

  for (const token of tokens) {
    score += scoreTokenMatch(title, token, 18);
    score += scoreTokenMatch(canonicalRoute, token, 16);
    score += scoreTokenMatch(slug, token, 14);
    score += aliases.reduce((sum, alias) => sum + scoreTokenMatch(alias, token, 12), 0);
    score += scoreTokenMatch(excerpt, token, 5);
    score += scoreTokenMatch(bodyText, token, 2);
  }

  if (doc.kind === 'entry') score += 4;
  if (doc.runtimeReady) score += 2;

  return score;
}

export function searchReferenceRuntimeDocs(
  locale: Language,
  query: string,
  limit?: number,
): ReferenceDocRecord[] {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const results = getReferenceRuntimeDocs(locale)
    .map((doc) => ({ doc, score: scoreReferenceRuntimeDoc(doc, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.doc.kind !== b.doc.kind) {
        return a.doc.kind === 'entry' ? -1 : 1;
      }
      return a.doc.title.localeCompare(b.doc.title);
    })
    .map(({ doc }) => doc);

  return typeof limit === 'number' ? results.slice(0, Math.max(0, limit)) : results;
}
