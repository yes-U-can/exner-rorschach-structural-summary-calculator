import type { Language } from '@/types';

export type KeyboardShortcutsUi = {
  title: string;
  description: string;
  toggleSidebar: string;
  undo: string;
  redo: string;
  selectAllRows: string;
  selectRowRange: string;
  toggleRowSelection: string;
  clickKey: string;
  zoomScoringCanvas: string;
  panScoringCanvas: string;
  mouseScrollKey: string;
  dragKey: string;
  toggleCodingAssistant: string;
  close: string;
};

const COPY: Record<Language, KeyboardShortcutsUi> = {
  ko: {
    title: '키보드 단축키',
    description: '사용할 수 있는 키보드 단축키 목록입니다.',
    toggleSidebar: '사이드바 열기/닫기',
    undo: '변경 취소',
    redo: '다시 실행',
    selectAllRows: '모든 반응 행 선택 (데스크톱)',
    selectRowRange: '연속 반응 행 범위 선택',
    toggleRowSelection: '개별 반응 행 추가/해제',
    clickKey: '클릭',
    zoomScoringCanvas: '채점 화면 확대/축소',
    panScoringCanvas: '채점 화면 이동',
    mouseScrollKey: '마우스 스크롤',
    dragKey: '드래그',
    toggleCodingAssistant: '코딩 도우미 열기/닫기',
    close: '닫기',
  },
  en: {
    title: 'Keyboard shortcuts',
    description: 'A list of available keyboard shortcuts.',
    toggleSidebar: 'Open/close sidebar',
    undo: 'Undo last edit',
    redo: 'Redo last edit',
    selectAllRows: 'Select all response rows (desktop)',
    selectRowRange: 'Select a continuous row range',
    toggleRowSelection: 'Add/remove an individual row',
    clickKey: 'Click',
    zoomScoringCanvas: 'Zoom scoring canvas',
    panScoringCanvas: 'Move scoring canvas',
    mouseScrollKey: 'Mouse scroll',
    dragKey: 'Drag',
    toggleCodingAssistant: 'Open/close coding helper',
    close: 'Close',
  },
  ja: {
    title: 'キーボードショートカット',
    description: '利用可能なキーボードショートカットの一覧です。',
    toggleSidebar: 'サイドバーを開く/閉じる',
    undo: '変更を元に戻す',
    redo: '変更をやり直す',
    selectAllRows: 'すべての反応行を選択（デスクトップ）',
    selectRowRange: '連続する反応行を範囲選択',
    toggleRowSelection: '個別の反応行を追加/解除',
    clickKey: 'クリック',
    zoomScoringCanvas: '採点画面を拡大/縮小',
    panScoringCanvas: '採点画面を移動',
    mouseScrollKey: 'マウススクロール',
    dragKey: 'ドラッグ',
    toggleCodingAssistant: 'コーディング補助を開く/閉じる',
    close: '閉じる',
  },
  es: {
    title: 'Atajos de teclado',
    description: 'Lista de atajos de teclado disponibles.',
    toggleSidebar: 'Abrir/cerrar barra lateral',
    undo: 'Deshacer cambio',
    redo: 'Rehacer cambio',
    selectAllRows: 'Seleccionar todas las filas (escritorio)',
    selectRowRange: 'Seleccionar un intervalo continuo de filas',
    toggleRowSelection: 'Añadir/quitar una fila individual',
    clickKey: 'Clic',
    zoomScoringCanvas: 'Ampliar/reducir el área de puntuación',
    panScoringCanvas: 'Desplazar el área de puntuación',
    mouseScrollKey: 'Desplazamiento del ratón',
    dragKey: 'Arrastrar',
    toggleCodingAssistant: 'Abrir/cerrar asistente de codificación',
    close: 'Cerrar',
  },
  pt: {
    title: 'Atalhos de teclado',
    description: 'Lista de atalhos de teclado disponíveis.',
    toggleSidebar: 'Abrir/fechar barra lateral',
    undo: 'Desfazer alteração',
    redo: 'Refazer alteração',
    selectAllRows: 'Selecionar todas as linhas (desktop)',
    selectRowRange: 'Selecionar um intervalo contínuo de linhas',
    toggleRowSelection: 'Adicionar/remover uma linha individual',
    clickKey: 'Clique',
    zoomScoringCanvas: 'Ampliar/reduzir a área de pontuação',
    panScoringCanvas: 'Mover a área de pontuação',
    mouseScrollKey: 'Rolagem do mouse',
    dragKey: 'Arrastar',
    toggleCodingAssistant: 'Abrir/fechar assistente de codificação',
    close: 'Fechar',
  },
};

export function getKeyboardShortcutsUi(language: Language): KeyboardShortcutsUi {
  return COPY[language] ?? COPY.ko;
}
