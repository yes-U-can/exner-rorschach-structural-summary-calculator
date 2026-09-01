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

  it('shows the institute brand lockup above the entry choices', () => {
    const modalStart = homePageSource.indexOf('{/* Welcome Modal */}');
    const modalEnd = homePageSource.indexOf('isOpen={showDownloadModal}');
    const modalSource = homePageSource.slice(modalStart, modalEnd);

    expect(modalSource).toContain('data-testid="sicp-brand-lockup"');
    expect(modalSource).toContain('href="https://www.yesucan.co.kr/"');
    expect(modalSource).toContain('target="_blank"');
    expect(modalSource).toContain('src="/sicp-icon.png"');
    expect(modalSource).toContain('서울임상심리연구소');
    expect(modalSource).toContain('Seoul Institute of Clinical Psychology');
    expect(modalSource.indexOf('sicp-brand-lockup')).toBeLessThan(
      modalSource.indexOf("t('modal.welcome.new')"),
    );
    expect(modalSource).toContain('autoFocus');
  });
});
