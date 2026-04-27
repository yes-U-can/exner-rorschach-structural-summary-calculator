import { getReferenceRuntimeDocs } from '@/lib/referenceCorpus';

function buildSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://exnersicp.vercel.app';
  return raw.replace(/\s+/g, '').replace(/\/+$/, '');
}

function absolute(siteUrl: string, pathname: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalized, `${siteUrl}/`).toString();
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = buildSiteUrl();
  const now = new Date().toISOString();

  const basePaths = ['/', '/ref', '/about', '/terms', '/privacy', '/chat'];
  const docPaths = getReferenceRuntimeDocs('en')
    .filter((item) => item.kind === 'entry')
    .map((item) => `/ref/${item.slug.join('/')}`);

  const urls = [...basePaths, ...docPaths].map((path) => absolute(siteUrl, path));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
