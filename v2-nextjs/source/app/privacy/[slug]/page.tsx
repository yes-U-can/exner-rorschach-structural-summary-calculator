import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveLanguage } from '@/i18n/config';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return resolveLanguage(lang);
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for using this website.',
  alternates: {
    canonical: '/privacy',
    languages: buildLanguageAlternates('/privacy'),
  },
};

export default async function PrivacyDetailPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  redirect(`/privacy?lang=${activeLang}`);
}
