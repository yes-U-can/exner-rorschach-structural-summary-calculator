import {
  getReferenceDocByCanonicalRoute,
  getReferenceRuntimeChunks,
  getReferenceRuntimeDocs,
} from '@/lib/referenceCorpus';
import type { Language } from '@/i18n/config';
import type { CodingAssistContext } from '@/types';

export type CodingRuleChunk = {
  id: string;
  title: string;
  text: string;
  categoryTags: string[];
  canonicalRoute: string;
  relatedRoutes: string[];
  routeScope: 'primary' | 'secondary';
};

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}%+/'-]+/gu);
  return matches ?? [];
}

const LOW_SIGNAL_CODING_TOKENS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'but',
  'coding',
  'does',
  'for',
  'input',
  'is',
  'it',
  'memo',
  'not',
  'of',
  'one',
  'response',
  'said',
  'says',
  'scoring',
  'the',
  'this',
  'to',
  'with',
]);

const CARD_ROMAN_TOKENS = new Set(['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']);
const MAX_EMBEDDING_QUERY_CHARS = 3_000;
const MAX_EMBEDDING_MEMO_CHARS = 800;
const MAX_EMBEDDING_CONTEXT_ROWS = 12;

function routeSegments(route: string): string[] {
  return route.toLowerCase().split(/[\/_-]+/u).filter(Boolean);
}

function scoreExactMetadataMatch(token: string, chunk: CodingRuleChunk): number {
  const segments = routeSegments(chunk.canonicalRoute);
  const leafSegment = segments.at(-1);
  const isCardRoute = chunk.canonicalRoute.toLowerCase().startsWith('scoring-input/card/');

  if (isCardRoute) {
    return token === leafSegment ? 4 : 2;
  }

  if (leafSegment === token) {
    return token.length <= 1 ? 42 : token.length <= 2 ? 32 : 54;
  }

  if (token.length <= 1) {
    return 12;
  }

  if (segments.includes(token)) {
    return token.length <= 2 ? 22 : 34;
  }

  return token.length <= 2 ? 14 : 24;
}

function scoreChunk(queryTokens: Set<string>, chunk: CodingRuleChunk): number {
  const titleTokens = new Set(tokenize(chunk.title));
  const routeTokens = new Set(routeSegments(chunk.canonicalRoute));
  const tagTokens = new Set(tokenize(chunk.categoryTags.join(' ')));
  const textTokens = new Set(tokenize(chunk.text));
  const hasExplicitCardIntent = queryTokens.has('card') || queryTokens.has('cards');
  const isCardRoute = chunk.canonicalRoute.toLowerCase().startsWith('scoring-input/card/');
  let score = 0;

  queryTokens.forEach((token) => {
    if (LOW_SIGNAL_CODING_TOKENS.has(token)) {
      return;
    }
    if (CARD_ROMAN_TOKENS.has(token) && queryTokens.has('card') && !isCardRoute) {
      return;
    }

    const metadataMatch = routeTokens.has(token) || tagTokens.has(token) || titleTokens.has(token);

    if (metadataMatch) {
      score += scoreExactMetadataMatch(token, chunk);
    }

    if (textTokens.has(token)) {
      score += token.length >= 4 ? 3 : 1;
    }
  });

  if (isCardRoute && !hasExplicitCardIntent) {
    score -= 18;
  }

  return score;
}

