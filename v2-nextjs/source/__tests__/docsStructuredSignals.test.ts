import { describe, expect, it } from 'vitest';

import { getAllDocRoutes, resolveDocContent } from '@/lib/referenceDocs';

describe('docs structured signals', () => {
  it('keeps reader-facing interpretation signals without exposing internal governance markers', () => {
    const entryRoutes = getAllDocRoutes().filter((item) => item.kind === 'entry');
    const languages = ['en', 'es', 'pt', 'ja'] as const;
    const failures: Array<{ id: string; slug: string; lang: string; reason: string }> = [];

    for (const route of entryRoutes) {
      for (const lang of languages) {
        const { description } = resolveDocContent(route, lang);

        const isInterpretation = route.slug[0] === 'result-interpretation';

        if (isInterpretation && !description.includes('[Before Interpretation]')) {
          failures.push({
            id: route.id,
            slug: route.slug.join('/'),
            lang,
            reason: 'missing_reader_precondition',
          });
        }

        if (isInterpretation && !description.includes('[Related References]')) {
          failures.push({ id: route.id, slug: route.slug.join('/'), lang, reason: 'missing_related_references' });
        }

        if (isInterpretation && !description.includes('[Caution]')) {
          failures.push({ id: route.id, slug: route.slug.join('/'), lang, reason: 'missing_reader_caution' });
        }

        if (description.includes('[Corpus Governance]') || description.includes('[AI Usage Guideline]')) {
          failures.push({ id: route.id, slug: route.slug.join('/'), lang, reason: 'internal_marker_exposed' });
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
