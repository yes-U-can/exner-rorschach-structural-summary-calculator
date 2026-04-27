import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'About',
  description: 'About this service and its purpose.',
  alternates: {
    canonical: '/about',
    languages: buildLanguageAlternates('/about'),
  },
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);

  redirect(`/about?lang=${activeLang}#contact`);
}
