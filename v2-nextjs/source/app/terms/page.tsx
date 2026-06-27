import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CopyPageButton from '@/components/common/CopyPageButton';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type TermsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

type TermsSection = {
  heading: string;
  paragraphs: string[];
};

type TermsContent = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: TermsSection[];
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of service for using this website.',
  alternates: {
    canonical: '/terms',
    languages: buildLanguageAlternates('/terms'),
  },
};

const CONTENT: Record<Language, TermsContent> = {
  ko: {
    title: '이용약관',
    effectiveDate: '시행일: 2026년 2월 15일',
    intro:
      '이 약관은 Exner(CS) 체계 로샤 구조요약 계산 웹앱을 사용할 때 적용되는 기본 조건을 설명합니다. 이 서비스는 구조요약 계산, 참조 문서 검색, BYOK 기반 코딩 도우미와 해석 도우미를 제공하며, 플랫폼 자체 결제나 크레딧, 월정액, 사용자 스킬북 스토어는 제공하지 않습니다.',
    sections: [
      {
        heading: '서비스 범위',
        paragraphs: [
          '구조요약 계산과 참조 문서 검색은 별도의 계정 없이 사용할 수 있습니다. AI 기능인 코딩 도우미와 해석 도우미는 사용자가 OpenAI API 키를 이번 세션에 입력한 경우에만 사용할 수 있습니다.',
          '이 서비스는 로샤 검사 구조요약 계산과 학습, 검토를 돕기 위한 도구입니다. 검사 실시, 공식 진단, 치료 결정, 법적·행정적 판단을 대신하는 서비스가 아닙니다.',
        ],
      },
      {
        heading: 'BYOK 기반 AI 기능',
        paragraphs: [
          'BYOK는 사용자가 자신의 API 키를 직접 연결해서 쓰는 방식입니다. API 키 사용 요금, 쿼터, 응답 정책, 장애, 모델 접근 권한은 사용자가 선택한 외부 AI 제공자의 약관과 정책을 따릅니다.',
          '입력한 API 키는 서버 DB에 저장되지 않고 24시간짜리 HttpOnly 쿠키에 암호화되어 보관됩니다. 사용자는 언제든 AI 세션을 종료해 쿠키와 임시 대화 상태를 삭제할 수 있습니다.',
        ],
      },
      {
        heading: 'AI 응답과 사용자 책임',
        paragraphs: [
          'AI 응답은 참고와 검토를 돕기 위한 자료입니다. AI가 제안한 부호화 후보나 해석 가설은 반드시 사용자의 전문적 판단으로 다시 확인해야 하며, 공식 진단이나 독립적인 임상 판단을 대체하지 않습니다.',
          '최종 해석과 사용 책임은 항상 사용자에게 있습니다. 사용자는 피검자의 실제 반응 맥락, 검사 상황, 문화적 배경, 임상적 관찰을 함께 고려해 AI 응답을 비판적으로 검토해야 합니다.',
        ],
      },
      {
        heading: '금지되는 사용',
        paragraphs: [
          '타인의 API 키를 무단으로 사용하거나 공유해서는 안 됩니다. 서비스 운영을 방해하거나 보안 취약점을 악용하거나 법령을 위반하는 방식으로 서비스를 사용할 수 없습니다.',
          '피검자를 직접 식별할 수 있는 개인정보나 불필요하게 민감한 정보를 AI 대화에 입력하지 않는 것을 권장합니다. 사용자는 자신이 입력하는 자료의 비식별화와 관리에 주의해야 합니다.',
        ],
      },
      {
        heading: '문의',
        paragraphs: [
          '서비스 운영, 오류, 약관 관련 문의는 mow.coding@gmail.com 으로 보낼 수 있습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    effectiveDate: 'Effective Date: February 15, 2026',
    intro:
      'These Terms explain the basic conditions for using the Rorschach Structural Summary web app. The current service is BYOK-session based, not account based.',
    sections: [
      {
        heading: 'Service scope',
        paragraphs: [
          'Structural Summary calculation and reference-document search can be used without an account. The interpretation helper and coding helper are available only after the user enters an OpenAI API key.',
          'AI features run only through the OpenAI API key entered by the user; the service does not sell a separate AI subscription or usage account.',
        ],
      },
      {
        heading: 'BYOK-based AI features',
        paragraphs: [
          'BYOK means that the user connects and uses their own API key. Model costs, quotas, response policies, and outages are governed by the external provider selected by the user.',
          'The entered API key is encrypted into a 24-hour HttpOnly cookie and is not stored in the server database. Users may end the AI session at any time to clear the cookie.',
        ],
      },
      {
        heading: 'AI responses and responsibility',
        paragraphs: [
          'AI responses are reference and review support only. They do not replace independent clinical judgment, formal diagnosis, or professional responsibility.',
          'Final interpretation and responsibility always remain with the user. Users should review AI output critically and combine it with their own professional judgment.',
        ],
      },
      {
        heading: 'Prohibited use',
        paragraphs: [
          'Users must not use or share another person’s API key without authorization. Users must not disrupt service operations, exploit security weaknesses, or use the service in violation of applicable law.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For service, error, or terms-related questions, contact mow.coding@gmail.com.',
        ],
      },
    ],
  },
  ja: {
    title: '利用規約',
    effectiveDate: '施行日: 2026年2月15日',
    intro:
      '本規約は、ロールシャッハ構造要約Webアプリの利用条件を説明します。現在のサービスはアカウント方式ではなく、BYOKセッション方式です。',
    sections: [
      {
        heading: 'サービス範囲',
        paragraphs: [
          '構造要約の計算と参照文書検索はアカウントなしで利用できます。解釈ヘルパーとコーディングヘルパーは、OpenAIのAPIキーを入力した場合のみ利用できます。',
          'AI機能は利用者が入力したOpenAIのAPIキーでのみ動作し、別途のAI利用権や決済アカウントは提供しません。',
        ],
      },
      {
        heading: 'BYOKベースのAI機能',
        paragraphs: [
          'BYOKは、利用者が自分のAPIキーを接続して使う方式です。モデル費用、クォータ、応答方針、障害は、利用者が選んだ外部提供者の条件に従います。',
          '入力されたAPIキーは24時間のHttpOnly Cookieに暗号化され、サーバーDBには保存されません。利用者はいつでもAIセッションを終了してCookieを削除できます。',
        ],
      },
      {
        heading: 'AI応答と責任',
        paragraphs: [
          'AI応答は参照と確認のための補助資料です。独立した臨床判断、正式な診断、専門的責任を代替しません。',
          '最終的な解釈と責任は常に利用者にあります。AI出力は批判的に確認し、専門的判断と合わせて利用してください。',
        ],
      },
      {
        heading: '禁止される利用',
        paragraphs: [
          '他人のAPIキーを無断で使用または共有してはいけません。サービス運営を妨害したり、脆弱性を悪用したり、法令に違反する形で利用してはいけません。',
        ],
      },
      {
        heading: '問い合わせ',
        paragraphs: [
          'サービス、エラー、規約に関する問い合わせは mow.coding@gmail.com までお送りください。',
        ],
      },
    ],
  },
  es: {
    title: 'Términos de Servicio',
    effectiveDate: 'Fecha de entrada en vigor: 15 de febrero de 2026',
    intro:
      'Estos términos explican las condiciones básicas para usar la aplicación web de Structural Summary para Rorschach. El servicio actual se basa en sesiones BYOK, no en cuentas de usuario.',
    sections: [
      {
        heading: 'Alcance del servicio',
        paragraphs: [
          'El cálculo del Structural Summary y la búsqueda de documentos de referencia pueden usarse sin cuenta. El asistente de interpretación y el asistente de codificación están disponibles solo después de introducir una clave API de OpenAI.',
          'Las funciones de IA funcionan únicamente con la clave API de OpenAI introducida por la persona usuaria; el servicio no vende una suscripción de IA ni una cuenta de uso separada.',
        ],
      },
      {
        heading: 'Funciones de IA basadas en BYOK',
        paragraphs: [
          'BYOK significa que la persona usuaria conecta y usa su propia clave API. Costes, cuotas, políticas de respuesta e interrupciones dependen del proveedor externo elegido.',
          'La clave API introducida se cifra en una cookie HttpOnly de 24 horas y no se guarda en la base de datos del servidor. La persona usuaria puede finalizar la sesión de IA en cualquier momento para borrar la cookie.',
        ],
      },
      {
        heading: 'Respuestas de IA y responsabilidad',
        paragraphs: [
          'Las respuestas de IA son solo apoyo de referencia y revisión. No sustituyen juicio clínico independiente, diagnóstico formal ni responsabilidad profesional.',
          'La interpretación final y la responsabilidad permanecen siempre en la persona usuaria. Las respuestas de IA deben revisarse críticamente y combinarse con criterio profesional.',
        ],
      },
      {
        heading: 'Uso prohibido',
        paragraphs: [
          'No se debe usar ni compartir la clave API de otra persona sin autorización. Tampoco se debe interferir con el servicio, explotar vulnerabilidades ni usarlo contra la ley aplicable.',
        ],
      },
      {
        heading: 'Contacto',
        paragraphs: [
          'Para preguntas sobre el servicio, errores o estos términos, contacte mow.coding@gmail.com.',
        ],
      },
    ],
  },
  pt: {
    title: 'Termos de Serviço',
    effectiveDate: 'Data de entrada em vigor: 15 de fevereiro de 2026',
    intro:
      'Estes termos explicam as condições básicas para usar o aplicativo web de Structural Summary para Rorschach. O serviço atual usa sessões BYOK, não contas de usuário.',
    sections: [
      {
        heading: 'Escopo do serviço',
        paragraphs: [
          'O cálculo do Structural Summary e a busca de documentos de referência podem ser usados sem conta. O assistente de interpretação e o assistente de codificação ficam disponíveis somente após inserir uma chave API da OpenAI ou do Google.',
          'Os recursos de IA funcionam somente com a chave API da OpenAI ou do Google inserida pela pessoa usuária; o serviço não vende uma assinatura de IA nem uma conta de uso separada.',
        ],
      },
      {
        heading: 'Recursos de IA baseados em BYOK',
        paragraphs: [
          'BYOK significa que a pessoa usuária conecta e usa sua própria chave API. Custos, cotas, políticas de resposta e indisponibilidades dependem do provedor externo escolhido.',
          'A chave API inserida é criptografada em um cookie HttpOnly de 24 horas e não é salva no banco de dados do servidor. A pessoa usuária pode encerrar a sessão de IA a qualquer momento para apagar o cookie.',
        ],
      },
      {
        heading: 'Respostas de IA e responsabilidade',
        paragraphs: [
          'As respostas de IA são apenas apoio para referência e revisão. Elas não substituem julgamento clínico independente, diagnóstico formal nem responsabilidade profissional.',
          'A interpretação final e a responsabilidade permanecem sempre com a pessoa usuária. As respostas de IA devem ser revisadas criticamente e combinadas com julgamento profissional.',
        ],
      },
      {
        heading: 'Uso proibido',
        paragraphs: [
          'Não se deve usar nem compartilhar a chave API de outra pessoa sem autorização. Também é proibido interferir no serviço, explorar vulnerabilidades ou usá-lo contra a lei aplicável.',
        ],
      },
      {
        heading: 'Contato',
        paragraphs: [
          'Para dúvidas sobre o serviço, erros ou estes termos, contate mow.coding@gmail.com.',
        ],
      },
    ],
  },
};

export default async function TermsPage({ searchParams }: TermsPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const content = CONTENT[activeLang];

  return (
    <div className="ui-page">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div
          id="terms-page-content"
          className="relative mx-auto max-w-4xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6 text-[var(--text-body)] shadow-sm sm:p-10"
        >
          <CopyPageButton
            language={activeLang}
            targetId="terms-page-content"
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
