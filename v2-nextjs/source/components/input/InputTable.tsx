'use client';

import { useMemo, useState, useCallback, useRef, useEffect, Fragment } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { RorschachResponse } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { SCORING_CONFIG } from '@/lib/constants';
import { OPTIONS } from '@/lib/options';
import InputRow from './InputRow';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { InformationCircleIcon, XMarkIcon, PencilSquareIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline';

// Determinants with NO form component (Pure C, T, V, Y, Cn)
const FORMLESS_DETERMINANTS = ['C', 'T', 'V', 'Y', 'Cn'];
const DRAG_START_THRESHOLD = 6;
const RESPONSE_MEMO_MAX_BYTES = 1200;
const utf8Encoder = new TextEncoder();

function getUtf8ByteLength(value: string) {
  return utf8Encoder.encode(value).length;
}

function truncateToUtf8Bytes(value: string, maxBytes: number) {
  let total = 0;
  let output = '';
  for (const char of value) {
    const nextBytes = getUtf8ByteLength(char);
    if (total + nextBytes > maxBytes) break;
    total += nextBytes;
    output += char;
  }
  return output;
}

const TABLE_COPY = {
  ko: {
    cardSortLabel: 'Card 오름차순 정렬',
    responseByteLimit: '최대 1200바이트',
    responseByteLimitReached: 'RESPONSE 메모는 최대 1200바이트까지 입력할 수 있습니다.',
  },
  en: {
    cardSortLabel: 'Sort Card ascending',
    responseByteLimit: 'Up to 1200 bytes',
    responseByteLimitReached: 'The RESPONSE memo can be up to 1200 bytes.',
  },
  ja: {
    cardSortLabel: 'Cardを昇順に並べ替え',
    responseByteLimit: '最大1200バイト',
    responseByteLimitReached: 'RESPONSEメモは最大1200バイトまで入力できます。',
  },
  es: {
    cardSortLabel: 'Ordenar Card ascendente',
    responseByteLimit: 'Máximo 1200 bytes',
    responseByteLimitReached: 'El memo RESPONSE admite hasta 1200 bytes.',
  },
  pt: {
    cardSortLabel: 'Ordenar Card em ordem crescente',
    responseByteLimit: 'Até 1200 bytes',
    responseByteLimitReached: 'O memo RESPONSE pode ter até 1200 bytes.',
  },
} as const;

// Special score level pairs (Level 1 / Level 2)
const LEVEL_PAIRS: [string, string][] = [
  ['DV1', 'DV2'],
  ['DR1', 'DR2'],
  ['INCOM1', 'INCOM2'],
  ['FABCOM1', 'FABCOM2'],
];

interface InputTableProps {
  responses: RorschachResponse[];
  onChange: (responses: RorschachResponse[]) => void;
  selectedRowIndices: number[];
  onRowSelection: (rowIndex: number, modifiers: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean }) => void;
  onAddRowRequest: (rowIndices: number[]) => void;
  onDeleteRowsRequest: (rowIndices: number[]) => void;
  maxRows?: number;
}

interface PendingDragState {
  sourceIndex: number;
  startX: number;
  startY: number;
  pointerOffsetY: number;
  rowRect: { top: number; left: number; width: number; height: number };
  rowElement: HTMLTableRowElement;
}

// Calculate Z score for a response
function calculateZScore(response: RorschachResponse): number | null {
  if (!response.card || !response.z) return null;

  const Z_TABLE = SCORING_CONFIG.TABLES.Z_SCORE;
  const cardScores = Z_TABLE[response.card as keyof typeof Z_TABLE];
  if (!cardScores) return null;

  const score = cardScores[response.z as keyof typeof cardScores];
  return typeof score === 'number' ? score : null;
}