export function buildCodingAssistQuery(context: CodingAssistContext): string {
  const normalizePart = (value: string, maxChars: number) =>
    value.replace(/\s+/gu, ' ').trim().slice(0, maxChars);
  const serializeCodes = (codes: CodingAssistContext['existingCodes']) =>
    [
      codes.location,
      codes.dq,
      codes.fq,
      codes.pair,
      codes.popular ? 'Popular P' : '',
      codes.z,
      ...codes.determinants,
      ...codes.contents,
      ...codes.specialScores,
    ]
      .map((value) => normalizePart(String(value ?? ''), 80))
      .filter(Boolean)
      .join(' ');
  const focusRowIndex = context.focusRowIndex ?? context.rowIndex;
  const selectedRowIndices = new Set(context.selectedRowIndices);
  const selectedRows = context.sheetRows
    .filter(
      (row) =>
        selectedRowIndices.has(row.rowIndex) &&
        (focusRowIndex === null || row.rowIndex !== focusRowIndex),
    )
    .slice(0, MAX_EMBEDDING_CONTEXT_ROWS - 1);
  const rows = [
    {
      label: 'focus',
      rowIndex: focusRowIndex,
      card: context.card,
      responseMemo: context.responseMemo,
      existingCodes: context.existingCodes,
    },
    ...selectedRows.map((row) => ({ ...row, label: 'selected' })),
  ];
  const rowSummaries = rows.map((row) => {
    const memo = normalizePart(row.responseMemo, MAX_EMBEDDING_MEMO_CHARS);
    const codes = serializeCodes(row.existingCodes);
    const rowLabel = row.rowIndex === null ? row.label : `${row.label}-${row.rowIndex + 1}`;

    return [
      rowLabel,
      `Card-${normalizePart(row.card, 40)}`,
      memo,
      codes ? `codes ${codes}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  return ['scoring input response coding', ...rowSummaries]
    .join('\n')
    .slice(0, MAX_EMBEDDING_QUERY_CHARS)
    .trim();
}

export function getCodingRuleChunks(lang: Language): CodingRuleChunk[] {
  return getReferenceRuntimeChunks(lang)
    .filter((chunk) => chunk.canonicalRoute.startsWith('scoring-input/'))
    .map((chunk) => {
      const doc = getReferenceDocByCanonicalRoute(lang, chunk.canonicalRoute);
      const sectionLabel = chunk.headingPath[chunk.headingPath.length - 1] ?? chunk.canonicalRoute;

      return {
        id: `${lang}:${chunk.chunkId}`,
        title: doc ? `${doc.title} / ${sectionLabel}` : sectionLabel,
        text: chunk.text,
        canonicalRoute: chunk.canonicalRoute,
        relatedRoutes: chunk.relatedRoutes,
        routeScope: 'primary',
        categoryTags: [
          ...chunk.canonicalRoute.split('/'),
          ...chunk.headingPath,
          ...chunk.aliases,
        ],
      };
    });
}

export function selectCodingRuleChunks(context: CodingAssistContext, lang: Language, limit = 6): CodingRuleChunk[] {
  const chunks = getCodingRuleChunks(lang);
  const query = buildCodingAssistQuery(context);

  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) {
    return chunks.slice(0, limit);
  }

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk);

  return ranked.length > 0 ? ranked : chunks.slice(0, limit);
}

export function buildSupportingInterpretationChunks(args: {
  lang: Language;
  relatedRoutes: string[];
  query: string;
  limit?: number;
}): CodingRuleChunk[] {
  const interpretationRoutes = [...new Set(args.relatedRoutes)]
    .filter((route) => route.startsWith('result-interpretation/'));

  if (!interpretationRoutes.length) {
    return [];
  }

  const docsByRoute = new Map(
    getReferenceRuntimeDocs(args.lang)
      .filter((doc) => interpretationRoutes.includes(doc.canonicalRoute))
      .map((doc) => [doc.canonicalRoute, doc]),
  );

  const candidates = interpretationRoutes
    .map((route) => {
      const doc = docsByRoute.get(route);
      if (!doc) return null;

      return {
        id: `${args.lang}:support:${route}`,
        title: doc.title,
        text: doc.excerpt || doc.bodyText,
        canonicalRoute: doc.canonicalRoute,
        relatedRoutes: doc.relatedRoutes,
        routeScope: 'secondary' as const,
        categoryTags: [
          ...doc.canonicalRoute.split('/'),
          ...doc.aliases,
        ],
      };
    })
    .filter((chunk): chunk is NonNullable<typeof chunk> => Boolean(chunk));

  if (!candidates.length) {
    return [];
  }

  const queryTokens = new Set(tokenize(args.query));
  return candidates
    .map((chunk) => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, args.limit ?? 2)
    .map((entry) => entry.chunk);
}
