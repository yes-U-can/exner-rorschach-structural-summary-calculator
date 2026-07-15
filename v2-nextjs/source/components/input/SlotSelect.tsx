'use client';

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SlotSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  disabledOptions?: readonly string[];
  className?: string;
  gridCols?: number;
  showClearButton?: boolean;
}

export default function SlotSelect({
  value,
  onChange,
  options,
  placeholder = '-',
  disabled = false,
  disabledOptions,
  className = '',
  gridCols,
  showClearButton = false
}: SlotSelectProps) {
  const isGrid = gridCols && gridCols > 1;
  const buttonStateClass = disabled ? 'is-disabled' : value ? 'is-filled' : 'is-empty';

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={`relative mx-auto h-8 ${className}`}>
        <ListboxButton
          className={`ui-slot-select-button ${buttonStateClass} relative flex h-8 min-h-8 max-h-8 w-full min-w-full max-w-full appearance-none items-center justify-center rounded-md px-1.5 text-center text-xs leading-none disabled:cursor-not-allowed`}
        >
          <span className="block h-4 w-full truncate leading-4">{value || placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5">
            <ChevronDownIcon className="ui-slot-select-chevron h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          modal={false}
          className={`z-[9999] mt-1 overflow-auto rounded-xl bg-[var(--surface-base)]
            shadow-xl
            ring-1 ring-[var(--border-subtle)]
            focus:outline-none text-xs
            transition ease-out duration-150 data-[closed]:opacity-0 data-[closed]:scale-95 ${
            isGrid ? 'p-2' : 'max-h-48 min-w-[80px] py-1'
          }`}
        >
          {isGrid ? (
            <>
              {/* Clear / placeholder button */}
              <button
                type="button"
                onClick={() => onChange('')}
                className="mb-1.5 w-full rounded-lg border border-dashed border-[var(--border-subtle)] py-1.5 text-center text-xs text-[var(--text-soft)]
                  transition-colors hover:border-[var(--danger-hover-border)] hover:bg-[var(--danger-hover-bg)] hover:text-[var(--danger-text)]"
              >
                Clear
              </button>
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
              >
                {options.map((option) => {
                  const isOptionDisabled = disabledOptions?.includes(option) ?? false;
                  return (
                  <ListboxOption
                    key={option}
                    value={option}
                    disabled={isOptionDisabled}
                    className={({ active, selected }) =>
                      isOptionDisabled
                        ? 'cursor-not-allowed select-none rounded-lg py-1.5 px-1 text-center text-[var(--text-soft)] line-through opacity-70'
                        : `cursor-pointer select-none py-1.5 px-1 text-center rounded-lg transition-colors ${
                        selected
                          ? 'bg-[var(--brand-700)] text-[var(--on-brand)] font-semibold shadow-sm'
                          : active
                            ? 'bg-[var(--surface-muted)] text-[var(--text-strong)]'
                            : 'text-[var(--text-body)] hover:bg-[var(--surface-muted)]'
                      }`
                    }
                  >
                    {option}
                  </ListboxOption>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {showClearButton ? (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="mx-1 mb-1 w-[calc(100%-0.5rem)] rounded-lg border border-dashed border-[var(--border-subtle)] px-3 py-1.5 text-center text-xs text-[var(--text-soft)]
                    transition-colors hover:border-[var(--danger-hover-border)] hover:bg-[var(--danger-hover-bg)] hover:text-[var(--danger-text)]"
                >
                  Clear
                </button>
              ) : (
                <ListboxOption
                  value=""
                  className={({ active }) =>
                    `cursor-pointer select-none py-1.5 px-3 transition-colors ${
                      active ? 'bg-[var(--surface-muted)] text-[var(--text-body)]' : 'text-[var(--text-soft)]'
                    }`
                  }
                >
                  {placeholder}
                </ListboxOption>
              )}
              {options.map((option) => {
                const isOptionDisabled = disabledOptions?.includes(option) ?? false;
                return (
                <ListboxOption
                  key={option}
                  value={option}
                  disabled={isOptionDisabled}
                  className={({ active, selected }) =>
                    isOptionDisabled
                      ? 'cursor-not-allowed select-none py-1.5 px-3 text-[var(--text-soft)] line-through opacity-70'
                      : `cursor-pointer select-none py-1.5 px-3 transition-colors ${
                      selected
                        ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-medium'
                        : active
                          ? 'bg-[var(--surface-muted)] text-[var(--text-strong)]'
                          : 'text-[var(--text-body)]'
                    }`
                  }
                >
                  {option}
                </ListboxOption>
                );
              })}
            </>
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}





