import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import CopyDocButton from '@/components/docs/CopyDocButton';
import ReferenceMarkdown from '@/components/ref/ReferenceMarkdown';
import ReferenceRelatedPanel from '@/components/ref/ReferenceRelatedPanel';
import ReferenceSearchForm from '@/components/ref/ReferenceSearchForm';
import { getTranslation } from '@/i18n/client';
import { resolveLanguage } from '@/i18n/config';
import {
  buildReferenceDocHref,
  getReferenceRuntimeDocBySlug,
  getReferenceRuntimeDocChildren,
  getReferenceRuntimeStaticSlugs,
} from '@/lib/referenceCorpus';
import { buildLocalizedPageMetadata, getSeoCopy } from '@/lib/seo';
import { getReferencePresentationTitle } from '@/lib/referencePresentation';
import type { Language } from '@/types';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ lang?: string; q?: string }>;
};

type NavRow = {
  key: string;
  prefix: string[];
  items: ReturnType<typeof getReferenceRuntimeDocChildren>;
};

function normalizeLang(lang?: string): Language {
  return resolveLanguage(lang);
}

function buildNavRows(language: Language, slug: string[]): NavRow[] {
  const rows: NavRow[] = [];

  for (let depth = 0; depth <= slug.length; depth += 1) {
    const prefix = slug.slice(0, depth);
    const items = getReferenceRuntimeDocChildren(language, prefix);
    if (items.length === 0) continue;

    rows.push({
      key: prefix.join('/') || 'root',
      prefix,
      items,
    });
  }

  return rows;
}

function normalizeHeadingText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildSeoDescription(value: string) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length <= 180 ? normalized : `${normalized.slice(0, 177).trimEnd()}...`;
}

function stripDuplicateTitleHeading(markdown: string, title: string) {
  const lines = markdown.split(/\r?\n/);
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);

  if (firstContentIndex === -1) return markdown;

  const firstLine = lines[firstContentIndex].trim();
  const firstHeadingText = firstLine
    .replace(/^#{1,6}\s+/, '')
    .replace(/\s+#+$/, '')
    .trim();

  if (normalizeHeadingText(firstHeadingText) !== normalizeHeadingText(title)) {
    return markdown;
  }

  const nextLines = [
    ...lines.slice(0, firstContentIndex),
    ...lines.slice(firstContentIndex + 1),
  ];

  while (nextLines.length > 0 && nextLines[0].trim().length === 0) {
    nextLines.shift();
  }

  return nextLines.join('\n');
}

export async function generateStaticParams() {
  return getReferenceRuntimeStaticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const docsLabel = getTranslation(activeLang, 'reference.title');
  const referenceSeo = getSeoCopy('reference', activeLang);

  if (!slug?.length) {
    return buildLocalizedPageMetadata({
      language: activeLang,
      pathname: '/ref',
      title: docsLabel,
      description: referenceSeo.description,
    });
  }

  const doc = getReferenceRuntimeDocBySlug(activeLang, slug);
  if (!doc) {
    return buildLocalizedPageMetadata({
      language: activeLang,
      pathname: '/ref',
      title: docsLabel,
      description: referenceSeo.description,
    });
  }

  const canonicalPath = `/ref/${doc.slug.map((segment) => encodeURIComponent(segment)).join('/')}`;
  const presentationTitle = getReferencePresentationTitle(activeLang, doc.canonicalRoute, doc.title);

  return buildLocalizedPageMetadata({
    language: activeLang,
    pathname: canonicalPath,
    title: `${presentationTitle} | ${docsLabel}`,
    description: buildSeoDescription(doc.excerpt || doc.bodyText),
  });
}

export default async function DocDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang, q } = await searchParams;
  const activeLang = normalizeLang(lang);
  const query = (q ?? '').trim();

  if (!slug?.length) {
    notFound();
  }

  const doc = getReferenceRuntimeDocBySlug(activeLang, slug);
  if (!doc) {
    notFound();
  }

  if (doc.slug.join('/') !== slug.join('/')) {
    redirect(buildReferenceDocHref(doc.canonicalRoute, activeLang));
  }

  const navRows = buildNavRows(activeLang, slug);
  const presentationTitle = getReferencePresentationTitle(activeLang, doc.canonicalRoute, doc.title);
  const copyText = `${presentationTitle}\n\n${doc.bodyText}`;
  const bodyMarkdown = stripDuplicateTitleHeading(doc.bodyMarkdown || doc.bodyText, doc.title);

  return (
    <div className="min-h-screen bg-[var(--brand-page)]">
      <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <ReferenceSearchForm
          language={activeLang}
          label={getTranslation(activeLang, 'reference.searchLabel')}
          placeholder={getTranslation(activeLang, 'reference.searchPlaceholder')}
          defaultQuery={query}
          className="mx-auto mb-8 max-w-4xl"
        />

        <section className="mx-auto mb-10 max-w-4xl border-b border-[var(--border-subtle)] pb-6">
          {navRows.map((row, rowIndex) => (
            <div
              key={row.key}
              className={`${rowIndex === 0 ? '' : 'mt-2 border-t border-[var(--border-subtle)] pt-3'} flex flex-wrap gap-2`}
            >
              {row.items.map((item) => {
                const itemPath = item.slug.join('/');
                const currentPath = slug.join('/');
                const isActive = itemPath === currentPath;
                const isInPath = currentPath.startsWith(`${itemPath}/`);

                return (
                  <Link
                    key={`${row.key}:${itemPath}`}
                    href={buildReferenceDocHref(item.canonicalRoute, activeLang)}
                    className={`inline-flex min-h-9 items-center rounded-md border px-3 py-2 text-sm leading-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${
                      isActive
                        ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-[var(--on-brand)]'
                        : isInPath
                          ? 'border-[var(--brand-200)] bg-[var(--brand-200)]/20 text-[var(--brand-700)]'
                          : 'border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)] hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    {getReferencePresentationTitle(activeLang, item.canonicalRoute, item.title)}
                  </Link>
                );
              })}
            </div>
          ))}
        </section>

        <article className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="break-words text-2xl font-bold text-[var(--text-strong)] sm:text-3xl">{presentationTitle}</h1>
            <CopyDocButton text={copyText} language={activeLang} />
          </div>
          <ReferenceMarkdown
            markdown={bodyMarkdown}
            language={activeLang}
            className="mt-6"
          />
          <ReferenceRelatedPanel language={activeLang} currentDoc={doc} className="mt-10" />
        </article>
      </main>
    </div>
  );
}
