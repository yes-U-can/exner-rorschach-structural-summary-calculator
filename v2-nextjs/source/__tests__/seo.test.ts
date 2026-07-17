import { describe, expect, it, vi } from 'vitest';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import {
  SEO_COPY,
  SITE_NAME,
  SITE_URL,
  buildAbsoluteLanguageAlternates,
  buildLanguageAlternates,
  buildLocalizedAlternates,
  buildLocalizedPath,
} from '@/lib/seo';

describe('localized SEO metadata', () => {
  it('keeps the requested Korean description verbatim', () => {
    expect(SEO_COPY.ko.home.description).toBe(
      '회원가입, 설치, 결제가 필요 없는 Exner Rorschach 종합체계(Comprehensive System) 검사 구조요약 계산기입니다. 오픈소스이며, 본 서비스는 전문가의 임상 판단을 대체하지 않습니다.',
    );
  });

  it('provides a title and description for every supported language and public page', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      for (const page of ['home', 'about', 'terms', 'privacy', 'reference', 'versions'] as const) {
        expect(SEO_COPY[language][page].title.trim().length).toBeGreaterThan(0);
        expect(SEO_COPY[language][page].description.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('uses Yes, U Can! as the single site-name candidate', () => {
    expect(SITE_NAME).toBe('Yes, U Can!');
    expect(SITE_URL).toBe('https://exner.yesucan.co.kr');
    for (const language of SUPPORTED_LANGUAGES) {
      expect(SEO_COPY[language].home.title).toBe(SITE_NAME);
    }
  });

  it('does not let a Vercel preview host replace the official canonical domain', async () => {
    const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = 'https://exnersicp.vercel.app';
    vi.resetModules();

    const isolatedSeo = await import('@/lib/seo');
    expect(isolatedSeo.SITE_URL).toBe('https://exner.yesucan.co.kr');

    if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
    vi.resetModules();
  });

  it('keeps Korean as the default URL and gives each other language its own URL', () => {
    expect(buildLocalizedPath('/', 'ko')).toBe('/');
    expect(buildLocalizedPath('/', 'en')).toBe('/?lang=en');
    expect(buildLocalizedPath('/ref', 'ja')).toBe('/ref?lang=ja');

    expect(buildLanguageAlternates('/ref')).toEqual({
      ko: '/ref',
      en: '/ref?lang=en',
      ja: '/ref?lang=ja',
      es: '/ref?lang=es',
      pt: '/ref?lang=pt',
      'x-default': '/ref',
    });
  });

  it('uses a self-canonical URL while advertising all five language alternatives', () => {
    expect(buildLocalizedAlternates('/privacy', 'es')).toEqual({
      canonical: '/privacy?lang=es',
      languages: buildLanguageAlternates('/privacy'),
    });
    expect(buildAbsoluteLanguageAlternates('/privacy').en).toBe(
      'https://exner.yesucan.co.kr/privacy?lang=en',
    );
  });
});
