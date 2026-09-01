import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import Providers from '@/components/layout/Providers';
import { TranslationProvider } from '@/hooks/useTranslation';
import { ToastProvider } from '@/components/ui/Toast';
import ByokSessionDialog from '@/components/byok/ByokSessionDialog';
import AppShell from '@/components/layout/AppShell';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, normalizeLanguage } from '@/i18n/config';
import {
  PRODUCT_NAME_BY_LANGUAGE,
  SEO_KEYWORDS_BY_LANGUAGE,
  SITE_NAME,
  SITE_URL,
  buildLocalizedPageMetadata,
  buildLocalizedPath,
  getAbsoluteUrl,
  getSeoCopy,
  getSeoLanguageTag,
} from '@/lib/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ?? 'RNxcEfQGpSUiWQhUoTpaiS1UU0UPB9vLwZ1QUurRLMY';

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const language = normalizeLanguage(requestHeaders.get('x-language')) ?? DEFAULT_LANGUAGE;
  const copy = getSeoCopy('home', language);
  const localizedMetadata = buildLocalizedPageMetadata({
    language,
    pathname: '/',
    title: copy.title,
    description: copy.description,
  });

  return {
    ...localizedMetadata,
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: copy.title,
      template: `%s | ${SITE_NAME}`,
    },
    keywords: SEO_KEYWORDS_BY_LANGUAGE[language],
    authors: [{ name: 'MOW' }],
    creator: 'MOW',
    publisher: 'MOW',
    category: 'Clinical psychology tool',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/sicp-icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/sicp-icon.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
    },
    verification: {
      google: googleSiteVerification,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get('x-nonce') ?? undefined;
  const initialLanguage = normalizeLanguage(requestHeaders.get('x-language')) ?? DEFAULT_LANGUAGE;
  const seoCopy = getSeoCopy('home', initialLanguage);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: [
          'Yes U Can',
          'Exner 로샤 종합체계 구조요약 계산기',
          '엑스너 로샤 종합체계 구조요약 계산기',
          '로샤 구조요약 계산기',
          'Exner Rorschach Structural Summary Calculator',
        ],
        inLanguage: SUPPORTED_LANGUAGES.map(getSeoLanguageTag),
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#web-application`,
        name:
          PRODUCT_NAME_BY_LANGUAGE[initialLanguage],
        alternateName: [
          SITE_NAME,
          'Exner CS Structural Summary Calculator',
          '엑스너 로샤 종합체계 구조요약 계산기',
        ],
        description: seoCopy.description,
        url: getAbsoluteUrl(buildLocalizedPath('/', initialLanguage)),
        isPartOf: { '@id': `${SITE_URL}/#website` },
        applicationCategory: 'MedicalApplication',
        operatingSystem: 'Web Browser',
        inLanguage: getSeoLanguageTag(initialLanguage),
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        creator: {
          '@type': 'Organization',
          name: 'MOW',
        },
        contributor: {
          '@type': 'Organization',
          name: 'Seoul Institute of Clinical Psychology (SICP)',
        },
      },
    ],
  };

  return (
    <html lang={getSeoLanguageTag(initialLanguage)} suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('sicp-theme');var d=t==='dark';document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}",
          }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} bg-[var(--brand-page)] font-sans antialiased text-[var(--text-body)]`}>
        <Providers>
          <TranslationProvider initialLanguage={initialLanguage}>
            <ToastProvider>
              <ByokSessionDialog />
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </TranslationProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
