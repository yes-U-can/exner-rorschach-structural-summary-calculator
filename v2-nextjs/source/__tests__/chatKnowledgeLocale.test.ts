import { describe, expect, it } from 'vitest';

import { selectRelevantKnowledge, type KnowledgeItem } from '@/lib/chatKnowledge';

describe('chat knowledge locale isolation', () => {
  it('filters out mixed-locale builtin knowledge even when lexical matches are stronger', () => {
    const builtInKnowledge: KnowledgeItem[] = [
      {
        id: 'route:ko:scoring-input/dq/+',
        title: 'DQ+ 설명',
        content: '한국어 DQ+ 설명',
        source: 'builtin',
        locale: 'ko',
        aliases: ['DQ+'],
        canonicalRoute: 'scoring-input/dq/+',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
      },
      {
        id: 'route:ja:scoring-input/dq/+',
        title: 'DQ+ 説明',
        content: '日本語のDQ+説明',
        source: 'builtin',
        locale: 'ja',
        aliases: ['DQ+'],
        canonicalRoute: 'scoring-input/dq/+',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
      },
    ];

    const selected = selectRelevantKnowledge('DQ+가 뭐야?', builtInKnowledge, 'ko');

    expect(selected).toHaveLength(1);
    expect(selected[0]?.locale).toBe('ko');
    expect(selected.some((item) => item.locale === 'ja')).toBe(false);
  });

  it('returns no results when only other-locale builtin knowledge exists', () => {
    const builtInKnowledge: KnowledgeItem[] = [
      {
        id: 'route:ja:scoring-input/dq/+',
        title: 'DQ+ 説明',
        content: '日本語のDQ+説明',
        source: 'builtin',
        locale: 'ja',
        aliases: ['DQ+'],
        canonicalRoute: 'scoring-input/dq/+',
        relatedRoutes: [],
        retrievalKind: 'runtime-route-summary',
      },
    ];

    const selected = selectRelevantKnowledge('DQ+가 뭐야?', builtInKnowledge, 'ko');

    expect(selected).toHaveLength(0);
  });
});
