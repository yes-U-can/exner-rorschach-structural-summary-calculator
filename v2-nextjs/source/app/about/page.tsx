import type { Metadata } from 'next';
import { buildLocalizedPageMetadata, getSeoCopy } from '@/lib/seo';
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

const WORKSHOP_URL = 'https://youtu.be/eDTxkJNUAHc';

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export async function generateMetadata({ searchParams }: AboutPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const language = normalizeLang(lang);
  const copy = getSeoCopy('about', language);
  return buildLocalizedPageMetadata({ language, pathname: '/about', ...copy });
}

const CONTENT: Record<Language, AboutContent> = {
  ko: {
    title: '서비스 소개',
    introParagraphs: [
      'Exner 로샤 종합체계 구조요약 계산기는 로샤 검사의 종합체계(Comprehensive System, CS) 구조요약 계산을 보다 안정적이고 효율적으로 돕기 위해 만들어졌습니다. 반복적으로 입력하고 계산해야 하는 항목들을 한 흐름 안에서 정리할 수 있도록 구성되어 있으며, 사용자는 위치, 결정인, 형태질, 특수점수와 주요 지표를 한 화면에서 검토하면서 구조요약 작업을 진행할 수 있습니다. 이 서비스의 목적은 계산과 정리의 부담을 줄여, 임상심리사와 수련생이 더 중요한 검토와 판단에 집중할 수 있도록 돕는 데 있습니다.',
      '이 웹앱 안에는 구조요약 계산과 부호화 과정에서 참고할 수 있는 문서들도 함께 정리되어 있습니다. 여기서 말하는 참조 문서는 로샤 검사와 종합체계의 규칙, 개념, 변수, 부호화 기준 등을 주제별로 나누어 정리한 읽기 전용 참고 자료 모음입니다. MOW가 이 문서 체계와 검색 기능을 구축·관리하며, 계산 로직과 실제 사용 흐름을 검토하는 과정에는 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP)의 임상적 검토와 현장 피드백이 반영되었습니다. 사용자는 필요한 개념이나 규칙을 직접 검색할 수 있고, 웹앱의 AI 기능도 이 문서들을 참조하도록 설계되어 있습니다.',
      'AI 기능은 BYOK 방식으로만 사용할 수 있습니다. BYOK는 Bring Your Own Key의 약자로, 사용자가 본인의 OpenAI API 키를 직접 입력해 AI 기능을 사용하는 방식을 뜻합니다. 이 웹앱은 별도의 플랫폼 과금, 크레딧, 월정액, 자체 제공 AI 모델을 운영하지 않으며, 입력된 API 키를 서버 DB에 저장하지 않습니다. API 키는 이번 로그인 세션에서만 사용되도록 24시간짜리 HttpOnly 쿠키에 암호화되어 보관되고, AI 요청을 처리할 때 필요한 범위 안에서만 사용됩니다.',
      '이 서비스의 AI는 사용자가 입력한 질문, 현재 작업 맥락, 그리고 웹앱 안의 참조 문서를 함께 바탕으로 응답합니다. 코딩 도우미는 반응을 종합체계의 부호화 기준에 비추어 검토할 수 있도록 돕고, 해석 도우미는 구조요약 수치 CSV를 바탕으로 해석 가설을 점검할 수 있도록 돕습니다. 다만 이 서비스와 AI 기능은 어디까지나 참고와 보조를 위한 도구이며, 전문가의 독립적인 임상 판단이나 공식적인 진단을 대체하지 않습니다. 최종적인 해석과 책임은 언제나 사용자에게 있습니다.',
      '서비스의 기획, 설계, 개발, 배포, 기술 운영과 유지보수는 MOW가 맡습니다. 서울임상심리연구소(SICP)는 초기 계산 로직을 프로그램으로 옮기는 과정의 검토, 구조요약 수식과 산출 결과의 임상적 확인, 실제 사용 경험을 바탕으로 한 피드백을 제공했습니다. 서비스 운영, 오류 제보, 보안 관련 문의는 mow.coding@gmail.com 으로 보내주시면 됩니다.',
    ],
    frameworkTitle: '인간 중심 AI와 5대 윤리 원칙 기반 통합 프레임워크',
    frameworkLead:
      '이 웹앱은 AI가 전문가를 대신해 판단하도록 만들기보다, 임상심리사와 수련생이 더 분명한 기준 위에서 검토하고 판단하도록 돕는 방향을 목표로 설계되었습니다. 이러한 방향은 인간 중심 AI, Human-in-the-Loop(HITL), 그리고 APA, ACA, AMA, NASW 등 주요 전문직 윤리 원칙에서 공통적으로 강조하는 자율성, 선행, 기밀성, 공정성, 전문적 책임의 기준과 연결됩니다.',
    workshopSentence: '이 원칙과 연결되는 연구소 워크숍 자료 일부는 다음 링크에서 확인할 수 있습니다.',
    workshopLabel: '워크숍 영상 보기',
    principles: [
      {
        title: "1. 자율성과 고지된 동의 (Autonomy & Informed Consent)",
        paragraphs: [
          "사전 고지 및 알 권리 보장: AI의 사용 목적, 데이터 수집 방식, 한계점 등을 내담자가 이해하기 쉬운 언어로 명확히 설명해야 합니다.",
          "거부권 및 대안 제공: 내담자는 언제든 AI 활용을 거부할 권리가 있으며, 거부 시 인간 기반의 동등한 대안적 치료를 제공해야 합니다.",
        ],
      },
      {
        title: "2. 선행 및 악행 금지 (Beneficence & Non-Malfeasance)",
        paragraphs: [
          "안전장치 구축: AI의 환각(오류) 가능성을 고려하여 매순간 비판적 검토가 필요하며, 자살, 살해 등 고위험 징후는 AI가 아닌 전문가가 직접 판단해야 합니다.",
          "과학적 타당성 확보: 내담자의 웰빙을 증진하고 위험을 최소화하기 위해 문화적으로 적절하고 과학적 연구로 검증된 AI 도구만을 사용해야 합니다.",
        ],
      },
      {
        title: "3. 기밀 유지 및 투명성 (Confidentiality, Privacy, & Transparency)",
        paragraphs: [
          "데이터 보안 및 프라이버시 최소화: HIPAA 등 정보 보호 규정을 준수하며, 비식별화/가명처리를 원칙으로 합니다.",
          "기술적 격리: 환자의 민감한 데이터 보호를 위해 로컬 LLM이나 철저하게 암호화된 시스템 사용을 권장합니다.",
          "설명 가능한 구조: 임상가는 알고리즘이 내담자의 데이터에 어떻게 적용되는지, AI가 어떻게 결과를 도출했는지 투명하게 설명할 수 있어야 합니다.",
        ],
      },
      {
        title: "4. 정의, 공정성 및 포용성 (Justice, Fairness, & Inclusiveness)",
        paragraphs: [
          "편향 점검 및 차별 방지: AI 시스템이 특정 소외 집단을 차별하거나 문화적 편향을 띠지 않는지 정기적으로 검토해야 합니다.",
          "공정성 타당도 검증: 자동화된 의사결정이 내담자에게 불이익을 주지 않도록 시스템의 출력과 기능을 비판적으로 감시해야 합니다.",
        ],
      },
      {
        title: "5. 전문적 진실성과 책임 (Fidelity, Professional Integrity, & Accountability)",
        paragraphs: [
          "전문성 및 역량 유지: AI 도구의 결과물을 책임감 있게 해석할 수 있도록 훈련을 통해 역량을 갖추었을 때만 AI 도구를 활용해야 합니다.",
          "지속적 교육: 최신 기술 변화와 디지털 윤리에 대해 지속적으로 교육을 이수하고, 전문적인 윤리 기준을 준수해야 합니다.",
        ],
      },
    ],
  },
  en: {
    title: 'About',
    introParagraphs: [
      'The Exner Rorschach Comprehensive System Structural Summary Calculator supports Structural Summary calculation and reference-document search. Calculation and reference search are available without creating an account.',
      'AI features use a BYOK session rather than a user account. When a user enters an OpenAI API key, the key is encrypted into a 24-hour HttpOnly cookie and is not stored in the server database.',
      'The public-reference RAG database is used only for reference retrieval and remains separate from the optional, content-free AI response feedback database. Neither database stores user accounts, API keys, chat history, or calculator data.',
      'The AI helper is a support tool for review and learning. It does not replace independent professional clinical judgment, formal diagnosis, or the user’s final responsibility.',
      'MOW is responsible for product planning, design, development, deployment, technical operation, and maintenance. The Seoul Institute of Clinical Psychology (SICP) contributed clinical review of the initial software transfer of the calculation logic, checked Structural Summary formulas and outputs, and provided feedback from practical use.',
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
          'The app does not store accounts, API keys, chat history, or calculator data in a server database. Public RAG data and optional content-free response ratings use separate database boundaries.',
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
      'このWebアプリは、Exnerロールシャッハ包括システム（Comprehensive System, CS）の構造一覧表の計算と参照文書検索を支援します。計算と参照文書検索はアカウントなしで利用できます。',
      'AI機能はログインアカウントではなくBYOKセッションで動作します。OpenAIのAPIキーを入力すると、キーは24時間のHttpOnly Cookieに暗号化され、サーバーDBには保存されません。',
      '公開参照文書用のRAGデータベースは参照検索のみに使用し、任意かつ本文を含まないAI応答評価用データベースとは分離します。どちらにもユーザーアカウント、APIキー、チャット履歴、計算データは保存しません。',
      'AIヘルパーは最終判断者ではなく、確認と学習を助ける補助ツールです。最終的な解釈と責任は常に利用者にあります。',
      'サービスの企画、設計、開発、配布、技術運用、保守はMOWが担当します。ソウル臨床心理研究所（Seoul Institute of Clinical Psychology, SICP）は、初期の計算ロジックをプログラムへ移行する過程の臨床的確認、構造一覧表の計算式と出力結果の検証、実際の利用に基づくフィードバックを提供しました。',
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
          'このアプリはアカウント、APIキー、チャット履歴、計算データをサーバーDBに保存しない設計です。公開RAGデータと、任意かつ本文を含まない応答評価は、分離されたデータベース境界で扱います。',
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
      'Esta aplicación apoya el cálculo del Resumen Estructural del Sistema Comprehensivo de Rorschach de Exner y la búsqueda de documentos de referencia. El cálculo y la búsqueda pueden usarse sin crear una cuenta.',
      'Las funciones de IA usan una sesión BYOK, no una cuenta de usuario. Cuando se introduce una clave API de OpenAI, la clave se cifra en una cookie HttpOnly de 24 horas y no se guarda en la base de datos del servidor.',
      'La base de datos RAG de referencias públicas se usa solo para la recuperación y se mantiene separada de la base de datos opcional de valoraciones de IA, que no contiene el texto. Ninguna guarda cuentas, claves API, historial de chat ni datos de cálculo.',
      'El asistente de IA es una herramienta de apoyo para revisión y aprendizaje. No sustituye el juicio clínico profesional, el diagnóstico formal ni la responsabilidad final de la persona usuaria.',
      'MOW es responsable de la planificación, el diseño, el desarrollo, el despliegue, la operación técnica y el mantenimiento del servicio. El Instituto de Psicología Clínica de Seúl (Seoul Institute of Clinical Psychology, SICP) aportó la revisión clínica de la transferencia inicial de la lógica de cálculo al programa, verificó las fórmulas y los resultados del Resumen Estructural y proporcionó comentarios basados en el uso práctico.',
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
          'La app no guarda cuentas, claves API, historial de chat ni datos de cálculo en una base de datos del servidor. Los datos RAG públicos y las valoraciones opcionales sin contenido usan bases de datos separadas.',
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
      'Este aplicativo apoia o cálculo do Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner e a busca de documentos de referência. O cálculo e a busca podem ser usados sem criar uma conta.',
      'Os recursos de IA usam uma sessão BYOK, não uma conta de usuário. Ao inserir uma chave API da OpenAI, a chave é criptografada em um cookie HttpOnly de 24 horas e não é salva no banco de dados do servidor.',
      'O banco de dados RAG de referências públicas é usado somente para recuperação e permanece separado do banco opcional de avaliações de IA sem conteúdo. Nenhum deles salva contas, chaves API, histórico de chat ou dados de cálculo.',
      'O assistente de IA é uma ferramenta de apoio para revisão e aprendizagem. Ele não substitui julgamento clínico profissional, diagnóstico formal nem a responsabilidade final da pessoa usuária.',
      'A MOW é responsável pelo planejamento, design, desenvolvimento, implantação, operação técnica e manutenção do serviço. O Instituto de Psicologia Clínica de Seul (Seoul Institute of Clinical Psychology, SICP) contribuiu com a revisão clínica da transferência inicial da lógica de cálculo para o programa, verificou fórmulas e resultados do Sumário Estrutural e forneceu feedback baseado no uso prático.',
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
          'O app não salva contas, chaves API, histórico de chat ou dados de cálculo no banco do servidor. Dados RAG públicos e avaliações opcionais sem conteúdo usam bancos de dados separados.',
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
    <div className="min-h-screen bg-[var(--brand-page)] text-[var(--text-body)]">
      <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <article
          id="about-page-content"
          className="relative"
        >
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">{content.title}</h1>

          <div className="mt-6 space-y-4">
            {content.introParagraphs.map((paragraph, index) => (
              <p key={`intro-${index}`} className="text-[15px] leading-7 text-[var(--text-body)]">
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-10 border-t border-[var(--border-subtle)] pt-8">
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
        </article>
      </main>
    </div>
  );
}
