import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { getAllDocRoutes, resolveDocContent } from '@/lib/referenceDocs';

describe('docs structured signals', () => {
  const internalMarkers = [
    `[${['Corpus', 'Governance'].join(' ')}]`,
    `[${['AI', 'Usage', 'Guideline'].join(' ')}]`,
  ];

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

        if (internalMarkers.some((marker) => description.includes(marker))) {
          failures.push({ id: route.id, slug: route.slug.join('/'), lang, reason: 'internal_marker_exposed' });
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it('keeps internal guidance markers out of the public source copy', () => {
    const source = readFileSync(path.join(process.cwd(), 'lib', 'docsDetailed.ts'), 'utf8');

    for (const marker of internalMarkers) {
      expect(source).not.toContain(marker);
    }
    expect(source).toContain('[Interpretation Guidance]');
  });
});
