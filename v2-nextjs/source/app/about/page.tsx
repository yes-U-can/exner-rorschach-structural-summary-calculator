import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CopyPageButton from '@/components/common/CopyPageButton';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type AboutPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

type PrincipleBlock = {
  title: string;
  paragraphs: string[];
};

type AboutContent = {
  title: string;
  introParagraphs: string[];
  frameworkTitle: string;
  frameworkLead: string;
  workshopSentence: string;
  workshopLabel: string;
  principles: PrincipleBlock[];
};

const WORKSHOP_URL = 'https://youtu.be/eDTxkJNUAHc?si=elrhVjFgQP0ZRggi';

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'About',
  description: 'About this service and its purpose.',
  alternates: {
    canonical: '/about',
    languages: buildLanguageAlternates('/about'),
  },
};

const CONTENT: Record<Language, AboutContent> = {
  ko: {
    title: '서비스 소개',
    introParagraphs: [
      '이 웹앱은 Exner(CS) 체계에 따른 로르샤흐 구조요약 계산과 참조문서 검색을 더 안정적으로 돕기 위해 만들었습니다. 구조요약 계산과 참조문서 검색은 계정 없이 사용할 수 있습니다.',
      'AI 기능은 로그인 계정이 아니라 BYOK 세션으로 동작합니다. 사용자가 OpenAI 또는 Google API 키를 입력하면, 그 키는 서버 DB에 저장되지 않고 24시간짜리 HttpOnly 쿠키에 암호화되어 보관됩니다.',
      'Neon DB는 사용자 계정이나 채팅 기록을 저장하는 용도가 아니라, 공개 가능한 참조문서 벡터 검색(RAG) 품질을 유지하는 용도로만 사용합니다.',
      'AI 도우미는 최종 판단자가 아니라 참고와 검토를 돕는 보조 도구입니다. 최종 해석과 임상적 책임은 항상 사용자에게 있습니다.',
    ],
    frameworkTitle: 'Human-in-the-Loop: 인간 중심 AI 원칙',
    frameworkLead:
      '이 서비스는 AI가 전문가를 대체하는 구조가 아니라, 사람이 더 분명한 기준 위에서 검토하고 판단하도록 돕는 구조를 목표로 합니다.',
    workshopSentence: '인간 중심 AI와 HITL에 대한 자세한 내용은 다음 링크에서 확인할 수 있습니다.',
    workshopLabel: '워크숍 영상 보기',
    principles: [
      {
        title: '1. 자율성과 설명 가능한 선택',
        paragraphs: [
          '사용자는 AI를 쓸지 말지를 선택할 수 있어야 하며, API 키가 어디에 저장되고 어떤 데이터가 외부 제공자에게 전송되는지 이해할 수 있어야 합니다.',
        ],
      },
      {
        title: '2. 이익과 위해 최소화',
        paragraphs: [
          'AI는 효율을 높일 수 있지만 오류가 날 수 있습니다. 따라서 AI 출력은 반드시 비판적으로 검토되어야 합니다.',
        ],
      },
      {
        title: '3. 개인정보 최소화',
        paragraphs: [
          '이 앱은 계정, API 키, 채팅 기록, 계산 데이터를 서버 DB에 저장하지 않는 방향으로 설계되어 있습니다. 서버에 남는 DB 데이터는 공개 참조문서 RAG 데이터입니다.',
        ],
      },
      {
        title: '4. 투명성과 검토 가능성',
        paragraphs: [
          'AI가 참고하는 참조문서를 공개하고, 사용자가 그 근거를 직접 확인할 수 있게 하는 것을 중요한 설계 원칙으로 둡니다.',
        ],
      },
      {
        title: '5. 전문적 책임',
        paragraphs: [
          '이 서비스는 학습과 검토를 위한 도구입니다. 공식 진단, 독립적인 임상 판단, 전문가 책임을 대체하지 않습니다.',
        ],
      },
    ],
  },
  en: {
    title: 'About',
    introParagraphs: [
      'This web app supports Exner (CS) Rorschach Structural Summary calculation and reference-document search. Calculation and reference search are available without creating an account.',
      'AI features use a BYOK session rather than a user account. When a user enters an OpenAI or Google API key, the key is encrypted into a 24-hour HttpOnly cookie and is not stored in the server database.',
      'Neon is retained only for public reference-document vector retrieval (RAG). It is not used as a user account, API-key, or chat-history database.',
      'The AI helper is a support tool for review and learning. It does not replace independent professional clinical judgment, formal diagnosis, or the user’s final responsibility.',
    ],
    frameworkTitle: 'Human-in-the-Loop: Human-Centered AI Principles',
    frameworkLead:
      'The service is designed to help people review and decide from clearer standards, not to let AI make final judgments in place of professionals.',
    workshopSentence: 'For more details on human-centered AI and HITL, see the following link.',
    workshopLabel: 'Watch the workshop video',
    principles: [
      {
        title: '1. Autonomy and understandable choice',
        paragraphs: [
          'Users should be able to choose whether to use AI and understand where their API key is held and what data may be sent to the selected provider.',
        ],
      },
      {
        title: '2. Benefit and harm reduction',
        paragraphs: [
          'AI may improve efficiency, but it can be inaccurate. Its output should always be reviewed critically.',
        ],
      },
      {
        title: '3. Data minimization',
        paragraphs: [
          'The app is designed not to store accounts, API keys, chat history, or calculator data in the server database. The remaining database scope is public reference RAG data.',
        ],
      },
      {
        title: '4. Transparency and reviewability',
        paragraphs: [
          'The service makes reference materials available so users can inspect the standards that guide AI-assisted answers.',
        ],
      },
      {
        title: '5. Professional accountability',
        paragraphs: [
          'The service is a learning and review aid. It does not replace formal diagnosis, independent clinical judgment, or professional responsibility.',
        ],
      },
    ],
  },
  ja: {
    title: 'サービス紹介',
    introParagraphs: [
      'このWebアプリは、Exner (CS) に基づくロールシャッハ構造要約の計算と参照文書検索を支援します。計算と参照文書検索はアカウントなしで利用できます。',
      'AI機能はログインアカウントではなくBYOKセッションで動作します。OpenAIまたはGoogleのAPIキーを入力すると、キーは24時間のHttpOnly Cookieに暗号化され、サーバーDBには保存されません。',
      'Neon DBは公開可能な参照文書のベクトル検索(RAG)のためだけに残しています。ユーザーアカウント、APIキー、チャット履歴の保存には使いません。',
      'AIヘルパーは最終判断者ではなく、確認と学習を助ける補助ツールです。最終的な解釈と責任は常に利用者にあります。',
    ],
    frameworkTitle: 'Human-in-the-Loop: 人間中心AIの原則',
    frameworkLead:
      'このサービスは、AIが専門家を代替するのではなく、人がより明確な基準に基づいて確認し判断できるよう支援することを目指します。',
    workshopSentence: '人間中心AIとHITLについての詳細は次のリンクで確認できます。',
    workshopLabel: 'ワークショップ動画を見る',
    principles: [
      {
        title: '1. 自律性と分かりやすい選択',
        paragraphs: [
          '利用者はAIを使うかどうかを選択でき、APIキーがどこに保持され、どの情報が外部提供者に送られる可能性があるかを理解できる必要があります。',
        ],
      },
      {
        title: '2. 利益とリスクの最小化',
        paragraphs: [
          'AIは効率を高める一方で誤る可能性があります。そのため出力は常に批判的に確認される必要があります。',
        ],
      },
      {
        title: '3. データ最小化',
        paragraphs: [
          'このアプリはアカウント、APIキー、チャット履歴、計算データをサーバーDBに保存しない設計です。DBに残る範囲は公開参照文書のRAGデータです。',
        ],
      },
      {
        title: '4. 透明性と検証可能性',
        paragraphs: [
          'AIが参照する基準を利用者が確認できるよう、参照文書を公開しています。',
        ],
      },
      {
        title: '5. 専門的責任',
        paragraphs: [
          'このサービスは学習と確認のための補助ツールであり、正式な診断や独立した臨床判断を代替しません。',
        ],
      },
    ],
  },
  es: {
    title: 'Presentación del servicio',
    introParagraphs: [
      'Esta aplicación apoya el cálculo del Structural Summary de Rorschach según Exner (CS) y la búsqueda de documentos de referencia. El cálculo y la búsqueda pueden usarse sin crear cuenta.',
      'Las funciones de IA usan una sesión BYOK, no una cuenta de usuario. Cuando se introduce una clave API de OpenAI o Google, la clave se cifra en una cookie HttpOnly de 24 horas y no se guarda en la base de datos del servidor.',
      'Neon se conserva solo para la recuperación vectorial de documentos públicos de referencia (RAG). No se usa como base de datos de cuentas, claves API ni historial de chat.',
      'El asistente de IA es una herramienta de apoyo para revisión y aprendizaje. No sustituye el juicio clínico profesional, el diagnóstico formal ni la responsabilidad final de la persona usuaria.',
    ],
    frameworkTitle: 'Human-in-the-Loop: principios de IA centrada en la persona',
    frameworkLead:
      'El servicio está diseñado para ayudar a revisar y decidir con criterios más claros, no para que la IA emita juicios finales en lugar de profesionales.',
    workshopSentence: 'Para más detalles sobre IA centrada en la persona y HITL, consulte el siguiente enlace.',
    workshopLabel: 'Ver video del taller',
    principles: [
      {
        title: '1. Autonomía y elección comprensible',
        paragraphs: [
          'Las personas usuarias deben poder decidir si usan IA y entender dónde se conserva su clave API y qué datos pueden enviarse al proveedor elegido.',
        ],
      },
      {
        title: '2. Beneficio y reducción de daño',
        paragraphs: [
          'La IA puede mejorar la eficiencia, pero también puede equivocarse. Sus respuestas deben revisarse críticamente.',
        ],
      },
      {
        title: '3. Minimización de datos',
        paragraphs: [
          'La app está diseñada para no guardar cuentas, claves API, historial de chat ni datos de cálculo en la base de datos del servidor. La base de datos queda limitada a datos RAG públicos de referencia.',
        ],
      },
      {
        title: '4. Transparencia y revisión',
        paragraphs: [
          'El servicio publica materiales de referencia para que las personas puedan inspeccionar los criterios que orientan las respuestas asistidas por IA.',
        ],
      },
      {
        title: '5. Responsabilidad profesional',
        paragraphs: [
          'El servicio es una ayuda para aprendizaje y revisión. No sustituye diagnóstico formal, juicio clínico independiente ni responsabilidad profesional.',
        ],
      },
    ],
  },
  pt: {
    title: 'Sobre o serviço',
    introParagraphs: [
      'Este aplicativo apoia o cálculo do Structural Summary de Rorschach segundo Exner (CS) e a busca de documentos de referência. O cálculo e a busca podem ser usados sem criar conta.',
      'Os recursos de IA usam uma sessão BYOK, não uma conta de usuário. Ao inserir uma chave API da OpenAI ou do Google, a chave é criptografada em um cookie HttpOnly de 24 horas e não é salva no banco de dados do servidor.',
      'O Neon permanece apenas para recuperação vetorial de documentos públicos de referência (RAG). Ele não é usado como banco de contas, chaves API ou histórico de chat.',
      'O assistente de IA é uma ferramenta de apoio para revisão e aprendizagem. Ele não substitui julgamento clínico profissional, diagnóstico formal nem a responsabilidade final da pessoa usuária.',
    ],
    frameworkTitle: 'Human-in-the-Loop: princípios de IA centrada na pessoa',
    frameworkLead:
      'O serviço foi desenhado para ajudar pessoas a revisar e decidir com critérios mais claros, não para que a IA assuma julgamentos finais no lugar de profissionais.',
    workshopSentence: 'Para mais detalhes sobre IA centrada na pessoa e HITL, veja o link a seguir.',
    workshopLabel: 'Ver vídeo do workshop',
    principles: [
      {
        title: '1. Autonomia e escolha compreensível',
        paragraphs: [
          'Usuários devem poder decidir se usam IA e entender onde a chave API é mantida e quais dados podem ser enviados ao provedor escolhido.',
        ],
      },
      {
        title: '2. Benefício e redução de danos',
        paragraphs: [
          'A IA pode aumentar a eficiência, mas também pode errar. Suas respostas devem ser revisadas criticamente.',
        ],
      },
      {
        title: '3. Minimização de dados',
        paragraphs: [
          'O app foi desenhado para não salvar contas, chaves API, histórico de chat ou dados de cálculo no banco do servidor. O banco fica limitado a dados RAG públicos de referência.',
        ],
      },
      {
        title: '4. Transparência e revisão',
        paragraphs: [
          'O serviço publica materiais de referência para que usuários possam verificar os critérios que orientam respostas assistidas por IA.',
        ],
      },
      {
        title: '5. Responsabilidade profissional',
        paragraphs: [
          'O serviço é uma ajuda para aprendizagem e revisão. Ele não substitui diagnóstico formal, julgamento clínico independente nem responsabilidade profissional.',
        ],
      },
    ],
  },
};

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const content = CONTENT[activeLang];

  return (
    <div className="ui-page">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div
          id="about-page-content"
          className="relative mx-auto max-w-4xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-6 text-[var(--text-body)] shadow-sm sm:p-10"
        >
          <CopyPageButton
            language={activeLang}
            targetId="about-page-content"
            className="absolute right-4 top-4 sm:right-6 sm:top-6"
          />
          <h1 className="pr-14 text-2xl font-bold text-[var(--text-strong)] sm:pr-16">{content.title}</h1>

          <div className="mt-6 space-y-4">
            {content.introParagraphs.map((paragraph, index) => (
              <p key={`intro-${index}`} className="text-[15px] leading-7 text-[var(--text-body)]">
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-6 sm:px-7 sm:py-8">
            <h2 className="text-xl font-semibold text-[var(--text-strong)]">{content.frameworkTitle}</h2>
            <p className="mt-3 text-[15px] leading-7 text-[var(--text-body)]">{content.frameworkLead}</p>
            <p className="mt-3 text-[15px] leading-7 text-[var(--text-body)]">
              {content.workshopSentence}{' '}
              <a
                href={WORKSHOP_URL}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--brand-700)] underline underline-offset-2"
              >
                {content.workshopLabel}
              </a>
              .
            </p>

            <div className="mt-8 divide-y divide-[var(--border-subtle)]">
              {content.principles.map((principle) => (
                <div key={principle.title} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-base font-semibold text-[var(--text-strong)]">{principle.title}</h3>
                  <div className="mt-3 space-y-3">
                    {principle.paragraphs.map((paragraph, index) => (
                      <p key={`${principle.title}-${index}`} className="text-[15px] leading-7 text-[var(--text-body)]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
