import type { Metadata } from 'next';
import VersionArchiveList from '@/components/versions/VersionArchiveList';
import { resolveLanguage } from '@/i18n/config';
import { v1GasVersions, v2NextVersions } from '@/lib/versionArchive';
import { buildLocalizedPageMetadata, getSeoCopy } from '@/lib/seo';
import type { Language } from '@/types';

type VersionsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const TITLES: Record<Language, string> = {
  ko: '버전 아카이브',
  en: 'Version Archive',
  ja: 'バージョンアーカイブ',
  es: 'Archivo de versiones',
  pt: 'Arquivo de versões',
};

function normalizeLang(lang?: string): Language {
  return resolveLanguage(lang);
}

export async function generateMetadata({ searchParams }: VersionsPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const language = normalizeLang(lang);
  const copy = getSeoCopy('versions', language);
  return buildLocalizedPageMetadata({ language, pathname: '/versions', ...copy });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VersionsPage({ searchParams }: VersionsPageProps) {
  const { lang: requestedLanguage } = await searchParams;
  const language = normalizeLang(requestedLanguage);

  return (
    <div className="min-h-screen bg-[var(--brand-page)] text-[var(--text-body)]">
      <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <article id="versions-page-content">
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">
            {TITLES[language]}
          </h1>
          <VersionArchiveList v2NextVersions={v2NextVersions} v1GasVersions={v1GasVersions} />
        </article>
      </main>
    </div>
  );
}
