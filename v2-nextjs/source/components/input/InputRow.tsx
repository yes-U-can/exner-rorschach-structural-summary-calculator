'use client';

import { memo } from 'react';
import type { PointerEvent as ReactPointerEvent, RefCallback } from 'react';
import type { RorschachResponse } from '@/types';
import { OPTIONS } from '@/lib/options';
import { useTranslation } from '@/hooks/useTranslation';
import SlotSelect from './SlotSelect';
import DeterminantSlots from './DeterminantSlots';
import ContentSlots from './ContentSlots';
import SpecialScoreSlots from './SpecialScoreSlots';
import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface InputRowProps {
  index: number;
  response: RorschachResponse;
  onChange: (index: number, response: RorschachResponse) => void;
  zScore: number | null;
  gphr: string;
  onResponseClick: (index: number) => void;
  onRowClick?: (index: number, event: React.MouseEvent<HTMLTableRowElement>) => void;
  isSelected?: boolean;
  isDragging?: boolean;
  isDragTarget?: boolean;
  onNoCellPointerDown?: (index: number, event: ReactPointerEvent<HTMLTableCellElement>) => void;
  rowRef?: RefCallback<HTMLTableRowElement>;
}

const InputRow = memo(function InputRow({
  index,
  response,
  onChange,
  zScore,
  gphr,
  onResponseClick,
  onRowClick,
  isSelected = false,
  isDragging = false,
  isDragTarget = false,
  onNoCellPointerDown,
  rowRef,
}: InputRowProps) {
  const { t } = useTranslation();

  const updateField = <K extends keyof RorschachResponse>(
    field: K,
    value: RorschachResponse[K]
  ) => {
    onChange(index, { ...response, [field]: value });
  };

  // Rule 1: Disable pair checkbox when reflection determinant is present
  const hasReflection = response.determinants.some(d => d === 'Fr' || d === 'rF');
  // Rule 2: Disable FQ '+' when DQ is 'v'
  const isDqVague = response.dq === 'v';
  // Rule 3: Disable Z input when DQ is 'v'
  // (Z-Score is not assigned to vague responses)

  return (
    <tr
      ref={rowRef}
      className={`border-b border-[var(--border-subtle)] bg-[var(--surface-base)] hover:bg-[var(--table-row-hover)] has-[button[aria-expanded='true']]:bg-[var(--table-row-hover)] [&>td]:border-r [&>td]:border-[var(--border-subtle)] [&>td:last-child]:border-r-0 transition-[transform,colors] duration-150 ${
        isDragging ? 'pointer-events-none [&>td]:!py-0 [&>td]:!h-0 [&>td]:!border-y-0 [&>td>*]:!opacity-0'
          : isSelected
            ? '[&>td]:bg-[var(--table-row-selected)] [&>td]:shadow-[var(--table-row-selected-shadow)] hover:[&>td]:bg-[var(--table-row-selected)]'
            : isDragTarget
              ? 'bg-[var(--table-row-drag-target)] [&>td]:bg-[var(--table-row-drag-target)]'
              : ''
      }`}
      data-row-index={index}
      onMouseDown={(event) => {
        if (event.button !== 0) return;
        onRowClick?.(index, event);
      }}
    >
      {/* Row Number */}
      <td
        className="group relative w-10 cursor-grab select-none overflow-visible border-r border-[var(--border-subtle)] px-2 py-2.5 text-center text-xs font-semibold tabular-nums text-[var(--brand-700)] active:cursor-grabbing"
        onPointerDown={(event) => onNoCellPointerDown?.(index, event)}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-1/2 z-10 inline-grid -translate-x-1/2 -translate-y-1/2 grid-cols-2 grid-rows-3 gap-[2px] rounded-md border px-1 py-1 shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition-all duration-150 group-hover:shadow-[0_3px_8px_rgba(15,23,42,0.18)] ${
            isDragging
              ? 'border-[var(--table-insert-border)] bg-[var(--table-drag-handle-bg)]'
              : 'border-[var(--table-drag-handle-border)] bg-[var(--table-drag-handle-bg)] group-hover:border-[var(--brand-300)]'
          }`}
        >
          {Array.from({ length: 6 }).map((_, dotIndex) => (
            <span
              key={dotIndex}
              className={`h-0.5 w-0.5 rounded-full ${
                isDragging ? 'bg-[var(--table-drag-dot-active)]' : 'bg-[var(--table-drag-dot)]'
              }`}
            />
          ))}
        </span>
        <span>{index + 1}</span>
      </td>

      {/* Memo icon */}
      <td className="px-1.5 py-1 text-center">
        <button
          type="button"
          onClick={() => onResponseClick(index)}
          className="inline-flex rounded-md p-1 transition-colors hover:bg-[var(--surface-muted)]"
          title={t('input.responseMemo')}
        >
          {response.response ? (
            <DocumentTextIcon className="w-4 h-4 text-[var(--text-body)]" />
          ) : (
            <DocumentIcon className="w-4 h-4 text-[var(--text-soft)]" />
          )}
        </button>
      </td>

      {/* Card */}
      <td className="px-1.5 py-2">
        <SlotSelect
          value={response.card}
          onChange={(v) => updateField('card', v)}
          options={OPTIONS.CARDS}
          showClearButton
          className="w-14"
        />
      </td>

      {/* Location */}
      <td className="px-1.5 py-2">
        <SlotSelect
          value={response.location}
          onChange={(v) => updateField('location', v)}
          options={OPTIONS.LOCATIONS}
          showClearButton
          className="w-14"
        />
      </td>

      {/* DQ */}
      <td className="px-1.5 py-2">
        <SlotSelect
          value={response.dq}
          onChange={(v) => updateField('dq', v)}
          options={OPTIONS.DQ}
          showClearButton
          className="w-12"
        />
      </td>

      {/* Determinants */}
      <td className="px-1.5 py-2">
        <DeterminantSlots
          values={response.determinants}
          onChange={(v) => updateField('determinants', v)}
        />
      </td>

      {/* FQ '+' disabled when DQ is 'v' */}
      <td className="px-1.5 py-2">
        <SlotSelect
          value={response.fq}
          onChange={(v) => updateField('fq', v)}
          options={OPTIONS.FQ}
          disabledOptions={isDqVague ? ['+'] : undefined}
          showClearButton
          className="w-14"
        />
      </td>

      {/* Pair disabled when Fr/rF (reflection) is present */}
      <td className="px-1.5 py-2 text-center">
        <input
          type="checkbox"
          checked={response.pair === '(2)'}
          onChange={(e) => updateField('pair', e.target.checked ? '(2)' : 'none')}
          disabled={hasReflection}
          className={`w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--brand-700)]
            focus:ring-[var(--brand-500)] ${hasReflection ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
          title={hasReflection ? t('input.pairDisabledTooltip') : undefined}
        />
      </td>

      {/* Contents */}
      <td className="px-1.5 py-2">
        <ContentSlots
          values={response.contents}
          onChange={(v) => updateField('contents', v)}
        />
      </td>

      {/* Popular */}
      <td className="px-1.5 py-2 text-center">
        <input
          type="checkbox"
          checked={response.popular}
          onChange={(e) => updateField('popular', e.target.checked)}
          className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--brand-700)]
            focus:ring-[var(--brand-500)] cursor-pointer"
        />
      </td>

      {/* Z disabled when DQ is 'v' (no organizational activity for vague responses) */}
      <td className="px-1.5 py-2">
        <SlotSelect
          value={response.z}
          onChange={(v) => updateField('z', v)}
          options={OPTIONS.Z_TYPES}
          disabled={isDqVague}
          showClearButton
          className="w-14"
        />
      </td>

      {/* Score */}
      <td className="px-1.5 py-2 text-center w-14">
        <span className="text-xs font-medium tabular-nums text-[var(--text-body)]">
          {zScore !== null ? zScore.toFixed(1) : ''}
        </span>
      </td>

      {/* G/PHR */}
      <td className="px-1.5 py-2 text-center w-14">
        <span className={`text-xs font-semibold ${
          gphr === 'GHR' ? 'text-emerald-600'
          : gphr === 'PHR' ? 'text-rose-500'
          : ''
        }`}>
          {gphr || ''}
        </span>
      </td>

      {/* Special Scores */}
      <td className="px-1.5 py-2">
        <SpecialScoreSlots
          values={response.specialScores}
          onChange={(v) => updateField('specialScores', v)}
        />
      </td>
    </tr>
  );
});

export default InputRow;



