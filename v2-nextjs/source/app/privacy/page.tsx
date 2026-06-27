import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CopyPageButton from '@/components/common/CopyPageButton';
import { buildLanguageAlternates } from '@/lib/seo';
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

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for using this website.',
  alternates: {
    canonical: '/privacy',
    languages: buildLanguageAlternates('/privacy'),
  },
};

const CONTENT: Record<Language, PrivacyContent> = {
  ko: {
    title: '개인정보처리방침',
    effectiveDate: '시행일: 2026년 2월 15일',
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
          '서버 DB는 사용자의 개인정보나 검사자료를 보관하기 위한 용도로 사용하지 않습니다. 현재 서버 DB는 공개 가능한 참조문서의 검색과 RAG 처리를 지원하기 위한 데이터에 한정해 사용합니다.',
          '따라서 사용자 계정 정보, API 키, AI 대화 기록, 구조요약 계산 데이터는 서버 DB의 보관 대상이 아닙니다.',
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
    effectiveDate: 'Effective Date: February 15, 2026',
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
          'The server database is used only for public reference-document retrieval (RAG). User accounts, API keys, chat history, and calculator data are not stored in the server database.',
          'Production runtime should use the minimum DB permissions needed for reference retrieval.',
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
    effectiveDate: '施行日: 2026年2月15日',
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
          'サーバーDBは公開参照文書検索(RAG)のために必要な範囲でのみ使用されます。ユーザーアカウント、APIキー、チャット履歴、計算データはサーバーDBに保存されません。',
          '本番環境ではRAG検索用の読み取り専用DB権限を使うことを原則とします。',
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
    effectiveDate: 'Fecha de entrada en vigor: 15 de febrero de 2026',
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
          'La base de datos del servidor se usa solo en la medida necesaria para recuperar documentos públicos de referencia (RAG). Las cuentas, claves API, historial de chat y datos de cálculo no se guardan en la base de datos del servidor.',
          'En producción debe usarse un rol de base de datos de solo lectura para la recuperación RAG.',
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
    effectiveDate: 'Data de entrada em vigor: 15 de fevereiro de 2026',
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
          'O banco de dados do servidor é usado apenas na medida necessária para recuperar documentos públicos de referência (RAG). Contas, chaves API, histórico de chat e dados de cálculo não são salvos no banco de dados do servidor.',
          'Em produção, deve ser usado um papel de banco de dados somente leitura para recuperação RAG.',
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
    <div className="ui-page">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div
          id="privacy-page-content"
          className="relative mx-auto max-w-4xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6 text-[var(--text-body)] shadow-sm sm:p-10"
        >
          <CopyPageButton
            language={activeLang}
            targetId="privacy-page-content"
            className="absolute right-4 top-4 sm:right-6 sm:top-6"
          />
          <h1 className="pr-14 text-2xl font-bold text-[var(--text-strong)] sm:pr-16">{content.title}</h1>
          <p className="mt-3 text-sm text-[var(--text-soft)]">{content.effectiveDate}</p>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
