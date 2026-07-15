import type { Language } from '@/i18n/config';

type ChatPageUi = {
  copiedDescription: string;
  clinicalDisclaimer: string;
  inputPlaceholder: string;
  sendMessage: string;
  welcomeTitle: string;
  welcomeCopiedTitle: string;
  summaryCsvLabel: string;
  summaryCsvPlaceholder: string;
  summaryCsvReadyLabel: string;
  clearSummaryCsv: string;
  summaryCsvRequired: string;
  summaryCsvInvalid: string;
  modelCatalogFallback: string;
  conversationOutline: string;
  jumpToPrompt: string;
};

type ChatRuntimeUi = {
  serverFallbackError: string;
  streamInterrupted: string;
  responseLengthReached: string;
  responseTimedOut: string;
  stopGenerating: string;
  responseStopped: string;
};

const CHAT_PAGE_UI: Record<Language, ChatPageUi> = {
  en: {
    copiedDescription:
      'The copied snapshot includes structural-summary values for interpretation review.',
    clinicalDisclaimer: 'This service does not replace professional clinical judgment.',
    inputPlaceholder: 'This is a 31-year-old woman’s profile. How can affect regulation and interpersonal patterns be interpreted?',
    sendMessage: 'Send message',
    welcomeTitle: 'Paste the Structural Summary values copied from the result screen,\nthen start by explaining the context you want the AI to consider.',
    welcomeCopiedTitle: 'Paste the Structural Summary values copied from the result screen,\nthen start by explaining the context you want the AI to consider.',
    summaryCsvLabel: 'Structural Summary values',
    summaryCsvPlaceholder: 'Paste summary',
    summaryCsvReadyLabel: 'Entered',
    clearSummaryCsv: 'Clear Structural Summary values',
    summaryCsvRequired: 'Use only values copied with “Copy Structural Summary values” on the result screen.',
    summaryCsvInvalid: 'Use only values copied with “Copy Structural Summary values” on the result screen.',
    modelCatalogFallback:
      'Live model lookup is temporarily unavailable. Showing the safe fallback catalog instead. Reference ID: {requestId}',
    conversationOutline: 'Conversation outline',
    jumpToPrompt: 'Go to prompt',
  },
  ko: {
    copiedDescription:
      '복사된 내용에는 해석 검토에 사용할 구조요약 수치가 들어 있습니다.',
    clinicalDisclaimer: '본 서비스는 전문가의 임상 판단을 대체하지 않습니다.',
    inputPlaceholder: '31세 여성의 프로파일입니다. 정서조절과 대인관계는 어떻게 해석할 수 있을까요?',
    sendMessage: '메시지 보내기',
    welcomeTitle: '결과 화면에서 복사한 구조요약 수치를 붙여넣고,\nAI에게 해석을 부탁할 맥락을 설명하며 대화를 시작하세요.',
    welcomeCopiedTitle: '결과 화면에서 복사한 구조요약 수치를 붙여넣고,\nAI에게 해석을 부탁할 맥락을 설명하며 대화를 시작하세요.',
    summaryCsvLabel: '구조요약 수치',
    summaryCsvPlaceholder: '구조요약 붙여넣기',
    summaryCsvReadyLabel: '입력됨',
    clearSummaryCsv: '구조요약 수치 지우기',
    summaryCsvRequired: '결과 화면의 “구조요약 값 복사하기” 버튼으로 복사한 값만 사용할 수 있습니다.',
    summaryCsvInvalid: '결과 화면의 “구조요약 값 복사하기” 버튼으로 복사한 값만 사용할 수 있습니다.',
    modelCatalogFallback:
      '실시간 모델 조회를 잠시 사용할 수 없어 안전한 기본 목록을 대신 표시하고 있습니다. 참고 ID: {requestId}',
    conversationOutline: '대화 목차',
    jumpToPrompt: '질문으로 이동',
  },
  ja: {
    copiedDescription:
      'コピーされた内容には、解釈検討に使う構造要約の数値が含まれています。',
    clinicalDisclaimer: '本サービスは専門家による臨床判断に代わるものではありません。',
    inputPlaceholder: '31歳女性のプロフィールです。感情調整と対人関係はどう解釈できますか？',
    sendMessage: 'メッセージを送信',
    welcomeTitle: '結果画面でコピーした構造要約の数値を貼り付け、\nAIに解釈してほしい文脈を説明して対話を始めてください。',
    welcomeCopiedTitle: '結果画面でコピーした構造要約の数値を貼り付け、\nAIに解釈してほしい文脈を説明して対話を始めてください。',
    summaryCsvLabel: '構造要約の数値',
    summaryCsvPlaceholder: '構造要約を貼り付け',
    summaryCsvReadyLabel: '入力済み',
    clearSummaryCsv: '構造要約の数値を消去',
    summaryCsvRequired: '結果画面のコピー機能で取得した値だけを使用できます。',
    summaryCsvInvalid: '結果画面のコピー機能で取得した値だけを使用できます。',
    modelCatalogFallback:
      'リアルタイムのモデル取得を一時的に使えないため、安全な基本カタログを代わりに表示しています。参照ID: {requestId}',
    conversationOutline: '会話の目次',
    jumpToPrompt: '質問へ移動',
  },
  es: {
    copiedDescription:
      'La copia incluye los valores del resumen estructural para la revisión interpretativa.',
    clinicalDisclaimer: 'Este servicio no sustituye el juicio clínico profesional.',
    inputPlaceholder: 'Es el perfil de una mujer de 31 años. ¿Cómo se pueden interpretar la regulación afectiva y lo interpersonal?',
    sendMessage: 'Enviar mensaje',
    welcomeTitle: 'Pega los valores del resumen estructural copiados desde la pantalla de resultados\ny empieza explicando el contexto que quieres que la IA considere.',
    welcomeCopiedTitle: 'Pega los valores del resumen estructural copiados desde la pantalla de resultados\ny empieza explicando el contexto que quieres que la IA considere.',
    summaryCsvLabel: 'Valores del resumen estructural',
    summaryCsvPlaceholder: 'Pegar resumen',
    summaryCsvReadyLabel: 'Ingresado',
    clearSummaryCsv: 'Borrar valores del resumen',
    summaryCsvRequired: 'Solo se aceptan los valores copiados desde la pantalla de resultados.',
    summaryCsvInvalid: 'Solo se aceptan los valores copiados desde la pantalla de resultados.',
    modelCatalogFallback:
      'La consulta en tiempo real de modelos no está disponible temporalmente. Se muestra el catálogo seguro de respaldo. ID de referencia: {requestId}',
    conversationOutline: 'Índice de conversación',
    jumpToPrompt: 'Ir a la pregunta',
  },
  pt: {
    copiedDescription:
      'A cópia inclui os valores do resumo estrutural para revisão interpretativa.',
    clinicalDisclaimer: 'Este serviço não substitui o julgamento clínico profissional.',
    inputPlaceholder: 'Este é o perfil de uma mulher de 31 anos. Como interpretar regulação afetiva e relações interpessoais?',
    sendMessage: 'Enviar mensagem',
    welcomeTitle: 'Cole os valores do resumo estrutural copiados da tela de resultados\ne comece explicando o contexto que deseja que a IA considere.',
    welcomeCopiedTitle: 'Cole os valores do resumo estrutural copiados da tela de resultados\ne comece explicando o contexto que deseja que a IA considere.',
    summaryCsvLabel: 'Valores do resumo estrutural',
    summaryCsvPlaceholder: 'Colar resumo',
    summaryCsvReadyLabel: 'Inserido',
    clearSummaryCsv: 'Limpar valores do resumo',
    summaryCsvRequired: 'Use apenas os valores copiados pela tela de resultados.',
    summaryCsvInvalid: 'Use apenas os valores copiados pela tela de resultados.',
    modelCatalogFallback:
      'A consulta em tempo real dos modelos está temporariamente indisponível. O catálogo seguro de contingência está sendo exibido. ID de referência: {requestId}',
    conversationOutline: 'Índice da conversa',
    jumpToPrompt: 'Ir para a pergunta',
  },
};

