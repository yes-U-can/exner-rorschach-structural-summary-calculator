import { describe, expect, it } from 'vitest';

import { generateMetadata as generateAboutMetadata } from '@/app/about/page';
import { generateMetadata as generatePrivacyMetadata } from '@/app/privacy/page';
import { generateMetadata as generateReferenceDetailMetadata } from '@/app/ref/[...slug]/page';
import { generateMetadata as generateReferenceMetadata } from '@/app/ref/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { generateMetadata as generateTermsMetadata } from '@/app/terms/page';
import { generateMetadata as generateVersionsMetadata } from '@/app/versions/page';
import { SITE_URL } from '@/lib/seo';

const defaultLanguageCases = [
  { pathname: '/about', title: '서비스 소개', generate: generateAboutMetadata },
  { pathname: '/terms', title: '이용약관', generate: generateTermsMetadata },
  { pathname: '/privacy', title: '개인정보처리방침', generate: generatePrivacyMetadata },
  { pathname: '/ref', title: '참조 문서', generate: generateReferenceMetadata },
  { pathname: '/versions', title: '버전 아카이브', generate: generateVersionsMetadata },
] as const;

describe('public page language metadata', () => {
  it('keeps every queryless public route on the Korean canonical version', async () => {
    for (const testCase of defaultLanguageCases) {
      const metadata = await testCase.generate({ searchParams: Promise.resolve({}) });

      expect(metadata.title).toBe(testCase.title);
      expect(metadata.alternates?.canonical).toBe(testCase.pathname);
      expect(metadata.alternates?.languages).toMatchObject({
        ko: testCase.pathname,
        en: `${testCase.pathname}?lang=en`,
        ja: `${testCase.pathname}?lang=ja`,
        es: `${testCase.pathname}?lang=es`,
        'pt-BR': `${testCase.pathname}?lang=pt`,
        'x-default': testCase.pathname,
      });
    }
  });

  it('keeps the Brazilian Portuguese page URL stable while emitting pt-BR metadata', async () => {
    const metadata = await generateAboutMetadata({
      searchParams: Promise.resolve({ lang: 'pt' }),
    });

    expect(metadata.title).toBe('Sobre o serviço');
    expect(metadata.alternates?.canonical).toBe('/about?lang=pt');
    expect(metadata.alternates?.languages).toMatchObject({
      'pt-BR': '/about?lang=pt',
    });
  });

  it('keeps a queryless reference document on its Korean canonical URL', async () => {
    const metadata = await generateReferenceDetailMetadata({
      params: Promise.resolve({ slug: ['scoring-input'] }),
      searchParams: Promise.resolve({}),
    });

    expect(metadata.alternates?.canonical).toBe('/ref/scoring-input');
    expect(metadata.alternates?.languages).toMatchObject({
      ko: '/ref/scoring-input',
      en: '/ref/scoring-input?lang=en',
      ja: '/ref/scoring-input?lang=ja',
      es: '/ref/scoring-input?lang=es',
      'pt-BR': '/ref/scoring-input?lang=pt',
      'x-default': '/ref/scoring-input',
    });
  });

  it('lists every indexable URL with itself and all five language alternatives', () => {
    const entries = sitemap();
    const expectedLanguageTags = ['en', 'es', 'ja', 'ko', 'pt-BR', 'x-default'];

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const languages = entry.alternates?.languages;
      expect(Object.keys(languages ?? {}).sort()).toEqual(expectedLanguageTags);
      expect(Object.values(languages ?? {})).toContain(entry.url);
    }
  });

  it('publishes the official sitemap and keeps private AI routes out of search', () => {
    const metadata = robots();

    expect(metadata.host).toBe(SITE_URL);
    expect(metadata.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(metadata.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: '*',
          allow: '/',
          disallow: expect.arrayContaining(['/api/', '/chat']),
        }),
      ]),
    );
  });
});
