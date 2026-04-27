import type { Language } from '@/i18n/config';

type ChatPageUi = {
  copiedDescription: string;
  inputPlaceholder: string;
  welcomeTitle: string;
  welcomeCopiedTitle: string;
  attachFile: string;
  removeAttachment: string;
  attachmentTooLarge: string;
  attachmentReadFailed: string;
  attachmentReady: string;
  citationTitle: string;
  citationOpen: string;
  modelCatalogFallback: string;
};

type ChatRuntimeUi = {
  serverFallbackError: string;
  streamInterrupted: string;
};

const CHAT_PAGE_UI: Record<Language, ChatPageUi> = {
  en: {
    copiedDescription:
      'The copied snapshot includes structural-summary values for interpretation review.',
    inputPlaceholder: 'Example: This is a 31-year-old woman’s profile. How can affect regulation and interpersonal patterns be interpreted?',
    welcomeTitle: 'Attach a CSV file containing Structural Summary values, then start by explaining the context you want the AI to consider.',
    welcomeCopiedTitle: 'Attach or paste the Structural Summary values CSV, then explain the context you want the AI to consider.',
    attachFile: 'Attach CSV or text file',
    removeAttachment: 'Remove attachment',
    attachmentTooLarge: 'The file is too large. Please attach a CSV or text file under 48 KB.',
    attachmentReadFailed: 'The file could not be read. Please try another CSV or text file.',
    attachmentReady: 'Attached',
    citationTitle: 'References',
    citationOpen: 'Open reference',
    modelCatalogFallback:
      'Live model lookup is temporarily unavailable. Showing the safe fallback catalog instead. Reference ID: {requestId}',
  },
  ko: {
    copiedDescription:
      '복사된 내용에는 해석 검토에 사용할 구조요약 수치가 들어 있습니다.',
    inputPlaceholder: '예시: 31세 여성의 프로파일입니다. 정서조절과 대인관계는 어떻게 해석할 수 있을까요?',
    welcomeTitle: '구조요약 수치가 적힌 CSV 파일을 첨부하고, AI에게 해석을 부탁할 맥락을 설명하며 대화를 시작하세요.',
    welcomeCopiedTitle: '구조요약 수치가 적힌 CSV 파일을 첨부하고, AI에게 해석을 부탁할 맥락을 설명하며 대화를 시작하세요.',
    attachFile: 'CSV 또는 텍스트 파일 첨부',
    removeAttachment: '첨부 파일 제거',
    attachmentTooLarge: '파일이 너무 큽니다. 48KB 이하의 CSV 또는 텍스트 파일을 첨부해 주세요.',
    attachmentReadFailed: '파일을 읽지 못했습니다. 다른 CSV 또는 텍스트 파일로 다시 시도해 주세요.',
    attachmentReady: '첨부됨',
    citationTitle: '참조 문서',
    citationOpen: '참조 열기',
    modelCatalogFallback:
      '실시간 모델 조회를 잠시 사용할 수 없어 안전한 기본 목록을 대신 표시하고 있습니다. 참고 ID: {requestId}',
  },
  ja: {
    copiedDescription:
      'コピーされた内容には、解釈検討に使う構造要約の数値が含まれています。',
    inputPlaceholder: '例: 31歳女性のプロフィールです。感情調整と対人関係はどう解釈できますか？',
    welcomeTitle: '構造要約数値が入ったCSVファイルを添付し、AIに解釈してほしい文脈を説明して対話を始めてください。',
    welcomeCopiedTitle: '構造要約数値が入ったCSVファイルを添付し、AIに解釈してほしい文脈を説明して対話を始めてください。',
    attachFile: 'CSVまたはテキストファイルを添付',
    removeAttachment: '添付を削除',
    attachmentTooLarge: 'ファイルが大きすぎます。48KB以下のCSVまたはテキストファイルを添付してください。',
    attachmentReadFailed: 'ファイルを読み取れませんでした。別のCSVまたはテキストファイルでお試しください。',
    attachmentReady: '添付済み',
    citationTitle: '参照文書',
    citationOpen: '参照を開く',
    modelCatalogFallback:
      'リアルタイムのモデル取得を一時的に使えないため、安全な基本カタログを代わりに表示しています。参照ID: {requestId}',
  },
  es: {
    copiedDescription:
      'La copia incluye los valores del resumen estructural para la revisión interpretativa.',
    inputPlaceholder: 'Ejemplo: Es el perfil de una mujer de 31 años. ¿Cómo se pueden interpretar la regulación afectiva y lo interpersonal?',
    welcomeTitle: 'Adjunta un CSV con valores del resumen estructural y empieza explicando el contexto que quieres que la IA considere.',
    welcomeCopiedTitle: 'Adjunta o pega el CSV del resumen estructural y explica el contexto que quieres que la IA considere.',
    attachFile: 'Adjuntar CSV o texto',
    removeAttachment: 'Quitar adjunto',
    attachmentTooLarge: 'El archivo es demasiado grande. Adjunta un CSV o texto de menos de 48 KB.',
    attachmentReadFailed: 'No se pudo leer el archivo. Intenta con otro CSV o texto.',
    attachmentReady: 'Adjunto',
    citationTitle: 'Referencias',
    citationOpen: 'Abrir referencia',
    modelCatalogFallback:
      'La consulta en tiempo real de modelos no está disponible temporalmente. Se muestra el catálogo seguro de respaldo. ID de referencia: {requestId}',
  },
  pt: {
    copiedDescription:
      'A cópia inclui os valores do resumo estrutural para revisão interpretativa.',
    inputPlaceholder: 'Exemplo: Este é o perfil de uma mulher de 31 anos. Como interpretar regulação afetiva e relações interpessoais?',
    welcomeTitle: 'Anexe um CSV com os valores do resumo estrutural e comece explicando o contexto que deseja que a IA considere.',
    welcomeCopiedTitle: 'Anexe ou cole o CSV do resumo estrutural e explique o contexto que deseja que a IA considere.',
    attachFile: 'Anexar CSV ou texto',
    removeAttachment: 'Remover anexo',
    attachmentTooLarge: 'O arquivo é grande demais. Anexe um CSV ou texto com menos de 48 KB.',
    attachmentReadFailed: 'Não foi possível ler o arquivo. Tente outro CSV ou texto.',
    attachmentReady: 'Anexado',
    citationTitle: 'Referências',
    citationOpen: 'Abrir referência',
    modelCatalogFallback:
      'A consulta em tempo real dos modelos está temporariamente indisponível. O catálogo seguro de contingência está sendo exibido. ID de referência: {requestId}',
  },
};

const CHAT_RUNTIME_UI: Record<Language, ChatRuntimeUi> = {
  en: {
    serverFallbackError: 'Failed to get response from the server.',
    streamInterrupted: '[Stream interrupted]',
  },
  ko: {
    serverFallbackError: '서버에서 응답을 받지 못했습니다.',
    streamInterrupted: '[응답 스트림이 중단되었습니다]',
  },
  ja: {
    serverFallbackError: 'サーバーから応答を取得できませんでした。',
    streamInterrupted: '[応答ストリームが中断されました]',
  },
  es: {
    serverFallbackError: 'No se pudo obtener respuesta del servidor.',
    streamInterrupted: '[La transmisión se interrumpió]',
  },
  pt: {
    serverFallbackError: 'Não foi possível obter resposta do servidor.',
    streamInterrupted: '[O fluxo de resposta foi interrompido]',
  },
};

export function getChatPageUi(language: string): ChatPageUi {
  return CHAT_PAGE_UI[(language as Language) in CHAT_PAGE_UI ? (language as Language) : 'en'];
}

export function getChatRuntimeUi(language: string): ChatRuntimeUi {
  return CHAT_RUNTIME_UI[(language as Language) in CHAT_RUNTIME_UI ? (language as Language) : 'en'];
}
