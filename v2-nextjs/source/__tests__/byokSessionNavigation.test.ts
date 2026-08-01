import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getByokSessionSuccessPath } from '@/lib/byokSessionClient';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

const appShellSource = readFileSync('components/layout/AppShell.tsx', 'utf8');

describe('BYOK session navigation intent', () => {
  it('opens the interpretation assistant after a protected sidebar request', () => {
    expect(appShellSource).toContain(
      "openByokSessionDialog({ source: 'sidebar', destination: 'chat' });",
    );

    for (const language of SUPPORTED_LANGUAGES) {
      expect(getByokSessionSuccessPath({ destination: 'chat' }, language)).toBe(
        `/chat?lang=${language}`,
      );
    }
  });

  it('keeps ordinary session setup on the current page', () => {
    expect(getByokSessionSuccessPath({ source: 'sidebar' }, 'ko')).toBeNull();
    expect(getByokSessionSuccessPath({}, 'en')).toBeNull();
  });
});
