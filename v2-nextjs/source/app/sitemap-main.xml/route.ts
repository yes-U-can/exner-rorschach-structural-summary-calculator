import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getReferenceRuntimeDocs } from '@/lib/referenceCorpus';
import {
  buildAbsoluteLanguageAlternates,
  buildLocalizedPath,
  getAbsoluteUrl,
} from '@/lib/seo';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlEntry(pathname: string, language: (typeof SUPPORTED_LANGUAGES)[number], now: string) {
  const url = getAbsoluteUrl(buildLocalizedPath(pathname, language));
  const alternateLinks = Object.entries(buildAbsoluteLanguageAlternates(pathname))
    .map(([alternateLanguage, href]) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternateLanguage)}" href="${escapeXml(href)}" />`,
    )
    .join('\n');

  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n${alternateLinks}\n    <lastmod>${now}</lastmod>\n  </url>`;
}

export const dynamic = 'force-static';

export async function GET() {
  const now = new Date().toISOString();
  const basePaths = ['/', '/ref', '/about', '/terms', '/privacy', '/versions'];
  const docPaths = getReferenceRuntimeDocs('en')
    .filter((item) => item.kind === 'entry')
    .map((item) => `/ref/${item.slug.join('/')}`);

  const entries = [...basePaths, ...docPaths].flatMap((pathname) =>
    SUPPORTED_LANGUAGES.map((language) => buildUrlEntry(pathname, language, now)),
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
