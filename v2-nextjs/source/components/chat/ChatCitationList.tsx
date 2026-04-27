'use client';

import Link from 'next/link';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/i18n/config';
import type { ChatCitation } from '@/types';
import { getChatCitationBadges } from '@/lib/chatCitationUi';
import { toChatCitationHref } from '@/lib/chatMessageMetadata';

type ChatCitationListProps = {
  citations: ChatCitation[];
  language: Language;
  title: string;
  openLabel: string;
  className?: string;
};

export default function ChatCitationList({
  citations,
  language,
  title,
  openLabel,
  className = '',
}: ChatCitationListProps) {
  if (citations.length === 0) return null;

  return (
    <div className={className}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-soft)]">{title}</p>
      <ul className="mt-2 space-y-2 text-xs text-[var(--text-body)]">
        {citations.map((citation) => {
          const href = toChatCitationHref(citation, language);
          const badges = getChatCitationBadges(citation, language);
          return (
            <li key={`${citation.id}-${citation.title}`} className="flex items-start gap-1.5">
              <ClipboardDocumentCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-soft)]" />
              <div className="min-w-0">
                <p className="break-words">{citation.title}</p>
                {badges.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {badges.map((badge) => (
                      <span
                        key={`${citation.id}-${badge}`}
                        className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-soft)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                {href && (
                  <Link
                    href={href}
                    className="mt-1 inline-block text-[10px] font-medium text-[var(--brand-700)] hover:underline"
                  >
                    {openLabel}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
