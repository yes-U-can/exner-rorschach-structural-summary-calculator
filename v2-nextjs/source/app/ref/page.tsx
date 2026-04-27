import type { Metadata } from 'next';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { buildReferenceDocHref, searchReferenceRuntimeDocs } from '@/lib/referenceCorpus';
import { buildLanguageAlternates } from '@/lib/seo';

type Language = 'en' | 'ko' | 'ja' | 'es' | 'pt';

type RefPageProps = {
  searchParams: Promise<{ lang?: string; q?: string }>;
};

const SEARCH_RESULT_LIMIT = 5;

type RefCopy = {
  searchTitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchIdle: string;
  searchEmpty: string;
  searchResults: (count: number, query: string) => string;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

const COPY: Record<Language, RefCopy> = {
  ko: {
    searchTitle: '\uC6F9\uC571\uC774 \uC0AC\uC6A9\uD558\uB294 \uCC38\uC870 \uBB38\uC11C\uB97C \uC5EC\uAE30\uC5D0\uC11C \uBC14\uB85C \uAC80\uC0C9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
    searchLabel: '\uCC38\uC870 \uBB38\uC11C \uAC80\uC0C9',
    searchPlaceholder: '\uBD80\uD638\uD654 \uADDC\uCE59, \uBCC0\uC218\uBA85, \uAC1C\uB150\uC5B4 \uB4F1\uC744 \uAC80\uC0C9\uD558\uC138\uC694',
    searchIdle: '\uAC80\uC0C9\uB41C \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.',
    searchEmpty: '\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.',
    searchResults: (count, query) => `"${query}"\uC5D0 \uB300\uD55C \uC0C1\uC704 \uAC80\uC0C9 \uACB0\uACFC ${count}\uAC74`,
  },
  en: {
    searchTitle: 'Search the reference documents used by this web app.',
    searchLabel: 'Search reference documents',
    searchPlaceholder: 'Search coding rules, variables, and concepts',
    searchIdle: 'No results found.',
    searchEmpty: 'No matching documents were found.',
    searchResults: (count, query) => `Top ${count} result(s) for "${query}"`,
  },
  ja: {
    searchTitle: 'Web\u30A2\u30D7\u30EA\u304C\u4F7F\u7528\u3059\u308B\u53C2\u7167\u6587\u66F8\u3092\u3053\u3053\u3067\u76F4\u63A5\u691C\u7D22\u3067\u304D\u307E\u3059\u3002',
    searchLabel: '\u53C2\u7167\u6587\u66F8\u691C\u7D22',
    searchPlaceholder: '\u30B3\u30FC\u30C7\u30A3\u30F3\u30B0\u898F\u5247\u3001\u5909\u6570\u540D\u3001\u6982\u5FF5\u3092\u691C\u7D22',
    searchIdle: '\u691C\u7D22\u7D50\u679C\u304C\u3042\u308A\u307E\u305B\u3093\u3002',
    searchEmpty: '\u4E00\u81F4\u3059\u308B\u6587\u66F8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002',
    searchResults: (count, query) => `\u300C${query}\u300D\u306E\u4E0A\u4F4D\u691C\u7D22\u7D50\u679C ${count}\u4EF6`,
  },
  es: {
    searchTitle: 'Busca aquí los documentos de referencia que usa la aplicación.',
    searchLabel: 'Buscar documentos de referencia',
    searchPlaceholder: 'Busca reglas de codificaci\u00F3n, variables y conceptos',
    searchIdle: 'No se encontraron resultados.',
    searchEmpty: 'No se encontraron documentos coincidentes.',
    searchResults: (count, query) => `Primeros ${count} resultado(s) para "${query}"`,
  },
  pt: {
    searchTitle: 'Pesquise aqui os documentos de referência usados pelo aplicativo.',
    searchLabel: 'Pesquisar documentos de refer\u00EAncia',
    searchPlaceholder: 'Pesquise regras de codifica\u00E7\u00E3o, vari\u00E1veis e conceitos',
    searchIdle: 'Nenhum resultado encontrado.',
    searchEmpty: 'Nenhum documento correspondente foi encontrado.',
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

function trimExcerpt(text: string, maxLength = 240) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

export default async function RefIndexPage({ searchParams }: RefPageProps) {
  const params = await searchParams;
  const language = normalizeLang(params.lang);
  const query = (params.q ?? '').trim();
  const hasQuery = query.length > 0;
  const searchResults = hasQuery ? searchReferenceRuntimeDocs(language, query, SEARCH_RESULT_LIMIT) : [];
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-[var(--brand-page)] text-[var(--text-body)]">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <section className="ui-ref-card rounded-3xl p-6">
          <h1 className="max-w-3xl text-base font-medium leading-7 tracking-tight text-[var(--text-strong)] sm:text-lg">
            {copy.searchTitle}
          </h1>

          <form action="/ref" method="get" className="mt-6">
            <input type="hidden" name="lang" value={language} />
            <label htmlFor="reference-docs-query" className="sr-only">
              {copy.searchLabel}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="reference-docs-query"
                name="q"
                defaultValue={query}
                placeholder={copy.searchPlaceholder}
                className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-body)] placeholder:text-[var(--text-soft)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
              />
              <button
                type="submit"
                aria-label={copy.searchLabel}
                title={copy.searchLabel}
                className="inline-flex items-center justify-center rounded-md bg-[var(--brand-700)] px-3 py-2 text-[var(--on-brand)] hover:bg-[var(--brand-700-hover)]"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {!hasQuery ? (
            <div className="ui-ref-muted mt-8 p-6 text-sm">
              {copy.searchIdle}
            </div>
          ) : searchResults.length === 0 ? (
            <>
              <p className="mt-3 text-sm text-[var(--text-soft)]">{copy.searchResults(searchResults.length, query)}</p>
              <div className="ui-ref-muted mt-8 p-6 text-sm">
                {copy.searchEmpty}
              </div>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-[var(--text-soft)]">{copy.searchResults(searchResults.length, query)}</p>
              <ul className="mt-6 space-y-3">
                {searchResults.map((doc) => (
                  <li
                    key={doc.canonicalRoute}
                    className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--brand-200)] hover:bg-[var(--surface-base)] hover:shadow"
                  >
                    <Link href={buildReferenceDocHref(doc.canonicalRoute, language)} className="block">
                      <span className="break-words text-base font-semibold text-[var(--text-strong)] group-hover:text-[var(--brand-700)]">
                        {doc.title}
                      </span>
                      <p className="mt-1 text-xs text-[var(--text-soft)]">/{doc.canonicalRoute}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-body)]">
                        {trimExcerpt(doc.excerpt || doc.bodyText)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
