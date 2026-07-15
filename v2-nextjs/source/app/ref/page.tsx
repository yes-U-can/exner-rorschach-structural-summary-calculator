import { ArrowRightIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import ReferenceSearchForm from '@/components/ref/ReferenceSearchForm';
import { buildReferenceDocHref, searchReferenceRuntimeDocs } from '@/lib/referenceCorpus';
import { buildReferenceSearchExcerpt } from '@/lib/referenceSearchExcerpt';
import { buildLanguageAlternates } from '@/lib/seo';

type Language = 'en' | 'ko' | 'ja' | 'es' | 'pt';

type RefPageProps = {
  searchParams: Promise<{ lang?: string; q?: string }>;
};

const SEARCH_RESULT_LIMIT = 5;

type RefCopy = {
  searchLabel: string;
  searchPlaceholder: string;
  searchEmptyTitle: string;
  searchEmptyHint: string;
  clearSearch: string;
  searchResults: (count: number, query: string) => string;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

const COPY: Record<Language, RefCopy> = {
  ko: {
    searchLabel: '\uCC38\uC870 \uBB38\uC11C \uAC80\uC0C9',
    searchPlaceholder: '\uBD80\uD638\uD654 \uADDC\uCE59, \uBCC0\uC218\uBA85, \uAC1C\uB150\uC5B4 \uB4F1\uC744 \uAC80\uC0C9\uD558\uC138\uC694',
    searchEmptyTitle: '\uC77C\uCE58\uD558\uB294 \uCC38\uC870 \uBB38\uC11C\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.',
    searchEmptyHint: '\uCCA0\uC790\uB97C \uD655\uC778\uD558\uAC70\uB098 \uB354 \uC9E7\uC740 \uAC80\uC0C9\uC5B4\uB85C \uB2E4\uC2DC \uAC80\uC0C9\uD574 \uBCF4\uC138\uC694.',
    clearSearch: '\uAC80\uC0C9\uC5B4 \uC9C0\uC6B0\uAE30',
    searchResults: (count, query) => `"${query}"\uC5D0 \uB300\uD55C \uC0C1\uC704 \uAC80\uC0C9 \uACB0\uACFC ${count}\uAC74`,
  },
  en: {
    searchLabel: 'Search reference documents',
    searchPlaceholder: 'Search coding rules, variables, and concepts',
    searchEmptyTitle: 'No matching reference documents were found.',
    searchEmptyHint: 'Check the spelling or try again with a shorter search term.',
    clearSearch: 'Clear search',
    searchResults: (count, query) => `Top ${count} result(s) for "${query}"`,
  },
  ja: {
    searchLabel: '\u53C2\u7167\u6587\u66F8\u691C\u7D22',
    searchPlaceholder: '\u30B3\u30FC\u30C7\u30A3\u30F3\u30B0\u898F\u5247\u3001\u5909\u6570\u540D\u3001\u6982\u5FF5\u3092\u691C\u7D22',
    searchEmptyTitle: '\u4E00\u81F4\u3059\u308B\u53C2\u7167\u6587\u66F8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002',
    searchEmptyHint: '\u7DB4\u308A\u3092\u78BA\u8A8D\u3059\u308B\u304B\u3001\u3088\u308A\u77ED\u3044\u691C\u7D22\u8A9E\u3067\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002',
    clearSearch: '\u691C\u7D22\u8A9E\u3092\u6D88\u53BB',
    searchResults: (count, query) => `\u300C${query}\u300D\u306E\u4E0A\u4F4D\u691C\u7D22\u7D50\u679C ${count}\u4EF6`,
  },
  es: {
    searchLabel: 'Buscar documentos de referencia',
    searchPlaceholder: 'Busca reglas de codificaci\u00F3n, variables y conceptos',
    searchEmptyTitle: 'No se encontraron documentos de referencia coincidentes.',
    searchEmptyHint: 'Comprueba la ortograf\u00EDa o prueba de nuevo con un t\u00E9rmino m\u00E1s corto.',
    clearSearch: 'Borrar b\u00FAsqueda',
    searchResults: (count, query) => `Primeros ${count} resultado(s) para "${query}"`,
  },
  pt: {
    searchLabel: 'Pesquisar documentos de refer\u00EAncia',
    searchPlaceholder: 'Pesquise regras de codifica\u00E7\u00E3o, vari\u00E1veis e conceitos',
    searchEmptyTitle: 'Nenhum documento de refer\u00EAncia correspondente foi encontrado.',
    searchEmptyHint: 'Verifique a ortografia ou tente novamente com um termo mais curto.',
    clearSearch: 'Limpar pesquisa',
    searchResults: (count, query) => `Principais ${count} resultado(s) para "${query}"`,
  },
};

export const metadata: Metadata = {
  title: 'Reference Documents',
  description: 'Searchable documentation for Rorschach scoring items and structural summary variables.',
  alternates: {
    canonical: '/ref',
    languages: buildLanguageAlternates('/ref'),
  },
};

function buildSearchResultHref(canonicalRoute: string, language: Language, query: string) {
  return `${buildReferenceDocHref(canonicalRoute, language)}&q=${encodeURIComponent(query)}`;
}

export default async function RefIndexPage({ searchParams }: RefPageProps) {
  const params = await searchParams;
  const language = normalizeLang(params.lang);
  const query = (params.q ?? '').trim();

  if (!query) {
    redirect(buildReferenceDocHref('scoring-input', language));
  }

  const searchResults = searchReferenceRuntimeDocs(language, query, SEARCH_RESULT_LIMIT);
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-[var(--brand-page)] text-[var(--text-body)]">
      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <section className="mx-auto w-full max-w-4xl">
          <ReferenceSearchForm
            language={language}
            label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
            defaultQuery={query}
            className="w-full"
          />

          {searchResults.length === 0 ? (
            <>
              <p className="mt-4 text-sm text-[var(--text-soft)]">{copy.searchResults(searchResults.length, query)}</p>
              <div className="mt-8 flex min-h-72 flex-col items-center justify-center border-y border-[var(--border-subtle)] px-5 py-12 text-center">
                <DocumentMagnifyingGlassIcon className="h-10 w-10 text-[var(--brand-700)]" aria-hidden="true" />
                <h1 className="mt-4 text-base font-semibold text-[var(--text-strong)]">{copy.searchEmptyTitle}</h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--text-soft)]">{copy.searchEmptyHint}</p>
                <Link
                  href={`/ref?lang=${language}`}
                  className="mt-5 inline-flex min-h-10 items-center rounded-md border border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 text-sm font-semibold text-[var(--text-body)] transition-colors hover:border-[var(--brand-300)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand-700)]"
                >
                  {copy.clearSearch}
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm text-[var(--text-soft)]">{copy.searchResults(searchResults.length, query)}</p>
              <ul className="mt-5 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                {searchResults.map((doc) => (
                  <li key={doc.canonicalRoute} className="group transition-colors hover:bg-[var(--surface-muted)]">
                    <Link href={buildSearchResultHref(doc.canonicalRoute, language, query)} className="flex items-center gap-4 px-1 py-5 sm:px-3">
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-base font-semibold text-[var(--text-strong)] group-hover:text-[var(--brand-700)]">
                          {doc.title}
                        </span>
                        <span className="mt-1 block text-xs text-[var(--text-soft)]">/{doc.canonicalRoute}</span>
                        <span className="mt-2 line-clamp-3 block text-sm leading-6 text-[var(--text-body)]">
                          {buildReferenceSearchExcerpt(doc.excerpt || doc.bodyText)}
                        </span>
                      </span>
                      <ArrowRightIcon className="h-5 w-5 shrink-0 text-[var(--text-soft)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--brand-700)]" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
