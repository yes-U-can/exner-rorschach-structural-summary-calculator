'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ArrowsUpDownIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { ReleaseKind, VersionArchiveEntry } from '@/lib/versionArchive';
import Tooltip from '@/components/ui/Tooltip';
import { useTranslation } from '@/hooks/useTranslation';

type SortOrder = 'desc' | 'asc';

type VersionArchiveListProps = {
  v2NextVersions: VersionArchiveEntry[];
  v1GasVersions: VersionArchiveEntry[];
};

type VersionArchiveLabels = {
  unpublishedDate: string;
  releaseKinds: Record<ReleaseKind, string>;
  deploymentLink: string;
  tutorialVideo: string;
};

function formatDate(value: string | null, unpublishedDate: string) {
  return value ?? unpublishedDate;
}

function buildSummary(entry: VersionArchiveEntry, labels: VersionArchiveLabels) {
  return `[${formatDate(entry.publishedAt, labels.unpublishedDate)}] ${entry.version} (${labels.releaseKinds[entry.releaseKind]})`;
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
  return <span className="font-semibold text-[var(--text-soft)]">{children}</span>;
}

function ReleaseList({
  entries,
  sourceLabel,
  releaseLabel = 'GitHub Release',
  showSource = true,
  showUnavailableActions = false,
  labels,
}: {
  entries: VersionArchiveEntry[];
  sourceLabel: string;
  releaseLabel?: string;
  showSource?: boolean;
  showUnavailableActions?: boolean;
  labels: VersionArchiveLabels;
}) {
  return (
    <ul className="list-disc space-y-3 pl-5 text-sm leading-8 text-[var(--text-body)] marker:text-[var(--brand-700)]">
      {entries.map((entry) => (
        <li key={`${entry.series}-${entry.version}`}>
          <span className="font-bold tracking-tight text-[var(--text-strong)]">{buildSummary(entry, labels)}</span>
          <span className="ml-2 inline-flex flex-wrap gap-x-3 gap-y-1">
            {entry.gasUrl ? <TextLink href={entry.gasUrl}>{labels.deploymentLink}</TextLink> : null}
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
            {entry.videoUrl ? <TextLink href={entry.videoUrl}>{labels.tutorialVideo}</TextLink> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function VersionArchiveList({ v2NextVersions, v1GasVersions }: VersionArchiveListProps) {
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isV2Open, setIsV2Open] = useState(true);
  const [isV1Open, setIsV1Open] = useState(true);
  const v2SourceUrl = v2NextVersions.find((entry) => entry.sourceUrl)?.sourceUrl ?? null;
  const sortedV1Versions = useMemo(() => sortVersions(v1GasVersions, sortOrder), [sortOrder, v1GasVersions]);
  const labels: VersionArchiveLabels = {
    unpublishedDate: t('versions.unpublishedDate'),
    releaseKinds: {
      major: t('versions.major'),
      minor: t('versions.minor'),
      bugfix: t('versions.bugfix'),
      hotfix: t('versions.hotfix'),
      unknown: t('versions.release'),
    },
    deploymentLink: t('versions.deploymentLink'),
    tutorialVideo: t('versions.tutorialVideo'),
  };
  const gasHelpText = t('versions.gasHelp');

  return (
    <div className="mt-8">
      <section className={`ui-version-disclosure-group${isV2Open ? ' is-open' : ''}`}>
        <div className="ui-version-disclosure-header flex flex-wrap items-center gap-2">
          <h2>
            <button
              id="version-archive-v2-trigger"
              type="button"
              className="ui-version-disclosure-trigger text-base font-semibold text-[var(--text-strong)]"
              onClick={() => setIsV2Open((current) => !current)}
              aria-expanded={isV2Open}
              aria-controls="version-archive-v2"
            >
              <ChevronDownIcon className={`ui-version-disclosure-chevron ${isV2Open ? 'is-open' : ''}`} aria-hidden="true" />
              <span>{t('versions.nextHeading')}</span>
            </button>
          </h2>
          {v2SourceUrl ? <TextLink href={v2SourceUrl}>{t('versions.sourceCode')}</TextLink> : null}
        </div>
        <div
          id="version-archive-v2"
          className="ui-version-disclosure"
          role="region"
          aria-labelledby="version-archive-v2-trigger"
          hidden={!isV2Open}
        >
          <div className="ui-version-disclosure-inner">
            <ReleaseList
              entries={v2NextVersions}
              sourceLabel={t('versions.sourceCode')}
              releaseLabel={t('versions.patchNotes')}
              showSource={false}
              showUnavailableActions
              labels={labels}
            />
          </div>
        </div>
      </section>

      <section className={`ui-version-disclosure-group mt-8${isV1Open ? ' is-open' : ''}`}>
        <div className="ui-version-disclosure-header flex flex-wrap items-center gap-2">
          <h2>
            <button
              id="version-archive-v1-trigger"
              type="button"
              className="ui-version-disclosure-trigger text-base font-semibold text-[var(--text-strong)]"
              onClick={() => setIsV1Open((current) => !current)}
              aria-expanded={isV1Open}
              aria-controls="version-archive-v1"
            >
              <ChevronDownIcon className={`ui-version-disclosure-chevron ${isV1Open ? 'is-open' : ''}`} aria-hidden="true" />
              <span>{t('versions.gasHeading')}</span>
            </button>
          </h2>
          <Tooltip content={gasHelpText}>
            <button
              type="button"
              aria-label={t('versions.gasInfoAria')}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--brand-700)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-500)]"
            >
              <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </Tooltip>
          <button
            type="button"
            onClick={() => setSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))}
            className="inline-flex min-h-9 w-fit items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-xs font-semibold text-[var(--text-body)] shadow-sm transition hover:border-[var(--brand-300)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand-700)]"
            aria-label={t('versions.sortAria')}
          >
            <ArrowsUpDownIcon className="h-4 w-4" aria-hidden="true" />
            <span>{sortOrder === 'desc' ? t('versions.latestFirst') : t('versions.oldestFirst')}</span>
          </button>
        </div>

        <div
          id="version-archive-v1"
          className="ui-version-disclosure"
          role="region"
          aria-labelledby="version-archive-v1-trigger"
          hidden={!isV1Open}
        >
          <div className="ui-version-disclosure-inner">
            <ReleaseList
              entries={sortedV1Versions}
              sourceLabel={`${t('versions.patchNotes')}/${t('versions.sourceCode')}`}
              labels={labels}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
