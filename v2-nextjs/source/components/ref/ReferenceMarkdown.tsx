'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ComponentPropsWithoutRef } from 'react';

import { buildReferenceRouteHref } from '@/lib/referenceRoutes';
import type { Language } from '@/types';

type ReferenceMarkdownProps = {
  markdown: string;
  language: Language;
  className?: string;
};

function resolveRefHref(href: string, language: Language): string {
  const raw = href.slice('ref://'.length);
  const canonicalRoute = decodeURIComponent(raw);
  return buildReferenceRouteHref(canonicalRoute, language);
}

function ExternalAnchor(props: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-[var(--brand-700)] underline decoration-[var(--brand-300)] underline-offset-4 hover:text-[var(--brand-700-hover)]"
    />
  );
}

export default function ReferenceMarkdown({
  markdown,
  language,
  className,
}: ReferenceMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-strong)]">{children}</h2>
          ),
          h2: ({ children }) => (
            <h3 className="mt-8 text-lg font-semibold text-[var(--text-strong)] first:mt-0">{children}</h3>
          ),
          p: ({ children }) => <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--text-body)]">{children}</p>,
          ul: ({ children }) => <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-body)]">{children}</ul>,
          ol: ({ children }) => <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--text-body)]">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-[var(--text-strong)]">{children}</strong>,
          code: ({ children }) => (
            <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 text-[0.95em] text-[var(--text-strong)]">{children}</code>
          ),
          a: ({ href, children }) => {
            if (!href) return <span>{children}</span>;
            if (href.startsWith('ref://')) {
              return (
                <Link
                  href={resolveRefHref(href, language)}
                  className="font-medium text-[var(--brand-700)] underline decoration-[var(--brand-300)] underline-offset-4 hover:text-[var(--brand-700-hover)]"
                >
                  {children}
                </Link>
              );
            }
            return <ExternalAnchor href={href}>{children}</ExternalAnchor>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