// Simple GHR/PHR classification (for display only - actual calculation happens in calculator.ts)
function classifyGPHR(response: RorschachResponse): string {
  const humanContentCodes = SCORING_CONFIG.CODES.HUMAN_CONTENT_GPHR as readonly string[];
  const humanMovementCodes = SCORING_CONFIG.CODES.HUMAN_MOVEMENT as readonly string[];
  const animalMovementCodes = SCORING_CONFIG.CODES.ANIMAL_MOVEMENT as readonly string[];
  const copOrAgCodes = SCORING_CONFIG.CODES.COP_OR_AG as readonly string[];
  const fqGoodCodes = SCORING_CONFIG.CODES.FQ_GOOD as readonly string[];
  const cognitiveSsBadCodes = SCORING_CONFIG.CODES.COGNITIVE_SS_BAD as readonly string[];
  const agOrMorCodes = SCORING_CONFIG.CODES.AG_OR_MOR as readonly string[];
  const fqBadCodes = SCORING_CONFIG.CODES.FQ_BAD as readonly string[];
  const level2SsCodes = SCORING_CONFIG.CODES.LEVEL_2_SS as readonly string[];
  const gphrPopularCards = SCORING_CONFIG.CODES.GPHR_POPULAR_CARDS as readonly string[];

  const hasHumanContent = response.contents.some(c => humanContentCodes.includes(c));
  const hasHumanMovement = response.determinants.some(d => humanMovementCodes.includes(d));
  const hasAnimalMovement = response.determinants.some(d => animalMovementCodes.includes(d));
  const hasCopOrAg = response.specialScores.some(s => copOrAgCodes.includes(s));

  const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);
  if (!isEligible) return '';

  const isPureH = response.contents.includes('H');
  const isGoodFQ = fqGoodCodes.includes(response.fq);
  const hasBadCognitiveSS = response.specialScores.some(s => cognitiveSsBadCodes.includes(s));
  const hasAgOrMor = response.specialScores.some(s => agOrMorCodes.includes(s));

  if (isPureH && isGoodFQ && !hasBadCognitiveSS && !hasAgOrMor) {
    return 'GHR';
  }

  const isBadFQ = fqBadCodes.includes(response.fq);
  const hasLevel2SS = response.specialScores.some(s => level2SsCodes.includes(s));

  if (isBadFQ || hasLevel2SS) return 'PHR';
  if (response.specialScores.includes('COP') && !response.specialScores.includes('AG')) return 'GHR';
  if (response.specialScores.includes('FABCOM1') || response.specialScores.includes('MOR') || response.contents.includes('An')) return 'PHR';
  if (response.popular && gphrPopularCards.includes(response.card)) return 'GHR';
  if (response.specialScores.includes('AG') || response.specialScores.includes('INCOM1') || response.specialScores.includes('DR1') || response.contents.includes('Hd')) return 'PHR';

  return 'GHR';
}

