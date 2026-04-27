import Link from 'next/link';
import { buildReferenceDocHref, getReferenceRelatedDocs, type ReferenceDocRecord } from '@/lib/referenceCorpus';
import type { Language } from '@/types';

type ReferenceRelatedPanelProps = {
  language: Language;
  currentDoc?: ReferenceDocRecord;
  relatedRoutes?: string[];
  className?: string;
};

type PanelCopy = {
  relatedLabel: string;
  countLabel: (count: number) => string;
};

const PANEL_COPY: Record<Language, PanelCopy> = {
  ko: {
    relatedLabel: '\uC9C1\uC811 \uC5F0\uACB0\uB41C \uBB38\uC11C',
    countLabel: (count) => `${count}\uAC1C \uC5F0\uACB0\uB428`,
  },
  en: {
    relatedLabel: 'Directly linked documents',
    countLabel: (count) => `${count} linked`,
  },
  ja: {
    relatedLabel: '\u76F4\u63A5\u3064\u306A\u304C\u308B\u6587\u66F8',
    countLabel: (count) => `${count}\u4EF6\u306E\u95A2\u9023`,
  },
  es: {
    relatedLabel: 'Documentos vinculados directamente',
    countLabel: (count) => `${count} vinculados`,
  },
  pt: {
    relatedLabel: 'Documentos ligados diretamente',
    countLabel: (count) => `${count} ligados`,
  },
};

export default function ReferenceRelatedPanel({
  language,
  currentDoc,
  relatedRoutes,
  className,
}: ReferenceRelatedPanelProps) {
  const copy = PANEL_COPY[language];
  const resolvedRelatedRoutes = relatedRoutes ?? currentDoc?.relatedRoutes ?? [];
  const relatedDocs = getReferenceRelatedDocs(language, resolvedRelatedRoutes);

  if (relatedDocs.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[var(--border-subtle)] pt-6">
        <h2 className="text-base font-semibold text-[var(--text-strong)]">{copy.relatedLabel}</h2>
        <span className="text-xs font-medium text-[var(--text-soft)]">
          {copy.countLabel(relatedDocs.length)}
        </span>
      </div>
      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {relatedDocs.map((doc) => (
          <li key={doc.canonicalRoute} className="min-w-0">
            <Link
              href={buildReferenceDocHref(doc.canonicalRoute, language)}
              className="break-words text-sm font-medium leading-6 text-[var(--brand-700)] underline decoration-[var(--brand-300)] underline-offset-4 transition hover:text-[var(--brand-700-hover)]"
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
