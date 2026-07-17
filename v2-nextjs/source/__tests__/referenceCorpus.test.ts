import { describe, expect, it } from 'vitest';

import {
  buildReferenceDocHref,
  getReferenceDocByCanonicalRoute,
  getReferenceDocs,
  getReferenceLocaleSummary,
  getReferenceRuntimeDocBySlug,
  getReferenceRuntimeDocChildren,
  getReferenceRuntimeDocs,
  getReferenceRuntimeStaticSlugs,
  getReferenceRuntimeChunks,
  isReferenceCorpusActive,
  searchReferenceRuntimeDocs,
} from '@/lib/referenceCorpus';
import { findDocRouteByCanonicalRoute, resolveDocContent } from '@/lib/referenceDocs';

describe('reference corpus artifacts', () => {
  it('loads the shared 203-doc skeleton for each locale', () => {
    expect(getReferenceDocs('ko')).toHaveLength(203);
    expect(getReferenceDocs('en')).toHaveLength(203);
    expect(getReferenceDocs('ja')).toHaveLength(203);
    expect(getReferenceDocs('es')).toHaveLength(203);
    expect(getReferenceDocs('pt')).toHaveLength(203);
  });

  it('exposes all five locales as promoted runtime corpora', () => {
    const koSummary = getReferenceLocaleSummary('ko');
    const enSummary = getReferenceLocaleSummary('en');
    const jaSummary = getReferenceLocaleSummary('ja');
    const esSummary = getReferenceLocaleSummary('es');
    const ptSummary = getReferenceLocaleSummary('pt');

    expect(koSummary.statusCounts.draft).toBe(203);
    expect(koSummary.runtimeReadyDocs).toBe(203);
    expect(koSummary.activeRuntimeSource).toBe('reference-corpus');
    expect(isReferenceCorpusActive('ko')).toBe(true);
    expect(enSummary.statusCounts.draft).toBe(203);
    expect(enSummary.runtimeReadyDocs).toBe(203);
    expect(enSummary.activeRuntimeSource).toBe('reference-corpus');
    expect(isReferenceCorpusActive('en')).toBe(true);
    expect(jaSummary.statusCounts.draft).toBe(203);
    expect(jaSummary.runtimeReadyDocs).toBe(203);
    expect(jaSummary.activeRuntimeSource).toBe('reference-corpus');
    expect(isReferenceCorpusActive('ja')).toBe(true);
    expect(esSummary.statusCounts.draft).toBe(203);
    expect(esSummary.statusCounts.stub).toBe(0);
    expect(esSummary.runtimeReadyDocs).toBe(203);
    expect(esSummary.activeRuntimeSource).toBe('reference-corpus');
    expect(isReferenceCorpusActive('es')).toBe(true);
    expect(ptSummary.statusCounts.draft).toBe(203);
    expect(ptSummary.statusCounts.stub).toBe(0);
    expect(ptSummary.runtimeReadyDocs).toBe(203);
    expect(ptSummary.activeRuntimeSource).toBe('reference-corpus');
    expect(isReferenceCorpusActive('pt')).toBe(true);
  });

  it('keeps canonical-route lookup stable for KO content', () => {
    const doc = getReferenceDocByCanonicalRoute('ko', 'scoring-input/dq/+');
    expect(doc?.title).toContain('+');
    expect(doc?.slug).toEqual(['scoring-input', 'dq', 'plus']);
    expect(doc?.bodyMarkdown).toContain('## 상호 참조');
    expect(doc?.bodyMarkdown).toContain('ref://');
  });

  it('uses URL-safe slugs for plus and minus coding routes', () => {
    expect(getReferenceDocByCanonicalRoute('ko', 'scoring-input/dq/+')?.slug)
      .toEqual(['scoring-input', 'dq', 'plus']);
    expect(getReferenceDocByCanonicalRoute('ko', 'scoring-input/dq/v/+')?.slug)
      .toEqual(['scoring-input', 'dq', 'v-plus']);
    expect(getReferenceDocByCanonicalRoute('ko', 'scoring-input/fq/+')?.slug)
      .toEqual(['scoring-input', 'fq', 'plus']);
    expect(getReferenceDocByCanonicalRoute('ko', 'scoring-input/fq/-')?.slug)
      .toEqual(['scoring-input', 'fq', 'minus']);

    const staticSlugKeys = getReferenceRuntimeStaticSlugs().map((slug) => slug.join('/'));
    expect(staticSlugKeys).toContain('scoring-input/dq/plus');
    expect(staticSlugKeys).toContain('scoring-input/dq/v-plus');
    expect(staticSlugKeys).not.toContain('scoring-input/dq/+');
    expect(staticSlugKeys).not.toContain('scoring-input/dq/v/+');
  });

  it('keeps generated reference links resolvable for every runtime document', () => {
    for (const locale of ['ko', 'en', 'ja', 'es', 'pt'] as const) {
      for (const doc of getReferenceRuntimeDocs(locale)) {
        const href = buildReferenceDocHref(doc.canonicalRoute, locale);
        const pathname = href.split('?')[0]?.replace(/^\/ref\//, '') ?? '';
        const slug = pathname.split('/').filter(Boolean).map((segment) => decodeURIComponent(segment));
        const resolved = getReferenceRuntimeDocBySlug(locale, slug);

        expect(resolved?.canonicalRoute).toBe(doc.canonicalRoute);
      }
    }
  });

  it('keeps legacy plus and minus reference URLs from falling into 404', () => {
    expect(getReferenceRuntimeDocBySlug('ko', ['scoring-input', 'dq', '+'])?.canonicalRoute)
      .toBe('scoring-input/dq/+');
    expect(getReferenceRuntimeDocBySlug('ko', ['scoring-input', 'dq', 'v', '+'])?.canonicalRoute)
      .toBe('scoring-input/dq/v/+');
    expect(getReferenceRuntimeDocBySlug('ko', ['scoring-input', 'fq', '-'])?.canonicalRoute)
      .toBe('scoring-input/fq/-');
  });

  it('exposes KO runtime chunks after locale promotion', () => {
    expect(getReferenceRuntimeChunks('ko').length).toBeGreaterThan(0);
  });

  it('uses one domain order for reference navigation in every locale', () => {
    const expectedByParent = [
      {
        parent: [],
        routes: ['scoring-input', 'result-interpretation'],
      },
      {
        parent: ['scoring-input'],
        routes: [
          'scoring-input/card',
          'scoring-input/location',
          'scoring-input/dq',
          'scoring-input/determinants',
          'scoring-input/fq',
          'scoring-input/pair',
          'scoring-input/contents',
          'scoring-input/popular',
          'scoring-input/z',
          'scoring-input/score',
          'scoring-input/gphr',
          'scoring-input/special-score',
        ],
      },
      {
        parent: ['result-interpretation'],
        routes: [
          'result-interpretation/upper-section',
          'result-interpretation/lower-section',
          'result-interpretation/special-indices',
        ],
      },
      {
        parent: ['result-interpretation', 'lower-section'],
        routes: [
          'result-interpretation/lower-section/core',
          'result-interpretation/lower-section/ideation',
          'result-interpretation/lower-section/affect',
          'result-interpretation/lower-section/mediation',
          'result-interpretation/lower-section/processing',
          'result-interpretation/lower-section/interpersonal',
          'result-interpretation/lower-section/selfPerception',
        ],
      },
      {
        parent: ['result-interpretation', 'special-indices'],
        routes: [
          'result-interpretation/special-indices/PTI',
          'result-interpretation/special-indices/DEPI',
          'result-interpretation/special-indices/CDI',
          'result-interpretation/special-indices/SCON',
          'result-interpretation/special-indices/HVI',
          'result-interpretation/special-indices/OBS',
        ],
      },
    ];

    for (const locale of ['ko', 'en', 'ja', 'es', 'pt'] as const) {
      for (const { parent, routes } of expectedByParent) {
        expect(
          getReferenceRuntimeDocChildren(locale, parent).map((doc) => doc.canonicalRoute),
        ).toEqual(routes);
      }
    }
  });

  it('preserves semantic section headings instead of relabeling them by position', () => {
    const route = 'result-interpretation/lower-section/affect/FC_CF_C';
    const spanishHeadings = getReferenceRuntimeChunks('es')
      .filter((chunk) => chunk.canonicalRoute === route)
      .map((chunk) => chunk.headingPath.at(-1));
    const koreanHeadings = getReferenceRuntimeChunks('ko')
      .filter((chunk) => chunk.canonicalRoute === route)
      .map((chunk) => chunk.headingPath.at(-1));

    expect(spanishHeadings).toContain('Variables para revisar en conjunto');
    expect(spanishHeadings).toContain('Referencias cruzadas');
    expect(spanishHeadings).not.toContain('Nota de evidencia');
    expect(koreanHeadings).not.toContain('근거 메모');
  });

  it('aligns reference document rendering with the active runtime source per locale', () => {
    const route = findDocRouteByCanonicalRoute('scoring-input/dq/+');
    expect(route).toBeDefined();

    const koContent = resolveDocContent(route!, 'ko');
    const enContent = resolveDocContent(route!, 'en');
    const jaContent = resolveDocContent(route!, 'ja');
    const esContent = resolveDocContent(route!, 'es');
    const ptContent = resolveDocContent(route!, 'pt');

    expect(koContent.markdown).toContain('ref://');
    expect(koContent.runtimeReady).toBe(true);
    expect(enContent.markdown).toContain('ref://');
    expect(enContent.runtimeReady).toBe(true);
    expect(jaContent.markdown).toContain('ref://');
    expect(jaContent.runtimeReady).toBe(true);
    expect(esContent.markdown).toContain('ref://');
    expect(esContent.runtimeReady).toBe(true);
    expect(ptContent.markdown).toContain('ref://');
    expect(ptContent.runtimeReady).toBe(true);
  });

  it('ranks exact canonical-route matches above broader matches', () => {
    const results = searchReferenceRuntimeDocs('en', 'scoring-input/dq/+');

    expect(results[0]?.canonicalRoute).toBe('scoring-input/dq/+');
  });

  it('returns the DQ overview before individual variants on a broad DQ query', () => {
    const results = searchReferenceRuntimeDocs('en', 'scoring-input/dq');

    expect(results[0]?.canonicalRoute).toBe('scoring-input/dq');
    expect(results.some((doc) => doc.canonicalRoute === 'scoring-input/dq/+')).toBe(true);
  });

  it('returns no documents when the query has no textual match', () => {
    expect(searchReferenceRuntimeDocs('ko', 'zzzz-no-match')).toEqual([]);
  });
});