export default function InputTable({
  responses,
  onChange,
  selectedRowIndices,
  onRowSelection,
  onAddRowRequest,
  onDeleteRowsRequest,
  maxRows = 50,
}: InputTableProps) {
  const { t, language } = useTranslation();
  const tableCopy = TABLE_COPY[language] ?? TABLE_COPY.en;
  const memoTooltipText = t('input.guideResponse');
  const rowTooltipText = t('input.tooltipInfo').replace(/,\s*/g, ',\n');
  const scoreTooltipText = t('input.scoreTooltip');
  const gphrTooltipText = t('input.gphrTooltip');
  const noTooltipText = t('input.noReorderTooltip');
  const cardSortLabel = tableCopy.cardSortLabel;

  const { showToast } = useToast();
  const [editingResponseIndex, setEditingResponseIndex] = useState<number | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragInsertIndex, setDragInsertIndex] = useState<number | null>(null);
  const [dragGapHeight, setDragGapHeight] = useState(48);
  const portalRoot = typeof document !== 'undefined' ? document.body : null;
  const responsesRef = useRef(responses);
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const dragSourceRef = useRef<number | null>(null);
  const dragInsertRef = useRef<number | null>(null);
  const pendingDragRef = useRef<PendingDragState | null>(null);
  const dragPointerOffsetYRef = useRef(0);
  const pointerYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const responsePopupBackdropPointerStartedRef = useRef(false);
  const cardOrderMap = useMemo(
    () => new Map<string, number>(OPTIONS.CARDS.map((card, idx) => [card, idx])),
    []
  );
  const selectedRowSet = useMemo(() => new Set(selectedRowIndices), [selectedRowIndices]);

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  useEffect(() => {
    dragSourceRef.current = dragSourceIndex;
  }, [dragSourceIndex]);

  useEffect(() => {
    dragInsertRef.current = dragInsertIndex;
  }, [dragInsertIndex]);

  const openResponsePopup = useCallback((index: number) => {
    setEditingResponseIndex(index);
  }, []);

  const handleRowClick = useCallback((rowIndex: number, event: React.MouseEvent<HTMLTableRowElement>) => {
    onRowSelection(rowIndex, {
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
    });
  }, [onRowSelection]);

  const closeResponsePopup = useCallback(() => {
    setEditingResponseIndex(null);
  }, []);

  // Calculate Z scores and G/PHR for all responses
  const calculatedData = useMemo(() => {
    return responses.map(r => ({
      zScore: calculateZScore(r),
      gphr: classifyGPHR(r)
    }));
  }, [responses]);

  // Handles row updates and applies domain rules before committing changes
  const handleResponseChange = useCallback((index: number, response: RorschachResponse) => {
    const currentResponses = responsesRef.current;
    const prev = currentResponses[index];
    const r = { ...response };
    const activeDets = r.determinants.filter(d => d !== '');

    // Rule 1: Reflection-Pair Mutual Exclusion
    const hasReflection = activeDets.some(d => d === 'Fr' || d === 'rF');
    if (hasReflection && r.pair === '(2)') {
      r.pair = 'none';
      if (prev.pair === '(2)' || (!prev.determinants.some(d => d === 'Fr' || d === 'rF'))) {
        showToast({ type: 'info', title: t('toast.reflectionPair.title'), message: t('toast.reflectionPair.message') });
      }
    }

    // Rule 2: DQ 'v' prohibits FQ '+'
    if (r.dq === 'v' && r.fq === '+') {
      r.fq = '';
      if (prev.dq !== 'v' || prev.fq !== '+') {
        showToast({ type: 'info', title: t('toast.dqVagueFq.title'), message: t('toast.dqVagueFq.message') });
      }
    }

    // Rule 3: DQ 'v' → Z must be empty
    if (r.dq === 'v' && r.z !== '') {
      r.z = '';
      if (prev.dq !== 'v' || prev.z !== '') {
        showToast({ type: 'info', title: t('toast.dqVagueZ.title'), message: t('toast.dqVagueZ.message') });
      }
    }

    // Rule 4: Pure Determinant FQ Handling
    if (activeDets.length > 0 && activeDets.every(d => FORMLESS_DETERMINANTS.includes(d))) {
      if (r.fq !== 'none') {
        r.fq = 'none';
        const prevActiveDets = prev.determinants.filter(d => d !== '');
        const wasPrevAllFormless = prevActiveDets.length > 0 && prevActiveDets.every(d => FORMLESS_DETERMINANTS.includes(d));
        if (!wasPrevAllFormless) {
          showToast({ type: 'info', title: t('toast.pureDeterminantFq.title'), message: t('toast.pureDeterminantFq.message') });
        }
      }
    }

    // Rule 5: Special Score Integrity
    const activeScores = r.specialScores.filter(s => s !== '');
    let levelConflict = false;
    for (const [lv1, lv2] of LEVEL_PAIRS) {
      const hasLv1 = activeScores.includes(lv1);
      const hasLv2 = activeScores.includes(lv2);
      if (hasLv1 && hasLv2) {
        levelConflict = true;
        const prevScores = prev.specialScores.filter(s => s !== '');
        const prevHadLv2 = prevScores.includes(lv2);
        const removeTarget = (!prevHadLv2 && hasLv2) ? lv1 : lv2;
        r.specialScores = r.specialScores.map(s => s === removeTarget ? '' : s);
      }
    }
    if (levelConflict) {
      showToast({ type: 'info', title: t('toast.specialScoreLevel.title'), message: t('toast.specialScoreLevel.message') });
    }

    const newResponses = [...currentResponses];
    newResponses[index] = r;
    responsesRef.current = newResponses;
    onChange(newResponses);
  }, [onChange, showToast, t]);

  const sortByCardAscending = useCallback(() => {
    const currentResponses = responsesRef.current;
    const sorted = currentResponses
      .map((response, originalIndex) => ({ response, originalIndex }))
      .sort((a, b) => {
        const aRank = cardOrderMap.get(a.response.card) ?? Number.MAX_SAFE_INTEGER;
        const bRank = cardOrderMap.get(b.response.card) ?? Number.MAX_SAFE_INTEGER;
        if (aRank !== bRank) return aRank - bRank;
        return a.originalIndex - b.originalIndex;
      })
      .map((entry) => entry.response);

    responsesRef.current = sorted;
    onChange(sorted);
  }, [cardOrderMap, onChange]);

  const clearDragState = useCallback(() => {
    setDragSourceIndex(null);
    setDragInsertIndex(null);
    dragSourceRef.current = null;
    dragInsertRef.current = null;
    pendingDragRef.current = null;
    if (ghostRef.current && ghostRef.current.parentNode) {
      ghostRef.current.parentNode.removeChild(ghostRef.current);
    }
    ghostRef.current = null;
    document.body.style.userSelect = '';
  }, []);

  const startDragFromPending = useCallback((pending: PendingDragState) => {
    setDragGapHeight(Math.max(40, Math.round(pending.rowRect.height)));

    const ghost = pending.rowElement.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.top = `${pending.rowRect.top}px`;
    ghost.style.left = `${pending.rowRect.left}px`;
    ghost.style.width = `${pending.rowRect.width}px`;
    ghost.style.background = '#ffffff';
    ghost.style.opacity = '1';
    ghost.style.border = '1px solid rgba(100, 116, 139, 0.85)';
    ghost.style.boxShadow = '0 22px 40px rgba(15, 23, 42, 0.35)';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '99999';
    ghost.style.transform = 'scale(1.01)';
    document.body.appendChild(ghost);

    ghostRef.current = ghost;
    dragPointerOffsetYRef.current = pending.pointerOffsetY;
    pointerYRef.current = pending.startY;
    dragSourceRef.current = pending.sourceIndex;
    dragInsertRef.current = pending.sourceIndex;
    setDragSourceIndex(pending.sourceIndex);
    setDragInsertIndex(pending.sourceIndex);
    document.body.style.userSelect = 'none';
  }, []);

  const getInsertIndexFromPointer = useCallback((clientY: number): number => {
    const sourceIndex = dragSourceRef.current;
    const total = responsesRef.current.length;
    if (sourceIndex === null || total <= 1) return sourceIndex ?? 0;

    const rows = Array.from(tbodyRef.current?.querySelectorAll('tr[data-row-index]') ?? []);
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const rowIndexAttr = row.getAttribute('data-row-index');
      if (rowIndexAttr === null) continue;
      const rowIndex = Number(rowIndexAttr);
      if (Number.isNaN(rowIndex) || rowIndex === sourceIndex) continue;
      const rect = row.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        return rowIndex;
      }
    }

    return total;
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (dragSourceRef.current === null && pendingDragRef.current) {
      const pending = pendingDragRef.current;
      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      if (Math.hypot(dx, dy) < DRAG_START_THRESHOLD) {
        return;
      }

      pendingDragRef.current = null;
      startDragFromPending(pending);
    }

    pointerYRef.current = event.clientY;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;

      const sourceIndex = dragSourceRef.current;
      if (sourceIndex === null) return;

      const y = pointerYRef.current;
      if (ghostRef.current) {
        ghostRef.current.style.top = `${y - dragPointerOffsetYRef.current}px`;
      }

      const nextInsertIndex = getInsertIndexFromPointer(y);
      if (dragInsertRef.current !== nextInsertIndex) {
        dragInsertRef.current = nextInsertIndex;
        setDragInsertIndex(nextInsertIndex);
      }
    });
  }, [getInsertIndexFromPointer, startDragFromPending]);

  const handlePointerUp = useCallback(() => {
    const sourceIndex = dragSourceRef.current;
    const insertIndex = dragInsertRef.current;

    if (sourceIndex !== null && insertIndex !== null) {
      let targetIndex = insertIndex;
      if (targetIndex > sourceIndex) targetIndex -= 1;

      if (targetIndex !== sourceIndex) {
        const currentResponses = responsesRef.current;
        const reordered = [...currentResponses];
        const [moved] = reordered.splice(sourceIndex, 1);
        reordered.splice(targetIndex, 0, moved);
        responsesRef.current = reordered;
        onChange(reordered);
      }
    }

    window.removeEventListener('pointermove', handlePointerMove);
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    clearDragState();
  }, [onChange, clearDragState, handlePointerMove]);

  const handleNoCellPointerDown = useCallback((index: number, event: ReactPointerEvent<HTMLTableCellElement>) => {
    if (event.button !== 0) return;
    const rowElement = event.currentTarget.closest('tr') as HTMLTableRowElement | null;
    if (!rowElement) return;

    event.preventDefault();
    const rect = rowElement.getBoundingClientRect();
    pendingDragRef.current = {
      sourceIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      pointerOffsetY: event.clientY - rect.top,
      rowRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      rowElement,
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
    window.addEventListener('pointercancel', handlePointerUp, { once: true });
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (ghostRef.current && ghostRef.current.parentNode) {
        ghostRef.current.parentNode.removeChild(ghostRef.current);
      }
      ghostRef.current = null;
      document.body.style.userSelect = '';
    };
  }, [handlePointerMove, handlePointerUp]);

  // Header columns — memoized to avoid recreating on every render
  const headers = useMemo(() => [
    { key: 'no',           label: 'No.',           tooltip: noTooltipText, accent: 'transparent',       className: 'w-10' },
    { key: 'action',       label: <PencilSquareIcon className="mx-auto w-4 h-4 text-[var(--text-soft)]" />, tooltip: memoTooltipText, accent: 'transparent', className: 'w-10' },
    { key: 'card',         label: 'Card',          accent: 'transparent', className: '' },
    { key: 'location',     label: 'Location',      accent: 'transparent', className: '' },
    { key: 'dq',           label: 'DQ',            accent: 'transparent', className: '' },
    { key: 'determinants', label: 'Determinants',  accent: 'transparent', className: '' },
    { key: 'fq',           label: 'FQ',            accent: 'transparent', className: '' },
    { key: 'pair',         label: 'Pair',          accent: 'transparent', className: '' },
    { key: 'contents',     label: 'Contents',      accent: 'transparent', className: '' },
    { key: 'popular',      label: 'P',             accent: 'transparent', className: '' },
    { key: 'z',            label: 'Z',             accent: 'transparent', className: '' },
    { key: 'score',        label: 'Score',         tooltip: scoreTooltipText, accent: 'transparent', className: 'w-14' },
    { key: 'gphr',         label: 'G/PHR',         tooltip: gphrTooltipText, accent: 'transparent', className: 'w-14' },
    { key: 'special',      label: 'Special Score', accent: 'transparent', className: '' },
  ], [memoTooltipText, scoreTooltipText, gphrTooltipText, noTooltipText]);

  return (
    <div className="overflow-visible rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto md:overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--table-header-bg)]">
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={`border-r border-b-2 border-white/40 border-b-[var(--table-header-border)] px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-700)] last:border-r-0 first:rounded-tl-xl last:rounded-tr-xl ${h.className}`}
                >
                  {h.tooltip ? (
                    <Tooltip content={h.tooltip}>
                      <span className="flex justify-center items-center h-full w-full">{h.label}</span>
                    </Tooltip>
                  ) : h.key === 'card' ? (
                    <span className="flex justify-center items-center gap-1">
                      <span>{h.label}</span>
                      <button
                        type="button"
                        onClick={sortByCardAscending}
                        aria-label={cardSortLabel}
                        title={cardSortLabel}
                        className="inline-flex items-center justify-center rounded p-0.5 text-[var(--brand-700)]/80 transition-colors hover:bg-[var(--surface-base)]/40 hover:text-[var(--brand-700)]"
                      >
                        <BarsArrowUpIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ) : (
                    h.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {responses.map((response, index) => (
              <Fragment key={`group-${index}`}>
                {dragSourceIndex !== null && dragInsertIndex === index && (
                  <tr aria-hidden="true">
                    <td colSpan={headers.length} className="p-0 border-0">
                      <div
                        className="border-y border-[var(--table-insert-border)] bg-[var(--table-insert-bg)] transition-all duration-100"
                        style={{ height: `${dragGapHeight}px` }}
                      />
                    </td>
                  </tr>
                )}
                {dragSourceIndex !== index && (
                  <InputRow
                    index={index}
                    response={response}
                    onChange={handleResponseChange}
                    isSelected={selectedRowSet.has(index)}
                    zScore={calculatedData[index].zScore}
                    gphr={calculatedData[index].gphr}
                    onResponseClick={openResponsePopup}
                    onRowClick={handleRowClick}
                    isDragging={dragSourceIndex === index}
                    isDragTarget={false}
                    onNoCellPointerDown={handleNoCellPointerDown}
                  />
                )}
              </Fragment>
            ))}
            {dragSourceIndex !== null && dragInsertIndex === responses.length && (
              <tr aria-hidden="true">
                <td colSpan={headers.length} className="p-0 border-0">
                  <div
                    className="border-y border-[var(--table-insert-border)] bg-[var(--table-insert-bg)] transition-all duration-100"
                    style={{ height: `${dragGapHeight}px` }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Response editing popup - rendered via portal */}
      {editingResponseIndex !== null && portalRoot && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--surface-overlay)]"
          onPointerDown={(event) => {
            responsePopupBackdropPointerStartedRef.current = event.target === event.currentTarget;
          }}
          onPointerUp={(event) => {
            if (responsePopupBackdropPointerStartedRef.current && event.target === event.currentTarget) {
              closeResponsePopup();
            }
            responsePopupBackdropPointerStartedRef.current = false;
          }}
          onPointerCancel={() => {
            responsePopupBackdropPointerStartedRef.current = false;
          }}
        >
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--text-strong)]">
                {t('input.responseNumber', { index: String(editingResponseIndex + 1) })}
              </h3>
              <button
                type="button"
                onClick={closeResponsePopup}
                className="rounded-lg p-1.5 text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-body)]"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={responses[editingResponseIndex]?.response || ''}
              onChange={(e) => {
                const nextValue = e.target.value;
                const safeValue = getUtf8ByteLength(nextValue) > RESPONSE_MEMO_MAX_BYTES
                  ? truncateToUtf8Bytes(nextValue, RESPONSE_MEMO_MAX_BYTES)
                  : nextValue;
                if (safeValue !== nextValue) {
                  showToast({
                    type: 'warning',
                    title: tableCopy.responseByteLimit,
                    message: tableCopy.responseByteLimitReached,
                  });
                }
                const newResponses = [...responses];
                newResponses[editingResponseIndex] = {
                  ...newResponses[editingResponseIndex],
                  response: safeValue,
                };
                onChange(newResponses);
              }}
              className="h-32 w-full resize-none rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2.5 text-sm text-[var(--text-body)] transition-colors focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/50"
              placeholder="..."
            />
            <div className="mt-1 flex justify-end text-[11px] text-[var(--text-soft)]">
              {getUtf8ByteLength(responses[editingResponseIndex]?.response || '')}/{RESPONSE_MEMO_MAX_BYTES} bytes
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeResponsePopup}
                className="rounded-lg bg-[var(--brand-700)] px-5 py-2 text-sm font-medium text-[var(--on-brand)] shadow-sm transition-colors hover:bg-[var(--brand-700-hover)]"
              >
                OK
              </button>
            </div>
          </div>
        </div>,
        portalRoot
      )}

      {/* Row controls */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-3">
        <p className="pr-4 whitespace-pre-line text-xs text-[var(--text-soft)]">{t('input.rowOrderTip')}</p>
        <div className="flex items-center gap-3">
          {/* Tooltip info icon */}
          <Tooltip content={rowTooltipText}>
            <InformationCircleIcon className="w-5 h-5 cursor-help text-[var(--text-soft)]" />
          </Tooltip>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddRowRequest(selectedRowIndices)}
            disabled={responses.length >= maxRows}
          >
            {t('buttons.add')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDeleteRowsRequest(selectedRowIndices)}
            disabled={responses.length <= 1}
          >
            {t('buttons.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}

