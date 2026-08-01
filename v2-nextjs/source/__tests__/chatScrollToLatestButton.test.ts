import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ChatScrollToLatestButton } from '@/components/chat/ChatScrollToLatestButton';

describe('chat scroll-to-latest indicator', () => {
  it('shows three centered activity dots while a response is streaming', () => {
    const markup = renderToStaticMarkup(
      createElement(ChatScrollToLatestButton, {
        label: 'Jump to latest',
        onClick: () => {},
        streaming: true,
      }),
    );

    expect(markup).toContain('data-chat-scroll-indicator="streaming"');
    expect(markup.match(/ui-chat-stream-dot/g)).toHaveLength(3);
    expect(markup).not.toContain('<svg');
  });

  it('shows the down arrow when no response is streaming', () => {
    const markup = renderToStaticMarkup(
      createElement(ChatScrollToLatestButton, {
        label: 'Jump to latest',
        onClick: () => {},
      }),
    );

    expect(markup).toContain('data-chat-scroll-indicator="idle"');
    expect(markup).toContain('<svg');
    expect(markup).not.toContain('ui-chat-scroll-streaming');
  });
});
