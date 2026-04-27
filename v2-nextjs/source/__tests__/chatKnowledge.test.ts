import { describe, expect, it } from 'vitest';

import { selectRelevantKnowledge, type KnowledgeItem } from '@/lib/chatKnowledge';

describe('chat knowledge retrieval', () => {
  it('prefers exact code hits and expands one hop through related routes', () => {
    const builtInKnowledge: KnowledgeItem[] = [
      {
        id: 'route:scoring-input/dq/+',
        title: '[채점/발달질] DQ+',
        content: 'DQ+ route summary',
        source: 'builtin',
        locale: 'ko',
        aliases: ['DQ+', '+'],
        canonicalRoute: 'scoring-input/dq/+',
        relatedRoutes: ['result-interpretation/lower-section/processing/DQ_plus_proc'],
        retrievalKind: 'runtime-route-summary',
      },
      {
        id: 'chunk:scoring-input/dq/+',
        title: '[채점/발달질] DQ+ / 설명',
        content: 'DQ+ means a well-synthesized developmental quality response.',
        source: 'builtin',
        locale: 'ko',
        aliases: ['DQ+', '+'],
        canonicalRoute: 'scoring-input/dq/+',
        relatedRoutes: ['result-interpretation/lower-section/processing/DQ_plus_proc'],
        retrievalKind: 'runtime-chunk',
      },
      {
        id: 'route:result-interpretation/lower-section/processing/DQ_plus_proc',
        title: '[해석/Processing] DQ+',
        content: 'Processing-side route summary for DQ+.',
        source: 'builtin',
        locale: 'ko',
        aliases: ['DQ+ processing'],
        canonicalRoute: 'result-interpretation/lower-section/processing/DQ_plus_proc',
        relatedRoutes: ['scoring-input/dq/+'],
        retrievalKind: 'runtime-route-summary',
      },
      {
        id: 'route:scoring-input/fq/+',
        title: '[채점/형태질] FQ+',
        content: 'FQ+ route summary',
        source: 'builtin',
        locale: 'ko',
        aliases: ['FQ+'],
        canonicalRoute: 'scoring-input/fq/+',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
      },
    ];

    const selected = selectRelevantKnowledge('DQ+가 뭔가요?', builtInKnowledge, 'ko');

    expect(selected[0]?.canonicalRoute).toBe('scoring-input/dq/+');
    expect(
      selected.some(
        (item) => item.canonicalRoute === 'result-interpretation/lower-section/processing/DQ_plus_proc',
      ),
    ).toBe(true);
    expect(selected.some((item) => item.canonicalRoute === 'scoring-input/fq/+')).toBe(false);
  });

  it('uses runtime route summaries as the empty-query fallback when runtime knowledge exists', () => {
    const builtInKnowledge: KnowledgeItem[] = [
      {
        id: 'route:scoring-input/location/W',
        title: '[채점/위치] W',
        content: 'Whole response route summary',
        source: 'builtin',
        locale: 'ko',
        aliases: ['W'],
        canonicalRoute: 'scoring-input/location/W',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
      },
      {
        id: 'chunk:scoring-input/location/W',
        title: '[채점/위치] W / 설명',
        content: 'Whole response chunk',
        source: 'builtin',
        locale: 'ko',
        aliases: ['W'],
        canonicalRoute: 'scoring-input/location/W',
        relatedRoutes: [],
        retrievalKind: 'runtime-chunk',
      },
    ];

    const selected = selectRelevantKnowledge('', builtInKnowledge, 'ko');

    expect(selected).toHaveLength(1);
    expect(selected[0]?.retrievalKind).toBe('runtime-route-summary');
  });
});
