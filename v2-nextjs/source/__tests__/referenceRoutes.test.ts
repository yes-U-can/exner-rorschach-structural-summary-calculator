import { describe, expect, it } from 'vitest';

import {
  buildReferenceDocHref,
  getReferenceDocs,
  getReferenceLocales,
} from '@/lib/referenceCorpus';
import { buildReferenceRouteHref, buildReferenceUrlSlug } from '@/lib/referenceRoutes';

// lib/referenceRoutes.ts exists so that client components can build /ref hrefs
// without importing the multi-megabyte corpus artifacts. These tests pin the
// invariant that the corpus-free builder stays byte-identical to the
// corpus-backed one for every published doc.
describe('referenceRoutes (client-safe href builder)', () => {
  it('derives the same slug stored in the corpus artifacts', () => {
    for (const locale of getReferenceLocales()) {
      for (const doc of getReferenceDocs(locale)) {
        expect(buildReferenceUrlSlug(doc.canonicalRoute)).toEqual(doc.slug);
      }
    }
  });

  it('matches the corpus-backed href for every doc in every locale', () => {
    for (const locale of getReferenceLocales()) {
      for (const doc of getReferenceDocs(locale)) {
        expect(buildReferenceRouteHref(doc.canonicalRoute, locale)).toBe(
          buildReferenceDocHref(doc.canonicalRoute, locale),
        );
      }
    }
  });
});
