import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import type { Language } from '@/types';

type ReferenceSearchFormProps = {
  language: Language;
  label: string;
  placeholder: string;
  defaultQuery?: string;
  className?: string;
};

export default function ReferenceSearchForm({
  language,
  label,
  placeholder,
  defaultQuery = '',
  className,
}: ReferenceSearchFormProps) {
  return (
    <form action="/ref" method="get" className={className} role="search">
      <input type="hidden" name="lang" value={language} />
      <label htmlFor="reference-docs-query" className="sr-only">
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="reference-docs-query"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-body)] placeholder:text-[var(--text-soft)] focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
        <button
          type="submit"
          aria-label={label}
          title={label}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-[var(--brand-700)] px-3 py-2 text-[var(--on-brand)] hover:bg-[var(--brand-700-hover)]"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
