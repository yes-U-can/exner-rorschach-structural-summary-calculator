'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import type { ReleaseKind, VersionArchiveEntry } from '@/lib/versionArchive';

type SortOrder = 'desc' | 'asc';

type VersionArchiveListProps = {
  currentVersion: VersionArchiveEntry;
  v1GasVersions: VersionArchiveEntry[];
};

const RELEASE_KIND_LABEL: Record<ReleaseKind, string> = {
  major: '\uBA54\uC774\uC800 \uD328\uCE58',
  minor: '\uB9C8\uC774\uB108 \uD328\uCE58',
  bugfix: '\uBC84\uADF8 \uD328\uCE58',
  hotfix: '\uD56B\uD53D\uC2A4',
  unknown: '\uB9B4\uB9AC\uC988',
};

function formatDate(value: string | null) {
  return value ?? '\uACF5\uAC1C\uC77C \uBBF8\uC815';
}

function buildSummary(entry: VersionArchiveEntry) {
  return `[${formatDate(entry.publishedAt)}] ${entry.version} (${RELEASE_KIND_LABEL[entry.releaseKind]})`;
}

function sortVersions(entries: VersionArchiveEntry[], sortOrder: SortOrder) {
  return [...entries].sort((a, b) => {
    const left = a.publishedAt ?? '';
    const right = b.publishedAt ?? '';
    return sortOrder === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
  });
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-[var(--brand-700)] underline decoration-[var(--brand-300)] underline-offset-4 transition hover:text-[var(--brand-700-hover)] hover:decoration-[var(--brand-700-hover)]"
    >
      {children}
    </a>
  );
}

function PlainTextAction({ children }: { children: ReactNode }) {
  return (
    <span className="font-semibold text-[var(--text-soft)]">
      {children}
    </span>
  );
}

function ReleaseList({
  entries,
  sourceLabel,
  releaseLabel = 'GitHub Release',
  showSource = true,
  showUnavailableActions = false,
}: {
  entries: VersionArchiveEntry[];
  sourceLabel: string;
  releaseLabel?: string;
  showSource?: boolean;
  showUnavailableActions?: boolean;
}) {
  return (
    <ul className="list-disc space-y-3 pl-5 text-sm leading-8 text-[var(--text-body)] marker:text-[var(--brand-700)]">
      {entries.map((entry) => (
        <li key={`${entry.series}-${entry.version}`}>
          <span className="font-bold tracking-tight text-[var(--text-strong)]">{buildSummary(entry)}</span>
          <span className="ml-2 inline-flex flex-wrap gap-x-3 gap-y-1">
            {entry.gasUrl ? <TextLink href={entry.gasUrl}>{'\uBC30\uD3EC\uB9C1\uD06C'}</TextLink> : null}
            {entry.releaseUrl ? (
              <TextLink href={entry.releaseUrl}>{releaseLabel}</TextLink>
            ) : showUnavailableActions ? (
              <PlainTextAction>{releaseLabel}</PlainTextAction>
            ) : null}
            {showSource && entry.sourceUrl ? (
              <TextLink href={entry.sourceUrl}>{sourceLabel}</TextLink>
            ) : showSource && showUnavailableActions ? (
              <PlainTextAction>{sourceLabel}</PlainTextAction>
            ) : null}
            {entry.videoUrl ? <TextLink href={entry.videoUrl}>{'\uC0AC\uC6A9\uBC95 \uC601\uC0C1'}</TextLink> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function VersionArchiveList({ currentVersion, v1GasVersions }: VersionArchiveListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const sortedV1Versions = useMemo(() => sortVersions(v1GasVersions, sortOrder), [sortOrder, v1GasVersions]);

  return (
    <div className="mt-8">
      <section>
        <h2 className="mb-3 text-base font-semibold text-[var(--text-strong)]">
          {'[NextJS] \uBC84\uC804 2 \uB9B4\uB9AC\uC988 \uAE30\uB85D'}
        </h2>
        <ReleaseList
          entries={[currentVersion]}
          sourceLabel={'\uC18C\uC2A4\uCF54\uB4DC'}
          releaseLabel={'\uD328\uCE58\uB178\uD2B8'}
          showUnavailableActions
        />
      </section>

      <section className="mt-8">
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-strong)]">
              {'[Google Apps Script] \uBC84\uC804 1 \uB9B4\uB9AC\uC988 \uAE30\uB85D'}
            </h2>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-[var(--text-soft)]">
              {"'\uBC30\uD3EC\uB9C1\uD06C'\uB97C \uD074\uB9AD\uD558\uBA74 \uD574\uB2F9 \uBC84\uC804\uC758 \uACC4\uC0B0\uAE30\uB97C \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}
              <br />
              {'\uD544\uC694\uD55C \uACBD\uC6B0, \uC18C\uC2A4\uCF54\uB4DC\uB97C \uAC1C\uC778 \uACC4\uC815\uC758 GAS \uD504\uB85C\uC81D\uD2B8\uC5D0 \uBD99\uC5EC\uB123\uC5B4\uC11C \uC0AC\uC6A9\uD574\uBCF4\uC138\uC694.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))}
            className="inline-flex min-h-9 w-fit items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-xs font-semibold text-[var(--text-body)] shadow-sm transition hover:border-[var(--brand-300)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand-700)]"
            aria-label={'\uBC84\uC804 \uC815\uB82C \uBC29\uD5A5 \uBC14\uAFB8\uAE30'}
          >
            <ArrowsUpDownIcon className="h-4 w-4" aria-hidden="true" />
            <span>{sortOrder === 'desc' ? '\uCD5C\uC2E0\uC21C' : '\uC624\uB798\uB41C\uC21C'}</span>
          </button>
        </div>

        <ReleaseList entries={sortedV1Versions} sourceLabel={'\uD328\uCE58\uB178\uD2B8/\uC18C\uC2A4\uCF54\uB4DC'} />
      </section>
    </div>
  );
}
