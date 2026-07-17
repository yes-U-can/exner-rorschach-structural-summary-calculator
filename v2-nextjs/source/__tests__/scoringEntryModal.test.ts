import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homePageSource = readFileSync('app/page.tsx', 'utf8');

describe('scoring workspace entry modal', () => {
  it('does not suppress the modal after the first visit in a browser session', () => {
    expect(homePageSource).not.toContain('rorschach_welcome_seen');
    expect(homePageSource).toContain(
      'const timer = window.setTimeout(() => setShowWelcomeModal(true), 0);',
    );
  });

  it('opens again when the scoring navigation link is clicked on the scoring page', () => {
    const handlerStart = homePageSource.indexOf('const handleHomeLinkClick');
    const handlerEnd = homePageSource.indexOf('// Handle welcome modal actions');
    const handlerSource = homePageSource.slice(handlerStart, handlerEnd);

    expect(handlerSource).toContain("url.pathname === '/'");
    expect(handlerSource).toContain('setShowWelcomeModal(true)');
    expect(handlerSource).not.toContain('hasSavedData()');
  });
});
