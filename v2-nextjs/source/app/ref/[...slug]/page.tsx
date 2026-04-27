import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import CopyDocButton from '@/components/docs/CopyDocButton';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ReferenceMarkdown from '@/components/ref/ReferenceMarkdown';
import ReferenceRelatedPanel from '@/components/ref/ReferenceRelatedPanel';
import { getTranslation } from '@/i18n/client';
import {
  buildReferenceDocHref,
  getReferenceRuntimeDocBySlug,
  getReferenceRuntimeDocChildren,
  getReferenceRuntimeStaticSlugs,
} from '@/lib/referenceCorpus';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ lang?: string }>;
};

type NavRow = {
  key: string;
  prefix: string[];
  items: ReturnType<typeof getReferenceRuntimeDocChildren>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
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

  if (!slug?.length) {
    return {
      title: docsLabel,
      alternates: {
        canonical: '/ref',
        languages: buildLanguageAlternates('/ref'),
      },
    };
  }

  const doc = getReferenceRuntimeDocBySlug(activeLang, slug);
  if (!doc) {
    return {
      title: docsLabel,
      alternates: {
        canonical: '/ref',
        languages: buildLanguageAlternates('/ref'),
      },
    };
  }

  const canonicalPath = `/ref/${doc.slug.map((segment) => encodeURIComponent(segment)).join('/')}`;

  return {
    title: `${doc.title} | ${docsLabel}`,
    description: doc.excerpt || doc.bodyText,
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(canonicalPath),
    },
  };
}

export default async function DocDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);

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
  const copyText = `${doc.title}\n\n${doc.bodyText}`;
  const bodyMarkdown = stripDuplicateTitleHeading(doc.bodyMarkdown || doc.bodyText, doc.title);

  return (
    <div className="min-h-screen bg-[var(--brand-page)]">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="ui-ref-card mb-6 p-4">
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
                    className={`rounded-md border px-2.5 py-1 text-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${
                      isActive
                        ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-[var(--on-brand)]'
                        : isInPath
                          ? 'border-[var(--brand-200)] bg-[var(--brand-200)]/20 text-[var(--brand-700)]'
                          : 'border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-body)] hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </section>

        <article className="ui-ref-card rounded-lg p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="break-words text-2xl font-bold text-[var(--text-strong)] sm:text-3xl">{doc.title}</h1>
            <CopyDocButton text={copyText} />
          </div>
          <ReferenceMarkdown
            markdown={bodyMarkdown}
            language={activeLang}
            className="mt-6"
          />
          <ReferenceRelatedPanel language={activeLang} currentDoc={doc} className="mt-10" />
        </article>
      </main>
      <Footer />
    </div>
  );
}
