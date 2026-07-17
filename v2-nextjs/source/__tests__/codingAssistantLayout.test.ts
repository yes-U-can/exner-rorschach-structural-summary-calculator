import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const chatWidgetSource = readFileSync('components/chat/ChatWidget.tsx', 'utf8');
const globalStyles = readFileSync('app/globals.css', 'utf8');

describe('coding assistant layout', () => {
  it('anchors the jump-to-latest button immediately above the coding composer', () => {
    expect(chatWidgetSource).toContain('ui-coding-chat-scroll-region');
    expect(globalStyles).toMatch(
      /\.ui-coding-chat-scroll-region \.ui-chat-scroll-latest\s*\{\s*bottom: 0\.75rem;/,
    );
  });
});
