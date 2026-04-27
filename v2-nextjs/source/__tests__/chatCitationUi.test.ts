import { describe, expect, it } from 'vitest';

import { getChatCitationBadges } from '@/lib/chatCitationUi';

describe('chat citation ui', () => {
  it('builds readable badges for builtin citations', () => {
    expect(
      getChatCitationBadges(
        {
          source: 'builtin',
          retrievalKind: 'runtime-route-summary',
          locale: 'ko',
        },
        'ko',
      ),
    ).toEqual(['참조 문서', '개요', 'KO']);
  });

  it('omits unknown values cleanly', () => {
    expect(
      getChatCitationBadges(
        {
          source: null,
          retrievalKind: null,
          locale: null,
        },
        'ko',
      ),
    ).toEqual([]);
  });
});
