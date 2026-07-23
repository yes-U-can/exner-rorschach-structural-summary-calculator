'use client';

import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRorschachForm } from '@/hooks/useRorschachForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from '@/components/ui/Toast';


import InputTable from '@/components/input/InputTable';
import MobileCard from '@/components/input/MobileCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';

import { exportToCSV, exportSummaryToCSV, generateSummaryCsv } from '@/lib/csv';
import { exportToPdf } from '@/lib/pdf';
import { buildPrintResponseMemoGroups } from '@/lib/printResponseMemos';
import {
  findScoringInputIssues,
  summarizeScoringInputIssues,
} from '@/lib/scoringInputValidation';
import {
  fetchByokSessionStatus,
  openByokSessionDialog,
  subscribeByokSessionChange,
  type ByokSessionStatus,
} from '@/lib/byokSessionClient';

import {
  buildCodingAssistContext,
  getDefaultSessionUiPreferences,
} from '@/lib/chatWorkflow';
import {
  clearSessionUiPreferencesStorage,
  readSessionUiPreferences,
  subscribeSessionUiPreferencesClear,
  writeSessionUiPreferences,
} from '@/lib/sessionUiPreferencesStorage';
import type { CodingAssistContext, RorschachResponse } from '@/types';

// Lazy-loaded heavy components (only loaded when actually needed)
const UpperSection = lazy(() => import('@/components/result/UpperSection'));
const LowerSection = lazy(() => import('@/components/result/LowerSection'));
const SpecialIndices = lazy(() => import('@/components/result/SpecialIndices'));
const PrintLowerSection = lazy(() => import('@/components/result/print/PrintLowerSection'));
const PrintSpecialIndices = lazy(() => import('@/components/result/print/PrintSpecialIndices'));
const ChatWidget = lazy(() => import('@/components/chat/ChatWidget'));
import {
  CalculatorIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const homeUiByLanguage = {
  en: {
    downloadButton: 'Download Data',
    downloadTitle: 'Download Data',
    downloadDescription: 'Choose the file you want to save from the current calculation result.',
    rawCsvLabel: 'Input Raw Data CSV',
    rawCsvDescription: 'Download the coded scoring inputs entered in the table as CSV.',
    summaryCsvLabel: 'Structural Summary Values CSV',
    summaryCsvDescription: 'Download the calculated Upper, Lower, and Special indices as CSV.',
    copySummaryButton: 'Copy Structural Summary values',
    copySummarySuccessTitle: 'Structural Summary values copied',
    copySummarySuccessMessage: 'Paste them into the interpretation helper.',
    copySummaryErrorTitle: 'Copy failed',
    copySummaryErrorMessage: 'Copying failed. Please try again.',
    pdfLabel: 'Structural Summary PDF Print',
    pdfDescription: 'Download a 2-page PDF with the summary sections and response memos.',
    codingStarter: 'If coding feels difficult, talk it through with me.',
    codingOpenButton: 'Coding helper',
    responseNotesTitle: 'Response Memos',
    responseNotesEmpty: 'No response memos were recorded.',
    pdfErrorTitle: 'PDF download failed',
    pdfErrorMessage: 'The PDF could not be generated. Please try again.',
    codingUnavailableTitle: 'Coding helper unavailable',
    codingUnavailableMessage: 'Select a row that contains both a card and a RESPONSE memo.',
    rowInsertUnavailableTitle: 'Cannot add a row',
    rowInsertUnavailableMessage: 'Rows {rows} are selected. A new row can only be inserted after one row.',
    rowInsertConfirmMessage: 'A new row will be added immediately after row {row}.',
    rowDeleteConfirmMessage: 'Delete the selected rows {rows}?',
    rowDeleteConfirmTitle: 'Delete selected rows?',
    rowInsertConfirmTitle: 'Add after selected row',
    skipTablePrompt: "Don't show this confirmation again",
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  ko: {
    downloadButton: '데이터 다운로드',
    downloadTitle: '데이터 다운로드',
    downloadDescription: '이번 계산 결과에서 내려받을 파일 형식을 선택하세요.',
    rawCsvLabel: '점수계열 원자료 CSV',
    rawCsvDescription: '채점표에 입력한 부호화 값을 CSV 파일로 저장합니다.',
    summaryCsvLabel: '구조요약 수치 CSV',
    summaryCsvDescription: '계산된 구조요약 수치를 CSV 파일로 저장합니다.',
    copySummaryButton: '구조요약 값 복사하기',
    copySummarySuccessTitle: '구조요약 값을 복사했습니다',
    copySummarySuccessMessage: '해석 도우미의 구조요약 수치 입력란에 붙여넣어 주세요.',
    copySummaryErrorTitle: '복사 실패',
    copySummaryErrorMessage: '구조요약 값을 복사하지 못했습니다. 다시 시도해 주세요.',
    pdfLabel: '구조요약지 PDF 인쇄',
    pdfDescription: '구조요약지와 response 메모를 2페이지 PDF 파일로 저장합니다.',
    codingStarter: '부호화가 어렵다면 저와 대화해보세요!',
    codingOpenButton: '코딩 도우미',
    responseNotesTitle: 'Response 메모',
    responseNotesEmpty: '기록된 response 메모가 없습니다.',
    pdfErrorTitle: 'PDF 저장 실패',
    pdfErrorMessage: 'PDF 파일을 만드는 중 오류가 발생했습니다. 다시 시도해 주세요.',
    codingUnavailableTitle: '코딩 도우미를 열 수 없습니다',
    codingUnavailableMessage: '현재 시트에서 카드와 RESPONSE 메모가 함께 입력된 행을 먼저 선택해 주세요.',
    rowInsertUnavailableTitle: '행 추가 불가',
    rowInsertUnavailableMessage: '현재 {rows}번 행이 함께 선택되어 있습니다. 새 행은 한 행 바로 다음에만 추가할 수 있습니다.',
    rowInsertConfirmMessage: '{row}번 행 바로 다음에 새 행을 추가합니다.',
    rowDeleteConfirmMessage: '현재 선택된 {rows}번 행을 삭제하시겠습니까?',
    rowDeleteConfirmTitle: '선택된 행 삭제 확인',
    rowInsertConfirmTitle: '선택된 행 다음에 추가',
    skipTablePrompt: '이 안내 다시 보지 않기',
    cancel: '취소',
    confirm: '확인',
  },
  ja: {
    downloadButton: 'データをダウンロード',
    downloadTitle: 'データをダウンロード',
    downloadDescription: '今回の計算結果から保存したいファイルを選択してください。',
    rawCsvLabel: '入力原資料 CSV',
    rawCsvDescription: '採点表に入力したコード値を CSV で保存します。',
    summaryCsvLabel: '構造要約数値 CSV',
    summaryCsvDescription: '計算された構造要約の数値を CSV で保存します。',
    copySummaryButton: '構造要約値をコピー',
    copySummarySuccessTitle: '構造要約値をコピーしました',
    copySummarySuccessMessage: '解釈ヘルパーの構造要約数値欄に貼り付けてください。',
    copySummaryErrorTitle: 'コピーに失敗しました',
    copySummaryErrorMessage: '構造要約値をコピーできませんでした。もう一度お試しください。',
    pdfLabel: '構造要約 PDF 印刷',
    pdfDescription: '構造要約と response メモを 2 ページ PDF で保存します。',
    codingStarter: '符号化に迷ったら、私と一緒に確認してみましょう。',
    codingOpenButton: 'コーディングヘルパー',
    responseNotesTitle: 'Response メモ',
    responseNotesEmpty: '記録された response メモはありません。',
    pdfErrorTitle: 'PDF 保存失敗',
    pdfErrorMessage: 'PDF を生成できませんでした。もう一度お試しください。',
    codingUnavailableTitle: 'コーディングヘルパーを開けません',
    codingUnavailableMessage: 'CardとRESPONSEメモの両方が入力されている行を選択してください。',
    rowInsertUnavailableTitle: '行を追加できません',
    rowInsertUnavailableMessage: '{rows}行が選択されています。新しい行は1行の直後にのみ追加できます。',
    rowInsertConfirmMessage: '{row}行目の直後に新しい行を追加します。',
    rowDeleteConfirmMessage: '選択した{rows}行を削除しますか？',
    rowDeleteConfirmTitle: '選択した行を削除',
    rowInsertConfirmTitle: '選択した行の後に追加',
    skipTablePrompt: '今後この確認を表示しない',
    cancel: 'キャンセル',
    confirm: '確認',
  },
  es: {
    downloadButton: 'Descargar datos',
    downloadTitle: 'Descargar datos',
    downloadDescription: 'Elige qué archivo quieres guardar del resultado actual.',
    rawCsvLabel: 'CSV de datos de entrada',
    rawCsvDescription: 'Guarda en CSV los valores codificados ingresados en la tabla.',
    summaryCsvLabel: 'CSV de valores del resumen',
    summaryCsvDescription: 'Guarda en CSV los valores calculados del resumen estructural.',
    copySummaryButton: 'Copiar valores del resumen',
    copySummarySuccessTitle: 'Valores del resumen copiados',
    copySummarySuccessMessage: 'Pégalos en el asistente de interpretación.',
    copySummaryErrorTitle: 'No se pudo copiar',
    copySummaryErrorMessage: 'No se pudieron copiar los valores. Inténtalo de nuevo.',
    pdfLabel: 'Imprimir PDF del resumen',
    pdfDescription: 'Guarda un PDF de 2 páginas con el resumen y las notas de response.',
    codingStarter: 'Si la codificación se complica, conversemos y revisémosla juntos.',
    codingOpenButton: 'Asistente de codificación',
    responseNotesTitle: 'Notas de response',
    responseNotesEmpty: 'No se registraron notas de response.',
    pdfErrorTitle: 'No se pudo guardar el PDF',
    pdfErrorMessage: 'No se pudo generar el PDF. Inténtalo de nuevo.',
    codingUnavailableTitle: 'No se puede abrir el asistente de codificación',
    codingUnavailableMessage: 'Selecciona una fila que tenga Card y una nota RESPONSE.',
    rowInsertUnavailableTitle: 'No se puede añadir una fila',
    rowInsertUnavailableMessage: 'Están seleccionadas las filas {rows}. Solo se puede añadir una fila después de una única fila.',
    rowInsertConfirmMessage: 'Se añadirá una fila justo después de la fila {row}.',
    rowDeleteConfirmMessage: '¿Eliminar las filas seleccionadas {rows}?',
    rowDeleteConfirmTitle: 'Eliminar filas seleccionadas',
    rowInsertConfirmTitle: 'Añadir después de la fila seleccionada',
    skipTablePrompt: 'No volver a mostrar esta confirmación',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  pt: {
    downloadButton: 'Baixar dados',
    downloadTitle: 'Baixar dados',
    downloadDescription: 'Escolha qual arquivo deseja salvar do resultado atual.',
    rawCsvLabel: 'CSV dos dados de entrada',
    rawCsvDescription: 'Salva em CSV os valores codificados digitados na tabela.',
    summaryCsvLabel: 'CSV dos valores do resumo',
    summaryCsvDescription: 'Salva em CSV os valores calculados do resumo estrutural.',
    copySummaryButton: 'Copiar valores do resumo',
    copySummarySuccessTitle: 'Valores do resumo copiados',
    copySummarySuccessMessage: 'Cole-os no assistente de interpretação.',
    copySummaryErrorTitle: 'Falha ao copiar',
    copySummaryErrorMessage: 'Não foi possível copiar os valores. Tente novamente.',
    pdfLabel: 'Imprimir PDF do resumo',
    pdfDescription: 'Salva um PDF de 2 páginas com o resumo e as notas de response.',
    codingStarter: 'Se a codificação estiver difícil, converse comigo para revisarmos juntos.',
    codingOpenButton: 'Assistente de codificação',
    responseNotesTitle: 'Notas de response',
    responseNotesEmpty: 'Nenhuma nota de response foi registrada.',
    pdfErrorTitle: 'Falha ao salvar PDF',
    pdfErrorMessage: 'Não foi possível gerar o PDF. Tente novamente.',
    codingUnavailableTitle: 'Não foi possível abrir o assistente de codificação',
    codingUnavailableMessage: 'Selecione uma linha que contenha Card e uma nota RESPONSE.',
    rowInsertUnavailableTitle: 'Não foi possível adicionar uma linha',
    rowInsertUnavailableMessage: 'As linhas {rows} estão selecionadas. Uma nova linha só pode ser adicionada após uma única linha.',
    rowInsertConfirmMessage: 'Uma nova linha será adicionada logo após a linha {row}.',
    rowDeleteConfirmMessage: 'Excluir as linhas selecionadas {rows}?',
    rowDeleteConfirmTitle: 'Excluir linhas selecionadas',
    rowInsertConfirmTitle: 'Adicionar após a linha selecionada',
    skipTablePrompt: 'Não mostrar esta confirmação novamente',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
} as const;

export default function HomePage() {
  const { t, language } = useTranslation();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const { showToast } = useToast();
  const {
    responses,
    setResponses,
    result,
    isCalculating,
    showResult,
    calculate,
    reset,
    loadSampleData,
    loadData,
    backToInput,
    validResponseCount,
    undo,
    redo,
  } = useRorschachForm();

  const { load, hasSavedData, clear } = useAutoSave(responses);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upper' | 'lower' | 'special'>('upper');
  const [isMobile, setIsMobile] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([]);
  const [selectionAnchorIndex, setSelectionAnchorIndex] = useState<number | null>(null);
  const [selectionFocusIndex, setSelectionFocusIndex] = useState<number | null>(null);
  const [activeMobileRowIndex, setActiveMobileRowIndex] = useState(0);
  const [sessionPreferences, setSessionPreferences] = useState(getDefaultSessionUiPreferences());
  const [tableActionPreferenceChecked, setTableActionPreferenceChecked] = useState(false);
  const [pendingTableAction, setPendingTableAction] = useState<null | {
    type: 'insert-after-selection' | 'delete-selection';
    rowIndices: number[];
    message: string;
  }>(null);
  const [codingAssistState, setCodingAssistState] = useState<{
    rowIndex: number | null;
    context: CodingAssistContext | null;
    starterMessage: string;
  } | null>(null);
  const [byokStatus, setByokStatus] = useState<ByokSessionStatus | null>(null);
  const hasAiSession = Boolean(byokStatus?.active);
  const showCodingAssistLauncher = Boolean(hasAiSession && !showChatWidget && !showResult);

  const pageUi = useMemo(() => homeUiByLanguage[language] ?? homeUiByLanguage.en, [language]);
  const showScoringInputWarnings = useCallback((inputResponses: RorschachResponse[]) => {
    const issues = findScoringInputIssues(inputResponses);
    if (issues.length === 0) return false;

    const summary = summarizeScoringInputIssues(issues);
    if (summary.invalidDeterminants.rows) {
      showToast({
        type: 'warning',
        title: t('toast.invalidDeterminants.title'),
        message: t('toast.invalidDeterminants.message', summary.invalidDeterminants),
      });
    }
    if (summary.standaloneSpaceRows) {
      showToast({
        type: 'warning',
        title: t('toast.standaloneSpace.title'),
        message: t('toast.standaloneSpace.message', { rows: summary.standaloneSpaceRows }),
      });
    }
    if (summary.movementConflictRows) {
      showToast({
        type: 'warning',
        title: t('toast.movementConflict.title'),
        message: t('toast.movementConflict.message', { rows: summary.movementConflictRows }),
      });
    }
    if (summary.duplicateDeterminants.rows) {
      showToast({
        type: 'warning',
        title: t('toast.duplicateDeterminant.title'),
        message: t('toast.duplicateDeterminant.message', summary.duplicateDeterminants),
      });
    }
    if (summary.missingFormQualityRows) {
      showToast({
        type: 'warning',
        title: t('toast.missingFormQuality.title'),
        message: t('toast.missingFormQuality.message', { rows: summary.missingFormQualityRows }),
      });
    }

    return true;
  }, [showToast, t]);

  useEffect(() => {
    const root = document.documentElement;

    if (!showCodingAssistLauncher) {
      root.style.removeProperty('--coding-assist-launcher-footer-clearance');
      return;
    }

    let frameId = 0;
    const updateLauncherPosition = () => {
      frameId = 0;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const footer = document.querySelector<HTMLElement>('[data-site-footer]');
      const footerRect = footer?.getBoundingClientRect();
      const visibleFooterHeight = footerRect
        ? Math.max(0, Math.min(footerRect.bottom, viewportHeight) - Math.max(footerRect.top, 0))
        : 0;
      const footerClearance = visibleFooterHeight > 0 ? Math.ceil(visibleFooterHeight + 16) : 0;
      root.style.setProperty('--coding-assist-launcher-footer-clearance', `${footerClearance}px`);
    };

    const scheduleUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateLauncherPosition);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('scroll', scheduleUpdate);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('scroll', scheduleUpdate);
      root.style.removeProperty('--coding-assist-launcher-footer-clearance');
    };
  }, [showCodingAssistLauncher]);

  const responseMemoGroups = useMemo(
    () => buildPrintResponseMemoGroups(responses),
    [responses],
  );
  const effectiveSelectedRowIndices = useMemo(() => {
    if (isMobile) {
      return Number.isInteger(activeMobileRowIndex) ? [activeMobileRowIndex] : [];
    }
    return selectedRowIndices;
  }, [activeMobileRowIndex, isMobile, selectedRowIndices]);

  const persistSessionPreferences = useCallback(async (nextPreferences: ReturnType<typeof getDefaultSessionUiPreferences>) => {
    setSessionPreferences(nextPreferences);
    if (byokStatus?.active) {
      writeSessionUiPreferences(nextPreferences);
    }
  }, [byokStatus?.active]);

  useEffect(() => {
    const resetPreferences = () => setSessionPreferences(getDefaultSessionUiPreferences());
    setSessionPreferences(readSessionUiPreferences());
    return subscribeSessionUiPreferencesClear(resetPreferences);
  }, []);

  const buildCodingContextForSheet = useCallback((focusRowIndex: number | null, explicitSelection?: number[]) => {
    const selected = explicitSelection && explicitSelection.length > 0
      ? explicitSelection
      : effectiveSelectedRowIndices;
    const normalizedFocusRow =
      typeof focusRowIndex === 'number' && Number.isInteger(focusRowIndex) && focusRowIndex >= 0
        ? focusRowIndex
        : null;

    return buildCodingAssistContext({
      focusRowIndex: normalizedFocusRow,
      responses,
      selectedRowIndices: selected,
    });
  }, [effectiveSelectedRowIndices, responses]);

  const syncSelectionAfterRemoval = useCallback((removedRows: number[]) => {
    const removed = [...new Set(removedRows)].sort((a, b) => a - b);
    setSelectedRowIndices((prev) => prev
      .filter((rowIndex) => !removed.includes(rowIndex))
      .map((rowIndex) => rowIndex - removed.filter((removedIndex) => removedIndex < rowIndex).length));
    setSelectionAnchorIndex((prev) => {
      if (prev === null) return null;
      if (removed.includes(prev)) return null;
      return prev - removed.filter((removedIndex) => removedIndex < prev).length;
    });
    setSelectionFocusIndex((prev) => {
      if (prev === null) return null;
      if (removed.includes(prev)) return null;
      return prev - removed.filter((removedIndex) => removedIndex < prev).length;
    });
  }, []);

  const applyInsertAfterRow = useCallback((rowIndex: number) => {
    let insertedRowIndex = rowIndex + 1;
    setResponses((prevResponses) => {
      insertedRowIndex = Math.min(rowIndex + 1, prevResponses.length);
      const nextResponses = [...prevResponses];
      nextResponses.splice(insertedRowIndex, 0, {
        card: '',
        response: '',
        location: '',
        dq: '',
        determinants: [],
        fq: '',
        pair: 'none',
        contents: [],
        popular: false,
        z: '',
        specialScores: [],
      });
      return nextResponses;
    });
    setSelectedRowIndices([insertedRowIndex]);
    setSelectionAnchorIndex(insertedRowIndex);
    setSelectionFocusIndex(insertedRowIndex);
    setActiveMobileRowIndex(insertedRowIndex);
  }, [setResponses]);

  const applyDeleteRows = useCallback((rowIndices: number[]) => {
    const normalizedRows = [...new Set(rowIndices)]
      .filter((rowIndex) => rowIndex >= 0 && rowIndex < responses.length)
      .sort((a, b) => a - b);

    if (!normalizedRows.length) {
      return;
    }

    setResponses((prevResponses) => {
      const nextResponses = prevResponses.filter((_, rowIndex) => !normalizedRows.includes(rowIndex));
      return nextResponses.length > 0 ? nextResponses : [{
        card: '',
        response: '',
        location: '',
        dq: '',
        determinants: [],
        fq: '',
        pair: 'none',
        contents: [],
        popular: false,
        z: '',
        specialScores: [],
      }];
    });
    syncSelectionAfterRemoval(normalizedRows);
    setActiveMobileRowIndex((prev) => Math.max(0, Math.min(prev, responses.length - normalizedRows.length - 1)));
  }, [responses.length, setResponses, syncSelectionAfterRemoval]);

  const handleDesktopRowSelection = useCallback((rowIndex: number, modifiers: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean }) => {
    const multiToggle = Boolean(modifiers.metaKey || modifiers.ctrlKey);

    if (modifiers.shiftKey && selectionAnchorIndex !== null) {
      const start = Math.min(selectionAnchorIndex, rowIndex);
      const end = Math.max(selectionAnchorIndex, rowIndex);
      const range = Array.from({ length: end - start + 1 }, (_, offset) => start + offset);
      setSelectedRowIndices(range);
      setSelectionFocusIndex(rowIndex);
      return;
    }

    if (multiToggle) {
      setSelectedRowIndices((prev) => (
        prev.includes(rowIndex)
          ? prev.filter((value) => value !== rowIndex)
          : [...prev, rowIndex].sort((a, b) => a - b)
      ));
      setSelectionAnchorIndex(rowIndex);
      setSelectionFocusIndex(rowIndex);
      return;
    }

    setSelectedRowIndices([rowIndex]);
    setSelectionAnchorIndex(rowIndex);
    setSelectionFocusIndex(rowIndex);
  }, [selectionAnchorIndex]);

  const selectAllDesktopRows = useCallback(() => {
    const allRowIndices = Array.from({ length: responses.length }, (_, index) => index);
    setSelectedRowIndices(allRowIndices);
    setSelectionAnchorIndex(allRowIndices.length > 0 ? allRowIndices[0] : null);
    setSelectionFocusIndex(allRowIndices.length > 0 ? allRowIndices[allRowIndices.length - 1] : null);
  }, [responses.length]);

  const primeCodingAssistState = useCallback((focusRowIndex?: number, explicitSelection?: number[]) => {
    if (!hasAiSession) {
      openByokSessionDialog();
      return false;
    }

    const nextFocusRowIndex =
      typeof focusRowIndex === 'number'
        ? focusRowIndex
        : explicitSelection && explicitSelection.length > 0
          ? (
            selectionFocusIndex !== null && explicitSelection.includes(selectionFocusIndex)
              ? selectionFocusIndex
              : explicitSelection[explicitSelection.length - 1]
          )
          : effectiveSelectedRowIndices.length > 0
            ? (
              selectionFocusIndex !== null && effectiveSelectedRowIndices.includes(selectionFocusIndex)
                ? selectionFocusIndex
                : effectiveSelectedRowIndices[effectiveSelectedRowIndices.length - 1]
            )
            : isMobile
              ? activeMobileRowIndex
              : null;
    const focusResponse = typeof nextFocusRowIndex === 'number' ? responses[nextFocusRowIndex] : null;
    const hasAnyResponseMemo = responses.some((response) => response.response.trim());

    if (focusResponse && (!focusResponse.card.trim() || !focusResponse.response.trim())) {
      return false;
    }

    if (!focusResponse && !hasAnyResponseMemo) {
      return false;
    }

    const context = buildCodingContextForSheet(nextFocusRowIndex, explicitSelection);
    setCodingAssistState({
      rowIndex: nextFocusRowIndex,
      context,
      starterMessage: pageUi.codingStarter,
    });
    return true;
  }, [activeMobileRowIndex, buildCodingContextForSheet, effectiveSelectedRowIndices, hasAiSession, isMobile, pageUi.codingStarter, responses, selectionFocusIndex]);


  const hasCodingAssistState = Boolean(codingAssistState);

  useEffect(() => {
    if (!showChatWidget || !hasCodingAssistState) return;
    const selected = effectiveSelectedRowIndices;
    const nextFocusRowIndex = selected.length > 0
      ? (
          selectionFocusIndex !== null && selected.includes(selectionFocusIndex)
            ? selectionFocusIndex
            : selected[selected.length - 1]
        )
      : null;
    const hasAnyResponseMemo = responses.some((response) => response.response.trim());
    if (!hasAnyResponseMemo) return;

    setCodingAssistState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rowIndex: nextFocusRowIndex,
        context: buildCodingContextForSheet(nextFocusRowIndex, selected),
      };
    });
  }, [buildCodingContextForSheet, effectiveSelectedRowIndices, hasCodingAssistState, responses, selectionFocusIndex, showChatWidget]);

  const openCodingAssistPopup = useCallback((rowIndex?: number) => {
    const explicitSelection =
      typeof rowIndex === 'number'
        ? (effectiveSelectedRowIndices.includes(rowIndex) ? effectiveSelectedRowIndices : [rowIndex])
        : effectiveSelectedRowIndices;
    const primed = primeCodingAssistState(rowIndex, explicitSelection);
    if (!primed) {
      showToast({
        type: 'warning',
        title: pageUi.codingUnavailableTitle,
        message: pageUi.codingUnavailableMessage,
      });
      return;
    }

    setShowChatWidget(true);
  }, [effectiveSelectedRowIndices, pageUi, primeCodingAssistState, showToast]);

  const handleInsertRequest = useCallback((rowIndices: number[]) => {
    if (rowIndices.length === 0) {
      applyInsertAfterRow(responses.length - 1);
      return;
    }

    if (rowIndices.length > 1) {
      showToast({
        type: 'warning',
        title: pageUi.rowInsertUnavailableTitle,
        message: pageUi.rowInsertUnavailableMessage.replace(
          '{rows}',
          rowIndices.map((rowIndex) => rowIndex + 1).join(', '),
        ),
      });
      return;
    }

    const targetRowIndex = rowIndices[0];
    if (sessionPreferences.tablePrompts.skipInsertAfterSelectedConfirm) {
      applyInsertAfterRow(targetRowIndex);
      return;
    }

    setTableActionPreferenceChecked(false);
    setPendingTableAction({
      type: 'insert-after-selection',
      rowIndices: [targetRowIndex],
      message: pageUi.rowInsertConfirmMessage.replace('{row}', String(targetRowIndex + 1)),
    });
  }, [applyInsertAfterRow, pageUi, responses.length, showToast, sessionPreferences.tablePrompts.skipInsertAfterSelectedConfirm]);

  const handleDeleteRequest = useCallback((rowIndices: number[]) => {
    if (rowIndices.length === 0) {
      applyDeleteRows([responses.length - 1]);
      return;
    }

    if (sessionPreferences.tablePrompts.skipDeleteSelectedConfirm) {
      applyDeleteRows(rowIndices);
      return;
    }

    setTableActionPreferenceChecked(false);
    setPendingTableAction({
      type: 'delete-selection',
      rowIndices,
      message: pageUi.rowDeleteConfirmMessage.replace(
        '{rows}',
        rowIndices.map((rowIndex) => rowIndex + 1).join(', '),
      ),
    });
  }, [applyDeleteRows, pageUi, responses.length, sessionPreferences.tablePrompts.skipDeleteSelectedConfirm]);

  const confirmPendingTableAction = useCallback(async () => {
    if (!pendingTableAction) return;

    if (pendingTableAction.type === 'insert-after-selection') {
      applyInsertAfterRow(pendingTableAction.rowIndices[0]);
      if (tableActionPreferenceChecked) {
        await persistSessionPreferences({
          ...sessionPreferences,
          tablePrompts: {
            ...sessionPreferences.tablePrompts,
            skipInsertAfterSelectedConfirm: true,
          },
        });
      }
    } else if (pendingTableAction.type === 'delete-selection') {
      applyDeleteRows(pendingTableAction.rowIndices);
      if (tableActionPreferenceChecked) {
        await persistSessionPreferences({
          ...sessionPreferences,
          tablePrompts: {
            ...sessionPreferences.tablePrompts,
            skipDeleteSelectedConfirm: true,
          },
        });
      }
    }

    setPendingTableAction(null);
    setTableActionPreferenceChecked(false);
  }, [applyDeleteRows, applyInsertAfterRow, pendingTableAction, persistSessionPreferences, tableActionPreferenceChecked, sessionPreferences]);

  useEffect(() => {
    let cancelled = false;
    const refreshByokStatus = async () => {
      const nextStatus = await fetchByokSessionStatus();
      if (!cancelled) setByokStatus(nextStatus);
    };

    void refreshByokStatus();
    const unsubscribe = subscribeByokSessionChange(() => {
      void refreshByokStatus();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const active = byokStatus?.active;
    if (active === false) {
      clearSessionUiPreferencesStorage();
    }
  }, [byokStatus?.active]);

  useEffect(() => {
    if (isMobile) {
      setSelectedRowIndices([]);
      setSelectionAnchorIndex(null);
      setSelectionFocusIndex(null);
    }
  }, [isMobile]);

  useEffect(() => {
    setSelectedRowIndices((prev) => prev.filter((rowIndex) => rowIndex >= 0 && rowIndex < responses.length));
    setSelectionAnchorIndex((prev) => {
      if (prev === null) return null;
      return prev >= 0 && prev < responses.length ? prev : null;
    });
    setSelectionFocusIndex((prev) => {
      if (prev === null) return null;
      return prev >= 0 && prev < responses.length ? prev : null;
    });
    setActiveMobileRowIndex((prev) => Math.max(0, Math.min(prev, responses.length - 1)));
  }, [responses.length]);

  useEffect(() => {
    const isTextEntryTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(target.closest('input, textarea, select, [role="combobox"], [contenteditable="true"]'));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;
      if (!isMeta) return;
      if (isTextEntryTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === 'j') {
        event.preventDefault();
        if (showChatWidget) {
          setShowChatWidget(false);
        } else {
          openCodingAssistPopup();
        }
        return;
      }

      if (key === 'a' && !isMobile) {
        event.preventDefault();
        selectAllDesktopRows();
        return;
      }

      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      if (key === 'y' || (key === 'z' && event.shiftKey)) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, openCodingAssistPopup, redo, selectAllDesktopRows, showChatWidget, undo]);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Every entry to the scoring workspace starts with an explicit data-source choice.
  useEffect(() => {
    const timer = window.setTimeout(() => setShowWelcomeModal(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHomeLinkClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === '/') {
        setShowWelcomeModal(true);
      }
    };

    document.addEventListener('click', handleHomeLinkClick, true);
    return () => document.removeEventListener('click', handleHomeLinkClick, true);
  }, []);

  // Handle welcome modal actions
  const handleNewStart = () => {
    setShowWelcomeModal(false);
  };

  const handleLoadSample = () => {
    loadSampleData();
    setShowWelcomeModal(false);
  };

  const handleLoadSaved = () => {
    const savedData = load();
    if (savedData) {
      loadData(savedData);
      showScoringInputWarnings(savedData);
    }
    setShowWelcomeModal(false);
  };

  // Handle reset
  const handleReset = () => {
    reset();
    clear();
    setShowResetModal(false);
    showToast({
      type: 'success',
      title: t('toast.resetComplete.title'),
      message: t('toast.resetComplete.message')
    });
  };

  // Handle calculate
  const handleCalculate = () => {
    if (isCalculating) return;

    if (showScoringInputWarnings(responses)) return;

    if (validResponseCount < 14) {
      showToast({
        type: 'warning',
        title: t('toast.validity.title'),
        message: t('toast.validity.message')
      });
      return;
    }

    calculate();
  };

  // Handle CSV export
  const handleExportRawData = () => {
    exportToCSV(responses);
    setShowDownloadModal(false);
  };

  // Scroll to results when they are shown
  useEffect(() => {
    if (showResult) {
      const resultsContainer = document.getElementById('results-container');
      if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [showResult]);

  const handleExportSummary = () => {
    if (result?.data) {
      exportSummaryToCSV(result.data);
      setShowDownloadModal(false);
    }
  };

  const copyTextToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const handleCopySummaryForInterpretation = () => {
    if (!result?.data) return;

    const summaryData = result.data;
    void (async () => {
      try {
        await copyTextToClipboard(generateSummaryCsv(summaryData));
        showToast({
          type: 'success',
          title: pageUi.copySummarySuccessTitle,
          message: pageUi.copySummarySuccessMessage,
        });
      } catch (error) {
        console.error('Summary copy error:', error);
        showToast({
          type: 'error',
          title: pageUi.copySummaryErrorTitle,
          message: pageUi.copySummaryErrorMessage,
        });
      }
    })();
  };

  const handleExportPdf = () => {
    if (!result?.data || isExportingPdf) return;

    setIsExportingPdf(true);
    void (async () => {
      try {
        await exportToPdf();
        setShowDownloadModal(false);
      } catch (error) {
        console.error('PDF export error:', error);
        showToast({
          type: 'error',
          title: pageUi.pdfErrorTitle,
          message: pageUi.pdfErrorMessage,
        });
      } finally {
        setIsExportingPdf(false);
      }
    })();
  };

  const inputActionButtons = (
    <div className="ui-input-action-buttons flex flex-wrap items-center justify-center gap-3 print:hidden">
      <Button
        variant="primary"
        size="lg"
        onClick={handleCalculate}
        disabled={isCalculating || validResponseCount === 0}
      >
        {isCalculating ? (
          <>
            <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
            {t('loader.calculating')}
          </>
        ) : (
          <>
            <CalculatorIcon className="w-5 h-5 mr-2" />
            {t('buttons.calculate')}
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => setShowResetModal(true)}
      >
        <ArrowPathIcon className="w-5 h-5 mr-2" />
        {t('buttons.reset')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-[var(--brand-page)]">
      {/* Main Content */}
      <div className="relative z-10">
        <main data-nosnippet className={`ui-scoring-page-main ${showResult ? 'max-w-7xl px-4 sm:px-6 lg:px-8' : 'max-w-[112rem] px-3 sm:px-4 lg:pl-2 lg:pr-1 2xl:px-8'} mx-auto py-6`}>
          {!showResult ? (
            // Input Section
            <div className="space-y-6">
              <>
                {/* Input Table */}
                <div className="print:hidden">
                  {isMobile ? (
                    <div className="space-y-6">
                      <MobileCard
                        responses={responses}
                        onChange={setResponses}
                        currentIndex={activeMobileRowIndex}
                        onCurrentIndexChange={setActiveMobileRowIndex}
                        onAddRowRequest={handleInsertRequest}
                        onDeleteRowsRequest={handleDeleteRequest}
                      />
                      {inputActionButtons}
                    </div>
                  ) : (
                    <InputTable
                      responses={responses}
                      onChange={setResponses}
                      selectedRowIndices={selectedRowIndices}
                      onRowSelection={handleDesktopRowSelection}
                      onAddRowRequest={handleInsertRequest}
                      onDeleteRowsRequest={handleDeleteRequest}
                      actions={inputActionButtons}
                    />
                  )}
                </div>
              </>
            </div>
          ) : (
            // Result Section
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden overflow-x-auto p-2">
                <Button variant="secondary" onClick={backToInput}>
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  {t('buttons.backToInput')}
                </Button>
                <Button variant="secondary" onClick={() => setShowDownloadModal(true)}>
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  {pageUi.downloadButton}
                </Button>
                <Button variant="secondary" onClick={handleCopySummaryForInterpretation}>
                  <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                  {pageUi.copySummaryButton}
                </Button>
              </div>

              {/* Result Tabs */}
              <div className="print:hidden overflow-x-auto">
                <div className="inline-flex min-w-max rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] p-1 shadow-sm">
                  {(['upper', 'lower', 'special'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-[var(--brand-700)] text-[var(--on-brand)] shadow-sm'
                          : 'text-[var(--text-body)] hover:bg-[var(--surface-muted)] hover:text-[var(--brand-700)]'
                      }`}
                    >
                      {t(`result.tabs.${tab}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Content */}
              {result?.success && result.data && (
                <Suspense fallback={null}>
                  <div id="results-container">
                    <div className={activeTab === 'upper' ? '' : 'hidden print:block'}>
                      <UpperSection data={result.data.upper_section} />
                    </div>
                    <div className={activeTab === 'lower' ? '' : 'hidden print:block'}>
                      <LowerSection data={result.data.lower_section} specialIndices={result.data.special_indices} />
                    </div>
                    <div className={activeTab === 'special' ? '' : 'hidden print:block'}>
                      <SpecialIndices data={result.data.special_indices} />
                    </div>
                  </div>
                  <div
                    id="pdf-export-root"
                    className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] w-[794px] bg-white text-slate-900"
                    aria-hidden="true"
                  >
                    <div data-pdf-page="true" className="pdf-export-page pdf-export-page--first w-[794px] bg-white p-0">
                      <section className="pdf-export-half pdf-export-half--titled">
                        <div className="pdf-export-half-label pdf-section-title">Upper Section</div>
                        <div className="pdf-export-fit-box">
                          <div className="pdf-export-content pdf-export-content--upper" data-pdf-max-scale="1.03">
                            <UpperSection data={result.data.upper_section} />
                          </div>
                        </div>
                      </section>
                      <section className="pdf-export-half pdf-export-half--titled">
                        <div className="pdf-export-half-label pdf-section-title">Lower Section</div>
                        <div className="pdf-export-fit-box">
                          <div className="pdf-export-content pdf-export-content--lower" data-pdf-max-scale="1.38">
                            <PrintLowerSection
                              data={result.data.lower_section}
                              specialIndices={result.data.special_indices}
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                    <div data-pdf-page="true" className="pdf-export-page pdf-export-page--second w-[794px] bg-white p-0">
                      <section className="pdf-export-half pdf-export-half--titled">
                        <div className="pdf-export-half-label pdf-section-title">Special Indices</div>
                        <div className="pdf-export-fit-box">
                          <div className="pdf-export-content pdf-export-content--special" data-pdf-max-scale="1.28">
                            <PrintSpecialIndices data={result.data.special_indices} />
                          </div>
                        </div>
                      </section>
                      <section className="pdf-export-half">
                        <div className="pdf-export-fit-box">
                          <div className="pdf-export-content pdf-export-content--responses">
                            <h3 className="pdf-response-title pdf-section-title text-base font-semibold text-slate-800">{pageUi.responseNotesTitle}</h3>
                            <ul className="pdf-response-list mt-4">
                              {responseMemoGroups.map((group) => (
                                <li key={group.key} className="pdf-response-item rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                  <p className="pdf-response-card-label text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {group.cardLabel}
                                  </p>
                                  {group.responses.length > 0 ? (
                                    <ol className="pdf-response-card-list mt-1">
                                      {group.responses.map((text, index) => (
                                        <li key={`${group.key}-${index}`} className="pdf-response-card-entry text-sm leading-6 text-slate-700">
                                          {index > 0 ? <div className="pdf-response-entry-divider" aria-hidden="true" /> : null}
                                          <span className="pdf-response-card-text whitespace-pre-wrap">{text}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  ) : (
                                    <div className="pdf-response-card-empty mt-1" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </Suspense>
              )}

              {/* Error Message */}
              {result && !result.success && result.errors && (
                <Card variant="glass" padding="lg" className="max-w-lg mx-auto text-center">
                  <div className="text-red-500 mb-4">
                    <ExclamationTriangleIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--text-strong)]">
                    {t('errors.calculation')}
                  </h3>
                  <p className="text-[var(--text-body)]">
                    {result.errors.map(e => e.message).join('\n')}
                  </p>
                </Card>
              )}
            </div>
          )}
        </main>

      </div>

      {/* AI Chat Widget and Button */}
      {showChatWidget && (
        <Suspense fallback={null}>
          <ChatWidget
            isOpen={showChatWidget}
            onClose={() => {
              setShowChatWidget(false);
            }}
            workflow={
              codingAssistState
                ? {
                    mode: 'coding_assist',
                    starterMessage: codingAssistState.starterMessage,
                    context: codingAssistState.context,
                  }
                : null
            }
          />
        </Suspense>
      )}

      {showCodingAssistLauncher && (
        <>
          <button
            type="button"
            onClick={() => openCodingAssistPopup()}
            aria-label={pageUi.codingOpenButton}
            title={pageUi.codingOpenButton}
            className="ui-coding-assist-launcher inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-[var(--brand-700)] px-4 py-3 text-[var(--on-brand)] shadow-[0_12px_30px_rgba(36,72,114,0.35)] transition-all"
          >
            <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm font-semibold tracking-tight">{pageUi.codingOpenButton}</span>
          </button>
        </>
      )}

      {/* Welcome Modal */}
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        size="md"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <button
              onClick={handleNewStart}
              className="w-full rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-left transition-colors hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]"
            >
              <span className="font-semibold text-[var(--text-strong)]">{t('modal.welcome.new')}</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="w-full rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-left transition-colors hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]"
            >
              <span className="font-semibold text-[var(--text-strong)]">{t('modal.welcome.loadSample')}</span>
            </button>

            {hasSavedData() && (
              <button
                onClick={handleLoadSaved}
                className="w-full px-4 py-3 text-left rounded-xl border border-[var(--brand-200)] bg-[var(--brand-200)]/20 hover:bg-[var(--brand-200)]/30 transition-colors"
              >
                <span className="font-semibold text-[var(--brand-700)]">{t('modal.welcome.loadSaved')}</span>
                <span className="block text-sm text-[var(--brand-700)] mt-1">{t('modal.welcome.continueMsg')}</span>
              </button>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        size="md"
        title={pageUi.downloadTitle}
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleExportRawData}
            className="w-full rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-left transition-colors hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-100)] text-[var(--brand-700)]">
                <TableCellsIcon className="h-5 w-5" />
              </span>
              <p className="font-semibold text-[var(--text-strong)]">{pageUi.rawCsvLabel}</p>
            </div>
          </button>
          <button
            type="button"
            onClick={handleExportSummary}
            className="w-full rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-left transition-colors hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-100)] text-[var(--brand-700)]">
                <TableCellsIcon className="h-5 w-5" />
              </span>
              <p className="font-semibold text-[var(--text-strong)]">{pageUi.summaryCsvLabel}</p>
            </div>
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="w-full rounded-xl border border-[var(--border-subtle)] px-4 py-3 text-left transition-colors hover:border-[var(--brand-200)] hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-100)] text-[var(--brand-700)]">
                <PrinterIcon className="h-5 w-5" />
              </span>
              <p className="font-semibold text-[var(--text-strong)]">{pageUi.pdfLabel}</p>
            </div>
          </button>
        </div>
      </Modal>
      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={t('modal.reset.title')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[var(--text-body)]">{t('modal.reset.message')}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowResetModal(false)}>
              {t('buttons.no')}
            </Button>
            <Button variant="danger" onClick={handleReset}>
              {t('buttons.yes')}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={Boolean(pendingTableAction)}
        onClose={() => {
          setPendingTableAction(null);
          setTableActionPreferenceChecked(false);
        }}
        title={pendingTableAction?.type === 'delete-selection' ? pageUi.rowDeleteConfirmTitle : pageUi.rowInsertConfirmTitle}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-[var(--text-body)]">{pendingTableAction?.message}</p>
          <label className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-body)]">
            <input
              type="checkbox"
              checked={tableActionPreferenceChecked}
              onChange={(event) => setTableActionPreferenceChecked(event.target.checked)}
              className="h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--brand-700)] focus:ring-[var(--brand-500)]"
            />
            <span>{pageUi.skipTablePrompt}</span>
          </label>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setPendingTableAction(null);
                setTableActionPreferenceChecked(false);
              }}
            >
              {pageUi.cancel}
            </Button>
            <Button variant="primary" onClick={() => void confirmPendingTableAction()}>
              {pageUi.confirm}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}






