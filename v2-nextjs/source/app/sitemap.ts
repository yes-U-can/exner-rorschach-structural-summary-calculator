import { MetadataRoute } from 'next';
import { getReferenceRuntimeDocs } from '@/lib/referenceCorpus';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://exnersicp.vercel.app';
const siteUrl = rawSiteUrl.replace(/\s+/g, '').replace(/\/+$/, '');

function absolute(pathname: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalized, `${siteUrl}/`).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absolute('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absolute('/ref'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absolute('/chat'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: absolute('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/terms'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/privacy'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const docRoutes = getReferenceRuntimeDocs('en')
    .filter((item) => item.kind === 'entry')
    .map((item) => ({
      url: absolute(`/ref/${item.slug.join('/')}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));

  return [...staticRoutes, ...docRoutes];
}
