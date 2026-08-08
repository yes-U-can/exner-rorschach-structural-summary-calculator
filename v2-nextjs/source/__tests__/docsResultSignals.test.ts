import { describe, expect, it } from 'vitest';

import { getAllDocRoutes, resolveDocContent } from '@/lib/referenceDocs';

describe('docs result-entry structure (English)', () => {
  it('keeps detailed result interpretation signals for result entries', () => {
    const resultEntries = getAllDocRoutes().filter(
      (item) => item.kind === 'entry' && item.slug.includes('result-interpretation')
    );
    const failures: Array<{ id: string; slug: string; reason: string }> = [];

    expect(resultEntries.length).toBeGreaterThan(0);

    for (const route of resultEntries) {
      const { description } = resolveDocContent(route, 'en');

      if (!description.trim()) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'empty_description' });
        continue;
      }
      if (!description.includes('[Before Interpretation]')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_interpretive_preconditions' });
      }
      if (!description.includes('[Related References]')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_cross_checks' });
      }
      if (!description.includes('[Caution]')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_misreading_guard' });
      }
    }

    expect(failures).toEqual([]);
  });
});
