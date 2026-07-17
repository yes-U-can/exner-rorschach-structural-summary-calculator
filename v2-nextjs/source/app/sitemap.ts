import type { MetadataRoute } from 'next';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getReferenceRuntimeDocs } from '@/lib/referenceCorpus';
import {
  buildAbsoluteLanguageAlternates,
  buildLocalizedPath,
  getAbsoluteUrl,
} from '@/lib/seo';

type SitemapPolicy = Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority'>;

const STATIC_ROUTES: Array<{ pathname: string; policy: SitemapPolicy }> = [
  { pathname: '/', policy: { changeFrequency: 'weekly', priority: 1 } },
  { pathname: '/ref', policy: { changeFrequency: 'weekly', priority: 0.9 } },
  { pathname: '/about', policy: { changeFrequency: 'monthly', priority: 0.6 } },
  { pathname: '/terms', policy: { changeFrequency: 'monthly', priority: 0.6 } },
  { pathname: '/privacy', policy: { changeFrequency: 'monthly', priority: 0.6 } },
  { pathname: '/versions', policy: { changeFrequency: 'monthly', priority: 0.55 } },
];

function localizedEntries(
  pathname: string,
  lastModified: Date,
  policy: SitemapPolicy,
): MetadataRoute.Sitemap {
  const languages = buildAbsoluteLanguageAlternates(pathname);
  return SUPPORTED_LANGUAGES.map((language) => ({
    url: getAbsoluteUrl(buildLocalizedPath(pathname, language)),
    lastModified,
    ...policy,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = STATIC_ROUTES.flatMap(({ pathname, policy }) =>
    localizedEntries(pathname, now, policy),
  );

  const docRoutes = getReferenceRuntimeDocs('en')
    .filter((item) => item.kind === 'entry')
    .flatMap((item) =>
      localizedEntries(`/ref/${item.slug.join('/')}`, now, {
        changeFrequency: 'monthly',
        priority: 0.65,
      }),
    );

  return [...staticRoutes, ...docRoutes];
}
