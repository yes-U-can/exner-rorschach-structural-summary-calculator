import type { Language } from '@/i18n/config';
import type { CodingAssistField } from '@/types';

type CodingAssistWidgetUi = {
  title: string;
  model: string;
  close: string;
  send: string;
  noContext: string;
  placeholder: string;
  proposalTitle: string;
  questionsTitle: string;
  apply: string;
  citationTitle: string;
  citationOpen: string;
  rowLabel: string;
  focusRowLabel: string;
  selectedRowsLabel: string;
  linkedSession: string;
  streamInterrupted: string;
  serverFallbackError: string;
  modelCatalogFallback: string;
  confidence: {
    low: string;
    medium: string;
    high: string;
  };
};

const FIELD_LABELS: Record<Language, Record<CodingAssistField, string>> = {
  ko: {
    location: 'Location',
    dq: 'DQ',
    determinants: 'Determinants',
    fq: 'FQ',
    pair: 'Pair',
    contents: 'Contents',
    popular: 'P',
    z: 'Z',
    specialScores: 'Special Score',
  },
  en: {
    location: 'Location',
    dq: 'DQ',
    determinants: 'Determinants',
    fq: 'FQ',
    pair: 'Pair',
    contents: 'Contents',
    popular: 'P',
    z: 'Z',
    specialScores: 'Special Score',
  },
  ja: {
    location: 'Location',
    dq: 'DQ',
    determinants: 'Determinants',
    fq: 'FQ',
    pair: 'Pair',
    contents: 'Contents',
    popular: 'P',
    z: 'Z',
    specialScores: 'Special Score',
  },
  es: {
    location: 'Location',
    dq: 'DQ',
    determinants: 'Determinants',
    fq: 'FQ',
    pair: 'Pair',
    contents: 'Contents',
    popular: 'P',
    z: 'Z',
    specialScores: 'Special Score',
  },
  pt: {
    location: 'Location',
    dq: 'DQ',
    determinants: 'Determinants',
    fq: 'FQ',
    pair: 'Pair',
    contents: 'Contents',
    popular: 'P',
    z: 'Z',
    specialScores: 'Special Score',
  },
};