const CHAT_RUNTIME_UI: Record<Language, ChatRuntimeUi> = {
  en: {
    serverFallbackError: 'Failed to get response from the server.',
    streamInterrupted: 'The response connection ended unexpectedly. Ask the assistant to continue if needed.',
    responseLengthReached: 'The response reached its length limit. Ask the assistant to continue if needed.',
    responseTimedOut: 'The response took too long and was stopped. Ask the assistant to continue if needed.',
    stopGenerating: 'Stop response generation',
    responseStopped: 'Response generation stopped.',
  },
  ko: {
    serverFallbackError: '서버에서 응답을 받지 못했습니다.',
    streamInterrupted: '응답 연결이 예기치 않게 끊겼습니다. 필요한 경우 이어서 답해 달라고 요청해 주세요.',
    responseLengthReached: '응답이 길이 한도에 도달했습니다. 필요한 경우 이어서 답해 달라고 요청해 주세요.',
    responseTimedOut: '응답 시간이 길어 자동으로 중지되었습니다. 필요한 경우 이어서 답해 달라고 요청해 주세요.',
    stopGenerating: '응답 생성 중지',
    responseStopped: '응답 생성을 중지했습니다.',
  },
  ja: {
    serverFallbackError: 'サーバーから応答を取得できませんでした。',
    streamInterrupted: '応答の接続が予期せず終了しました。必要であれば続きを依頼してください。',
    responseLengthReached: '回答が長さの上限に達しました。必要であれば続きを依頼してください。',
    responseTimedOut: '応答に時間がかかったため自動的に停止しました。必要であれば続きを依頼してください。',
    stopGenerating: '応答の生成を停止',
    responseStopped: '応答の生成を停止しました。',
  },
  es: {
    serverFallbackError: 'No se pudo obtener respuesta del servidor.',
    streamInterrupted: 'La conexión de la respuesta terminó de forma inesperada. Pide que continúe si es necesario.',
    responseLengthReached: 'La respuesta alcanzó el límite de longitud. Pide que continúe si es necesario.',
    responseTimedOut: 'La respuesta tardó demasiado y se detuvo. Pide que continúe si es necesario.',
    stopGenerating: 'Detener la generación',
    responseStopped: 'Se detuvo la generación de la respuesta.',
  },
  pt: {
    serverFallbackError: 'Não foi possível obter resposta do servidor.',
    streamInterrupted: 'A conexão da resposta terminou inesperadamente. Peça para continuar, se necessário.',
    responseLengthReached: 'A resposta atingiu o limite de tamanho. Peça para continuar, se necessário.',
    responseTimedOut: 'A resposta demorou demais e foi interrompida. Peça para continuar, se necessário.',
    stopGenerating: 'Interromper a geração',
    responseStopped: 'A geração da resposta foi interrompida.',
  },
};

export function getChatPageUi(language: string): ChatPageUi {
  return CHAT_PAGE_UI[(language as Language) in CHAT_PAGE_UI ? (language as Language) : 'en'];
}

export function getChatRuntimeUi(language: string): ChatRuntimeUi {
  return CHAT_RUNTIME_UI[(language as Language) in CHAT_RUNTIME_UI ? (language as Language) : 'en'];
}

