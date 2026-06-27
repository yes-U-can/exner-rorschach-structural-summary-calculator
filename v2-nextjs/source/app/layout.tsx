import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import { headers } from 'next/headers';
import Providers from '@/components/layout/Providers';
import { TranslationProvider } from '@/hooks/useTranslation';
import { ToastProvider } from '@/components/ui/Toast';
import GoogleAnalyticsPageView from '@/components/analytics/GoogleAnalyticsPageView';
import ByokSessionDialog from '@/components/byok/ByokSessionDialog';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://exner.yesucan.co.kr';
const siteUrl = rawSiteUrl.replace(/\s+/g, '').replace(/\/+$/, '');
const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ?? 'RNxcEfQGpSUiWQhUoTpaiS1UU0UPB9vLwZ1QUurRLMY';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Computing Program for Rorschach Structural Summary | Free Online Tool',
    template: '%s | Rorschach Structural Summary',
  },
  description:
    'Free online Rorschach (Comprehensive System) structural summary calculator for clinical practice and training.',
  keywords: [
    'Rorschach',
    'Rorschach test',
    'Comprehensive System',
    'Exner system',
    'Structural Summary',
    'Rorschach scoring',
    'clinical psychology',
    'psychodiagnostic tool',
  ],
  authors: [{ name: 'Seoul Institute of Clinical Psychology (SICP)' }],
  creator: 'Seoul Institute of Clinical Psychology (SICP)',
  publisher: 'SICP',
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
  openGraph: {
    type: 'website',
    url: '/',
    siteName: '로샤 구조요약 계산 도우미',
    locale: 'ko_KR',
    title: 'Exner(CS) 체계 로샤 구조요약 계산기',
    description:
      '서울임상심리연구소와 모오가 함께 제공하는 구조요약 계산 및 BYOK 기반 AI 보조 웹 도구입니다.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Exner(CS) 체계 로샤 구조요약 계산기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exner(CS) 체계 로샤 구조요약 계산기',
    description:
      '서울임상심리연구소와 모오가 함께 제공하는 구조요약 계산 및 BYOK 기반 AI 보조 웹 도구입니다.',
    images: ['/og-image.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const cookieYesScriptUrl = process.env.NEXT_PUBLIC_COOKIEYES_SCRIPT_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Computing Program for Rorschach Structural Summary',
    description:
      'Free online Rorschach (Comprehensive System) structural summary calculator for clinicians and trainees.',
    url: siteUrl,
    applicationCategory: 'MedicalApplication',
    operatingSystem: 'Web Browser',
    inLanguage: ['en', 'ko', 'ja', 'es', 'pt'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Seoul Institute of Clinical Psychology (SICP)',
      url: siteUrl,
    },
  };

  return (
    <html lang="ko" suppressHydrationWarning>
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
        {gaId && gaId !== 'G-XXXXXXXXXX' && (
          <>
            {cookieYesScriptUrl ? (
              <>
                <Script
                  id="google-consent-default"
                  strategy="beforeInteractive"
                  nonce={nonce}
                  suppressHydrationWarning
                >
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('consent', 'default', {
                      ad_storage: 'denied',
                      ad_user_data: 'denied',
                      ad_personalization: 'denied',
                      analytics_storage: 'denied'
                    });
                  `}
                </Script>
                <Script
                  id="cookieyes"
                  src={cookieYesScriptUrl}
                  strategy="beforeInteractive"
                  nonce={nonce}
                  suppressHydrationWarning
                />
              </>
            ) : null}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
              nonce={nonce}
              suppressHydrationWarning
            />
            <Script id="google-analytics" strategy="afterInteractive" nonce={nonce} suppressHydrationWarning>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  send_page_view: false,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} bg-[var(--brand-page)] font-sans antialiased text-[var(--text-body)]`}>
        <Providers>
          <TranslationProvider>
            <ToastProvider>
              {gaId && gaId !== 'G-XXXXXXXXXX' ? (
                <Suspense fallback={null}>
                  <GoogleAnalyticsPageView measurementId={gaId} />
                </Suspense>
              ) : null}
              <ByokSessionDialog />
              {children}
            </ToastProvider>
          </TranslationProvider>
        </Providers>
      </body>
    </html>
  );
}