const WIDGET_UI: Record<Language, CodingAssistWidgetUi> = {
  en: {
    title: 'Coding helper',
    model: 'AI Model',
    close: 'Close',
    send: 'Send message',
    noContext: 'No RESPONSE memo is linked right now. Fill a RESPONSE memo first, then reopen this tool.',
    placeholder: 'Add any observed context the AI should consider',
    proposalTitle: 'Coding proposals',
    questionsTitle: 'Follow-up questions',
    apply: 'Apply field',
    citationTitle: 'References',
    citationOpen: 'Open reference',
    rowLabel: 'Row',
    focusRowLabel: 'AI focus row',
    selectedRowsLabel: 'Selected rows',
    linkedSession: 'Linked to this RESPONSE row',
    streamInterrupted: '[Stream interrupted]',
    serverFallbackError: 'Failed to get response from server.',
    modelCatalogFallback:
      'Live model lookup is temporarily unavailable. Showing the safe fallback catalog instead. Reference ID: {requestId}',
    confidence: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
  },
  ko: {
    title: '코딩 도우미',
    model: 'AI 모델',
    close: '닫기',
    send: '메시지 보내기',
    noContext: '아직 연결된 RESPONSE 메모가 없습니다. 먼저 RESPONSE 메모를 입력한 뒤 다시 열어 주세요.',
    placeholder: 'AI가 함께 고려해야 할 맥락을 적어 주세요',
    proposalTitle: '부호화 제안',
    questionsTitle: '추가 확인 질문',
    apply: '이 필드 적용',
    citationTitle: '참조 문서',
    citationOpen: '참조 열기',
    rowLabel: '행',
    focusRowLabel: 'AI가 집중할 행',
    selectedRowsLabel: '선택된 행',
    linkedSession: '이 RESPONSE 행에 연결됨',
    streamInterrupted: '[응답 스트림이 중단되었습니다]',
    serverFallbackError: '서버에서 응답을 받지 못했습니다.',
    modelCatalogFallback:
      '실시간 모델 조회를 잠시 사용할 수 없어 안전한 기본 목록을 대신 표시하고 있습니다. 참고 ID: {requestId}',
    confidence: {
      low: '낮음',
      medium: '보통',
      high: '높음',
    },
  },
  ja: {
    title: 'コーディングヘルパー',
    model: 'AIモデル',
    close: '閉じる',
    send: '送信',
    noContext: '現在リンクされたRESPONSEメモがありません。先にRESPONSEメモを入力してから再度開いてください。',
    placeholder: 'AIが一緒に考慮すべき観察コンテキストを入力してください',
    proposalTitle: '符号化候補',
    questionsTitle: '追加確認質問',
    apply: 'このフィールドを適用',
    citationTitle: '参照文書',
    citationOpen: '参照を開く',
    rowLabel: '行',
    focusRowLabel: 'AIが注目する行',
    selectedRowsLabel: '選択行',
    linkedSession: 'このRESPONSE行にリンク済み',
    streamInterrupted: '[応答ストリームが中断されました]',
    serverFallbackError: 'サーバーから応答を取得できませんでした。',
    modelCatalogFallback:
      '現在、リアルタイムのモデル取得を使えないため、安全な基本カタログを代わりに表示しています。参照ID: {requestId}',
    confidence: {
      low: '低い',
      medium: '普通',
      high: '高い',
    },
  },
  es: {
    title: 'Asistente de codificación',
    model: 'Modelo de IA',
    close: 'Cerrar',
    send: 'Enviar',
    noContext: 'Todavía no hay una nota de RESPONSE vinculada. Completa la nota primero y vuelve a abrir esta herramienta.',
    placeholder: 'Agrega el contexto observado que la IA debe considerar',
    proposalTitle: 'Propuestas de codificación',
    questionsTitle: 'Preguntas de seguimiento',
    apply: 'Aplicar campo',
    citationTitle: 'Referencias',
    citationOpen: 'Abrir referencia',
    rowLabel: 'Fila',
    focusRowLabel: 'Fila de enfoque de IA',
    selectedRowsLabel: 'Filas seleccionadas',
    linkedSession: 'Vinculado a esta fila',
    streamInterrupted: '[La transmisión se interrumpió]',
    serverFallbackError: 'No se pudo obtener respuesta del servidor.',
    modelCatalogFallback:
      'La consulta en tiempo real de modelos no está disponible temporalmente. Se muestra el catálogo seguro de respaldo. ID de referencia: {requestId}',
    confidence: {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
    },
  },
  pt: {
    title: 'Assistente de codificação',
    model: 'Modelo de IA',
    close: 'Fechar',
    send: 'Enviar',
    noContext: 'Ainda não há uma nota de RESPONSE vinculada. Preencha a nota primeiro e abra esta ferramenta novamente.',
    placeholder: 'Adicione o contexto observado que a IA deve considerar',
    proposalTitle: 'Propostas de codificação',
    questionsTitle: 'Perguntas complementares',
    apply: 'Aplicar campo',
    citationTitle: 'Referências',
    citationOpen: 'Abrir referencia',
    rowLabel: 'Linha',
    focusRowLabel: 'Linha de foco da IA',
    selectedRowsLabel: 'Linhas selecionadas',
    linkedSession: 'Vinculado a esta linha',
    streamInterrupted: '[O fluxo foi interrompido]',
    serverFallbackError: 'Não foi possível obter resposta do servidor.',
    modelCatalogFallback:
      'A consulta em tempo real dos modelos está temporariamente indisponível. O catálogo seguro de contingência está sendo exibido. ID de referência: {requestId}',
    confidence: {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
    },
  },
};

export function getCodingAssistFieldLabels(language: string): Record<CodingAssistField, string> {
  return FIELD_LABELS[(language as Language) in FIELD_LABELS ? (language as Language) : 'en'];
}

export function getCodingAssistWidgetUi(language: string): CodingAssistWidgetUi {
  return WIDGET_UI[(language as Language) in WIDGET_UI ? (language as Language) : 'en'];
}
