import type { Language } from '@/types';

// Client-safe reference route helpers. This module must stay free of any
// reference-corpus artifact imports: client components (e.g. ReferenceMarkdown)
// rely on it to build /ref hrefs without pulling the multi-megabyte corpus
// JSON into the browser bundle. The slug derivation below is the same logic
// used by scripts/generate-reference-corpus.mjs, so the resulting hrefs match
// the slugs stored in the corpus artifacts.
export function buildReferenceUrlSlug(canonicalRoute: string): string[] {
  const parts = canonicalRoute.split('/').filter(Boolean);
  const slug: string[] = [];

  for (let index = 0; index < parts.length; index += 1) {
    const current = parts[index];
    const next = parts[index + 1];

    if (current === 'v' && next === '+') {
      slug.push('v-plus');
      index += 1;
      continue;
    }

    if (current === '+') {
      slug.push('plus');
      continue;
    }

    if (current === '-') {
      slug.push('minus');
      continue;
    }

    slug.push(current);
  }

  return slug;
}

export function buildReferenceHrefFromSlug(slug: string[], locale: Language): string {
  const encodedRoute = slug
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/ref/${encodedRoute}?lang=${locale}`;
}

export function buildReferenceRouteHref(canonicalRoute: string, locale: Language): string {
  return buildReferenceHrefFromSlug(buildReferenceUrlSlug(canonicalRoute), locale);
}
