'use client';

import { useMemo, useState, useCallback, useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { RorschachResponse } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { SCORING_CONFIG } from '@/lib/constants';
import { classifyGPHR } from '@/lib/gphr';
import { OPTIONS } from '@/lib/options';
import {
  SCORING_CANVAS_DEFAULT_ZOOM,
  SCORING_CANVAS_VERTICAL_EDGE_PADDING,
  type ScoringCanvasTransform,
  getBoundedScoringCanvasTransform,
  getScoringCanvasBackdropPadding,
  getInitialScoringCanvasTransform,
  getNextScoringZoom,
  getNormalizedScoringPanDelta,
  getPointerAnchoredScoringTransform,
  getScoringCanvasBaseWidth,
  shouldHandleScoringZoomGesture,
  shouldStartScoringPanGesture,
} from '@/lib/scoringCanvas';
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
  actions?: ReactNode;
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

interface CanvasPanState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  latestClientX: number;
  latestClientY: number;
  startTransform: ScoringCanvasTransform;
}

function applyScoringCanvasTransform(
  stage: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  transform: ScoringCanvasTransform,
  motion: 'smooth' | 'direct'
) {
  if (!stage) return;
  stage.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.zoom})`;
  stage.dataset.scoringMotion = motion;
  stage.dataset.scoringOffsetX = transform.x.toFixed(2);
  stage.dataset.scoringOffsetY = transform.y.toFixed(2);
  stage.dataset.scoringZoom = transform.zoom.toFixed(3);
  stage.dataset.scoringDetail = transform.zoom >= 1.15 ? 'expanded' : 'hidden';
  if (viewport) viewport.dataset.scoringZoom = transform.zoom.toFixed(3);
}

function boundScoringCanvasTransform(
  stage: HTMLDivElement,
  viewport: HTMLDivElement,
  transform: ScoringCanvasTransform
) {
  const canvasWidth = Math.max(stage.offsetWidth, stage.scrollWidth);
  const canvasHeight = Math.max(stage.offsetHeight, stage.scrollHeight);

  return getBoundedScoringCanvasTransform({
    transform,
    viewportWidth: viewport.clientWidth,
    viewportHeight: viewport.clientHeight,
    canvasWidth,
    canvasHeight,
    horizontalEdgePadding: getScoringCanvasBackdropPadding(
      viewport.clientWidth,
      canvasWidth
    ),
    verticalEdgePadding: getScoringCanvasBackdropPadding(
      viewport.clientHeight,
      canvasHeight,
      SCORING_CANVAS_VERTICAL_EDGE_PADDING
    ),
  });
}

function readRenderedScoringCanvasTransform(
  stage: HTMLDivElement,
  fallback: ScoringCanvasTransform
): ScoringCanvasTransform {
  const renderedTransform = window.getComputedStyle(stage).transform;
  if (!renderedTransform || renderedTransform === 'none') return fallback;

  const matrix = new DOMMatrixReadOnly(renderedTransform);
  const zoom = Math.hypot(matrix.a, matrix.b);
  if (!Number.isFinite(zoom) || zoom <= 0) return fallback;

  return {
    x: matrix.m41,
    y: matrix.m42,
    zoom,
  };
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

export default function InputTable({
  responses,
  onChange,
  selectedRowIndices,
  onRowSelection,
  onAddRowRequest,
  onDeleteRowsRequest,
  actions,
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
  const [tableCanvasBaseWidth, setTableCanvasBaseWidth] = useState<number | null>(null);
  const [isCanvasPanning, setIsCanvasPanning] = useState(false);
  const portalRoot = typeof document !== 'undefined' ? document.body : null;
  const responsesRef = useRef(responses);
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const tableStageRef = useRef<HTMLDivElement | null>(null);
  const canvasTransformRef = useRef<ScoringCanvasTransform>({
    x: 0,
    y: 0,
    zoom: SCORING_CANVAS_DEFAULT_ZOOM,
  });
  const isAltKeyPressedRef = useRef(false);
  const canvasHasInteractedRef = useRef(false);
  const canvasPanRef = useRef<CanvasPanState | null>(null);
  const canvasPanRafRef = useRef<number | null>(null);
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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('ui-scoring-canvas-active');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => root.classList.remove('ui-scoring-canvas-active');
  }, []);

  useLayoutEffect(() => {
    const viewport = tableScrollRef.current;
    const stage = tableStageRef.current;
    if (!viewport || !stage) return;

    const updateCanvasBounds = () => {
      const nextWidth = getScoringCanvasBaseWidth(viewport.clientWidth);
      setTableCanvasBaseWidth((currentWidth) => (
        currentWidth !== null && Math.abs(currentWidth - nextWidth) < 0.5
          ? currentWidth
          : nextWidth
      ));

      const nextTransform = canvasHasInteractedRef.current
        ? canvasTransformRef.current
        : getInitialScoringCanvasTransform({
            viewportWidth: viewport.clientWidth,
            canvasWidth: Math.max(stage.offsetWidth, stage.scrollWidth),
          });
      const boundedTransform = boundScoringCanvasTransform(stage, viewport, nextTransform);
      canvasTransformRef.current = boundedTransform;
      applyScoringCanvasTransform(stage, viewport, boundedTransform, 'direct');
    };

    updateCanvasBounds();
    const resizeObserver = new ResizeObserver(updateCanvasBounds);
    resizeObserver.observe(viewport);
    resizeObserver.observe(stage);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const viewport = tableScrollRef.current;
    if (!viewport) return;

    const handleAltKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Alt' ||
        event.key === 'AltGraph' ||
        event.code === 'AltLeft' ||
        event.code === 'AltRight' ||
        event.altKey
      ) {
        isAltKeyPressedRef.current = true;
      }
    };

    const handleAltKeyUp = (event: KeyboardEvent) => {
      if (
        event.key === 'Alt' ||
        event.key === 'AltGraph' ||
        event.code === 'AltLeft' ||
        event.code === 'AltRight' ||
        !event.altKey
      ) {
        isAltKeyPressedRef.current = false;
      }
    };

    const clearAltKeyState = () => {
      isAltKeyPressedRef.current = false;
    };

    const handleCanvasWheel = (event: WheelEvent) => {
      const isZoomGesture = shouldHandleScoringZoomGesture(
        event,
        isAltKeyPressedRef.current ||
          event.getModifierState('Alt') ||
          event.getModifierState('AltGraph')
      );
      if ((event.ctrlKey || event.metaKey) && !isZoomGesture) return;

      const stage = tableStageRef.current;
      if (!stage) return;

      event.preventDefault();
      event.stopPropagation();
      canvasHasInteractedRef.current = true;

      if (isZoomGesture) {
        const nextZoom = getNextScoringZoom(
          canvasTransformRef.current.zoom,
          event.deltaY,
          event.deltaMode
        );
        if (nextZoom === canvasTransformRef.current.zoom) return;

        const viewportRect = viewport.getBoundingClientRect();
        const renderedTransform = readRenderedScoringCanvasTransform(
          stage,
          canvasTransformRef.current
        );
        const nextTransform = boundScoringCanvasTransform(
          stage,
          viewport,
          getPointerAnchoredScoringTransform({
            transform: renderedTransform,
            nextZoom,
            pointerX: event.clientX - viewportRect.left,
            pointerY: event.clientY - viewportRect.top,
          })
        );
        canvasTransformRef.current = nextTransform;
        applyScoringCanvasTransform(stage, viewport, nextTransform, 'smooth');
        return;
      }

      const horizontalWheel = event.shiftKey && event.deltaX === 0
        ? event.deltaY
        : event.deltaX;
      const verticalWheel = event.shiftKey && event.deltaX === 0
        ? 0
        : event.deltaY;
      const nextTransform = boundScoringCanvasTransform(stage, viewport, {
        ...canvasTransformRef.current,
        x: canvasTransformRef.current.x - getNormalizedScoringPanDelta(horizontalWheel, event.deltaMode),
        y: canvasTransformRef.current.y - getNormalizedScoringPanDelta(verticalWheel, event.deltaMode),
      });
      canvasTransformRef.current = nextTransform;
      applyScoringCanvasTransform(stage, viewport, nextTransform, 'smooth');
    };

    window.addEventListener('keydown', handleAltKeyDown);
    window.addEventListener('keyup', handleAltKeyUp);
    window.addEventListener('blur', clearAltKeyState);
    viewport.addEventListener('wheel', handleCanvasWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleAltKeyDown);
      window.removeEventListener('keyup', handleAltKeyUp);
      window.removeEventListener('blur', clearAltKeyState);
      viewport.removeEventListener('wheel', handleCanvasWheel);
    };
  }, []);

  const handleCanvasPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isRowTarget = Boolean(target.closest('tbody tr[data-row-index]'));
    const isInteractiveTarget = Boolean(target.closest('button, input, select, textarea, a, [role="option"], [contenteditable="true"]'));

    if (!shouldStartScoringPanGesture({
      button: event.button,
      ctrlKey: event.ctrlKey,
      isRowTarget,
      isInteractiveTarget,
    })) return;

    event.preventDefault();
    event.stopPropagation();
    canvasHasInteractedRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const stage = tableStageRef.current;
    const renderedTransform = stage
      ? readRenderedScoringCanvasTransform(stage, canvasTransformRef.current)
      : canvasTransformRef.current;
    const boundedTransform = stage
      ? boundScoringCanvasTransform(stage, event.currentTarget, renderedTransform)
      : renderedTransform;
    canvasTransformRef.current = boundedTransform;
    applyScoringCanvasTransform(stage, event.currentTarget, boundedTransform, 'direct');
    canvasPanRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      latestClientX: event.clientX,
      latestClientY: event.clientY,
      startTransform: boundedTransform,
    };
    setIsCanvasPanning(true);
    document.body.style.userSelect = 'none';
  }, []);

  const applyCanvasPanPosition = useCallback((pan: CanvasPanState, clientX: number, clientY: number) => {
    const viewport = tableScrollRef.current;
    const stage = tableStageRef.current;
    if (!viewport || !stage) return;

    const deltaX = clientX - pan.startClientX;
    const deltaY = clientY - pan.startClientY;
    const nextTransform = boundScoringCanvasTransform(stage, viewport, {
      x: pan.startTransform.x + deltaX,
      y: pan.startTransform.y + deltaY,
      zoom: pan.startTransform.zoom,
    });
    canvasTransformRef.current = nextTransform;
    applyScoringCanvasTransform(stage, viewport, nextTransform, 'direct');
  }, []);

  const handleCanvasPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const pan = canvasPanRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;

    event.preventDefault();
    pan.latestClientX = event.clientX;
    pan.latestClientY = event.clientY;
    if (canvasPanRafRef.current !== null) return;

    canvasPanRafRef.current = window.requestAnimationFrame(() => {
      canvasPanRafRef.current = null;
      const activePan = canvasPanRef.current;
      if (activePan) {
        applyCanvasPanPosition(activePan, activePan.latestClientX, activePan.latestClientY);
      }
    });
  }, [applyCanvasPanPosition]);

  const handleCanvasPointerEnd = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const pan = canvasPanRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;

    if (canvasPanRafRef.current !== null) {
      window.cancelAnimationFrame(canvasPanRafRef.current);
      canvasPanRafRef.current = null;
    }
    applyCanvasPanPosition(pan, event.clientX, event.clientY);
    canvasPanRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (tableStageRef.current) {
      tableStageRef.current.dataset.scoringMotion = 'smooth';
    }
    setIsCanvasPanning(false);
    document.body.style.userSelect = '';
  }, [applyCanvasPanPosition]);

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
    const currentZoom = canvasTransformRef.current.zoom;
    setDragGapHeight(Math.max(40, Math.round(pending.rowRect.height)) / currentZoom);

    const ghost = document.createElement('div');
    ghost.style.position = 'fixed';
    ghost.style.top = `${pending.rowRect.top}px`;
    ghost.style.left = `${pending.rowRect.left}px`;
    ghost.style.width = `${pending.rowRect.width}px`;
    ghost.style.height = `${pending.rowRect.height}px`;
    ghost.style.background = 'var(--surface-base)';
    ghost.style.opacity = '0.98';
    ghost.style.outline = '1px solid var(--table-insert-border)';
    ghost.style.borderRadius = '0.5rem';
    ghost.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.22)';
    ghost.style.overflow = 'hidden';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '99999';
    ghost.style.willChange = 'top';
    ghost.setAttribute('aria-hidden', 'true');

    const sourceTable = pending.rowElement.closest('table');
    const ghostTable = sourceTable
      ? sourceTable.cloneNode(false) as HTMLTableElement
      : document.createElement('table');
    ghostTable.removeAttribute('id');
    ghostTable.style.width = `${100 / currentZoom}%`;
    ghostTable.style.height = 'auto';
    ghostTable.style.zoom = String(currentZoom);
    ghostTable.style.tableLayout = 'fixed';
    ghostTable.style.borderCollapse = 'collapse';
    ghostTable.style.borderSpacing = '0';

    const colGroup = document.createElement('colgroup');
    Array.from(pending.rowElement.cells).forEach((cell) => {
      const col = document.createElement('col');
      col.style.width = `${cell.getBoundingClientRect().width / currentZoom}px`;
      colGroup.appendChild(col);
    });

    const ghostBody = document.createElement('tbody');
    const ghostRow = pending.rowElement.cloneNode(true) as HTMLTableRowElement;
    ghostRow.removeAttribute('data-row-index');
    ghostRow.style.height = `${pending.rowRect.height / currentZoom}px`;
    ghostRow.querySelectorAll<HTMLElement>('button, input, [tabindex]').forEach((element) => {
      element.setAttribute('tabindex', '-1');
    });
    ghostBody.appendChild(ghostRow);
    ghostTable.appendChild(colGroup);
    ghostTable.appendChild(ghostBody);
    ghost.appendChild(ghostTable);
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
    event.stopPropagation();
    onRowSelection(index, {
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
    });
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
  }, [handlePointerMove, handlePointerUp, onRowSelection]);

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
      canvasPanRef.current = null;
      if (canvasPanRafRef.current !== null) {
        window.cancelAnimationFrame(canvasPanRafRef.current);
        canvasPanRafRef.current = null;
      }
      document.body.style.userSelect = '';
    };
  }, [handlePointerMove, handlePointerUp]);

  // Header columns — memoized to avoid recreating on every render
  const headers = useMemo(() => [
    { key: 'no',           label: 'No.',           tooltip: noTooltipText, accent: 'transparent',       className: 'w-8 min-w-8 max-w-8 px-1' },
    { key: 'action',       label: <PencilSquareIcon className="mx-auto w-4 h-4 text-[var(--text-soft)]" />, tooltip: memoTooltipText, accent: 'transparent', className: 'w-10' },
    { key: 'card',         label: 'Card',          accent: 'transparent', className: '' },
    { key: 'location',     label: 'Location',      accent: 'transparent', className: '' },
    { key: 'dq',           label: 'DQ',            accent: 'transparent', className: '' },
    { key: 'determinants', label: 'Determinants',  accent: 'transparent', className: '' },
    { key: 'fq',           label: 'FQ',            accent: 'transparent', className: '' },
    { key: 'pair',         label: 'Pair',          accent: 'transparent', className: '' },
    { key: 'contents',     label: 'Contents',      accent: 'transparent', className: '' },
    { key: 'popular',      label: 'P',             accent: 'transparent', className: 'w-12 min-w-12' },
    { key: 'z',            label: 'Z',             accent: 'transparent', className: '' },
    { key: 'score',        label: 'Score',         tooltip: scoreTooltipText, accent: 'transparent', className: 'w-14' },
    { key: 'gphr',         label: 'G/PHR',         tooltip: gphrTooltipText, accent: 'transparent', className: 'w-14' },
    { key: 'special',      label: 'Special Score', accent: 'transparent', className: '' },
  ], [memoTooltipText, scoreTooltipText, gphrTooltipText, noTooltipText]);

  return (
    <div className="ui-scoring-table-shell relative">
      {/* Table */}
      <div
        ref={tableScrollRef}
        className={`ui-scoring-table-scroll ${isCanvasPanning ? 'is-canvas-panning' : ''}`}
        data-scoring-base-width={tableCanvasBaseWidth === null ? undefined : Math.round(tableCanvasBaseWidth)}
        data-scoring-zoom={SCORING_CANVAS_DEFAULT_ZOOM.toFixed(3)}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerEnd}
        onPointerCancel={handleCanvasPointerEnd}
        onLostPointerCapture={handleCanvasPointerEnd}
      >
        <div
          ref={tableStageRef}
          className="ui-scoring-table-stage"
          data-scoring-motion="smooth"
          data-scoring-offset-x="0.00"
          data-scoring-offset-y="0.00"
          data-scoring-zoom={SCORING_CANVAS_DEFAULT_ZOOM.toFixed(3)}
          data-scoring-detail="hidden"
          style={{
            width: tableCanvasBaseWidth === null ? '100%' : `${tableCanvasBaseWidth}px`,
          }}
        >
          <div
            className="ui-scoring-table-canvas"
          >
            <table className="ui-scoring-table w-full min-w-[70rem] rounded-xl border border-separate border-spacing-0 border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-sm">
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
          <tfoot>
            <tr>
              <td
                colSpan={headers.length}
                className="ui-scoring-table-footer-cap min-h-16 rounded-b-xl border-t-2 border-[var(--table-header-border)] bg-[var(--table-header-bg)] px-5 py-3"
              >
                <span className="block whitespace-normal text-left text-xs font-medium leading-5 text-[var(--table-header-text)]">
                  {t('input.rowOrderTip')}
                </span>
              </td>
            </tr>
          </tfoot>
            </table>

          {/* Row controls */}
          <div className="ui-scoring-action-bar grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3">
            <div className="flex min-w-0 items-center justify-self-start gap-3">
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
              <Tooltip content={rowTooltipText}>
                <button
                  type="button"
                  aria-label={rowTooltipText.split('\n')[0]}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-base)] hover:text-[var(--brand-700)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                >
                  <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </Tooltip>
            </div>
            <div className="justify-self-center">{actions}</div>
            <div aria-hidden="true" />
          </div>
          </div>
        </div>
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

    </div>
  );
}

