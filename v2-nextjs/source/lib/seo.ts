import type { Metadata } from 'next';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type Language,
} from '@/i18n/config';

// The custom domain is the permanent public identity. Preview/deployment hosts
// must never replace it in canonical, hreflang, Open Graph, or sitemap URLs.
export const SITE_URL = 'https://exner.yesucan.co.kr';
export const SITE_NAME = 'Yes, U Can!';

export type SeoPage = 'home' | 'about' | 'terms' | 'privacy' | 'reference' | 'versions';

type SeoCopy = {
  title: string;
  description: string;
};

const HOME_DESCRIPTION_KO =
  '회원가입, 설치, 결제가 필요 없는 Exner Rorschach 종합체계(Comprehensive System) 검사 구조요약 계산기입니다. 오픈소스이며, 본 서비스는 전문가의 임상 판단을 대체하지 않습니다.';

export const SEO_COPY: Record<Language, Record<SeoPage, SeoCopy>> = {
  ko: {
    home: {
      title: SITE_NAME,
      description: HOME_DESCRIPTION_KO,
    },
    about: {
      title: '서비스 소개',
      description: 'Exner Rorschach 종합체계 구조요약 계산기와 선택형 AI 도우미의 목적, 범위, 임상적 한계를 설명합니다.',
    },
    terms: {
      title: '이용약관',
      description: 'Exner Rorschach 구조요약 계산기와 선택형 AI 도우미를 이용할 때 적용되는 조건과 책임 범위를 안내합니다.',
    },
    privacy: {
      title: '개인정보처리방침',
      description: '구조요약 계산 데이터, OpenAI API 키, AI 대화와 선택형 응답 피드백이 처리되고 보호되는 방식을 설명합니다.',
    },
    reference: {
      title: '참조 문서',
      description: 'Exner Rorschach 종합체계의 부호화 항목과 구조요약 변수를 검색하고 확인할 수 있는 참조 문서입니다.',
    },
    versions: {
      title: '버전 아카이브',
      description: 'Exner Rorschach 구조요약 계산기 v2 Next.js와 v1 Google Apps Script의 릴리즈 기록을 확인할 수 있습니다.',
    },
  },
  en: {
    home: {
      title: SITE_NAME,
      description:
        'An open-source Exner Rorschach Comprehensive System Structural Summary calculator requiring no registration, installation, or payment. It does not replace professional clinical judgment.',
    },
    about: {
      title: 'About the Service',
      description:
        'Learn the purpose, scope, and clinical limits of the Exner Rorschach Structural Summary calculator and its optional AI assistants.',
    },
    terms: {
      title: 'Terms of Use',
      description:
        'Terms and responsibilities for using the Exner Rorschach Structural Summary calculator and its optional AI assistants.',
    },
    privacy: {
      title: 'Privacy Policy',
      description:
        'How calculator data, OpenAI API keys, AI conversations, and optional response feedback are processed and protected.',
    },
    reference: {
      title: 'Reference Documents',
      description:
        'Searchable reference documents for Exner Rorschach Comprehensive System coding items and Structural Summary variables.',
    },
    versions: {
      title: 'Version Archive',
      description:
        'Release history for the Exner Rorschach Structural Summary calculator, including Next.js v2 and Google Apps Script v1.',
    },
  },
  ja: {
    home: {
      title: SITE_NAME,
      description:
        '会員登録、インストール、支払いが不要なオープンソースのExner Rorschach 包括システム（Comprehensive System）構造一覧表計算ツールです。本サービスは専門家の臨床判断に代わるものではありません。',
    },
    about: {
      title: 'サービスについて',
      description:
        'Exner Rorschach 構造一覧表計算ツールと任意のAIアシスタントの目的、範囲、臨床上の限界を説明します。',
    },
    terms: {
      title: '利用規約',
      description:
        'Exner Rorschach 構造一覧表計算ツールと任意のAIアシスタントを利用する際の条件と責任範囲を案内します。',
    },
    privacy: {
      title: 'プライバシーポリシー',
      description:
        '計算データ、OpenAI APIキー、AI会話、任意の応答フィードバックの処理と保護について説明します。',
    },
    reference: {
      title: '参照文書',
      description:
        'Exner Rorschach 包括システムのコーディング項目と構造一覧表変数を検索できる参照文書です。',
    },
    versions: {
      title: 'バージョンアーカイブ',
      description:
        'Exner Rorschach 構造一覧表計算ツールのNext.js v2とGoogle Apps Script v1のリリース履歴です。',
    },
  },
  es: {
    home: {
      title: SITE_NAME,
      description:
        'Calculadora de código abierto del Resumen Estructural del Sistema Comprehensivo (Comprehensive System) de Rorschach de Exner, sin registro, instalación ni pago. No sustituye el juicio clínico profesional.',
    },
    about: {
      title: 'Acerca del servicio',
      description:
        'Propósito, alcance y límites clínicos de la calculadora del Resumen Estructural de Rorschach de Exner y sus asistentes de IA opcionales.',
    },
    terms: {
      title: 'Términos de uso',
      description:
        'Condiciones y responsabilidades para usar la calculadora del Resumen Estructural de Rorschach de Exner y sus asistentes de IA opcionales.',
    },
    privacy: {
      title: 'Política de privacidad',
      description:
        'Cómo se procesan y protegen los datos de cálculo, las claves API de OpenAI, las conversaciones de IA y el feedback opcional.',
    },
    reference: {
      title: 'Documentos de referencia',
      description:
        'Documentos consultables sobre la codificación y las variables del Resumen Estructural del Sistema Comprehensivo de Rorschach de Exner.',
    },
    versions: {
      title: 'Archivo de versiones',
      description:
        'Historial de versiones de la calculadora del Resumen Estructural de Rorschach de Exner: Next.js v2 y Google Apps Script v1.',
    },
  },
  pt: {
    home: {
      title: SITE_NAME,
      description:
        'Calculadora de código aberto do Sumário Estrutural do Sistema Compreensivo (Comprehensive System) de Rorschach de Exner, sem cadastro, instalação ou pagamento. Não substitui o julgamento clínico profissional.',
    },
    about: {
      title: 'Sobre o serviço',
      description:
        'Objetivo, escopo e limites clínicos da calculadora do Sumário Estrutural de Rorschach de Exner e de seus assistentes de IA opcionais.',
    },
    terms: {
      title: 'Termos de uso',
      description:
        'Condições e responsabilidades para usar a calculadora do Sumário Estrutural de Rorschach de Exner e seus assistentes de IA opcionais.',
    },
    privacy: {
      title: 'Política de privacidade',
      description:
        'Como dados de cálculo, chaves API da OpenAI, conversas de IA e avaliações opcionais de respostas são processados e protegidos.',
    },
    reference: {
      title: 'Documentos de referência',
      description:
        'Documentos pesquisáveis sobre codificação e variáveis do Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner.',
    },
    versions: {
      title: 'Arquivo de versões',
      description:
        'Histórico de versões da calculadora do Sumário Estrutural de Rorschach de Exner: Next.js v2 e Google Apps Script v1.',
    },
  },
};

