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

function scoreChunk(queryTokens: Set<string>, chunk: CodingRuleChunk): number {
  const haystack = `${chunk.title}
${chunk.text}
${chunk.categoryTags.join(' ')}`;
  const tokens = new Set(tokenize(haystack));
  let score = 0;
  queryTokens.forEach((token) => {
    if (tokens.has(token)) score += 1;
  });
  return score;
}

export function buildCodingAssistQuery(context: CodingAssistContext): string {
  const selectedRows = context.sheetRows.filter((row) => context.selectedRowIndices.includes(row.rowIndex));
  const supportingRows = context.sheetRows.filter((row) => row.rowIndex !== context.focusRowIndex);
  const focusLabel = `${context.card} ${context.responseMemo}`.trim();
  const selectedSummary = selectedRows
    .map((row) => `${row.card} ${row.responseMemo}`.trim())
    .join(' ');
  const sheetSummary = supportingRows
    .slice(0, 8)
    .map((row) => `${row.card} ${row.responseMemo}`.trim())
    .join(' ');

  return [
    focusLabel,
    selectedSummary,
    sheetSummary,
    ...(context.focusRowIndex === null
      ? []
      : [
          context.existingCodes.location,
          context.existingCodes.dq,
          context.existingCodes.fq,
          context.existingCodes.pair,
          context.existingCodes.z,
          ...context.existingCodes.determinants,
          ...context.existingCodes.contents,
          ...context.existingCodes.specialScores,
        ]),
    'location dq determinants fq contents special score coding response popular z pair',
  ].join(' ');
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
