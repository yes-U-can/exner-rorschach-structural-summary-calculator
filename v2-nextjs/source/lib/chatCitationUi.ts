import type { Language } from '@/i18n/config';
import type { ChatCitation } from '@/types';

type CitationUiCopy = {
  sourceBuiltin: string;
  retrievalSummary: string;
  retrievalChunk: string;
  retrievalGraph: string;
};

const CITATION_UI_COPY: Record<Language, CitationUiCopy> = {
  en: {
    sourceBuiltin: 'Reference doc',
    retrievalSummary: 'Overview',
    retrievalChunk: 'Excerpt',
    retrievalGraph: 'Related doc',
  },
  ko: {
    sourceBuiltin: '참조 문서',
    retrievalSummary: '개요',
    retrievalChunk: '본문',
    retrievalGraph: '연결 문서',
  },
  ja: {
    sourceBuiltin: '参照文書',
    retrievalSummary: '概要',
    retrievalChunk: '本文',
    retrievalGraph: '関連文書',
  },
  es: {
    sourceBuiltin: 'Documento de referencia',
    retrievalSummary: 'Resumen',
    retrievalChunk: 'Fragmento',
    retrievalGraph: 'Documento relacionado',
  },
  pt: {
    sourceBuiltin: 'Documento de referencia',
    retrievalSummary: 'Resumo',
    retrievalChunk: 'Trecho',
    retrievalGraph: 'Documento relacionado',
  },
};

const LANGUAGE_BADGES: Record<Language, string> = {
  en: 'EN',
  ko: 'KO',
  ja: 'JA',
  es: 'ES',
  pt: 'PT',
};

function getCopy(language: Language): CitationUiCopy {
  return CITATION_UI_COPY[language] ?? CITATION_UI_COPY.en;
}

export function getChatCitationBadges(
  citation: Pick<ChatCitation, 'source' | 'retrievalKind' | 'locale'>,
  language: Language,
): string[] {
  const copy = getCopy(language);
  const badges: string[] = [];

  if (citation.source === 'builtin') {
    badges.push(copy.sourceBuiltin);
  }

  if (citation.retrievalKind === 'runtime-route-summary') {
    badges.push(copy.retrievalSummary);
  } else if (citation.retrievalKind === 'runtime-chunk') {
    badges.push(copy.retrievalChunk);
  } else if (citation.retrievalKind === 'graph-related') {
    badges.push(copy.retrievalGraph);
  }

  if (citation.locale && LANGUAGE_BADGES[citation.locale]) {
    badges.push(LANGUAGE_BADGES[citation.locale]);
  }

  return badges;
}