const OPEN_GRAPH_LOCALES: Record<Language, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
  es: 'es_ES',
  pt: 'pt_BR',
};

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.replace(/\/+$/, '');
}

export function buildLocalizedPath(pathname: string, language: Language) {
  const normalized = normalizePathname(pathname);
  if (language === DEFAULT_LANGUAGE) return normalized;
  return `${normalized}?lang=${language}`;
}

export function buildLanguageAlternates(pathname: string) {
  const normalized = normalizePathname(pathname);
  const languages = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((language) => [language, buildLocalizedPath(normalized, language)]),
  );

  return {
    ...languages,
    'x-default': normalized,
  };
}

export function buildAbsoluteLanguageAlternates(pathname: string) {
  return Object.fromEntries(
    Object.entries(buildLanguageAlternates(pathname)).map(([language, path]) => [
      language,
      getAbsoluteUrl(path),
    ]),
  );
}

export function buildLocalizedAlternates(pathname: string, language: Language) {
  return {
    canonical: buildLocalizedPath(pathname, language),
    languages: buildLanguageAlternates(pathname),
  };
}

export function getSeoCopy(page: SeoPage, language: Language) {
  return SEO_COPY[language][page];
}

export function buildLocalizedPageMetadata(args: {
  language: Language;
  pathname: string;
  title: string;
  description: string;
}): Metadata {
  const alternateLocales = SUPPORTED_LANGUAGES
    .filter((language) => language !== args.language)
    .map((language) => OPEN_GRAPH_LOCALES[language]);

  return {
    title: args.title,
    description: args.description,
    alternates: buildLocalizedAlternates(args.pathname, args.language),
    openGraph: {
      type: 'website',
      url: buildLocalizedPath(args.pathname, args.language),
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[args.language],
      alternateLocale: alternateLocales,
      title: args.title,
      description: args.description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: args.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: args.title,
      description: args.description,
      images: ['/og-image.png'],
    },
  };
}

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, `${SITE_URL}/`).toString();
}
