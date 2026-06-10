import type { Language } from '@/i18n/config';

type ChatPageUi = {
  copiedDescription: string;
  inputPlaceholder: string;
  welcomeTitle: string;
  welcomeCopiedTitle: string;
  summaryCsvLabel: string;
  summaryCsvPlaceholder: string;
  summaryCsvReadyLabel: string;
  summaryCsvRequired: string;
  summaryCsvInvalid: string;
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
    welcomeTitle: 'Paste the Structural Summary values copied from the result screen,\nthen start by explaining the context you want the AI to consider.',
    welcomeCopiedTitle: 'Paste the Structural Summary values copied from the result screen,\nthen start by explaining the context you want the AI to consider.',
    summaryCsvLabel: 'Structural Summary values',
    summaryCsvPlaceholder: 'Summary values',
    summaryCsvReadyLabel: 'Entered ✅',
    summaryCsvRequired: 'Use only values copied with “Copy Structural Summary values” on the result screen.',
    summaryCsvInvalid: 'Use only values copied with “Copy Structural Summary values” on the result screen.',
    modelCatalogFallback:
      'Live model lookup is temporarily unavailable. Showing the safe fallback catalog instead. Reference ID: {requestId}',
  },
  ko: {
    copiedDescription:
      '복사된 내용에는 해석 검토에 사용할 구조요약 수치가 들어 있습니다.',
    inputPlaceholder: '예시: 31세 여성의 프로파일입니다. 정서조절과 대인관계는 어떻게 해석할 수 있을까요?',
    welcomeTitle: '결과 화면에서 복사한 구조요약 수치를 붙여넣고,\nAI에게 해석을 부탁할 맥락을 설명하며 대화를 시작하세요.',
    welcomeCopiedTitle: '결과 화면에서 복사한 구조요약 수치를 붙여넣고,\nAI에게 해석을 부탁할 맥락을 설명하며 대화를 시작하세요.',
    summaryCsvLabel: '구조요약 수치',
    summaryCsvPlaceholder: '구조요약 수치 입력',
    summaryCsvReadyLabel: '입력됨 ✅',
    summaryCsvRequired: '결과 화면의 “구조요약 값 복사하기” 버튼으로 복사한 값만 사용할 수 있습니다.',
    summaryCsvInvalid: '결과 화면의 “구조요약 값 복사하기” 버튼으로 복사한 값만 사용할 수 있습니다.',
    modelCatalogFallback:
      '실시간 모델 조회를 잠시 사용할 수 없어 안전한 기본 목록을 대신 표시하고 있습니다. 참고 ID: {requestId}',
  },
  ja: {
    copiedDescription:
      'コピーされた内容には、解釈検討に使う構造要約の数値が含まれています。',
    inputPlaceholder: '例: 31歳女性のプロフィールです。感情調整と対人関係はどう解釈できますか？',
    welcomeTitle: '結果画面でコピーした構造要約の数値を貼り付け、\nAIに解釈してほしい文脈を説明して対話を始めてください。',
    welcomeCopiedTitle: '結果画面でコピーした構造要約の数値を貼り付け、\nAIに解釈してほしい文脈を説明して対話を始めてください。',
    summaryCsvLabel: '構造要約の数値',
    summaryCsvPlaceholder: '構造要約値',
    summaryCsvReadyLabel: '入力済み ✅',
    summaryCsvRequired: '結果画面のコピー機能で取得した値だけを使用できます。',
    summaryCsvInvalid: '結果画面のコピー機能で取得した値だけを使用できます。',
    modelCatalogFallback:
      'リアルタイムのモデル取得を一時的に使えないため、安全な基本カタログを代わりに表示しています。参照ID: {requestId}',
  },
  es: {
    copiedDescription:
      'La copia incluye los valores del resumen estructural para la revisión interpretativa.',
    inputPlaceholder: 'Ejemplo: Es el perfil de una mujer de 31 años. ¿Cómo se pueden interpretar la regulación afectiva y lo interpersonal?',
    welcomeTitle: 'Pega los valores del resumen estructural copiados desde la pantalla de resultados\ny empieza explicando el contexto que quieres que la IA considere.',
    welcomeCopiedTitle: 'Pega los valores del resumen estructural copiados desde la pantalla de resultados\ny empieza explicando el contexto que quieres que la IA considere.',
    summaryCsvLabel: 'Valores del resumen estructural',
    summaryCsvPlaceholder: 'Valores del resumen',
    summaryCsvReadyLabel: 'Ingresado ✅',
    summaryCsvRequired: 'Solo se aceptan los valores copiados desde la pantalla de resultados.',
    summaryCsvInvalid: 'Solo se aceptan los valores copiados desde la pantalla de resultados.',
    modelCatalogFallback:
      'La consulta en tiempo real de modelos no está disponible temporalmente. Se muestra el catálogo seguro de respaldo. ID de referencia: {requestId}',
  },
  pt: {
    copiedDescription:
      'A cópia inclui os valores do resumo estrutural para revisão interpretativa.',
    inputPlaceholder: 'Exemplo: Este é o perfil de uma mulher de 31 anos. Como interpretar regulação afetiva e relações interpessoais?',
    welcomeTitle: 'Cole os valores do resumo estrutural copiados da tela de resultados\ne comece explicando o contexto que deseja que a IA considere.',
    welcomeCopiedTitle: 'Cole os valores do resumo estrutural copiados da tela de resultados\ne comece explicando o contexto que deseja que a IA considere.',
    summaryCsvLabel: 'Valores do resumo estrutural',
    summaryCsvPlaceholder: 'Valores do resumo',
    summaryCsvReadyLabel: 'Inserido ✅',
    summaryCsvRequired: 'Use apenas os valores copiados pela tela de resultados.',
    summaryCsvInvalid: 'Use apenas os valores copiados pela tela de resultados.',
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

