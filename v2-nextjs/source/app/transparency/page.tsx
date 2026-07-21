import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { resolveLanguage } from '@/i18n/config';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type TransparencyPageProps = {
  searchParams: Promise<{ lang?: string; q?: string }>;
};

function normalizeLang(lang?: string): Language {
  return resolveLanguage(lang);
}

export const metadata: Metadata = {
  title: 'Reference Documents',
  description: 'Searchable documentation for Rorschach scoring items and structural summary variables.',
  alternates: {
    canonical: '/ref',
    languages: buildLanguageAlternates('/ref'),
  },
};

export default async function TransparencyPage({ searchParams }: TransparencyPageProps) {
  const { q, lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const query = (q ?? '').trim();
  const target = query.length > 0
    ? `/ref?lang=${activeLang}&q=${encodeURIComponent(query)}`
    : `/ref?lang=${activeLang}`;

  redirect(target);
}
