'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t, language } = useTranslation();
  const appVersion = '2.1.10';
  const versionHref = `/versions?lang=${language}`;

  const labels = {
    en: {
      about: 'About',
      terms: 'Terms',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
    ko: {
      about: '서비스 소개',
      terms: '이용약관',
      copyright:
        '© 2026 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP) & 모오(MOW). All rights reserved.',
    },
    ja: {
      about: 'サービス紹介',
      terms: '利用規約',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
    es: {
      about: 'Acerca de',
      terms: 'T\u00E9rminos',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
    pt: {
      about: 'Sobre',
      terms: 'Termos',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
  } as const;

  const text = labels[language];
  const links = [
    { href: `/about?lang=${language}`, label: text.about },
    { href: `/terms?lang=${language}`, label: text.terms },
    { href: `/privacy?lang=${language}`, label: t('links.privacy') },
  ];

  return (
    <footer data-site-footer className="relative z-10 mt-16 border-t border-[var(--border-subtle)] py-8 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-xs text-[var(--text-soft)] sm:hidden">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-center text-xs font-medium text-[var(--text-body)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-center">
            <Link href={versionHref} prefetch={false} className="underline underline-offset-2 hover:text-[var(--text-body)]">
              Version {appVersion}
            </Link>
          </p>
          <p className="text-center">{text.copyright}</p>
        </div>

        <div className="hidden flex-col gap-3 text-xs text-[var(--text-soft)] sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>{text.copyright}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline underline-offset-2 hover:text-[var(--text-body)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={versionHref}
              prefetch={false}
              className="text-[var(--text-soft)] underline underline-offset-2 hover:text-[var(--text-body)]"
            >
              Version {appVersion}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
