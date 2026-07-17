import type { Metadata } from 'next';
import { buildLocalizedPageMetadata, getSeoCopy } from '@/lib/seo';
import type { Language } from '@/types';

type PrivacyPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

type PolicySection = {
  heading: string;
  paragraphs: string[];
};

type PrivacyContent = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: PolicySection[];
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export async function generateMetadata({ searchParams }: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const language = normalizeLang(lang);
  const copy = getSeoCopy('privacy', language);
  return buildLocalizedPageMetadata({ language, pathname: '/privacy', ...copy });
}

const CONTENT: Record<Language, PrivacyContent> = {
  ko: {
    title: '개인정보처리방침',
    effectiveDate: '시행일: 2026년 7월 18일',
    intro:
      '이 문서는 현재 서비스가 어떤 데이터를 처리하고, 어떤 데이터를 서버에 저장하지 않는지 설명합니다. 이 서비스의 기본 원칙은 사용자 계정, API 키, AI 대화 기록, 구조요약 계산 데이터를 서버 DB에 지속적으로 저장하지 않는 것입니다.',
    sections: [
      {
        heading: '서버에 저장하지 않는 데이터',
        paragraphs: [
          '구조요약 계산 화면에 입력한 값은 사용자의 브라우저 저장소에만 임시 저장됩니다. 이 데이터는 서버 DB에 저장되지 않으며, 사용자가 브라우저 저장소를 지우거나 입력값을 초기화하면 삭제됩니다.',
          'AI 사용을 위해 입력한 API 키는 서버 DB에 저장되지 않습니다. API 키는 24시간짜리 HttpOnly 쿠키에 암호화되어 보관되고, AI 요청을 처리할 때 필요한 경우에만 서버에서 복호화됩니다.',
          'AI 대화 기록은 서버 DB에 저장되지 않습니다. 대화 내용은 현재 브라우저 세션 동안만 임시로 유지되며, AI 세션을 종료하거나 브라우저 세션이 종료되면 삭제될 수 있습니다.',
        ],
      },
      {
        heading: '서버 DB 사용 범위',
        paragraphs: [
          '공개 참조문서 검색(RAG)용 DB는 참조문서 벡터와 메타데이터에만 사용하며, 운영 환경에서는 읽기 전용 권한을 사용합니다. 사용자 계정 정보, API 키, AI 대화 기록, 구조요약 계산 데이터는 이 DB에 저장하지 않습니다.',
          '사용자가 선택적으로 제출한 AI 응답 평가는 아래에 설명한 별도의 피드백 DB에만 저장되며, RAG DB와 그 접근 권한을 공유하지 않습니다.',
        ],
      },
      {
        heading: '선택적 AI 응답 피드백',
        paragraphs: [
          '완료된 AI 답변 옆의 좋아요 또는 싫어요 버튼을 누르면 평가값과 선택한 사전 정의 이유 코드, 도우미 종류, 언어, 고정 모델·하네스 식별자, 완료 상태, 대략적인 답변 길이 구간, 무작위 응답 식별자가 별도의 피드백 DB로 전송됩니다. 평가와 이유 선택은 모두 선택 사항입니다.',
          '질문, AI 답변 원문, 자유 서술 의견, 반응 메모, 구조요약 수치, API 키, 계정 식별자, IP 주소, 사용자 에이전트는 피드백 요청이나 피드백 DB 행에 포함하지 않습니다.',
          '반복 요청으로 인한 남용을 막기 위해, 암호화된 AI 세션 안의 무작위 식별자를 서버 비밀키로 일방향 변환한 세션 키와 요청 횟수만 별도 피드백 DB에 최대 24시간 보관합니다. 평가의 저장·변경·삭제 요청은 분당 10회, 한 AI 세션당 60회로 제한됩니다.',
          '호스팅 단계의 자동 남용 방지는 짧은 시간의 요청 횟수를 제한하기 위해 IP 주소나 연결 특성을 일시적으로 사용할 수 있습니다. 앱은 이 정보를 피드백 DB에 저장하지 않습니다.',
          '현재 브라우저 세션에서 선택한 버튼을 다시 누르면 해당 평가와 이유 코드를 삭제합니다. 피드백 메타데이터는 최대 180일 뒤 만료되며, 만료된 기록은 제한된 묶음 단위로 정리됩니다.',
        ],
      },
      {
        heading: '외부 AI 제공자에게 전송될 수 있는 정보',
        paragraphs: [
          '사용자가 AI 응답을 요청하면, 답변 생성에 필요한 프롬프트, 현재 대화 문맥, 구조요약 수치 또는 채점 화면 맥락, 참조문서 일부가 사용자가 선택한 OpenAI로 전송될 수 있습니다.',
          '외부 AI 제공자의 데이터 처리 방식은 각 제공자의 약관과 개인정보 정책을 따릅니다. 사용자는 본인이 선택한 API 제공자의 정책을 확인하고, 민감한 개인정보나 불필요한 식별정보를 입력하지 않도록 주의해야 합니다.',
        ],
      },
      {
        heading: '보관과 삭제',
        paragraphs: [
          'BYOK 세션 쿠키는 최대 24시간 동안 유지됩니다. 사용자가 AI 세션 종료 버튼을 누르면 쿠키와 임시 대화 상태를 삭제합니다.',
          '브라우저에 저장된 계산 데이터와 임시 대화 내용은 사용자가 직접 삭제하거나 브라우저 저장소를 지울 때 삭제됩니다. 서버 DB에 저장된 사용자별 계산 기록이나 대화 기록은 없으므로, 별도의 서버 DB 삭제 절차를 두지 않습니다.',
        ],
      },
      {
        heading: '문의',
        paragraphs: [
          '서비스 운영, 오류 제보, 보안 관련 문의는 mow.coding@gmail.com 으로 보낼 수 있습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    effectiveDate: 'Effective Date: July 18, 2026',
    intro:
      'This policy explains what data is processed in the current BYOK-only architecture. The core principle is that user accounts, API keys, chat history, and calculator data are not stored in the server database.',
    sections: [
      {
        heading: 'Data processed',
        paragraphs: [
          'Values entered in the calculator are kept only in the user’s browser storage for temporary restore. They are not stored in the server database.',
          'API keys entered for AI use are not stored in the server database. They are encrypted into a 24-hour HttpOnly cookie and decrypted server-side only when processing an AI request.',
          'AI chat history is not stored in the server database. It is kept only for the browser session and may be deleted when the AI session or browser session ends.',
        ],
      },
      {
        heading: 'Server database scope',
        paragraphs: [
          'The public-reference RAG database is used only for reference vectors and metadata, with a read-only role in production. User accounts, API keys, chat history, and calculator data are not stored in that database.',
          'Optional AI response ratings are stored only in the separate feedback database described below. It does not share the RAG database or its access role.',
        ],
      },
      {
        heading: 'Optional AI response feedback',
        paragraphs: [
          'If a user presses the helpful or not-helpful button beside a completed AI answer, the service sends the rating and any selected predefined reason codes, assistant workflow, locale, fixed model and harness identifiers, completion class, coarse response-length range, and a random response identifier to a separate feedback database. Both the rating and reason selection are optional.',
          'The feedback request and feedback database row do not include the question, answer text, free-form comments, response memo, Structural Summary values, API key, account identifier, IP address, or user agent.',
          'To limit repeated-request abuse, the service stores only a one-way session key derived with a server secret from the random identifier inside the encrypted AI session, together with request counters. These records expire within 24 hours. Rating save, change, and delete requests are limited to 10 per minute and 60 per AI session.',
          'Automated abuse protection at the hosting edge may temporarily use an IP address or connection characteristics to limit short bursts of requests. The application does not store that information in the feedback database.',
          'Pressing the selected button again during the current browser session removes that rating and its reason codes. Feedback metadata expires after no more than 180 days, and expired records are removed in bounded batches.',
        ],
      },
      {
        heading: 'External AI providers',
        paragraphs: [
          'When a user requests an AI response, prompt text, current chat context, relevant calculator output, and reference-document context may be sent to OpenAI.',
          'Processing by the external provider is governed by that provider’s own terms and privacy policy. Users should review the policies of the API provider they choose.',
        ],
      },
      {
        heading: 'Retention and deletion',
        paragraphs: [
          'The BYOK cookie lasts for up to 24 hours. When the user ends the AI session, the cookie and temporary chat state are cleared.',
          'Calculator data stored in the browser remains until the user clears it or browser storage is removed.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For service, error, or security questions, contact mow.coding@gmail.com.',
        ],
      },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    effectiveDate: '施行日: 2026年7月18日',
    intro:
      '本ポリシーは、現在のBYOK-only構成で処理されるデータと保存場所を説明します。基本原則は、ユーザーアカウント、APIキー、チャット履歴、計算データをサーバーDBに保存しないことです。',
    sections: [
      {
        heading: '処理されるデータ',
        paragraphs: [
          '計算画面に入力された値は、一時的な復元のため利用者のブラウザ保存領域にのみ保持されます。サーバーDBには保存されません。',
          'AI利用のために入力されたAPIキーはサーバーDBに保存されません。24時間のHttpOnly Cookieに暗号化され、AIリクエスト処理時のみサーバー側で復号されます。',
          'AIチャット履歴はサーバーDBに保存されません。ブラウザセッション中だけ保持され、AIセッションまたはブラウザセッション終了時に削除されることがあります。',
        ],
      },
      {
        heading: 'サーバーDBの使用範囲',
        paragraphs: [
          '公開参照文書用のRAGデータベースは参照ベクトルとメタデータのみに使用し、本番環境では読み取り専用権限を使用します。ユーザーアカウント、APIキー、チャット履歴、計算データはこのデータベースに保存されません。',
          '任意で送信されたAI応答評価は、下記の専用フィードバックデータベースにのみ保存されます。RAGデータベースやそのアクセス権限とは共有されません。',
        ],
      },
      {
        heading: '任意のAI応答フィードバック',
        paragraphs: [
          '完了したAI回答の横にある「役に立った」または「役に立たなかった」ボタンを押すと、評価と選択した定型理由コード、アシスタントの種類、言語、固定のモデル・ハーネス識別子、完了状態、回答長のおおまかな区分、ランダムな応答識別子が専用フィードバックデータベースに送信されます。評価と理由の選択はいずれも任意です。',
          '質問、AI回答本文、自由記述の意見、応答メモ、構造一覧表の数値、APIキー、アカウント識別子、IPアドレス、ユーザーエージェントは、フィードバック要求やフィードバックデータベース行に含まれません。',
          '反復要求による不正利用を抑えるため、暗号化されたAIセッション内のランダムな識別子からサーバー秘密鍵で一方向変換したセッションキーと要求回数だけを、専用フィードバックデータベースに最長24時間保存します。評価の保存・変更・削除は1分あたり10回、1つのAIセッションあたり60回に制限されます。',
          'ホスティング段階の自動不正利用防止は、短時間の要求回数を制限するためIPアドレスや接続特性を一時的に使用する場合があります。アプリはその情報をフィードバックデータベースに保存しません。',
          '現在のブラウザセッション中に選択済みのボタンをもう一度押すと、その評価と理由コードは削除されます。フィードバックのメタデータは最長180日後に期限切れとなり、期限切れの記録は件数を制限した単位で削除されます。',
        ],
      },
      {
        heading: '外部AI提供者',
        paragraphs: [
          'AI応答を求めると、プロンプト、現在の会話文脈、関連する計算結果、参照文書文脈が、選択されたOpenAIに送信される場合があります。',
          '外部提供者での処理は各提供者の規約とプライバシーポリシーに従います。利用者は選択したAPI提供者の方針を確認してください。',
        ],
      },
      {
        heading: '保持と削除',
        paragraphs: [
          'BYOK Cookieは最大24時間保持されます。AIセッションを終了すると、Cookieと一時チャット状態が削除されます。',
          'ブラウザに保存された計算データは、利用者が削除するかブラウザ保存領域を消去するまで残ります。',
        ],
      },
      {
        heading: '問い合わせ',
        paragraphs: [
          'サービス運営、エラー、セキュリティに関するお問い合わせは mow.coding@gmail.com までご連絡ください。',
        ],
      },
    ],
  },
  es: {
    title: 'Política de Privacidad',
    effectiveDate: 'Fecha de entrada en vigor: 18 de julio de 2026',
    intro:
      'Esta política explica qué datos se procesan en la arquitectura BYOK-only actual. El principio central es no guardar cuentas, claves API, historial de chat ni datos de cálculo en la base de datos del servidor.',
    sections: [
      {
        heading: 'Datos procesados',
        paragraphs: [
          'Los valores introducidos en la calculadora se mantienen solo en el almacenamiento del navegador para restauración temporal. No se guardan en la base de datos del servidor.',
          'Las claves API introducidas para usar IA no se guardan en la base de datos del servidor. Se cifran en una cookie HttpOnly de 24 horas y se descifran en el servidor solo al procesar una solicitud de IA.',
          'El historial de chat de IA no se guarda en la base de datos del servidor. Se mantiene solo durante la sesión del navegador y puede borrarse al finalizar la sesión de IA o del navegador.',
        ],
      },
      {
        heading: 'Alcance de la base de datos del servidor',
        paragraphs: [
          'La base de datos RAG de referencias públicas se usa solo para vectores y metadatos de referencia, con un rol de solo lectura en producción. Las cuentas, claves API, historial de chat y datos de cálculo no se guardan en esa base de datos.',
          'Las valoraciones opcionales de respuestas de IA se guardan únicamente en la base de datos de feedback independiente descrita a continuación. No comparte la base de datos RAG ni su rol de acceso.',
        ],
      },
      {
        heading: 'Feedback opcional sobre respuestas de IA',
        paragraphs: [
          'Si se pulsa el botón de respuesta útil o no útil junto a una respuesta de IA terminada, el servicio envía la valoración y los códigos de motivos predefinidos seleccionados, el tipo de asistente, el idioma, los identificadores fijos del modelo y del arnés, el estado de finalización, un intervalo aproximado de longitud y un identificador aleatorio de respuesta a una base de datos de feedback independiente. Tanto la valoración como los motivos son opcionales.',
          'La solicitud y la fila de la base de datos de feedback no incluyen la pregunta, el texto de la respuesta, comentarios de texto libre, la nota de respuesta, valores del Resumen Estructural, la clave API, identificadores de cuenta, la dirección IP ni el agente de usuario.',
          'Para limitar el abuso por solicitudes repetidas, el servicio guarda solo una clave de sesión unidireccional derivada con un secreto del servidor del identificador aleatorio de la sesión de IA cifrada, junto con contadores de solicitudes. Estos registros caducan en un máximo de 24 horas. Las solicitudes para guardar, cambiar o eliminar una valoración se limitan a 10 por minuto y 60 por sesión de IA.',
          'La protección automatizada contra abusos en el alojamiento puede usar temporalmente la dirección IP o características de la conexión para limitar ráfagas breves de solicitudes. La aplicación no guarda esa información en la base de datos de feedback.',
          'Al pulsar de nuevo el botón seleccionado durante la sesión actual del navegador se eliminan esa valoración y sus códigos de motivos. Los metadatos caducan en un máximo de 180 días y los registros vencidos se eliminan en lotes limitados.',
        ],
      },
      {
        heading: 'Proveedores externos de IA',
        paragraphs: [
          'Cuando se solicita una respuesta de IA, el prompt, el contexto actual de chat, resultados relevantes de la calculadora y contexto de documentos de referencia pueden enviarse a OpenAI.',
          'El tratamiento por el proveedor externo se rige por sus propios términos y política de privacidad. La persona usuaria debe revisar las políticas del proveedor API que elija.',
        ],
      },
      {
        heading: 'Conservación y eliminación',
        paragraphs: [
          'La cookie BYOK dura hasta 24 horas. Al finalizar la sesión de IA, se eliminan la cookie y el estado temporal del chat.',
          'Los datos de la calculadora guardados en el navegador permanecen hasta que la persona usuaria los borre o se elimine el almacenamiento del navegador.',
        ],
      },
      {
        heading: 'Contacto',
        paragraphs: [
          'Para preguntas sobre el servicio, errores o seguridad, contacte mow.coding@gmail.com.',
        ],
      },
    ],
  },
  pt: {
    title: 'Política de Privacidade',
    effectiveDate: 'Data de entrada em vigor: 18 de julho de 2026',
    intro:
      'Esta política explica quais dados são processados na arquitetura BYOK-only atual. O princípio central é não salvar contas, chaves API, histórico de chat nem dados de cálculo no banco de dados do servidor.',
    sections: [
      {
        heading: 'Dados processados',
        paragraphs: [
          'Os valores inseridos na calculadora ficam apenas no armazenamento do navegador para restauração temporária. Eles não são salvos no banco de dados do servidor.',
          'As chaves API inseridas para usar IA não são salvas no banco de dados do servidor. Elas são criptografadas em um cookie HttpOnly de 24 horas e descriptografadas no servidor somente ao processar uma solicitação de IA.',
          'O histórico de chat de IA não é salvo no banco de dados do servidor. Ele fica apenas durante a sessão do navegador e pode ser apagado quando a sessão de IA ou do navegador termina.',
        ],
      },
      {
        heading: 'Escopo do banco de dados do servidor',
        paragraphs: [
          'O banco de dados RAG de referências públicas é usado somente para vetores e metadados de referência, com um papel somente leitura em produção. Contas, chaves API, histórico de chat e dados de cálculo não são salvos nesse banco de dados.',
          'As avaliações opcionais de respostas de IA são salvas apenas no banco de dados de feedback separado descrito abaixo. Ele não compartilha o banco de dados RAG nem seu papel de acesso.',
        ],
      },
      {
        heading: 'Feedback opcional sobre respostas de IA',
        paragraphs: [
          'Ao pressionar o botão de resposta útil ou não útil ao lado de uma resposta de IA concluída, o serviço envia a avaliação e os códigos de motivos predefinidos selecionados, o tipo de assistente, o idioma, os identificadores fixos do modelo e do harness, o estado de conclusão, uma faixa aproximada de tamanho e um identificador aleatório da resposta para um banco de dados de feedback separado. Tanto a avaliação quanto os motivos são opcionais.',
          'A solicitação e a linha do banco de dados de feedback não incluem a pergunta, o texto da resposta, comentários em texto livre, a nota de resposta, valores do Resumo Estrutural, a chave API, identificadores de conta, o endereço IP nem o agente de usuário.',
          'Para limitar abusos por solicitações repetidas, o serviço salva apenas uma chave de sessão unidirecional derivada com um segredo do servidor a partir do identificador aleatório da sessão de IA criptografada, junto com contadores de solicitações. Esses registros expiram em até 24 horas. Solicitações para salvar, alterar ou excluir uma avaliação são limitadas a 10 por minuto e 60 por sessão de IA.',
          'A proteção automatizada contra abusos na hospedagem pode usar temporariamente o endereço IP ou características da conexão para limitar rajadas curtas de solicitações. O aplicativo não salva essas informações no banco de dados de feedback.',
          'Pressionar novamente o botão selecionado durante a sessão atual do navegador remove a avaliação e seus códigos de motivos. Os metadados expiram em no máximo 180 dias e os registros expirados são removidos em lotes limitados.',
        ],
      },
      {
        heading: 'Provedores externos de IA',
        paragraphs: [
          'Quando uma resposta de IA é solicitada, prompt, contexto atual do chat, resultados relevantes da calculadora e contexto de documentos de referência podem ser enviados a OpenAI.',
          'O tratamento pelo provedor externo segue seus próprios termos e política de privacidade. A pessoa usuária deve revisar as políticas do provedor API escolhido.',
        ],
      },
      {
        heading: 'Retenção e exclusão',
        paragraphs: [
          'O cookie BYOK dura até 24 horas. Ao encerrar a sessão de IA, o cookie e o estado temporário do chat são apagados.',
          'Dados da calculadora salvos no navegador permanecem até que a pessoa usuária os apague ou o armazenamento do navegador seja removido.',
        ],
      },
      {
        heading: 'Contato',
        paragraphs: [
          'Para dúvidas sobre o serviço, erros ou segurança, contate mow.coding@gmail.com.',
        ],
      },
    ],
  },
};

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const content = CONTENT[activeLang];

  return (
    <div className="min-h-screen bg-[var(--brand-page)] text-[var(--text-body)]">
      <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <article
          id="privacy-page-content"
          className="relative"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <h1 className="text-2xl font-bold text-[var(--text-strong)]">{content.title}</h1>
            <p className="shrink-0 text-sm text-[var(--text-soft)]">{content.effectiveDate}</p>
          </div>
          <p className="mt-4 text-[15px] leading-7 text-[var(--text-body)]">{content.intro}</p>

          <div className="mt-8 space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-base font-bold text-[var(--text-strong)]">{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.heading}-${index}`} className="text-[15px] leading-7 text-[var(--text-body)]">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
