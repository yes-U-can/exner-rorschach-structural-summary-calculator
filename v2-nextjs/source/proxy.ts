import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { DEFAULT_LANGUAGE, normalizeLanguage } from '@/i18n/config';

function getNonce() {
  return randomBytes(16).toString('base64');
}

function getCookieYesOrigin() {
  const scriptUrl = process.env.NEXT_PUBLIC_COOKIEYES_SCRIPT_URL;
  if (!scriptUrl) return null;
  try {
    return new URL(scriptUrl).origin;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy(nonce: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieYesOrigin = getCookieYesOrigin();
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    cookieYesOrigin,
    isProduction ? null : "'unsafe-eval'",
  ].filter(Boolean);

  const directives = [
    ["default-src", "'self'"],
    ['base-uri', "'self'"],
    ['object-src', "'none'"],
    ['frame-ancestors', "'none'"],
    ['form-action', "'self'"],
    ['script-src', ...scriptSrc],
    ["style-src", "'self'", "'unsafe-inline'"],
    [
      'img-src',
      "'self'",
      'data:',
      'blob:',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
    ["font-src", "'self'", 'data:'],
    [
      'connect-src',
      "'self'",
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://region1.google-analytics.com',
      cookieYesOrigin,
    ].filter(Boolean),
    ['frame-src', "'none'"],
    ["manifest-src", "'self'"],
    ["worker-src", "'self'", 'blob:'],
    isProduction ? ['upgrade-insecure-requests'] : null,
  ].filter(Boolean) as string[][];

  return directives.map((directive) => directive.join(' ')).join('; ');
}

export function proxy(request: NextRequest) {
  const nonce = getNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'x-language',
    normalizeLanguage(request.nextUrl.searchParams.get('lang')) ?? DEFAULT_LANGUAGE,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', buildContentSecurityPolicy(nonce));
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sicp-icon-192.png|apple-icon.png|og-image.png|robots.txt|sitemap.xml|sitemap-main.xml).*)',
  ],
};
