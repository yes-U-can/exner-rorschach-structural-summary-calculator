import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { normalizeLanguage, resolveLanguage, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getAppShellUi } from '@/lib/appShellUi';

const languageSelectorSource = readFileSync('components/layout/LanguageSelector.tsx', 'utf8');
const versionArchiveSource = readFileSync('components/versions/VersionArchiveList.tsx', 'utf8');
const appShellSource = readFileSync('components/layout/AppShell.tsx', 'utf8');
const translationHookSource = readFileSync('hooks/useTranslation.tsx', 'utf8');
const packageManifest = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };

describe('app shell UI copy', () => {
  it('provides complete sidebar labels in all five languages', () => {
    const expectedKeys = Object.keys(getAppShellUi('ko')).sort();
    for (const language of SUPPORTED_LANGUAGES) {
      const copy = getAppShellUi(language);
      expect(Object.keys(copy).sort()).toEqual(expectedKeys);
      for (const value of Object.values(copy)) {
        expect(value.trim()).not.toBe('');
      }
    }
  });

  it('keeps the Korean shell labels concise', () => {
    const copy = getAppShellUi('ko');
    expect(copy.workspace).toBe('작업공간');
    expect(copy.settings).toBe('설정');
    expect(copy.about).toBe('서비스 소개');
  });

  it('accepts only the five supported request languages', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(normalizeLanguage(language)).toBe(language);
    }
    expect(normalizeLanguage('fr')).toBeNull();
    expect(normalizeLanguage(undefined)).toBeNull();
  });

  it('uses Korean when a request has no supported language parameter', () => {
    expect(resolveLanguage(undefined)).toBe('ko');
    expect(resolveLanguage('fr')).toBe('ko');
    expect(resolveLanguage('en')).toBe('en');
  });

  it('keeps the document language tag region-specific after client hydration', () => {
    expect(translationHookSource).toContain(
      'document.documentElement.lang = getDocumentLanguageTag(resolvedLanguage);',
    );
    expect(translationHookSource).toContain(
      'document.documentElement.lang = getDocumentLanguageTag(language);',
    );
  });

  it('portals the sidebar language menu outside the collapsed rail', () => {
    expect(languageSelectorSource).toContain("to: compact ? ('right end' as const) : ('top start' as const)");
    expect(languageSelectorSource).toContain('portal={isSidebarVariant}');
    expect(languageSelectorSource).toContain('modal={false}');
  });

  it('keeps both version archive groups collapsed on first render', () => {
    expect(versionArchiveSource).toContain('const [isV2Open, setIsV2Open] = useState(false);');
    expect(versionArchiveSource).toContain('const [isV1Open, setIsV1Open] = useState(false);');
  });

  it('keeps the visible app version aligned across the shell and all locales', () => {
    expect(appShellSource).toContain(`const APP_VERSION = '${packageManifest.version}';`);

    for (const language of SUPPORTED_LANGUAGES) {
      const locale = JSON.parse(readFileSync(`i18n/locales/${language}.json`, 'utf8')) as {
        app: { version: string };
      };
      expect(locale.app.version).toBe(`v${packageManifest.version}`);
    }
  });
});
