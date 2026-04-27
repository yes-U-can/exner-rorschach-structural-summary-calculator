import { describe, expect, it } from 'vitest';

import { parseChatMessageMetadata, toChatCitationHref } from '@/lib/chatMessageMetadata';

describe('chat message metadata', () => {
  it('normalizes valid citation metadata and drops malformed entries', () => {
    const parsed = parseChatMessageMetadata(
      JSON.stringify({
        workflowType: 'interpretation',
        locale: 'ko',
        citations: [
          {
            id: ' route:scoring-input/dq/+ ',
            title: ' DQ+ ',
            canonicalRoute: ' scoring-input/dq/+ ',
            retrievalKind: ' runtime-route-summary ',
            locale: ' ko ',
            source: 'builtin',
          },
          {
            id: '',
            title: 'bad',
          },
        ],
      }),
    );

    expect(parsed).toEqual({
      workflowType: 'interpretation',
      locale: 'ko',
      citations: [
        {
          id: 'route:scoring-input/dq/+',
          title: 'DQ+',
          canonicalRoute: 'scoring-input/dq/+',
          retrievalKind: 'runtime-route-summary',
          locale: 'ko',
          source: 'builtin',
        },
      ],
    });
  });

  it('builds reference hrefs from canonical routes and fallback ids', () => {
    expect(
      toChatCitationHref(
        {
          id: 'route:scoring-input/dq/+',
          canonicalRoute: null,
          locale: 'ja',
        },
        'ko',
      ),
    ).toBe('/ref/scoring-input/dq/%2B?lang=ja');

    expect(
      toChatCitationHref(
        {
          id: 'ko:result-interpretation/lower-section/processing/DQ_plus_proc',
          canonicalRoute: null,
        },
        'en',
      ),
    ).toBe('/ref/result-interpretation/lower-section/processing/DQ_plus_proc?lang=ko');
  });
});
