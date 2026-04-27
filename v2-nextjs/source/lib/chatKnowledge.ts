import {
  getReferenceDocByCanonicalRoute,
  getReferenceRuntimeChunks,
  getReferenceRuntimeDocs,
} from '@/lib/referenceCorpus';
import type { Language } from '@/types';

type RetrievalKind =
  | 'runtime-route-summary'
  | 'runtime-chunk'
  | 'graph-related';

type DocDomain = 'coding' | 'interpretation' | 'other';
type DocLevel = 'entry' | 'category' | 'unknown';

type QueryIntent = {
  preferDomain: DocDomain | 'neutral';
  graphIntent: boolean;
  explicitCoding: boolean;
  explicitInterpretation: boolean;
};

type ResolvedKnowledgeMeta = {
  domain: DocDomain;
  level: DocLevel;
  leafSegment: string;
  parentRoute: string;
  compactLeaf: string;
  compactTail: string;
  compactAliases: string[];
  compactTitle: string;
};

const TOKEN_SUFFIX_PATTERNS = [
  /(은|는|이|가|을|를|와|과|만|에서|으로|로|의|도|야|요|까|인가)$/u,
  /(이라|라고|이면|이란)$/u,
];

export type KnowledgeItem = {
  id?: string;
  title: string;
  content: string;
  source: 'builtin';
  locale?: Language;
  aliases?: string[];
  canonicalRoute?: string;
  relatedRoutes?: string[];
  retrievalKind?: RetrievalKind;
  docDomain?: DocDomain;
  docLevel?: DocLevel;
};

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}%+/'_:-]+/gu);
  return matches ?? [];
}

function tokenizePreserveCase(text: string): string[] {
  return text.match(/[\p{L}\p{N}%+/'_:-]+/gu) ?? [];
}

function normalizeCompact(text: string): string {
  return text.replace(/[^\p{L}\p{N}%+]+/gu, '').toLowerCase();
}

function stripTokenSuffixes(token: string): string[] {
  const stripped = new Set<string>([token]);
  let current = token;

  for (const pattern of TOKEN_SUFFIX_PATTERNS) {
    const next = current.replace(pattern, '');
    if (next && next !== current) {
      stripped.add(next);
      current = next;
    }
  }

  return [...stripped];
}

function expandQueryTokens(tokens: string[]): string[] {
  const expanded = new Set<string>();

  for (const token of tokens) {
    expanded.add(token);

    if (!/[a-z0-9%+/'-]/i.test(token)) {
      continue;
    }

    for (const variant of stripTokenSuffixes(token)) {
      expanded.add(variant);
    }
  }

  return [...expanded];
}

function expandRawQueryTokens(rawTokens: string[]): string[] {
  const expanded = new Set<string>();

  for (const token of rawTokens) {
    for (const variant of stripTokenSuffixes(token)) {
      expanded.add(variant);
    }
  }

  return [...expanded];
}

function buildCompactTerms(queryText: string, rawTokens: string[]): string[] {
  const compact = new Set<string>();
  const compactQuery = normalizeCompact(queryText);

  if (compactQuery) {
    compact.add(compactQuery);
  }

  for (let index = 0; index < rawTokens.length; index += 1) {
    const variants = stripTokenSuffixes(rawTokens[index]);

    for (const variant of variants) {
      const single = normalizeCompact(variant);
      if (single) {
        compact.add(single);
      }
    }

    const nextVariants = rawTokens
      .slice(index, index + 2)
      .flatMap((token) => stripTokenSuffixes(token).slice(-1));
    const compactPair = normalizeCompact(nextVariants.join(''));
    if (compactPair && compactPair.length <= 24) {
      compact.add(compactPair);
    }

    const thirdVariants = rawTokens
      .slice(index, index + 3)
      .flatMap((token) => stripTokenSuffixes(token).slice(-1));
    const compactTriple = normalizeCompact(thirdVariants.join(''));
    if (compactTriple && compactTriple.length <= 24) {
      compact.add(compactTriple);
    }
  }

  return [...compact];
}

function inferDocDomain(item: Pick<KnowledgeItem, 'canonicalRoute'>): DocDomain {
  if (item.canonicalRoute?.startsWith('scoring-input/')) return 'coding';
  if (item.canonicalRoute?.startsWith('result-interpretation/')) return 'interpretation';
  return 'other';
}

function resolveKnowledgeMeta(item: KnowledgeItem, lang: Language): ResolvedKnowledgeMeta {
  const fallbackDoc =
    item.canonicalRoute ? getReferenceDocByCanonicalRoute(lang, item.canonicalRoute) : undefined;
  const domain = item.docDomain ?? inferDocDomain(item);
  const level = item.docLevel ?? fallbackDoc?.kind ?? 'unknown';
  const routeParts = item.canonicalRoute?.split('/').filter(Boolean) ?? [];
  const leafSegment = routeParts.at(-1) ?? '';
  const parentRoute = routeParts.slice(0, -1).join('/');
  const tailSegment = routeParts.slice(-2).join('');

  return {
    domain,
    level,
    leafSegment,
    parentRoute,
    compactLeaf: normalizeCompact(leafSegment),
    compactTail: normalizeCompact(tailSegment),
    compactAliases: (item.aliases ?? fallbackDoc?.aliases ?? []).map((alias) => normalizeCompact(alias)),
    compactTitle: normalizeCompact(item.title || fallbackDoc?.title || ''),
  };
}

function inferQueryIntent(queryText: string): QueryIntent {
  const normalized = queryText.toLowerCase();

  const codingPatterns = [
    /채점/u,
    /부호화/u,
    /코딩/u,
    /입력/u,
    /언제/u,
    /붙/u,
    /부여/u,
    /적용/u,
    /\bcoding\b/i,
    /\bcode\b/i,
    /\blocation\b/i,
    /위치/u,
    /\bdeterminant\b/i,
    /결정인/u,
    /\bspecial score\b/i,
    /특수점수/u,
    /\bcard\b/i,
    /카드/u,
    /\bcontent\b/i,
    /내용/u,
    /형태질/u,
    /발달질/u,
  ];
  const interpretationPatterns = [
    /해석/u,
    /의미/u,
    /설명/u,
    /시사/u,
    /지표/u,
    /\bindex\b/i,
    /\binterpretation\b/i,
    /\bprocessing\b/i,
    /\binterpersonal\b/i,
    /\bself[- ]perception\b/i,
    /\bideation\b/i,
    /\baffect\b/i,
    /\bmediation\b/i,
    /\bupper section\b/i,
    /\bcore\b/i,
    /\bratio\b/i,
    /경향/u,
    /프로파일/u,
    /높/u,
    /낮/u,
  ];
  const graphPatterns = [/같이/u, /연결/u, /상호참조/u, /문서/u, /링크/u, /보고 싶/u];

  const explicitCoding = codingPatterns.some((pattern) => pattern.test(normalized));
  const explicitInterpretation =
    !explicitCoding && interpretationPatterns.some((pattern) => pattern.test(normalized));
  const graphIntent = graphPatterns.some((pattern) => pattern.test(normalized));

  return {
    preferDomain: explicitCoding ? 'coding' : explicitInterpretation ? 'interpretation' : 'neutral',
    graphIntent,
    explicitCoding,
    explicitInterpretation,
  };
}

function scoreScopeHints(queryText: string, routeLower: string): number {
  const scopedPatterns = [
    { pattern: /\bprocessing\b/i, routeFragment: '/processing/' },
    { pattern: /\binterpersonal\b/i, routeFragment: '/interpersonal/' },
    { pattern: /\bself[- ]perception\b/i, routeFragment: '/selfperception/' },
    { pattern: /\bideation\b/i, routeFragment: '/ideation/' },
    { pattern: /\baffect\b/i, routeFragment: '/affect/' },
    { pattern: /\bmediation\b/i, routeFragment: '/mediation/' },
    { pattern: /\bupper section\b/i, routeFragment: '/upper-section/' },
    { pattern: /\bcore\b/i, routeFragment: '/core/' },
    { pattern: /\bspecial score\b/i, routeFragment: '/special-score/' },
    { pattern: /\bcard\b/i, routeFragment: '/card/' },
  ];

  let score = 0;

  for (const scopedPattern of scopedPatterns) {
    if (scopedPattern.pattern.test(queryText) && routeLower.includes(scopedPattern.routeFragment)) {
      score += 40;
    }
  }

  return score;
}

function overlapScore(queryTokens: Set<string>, text: string): number {
  const tokens = new Set(tokenize(text));
  let score = 0;

  queryTokens.forEach((token) => {
    if (tokens.has(token)) {
      score += 1;
    }
  });

  return score;
}

function trimContent(text: string, maxLength = 1000): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildRuntimeKnowledge(lang: Language): KnowledgeItem[] {
  const runtimeDocs = getReferenceRuntimeDocs(lang);
  const routeSummaries = runtimeDocs.map((doc) => ({
    id: `route:${doc.canonicalRoute}`,
    title: doc.title,
    content: trimContent(doc.excerpt || doc.bodyText, 800),
    source: 'builtin' as const,
    locale: lang,
    aliases: doc.aliases,
    canonicalRoute: doc.canonicalRoute,
    relatedRoutes: doc.relatedRoutes,
    retrievalKind: 'runtime-route-summary' as const,
    docDomain: inferDocDomain(doc),
    docLevel: doc.kind,
  }));

  const runtimeChunks = getReferenceRuntimeChunks(lang);
  const chunkItems = runtimeChunks.map((chunk) => {
    const doc = getReferenceDocByCanonicalRoute(lang, chunk.canonicalRoute);
    const sectionLabel = chunk.headingPath[chunk.headingPath.length - 1] ?? chunk.canonicalRoute;

    return {
      id: `chunk:${chunk.chunkId}`,
      title: doc ? `${doc.title} / ${sectionLabel}` : chunk.headingPath.join(' / '),
      content: chunk.text,
      source: 'builtin' as const,
      locale: lang,
      aliases: chunk.aliases,
      canonicalRoute: chunk.canonicalRoute,
      relatedRoutes: chunk.relatedRoutes,
      retrievalKind: 'runtime-chunk' as const,
      docDomain: inferDocDomain(chunk),
      docLevel: (doc?.kind ?? 'unknown') as DocLevel,
    };
  });

  return [...routeSummaries, ...chunkItems];
}

function scoreKnowledgeItem(
  queryTokens: Set<string>,
  queryText: string,
  rawQueryTokens: string[],
  compactTerms: Set<string>,
  item: KnowledgeItem,
  intent: QueryIntent,
  lang: Language,
): number {
  const normalizedQuery = queryText.trim().toLowerCase();
  const aliasText = item.aliases?.join('\n') ?? '';
  const routeText = item.canonicalRoute ? item.canonicalRoute.replace(/[/_-]+/g, ' ') : '';
  const aliasesLower = item.aliases?.map((alias) => alias.toLowerCase()) ?? [];
  const routeLower = item.canonicalRoute?.toLowerCase() ?? '';
  const routeSegments = routeLower.split('/').filter(Boolean);
  const rawAliases = item.aliases ?? [];
  const meta = resolveKnowledgeMeta(item, lang);
  const codeFocused = rawQueryTokens.some((token) => /[A-Z%+\-]/.test(token));

  let score = 0;
  score += overlapScore(queryTokens, item.title) * 6;
  score += overlapScore(queryTokens, aliasText) * 5;
  score += overlapScore(queryTokens, routeText) * 5;
  score += overlapScore(queryTokens, item.content);

  for (const token of queryTokens) {
    if (aliasesLower.some((alias) => alias === token)) {
      score += token.length <= 1 ? 10 : 34;
    } else if (aliasesLower.some((alias) => alias.includes(token))) {
      score += token.length <= 1 ? 3 : 10;
    }

    if (routeSegments.some((segment) => segment === token)) {
      score += token.length <= 1 ? 8 : 26;
    }
  }

  for (const rawToken of rawQueryTokens) {
    if (rawAliases.some((alias) => alias === rawToken)) {
      score += rawToken.length <= 1 ? 16 : 58;
    }

    if (meta.leafSegment === rawToken) {
      score += rawToken.length <= 1 ? 18 : 64;
    }
  }

  for (const term of compactTerms) {
    if (!term) continue;

    if (meta.compactLeaf === term) {
      score += 44;
    }

    if (meta.compactTail === term) {
      score += 40;
    }

    if (meta.compactAliases.some((alias) => alias === term)) {
      score += 52;
    } else if (
      meta.compactAliases.some(
        (alias) =>
          alias.length >= 4 &&
          term.length >= 4 &&
          (alias.includes(term) || term.includes(alias)),
      )
    ) {
      score += 16;
    }

    if (meta.compactTitle.includes(term)) {
      score += 12;
    }
  }

  if (normalizedQuery) {
    const titleLower = item.title.toLowerCase();

    if (titleLower === normalizedQuery) score += 36;
    if (titleLower.includes(normalizedQuery)) score += 12;
    if (aliasesLower.some((alias) => alias === normalizedQuery)) score += 40;
    if (aliasesLower.some((alias) => alias.includes(normalizedQuery))) score += 16;
    if (routeLower === normalizedQuery) score += 42;
    if (routeSegments.some((segment) => segment === normalizedQuery)) score += 42;
    if (routeLower.includes(normalizedQuery)) score += 14;
  }

  score += scoreScopeHints(queryText, routeLower);

  if (codeFocused && !intent.explicitInterpretation) {
    if (meta.domain === 'coding') {
      score += intent.explicitCoding ? 28 : 12;
    } else if (meta.domain === 'interpretation' && intent.preferDomain === 'neutral') {
      score -= 6;
    }
  }

  if (intent.preferDomain !== 'neutral') {
    if (meta.domain === intent.preferDomain) {
      score += intent.explicitCoding || intent.explicitInterpretation ? 30 : 20;
    } else if (meta.domain !== 'other') {
      score -= intent.explicitCoding || intent.explicitInterpretation ? 18 : 10;
    }
  } else if (meta.domain === 'coding') {
    score += 6;
  }

  if (intent.graphIntent && intent.explicitCoding) {
    if (meta.domain === 'coding') {
      score += 26;
    } else if (meta.domain === 'interpretation') {
      score -= 14;
    }
  }

  if (meta.level === 'entry') {
    score += 8;
  } else if (meta.level === 'category') {
    score -= 4;
  }

  if (codeFocused && meta.level === 'category') {
    score -= 40;
  }

  if (item.retrievalKind === 'runtime-chunk') {
    score += 2;
  }

  return score;
}

function preferKnowledgeCandidate(
  current: { item: KnowledgeItem; score: number },
  next: { item: KnowledgeItem; score: number },
): { item: KnowledgeItem; score: number } {
  if (next.score !== current.score) {
    return next.score > current.score ? next : current;
  }

  const currentChunk = current.item.retrievalKind === 'runtime-chunk';
  const nextChunk = next.item.retrievalKind === 'runtime-chunk';
  if (currentChunk !== nextChunk) {
    return nextChunk ? next : current;
  }

  return next.item.content.length < current.item.content.length ? next : current;
}

function selectLexicalKnowledge(
  queryTokens: Set<string>,
  queryText: string,
  rawQueryTokens: string[],
  compactTerms: Set<string>,
  builtInKnowledge: KnowledgeItem[],
  intent: QueryIntent,
  lang: Language,
): KnowledgeItem[] {
  const compactCodeTokens = rawQueryTokens
    .filter((token) => /[A-Z%+\-]/.test(token))
    .map((token) => normalizeCompact(token))
    .filter(Boolean);
  const ranked = builtInKnowledge
    .map((item) => ({
      item,
      score: scoreKnowledgeItem(
        queryTokens,
        queryText,
        rawQueryTokens,
        compactTerms,
        item,
        intent,
        lang,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    const runtimeSummaries = builtInKnowledge.filter(
      (item) => item.retrievalKind === 'runtime-route-summary',
    );
    return runtimeSummaries.length ? runtimeSummaries.slice(0, 3) : builtInKnowledge.slice(0, 3);
  }

  const routeBest = new Map<string, { item: KnowledgeItem; score: number }>();
  const routeSummaries = new Map<string, KnowledgeItem>();

  for (const candidate of ranked) {
    if (candidate.item.canonicalRoute && candidate.item.retrievalKind === 'runtime-route-summary') {
      routeSummaries.set(candidate.item.canonicalRoute, candidate.item);
    }

    const routeKey = candidate.item.canonicalRoute;
    if (!routeKey) continue;
    const existing = routeBest.get(routeKey);
    routeBest.set(routeKey, existing ? preferKnowledgeCandidate(existing, candidate) : candidate);
  }

  const bestRoutes = Array.from(routeBest.values()).sort((a, b) => b.score - a.score);
  const topScore = bestRoutes[0]?.score ?? 0;
  let primary = bestRoutes
    .filter((entry, index) => index === 0 || entry.score >= Math.max(10, Math.floor(topScore * 0.35)))
    .slice(0, 5)
    .map((entry) => entry.item);

  if (!primary.length) {
    return ranked.slice(0, 5).map((entry) => entry.item);
  }

  const topMeta = resolveKnowledgeMeta(primary[0], lang);
  if (topMeta.level === 'category' && primary[0].canonicalRoute) {
    const topRoutePrefix = `${primary[0].canonicalRoute}/`;
    const promotedLeaf = bestRoutes.find((entry) => {
      const route = entry.item.canonicalRoute;
      if (!route || !route.startsWith(topRoutePrefix)) {
        return false;
      }

      const meta = resolveKnowledgeMeta(entry.item, lang);
      const aliasMatches = (entry.item.aliases ?? []).some((alias) => rawQueryTokens.includes(alias));

      return (
        compactCodeTokens.some((token) => meta.compactLeaf === token || meta.compactTail === token) ||
        Array.from(compactTerms).some(
          (term) =>
            term.length >= 2 &&
            (meta.compactLeaf === term ||
              meta.compactTail === term ||
              meta.compactAliases.some((alias) => alias === term)),
        ) ||
        aliasMatches
      );
    });

    if (promotedLeaf?.item.canonicalRoute && promotedLeaf.item.canonicalRoute !== primary[0].canonicalRoute) {
      primary = [
        promotedLeaf.item,
        ...primary.filter((item) => item.canonicalRoute !== promotedLeaf.item.canonicalRoute),
      ].slice(0, 5);
    }
  }

  const graphExpanded: KnowledgeItem[] = [];
  const selectedRoutes = new Set(primary.map((item) => item.canonicalRoute).filter(Boolean));
  const relatedCandidates: Array<{ item: KnowledgeItem; score: number; sourceIndex: number }> = [];

  primary.forEach((item, sourceIndex) => {
    for (const relatedRoute of item.relatedRoutes ?? []) {
      if (selectedRoutes.has(relatedRoute)) continue;

      const related =
        routeSummaries.get(relatedRoute) ??
        builtInKnowledge.find((candidate) => candidate.canonicalRoute === relatedRoute);
      if (!related) continue;

      const graphItem: KnowledgeItem = {
        ...related,
        id: `graph:${relatedRoute}`,
        retrievalKind: 'graph-related',
        content: trimContent(related.content, 700),
      };

      relatedCandidates.push({
        item: graphItem,
        score: scoreKnowledgeItem(
          queryTokens,
          queryText,
          rawQueryTokens,
          compactTerms,
          graphItem,
          intent,
          lang,
        ),
        sourceIndex,
      });
    }
  });

  relatedCandidates
    .sort((a, b) => {
      if (a.sourceIndex !== b.sourceIndex) {
        return a.sourceIndex - b.sourceIndex;
      }

      const aMeta = resolveKnowledgeMeta(a.item, lang);
      const bMeta = resolveKnowledgeMeta(b.item, lang);
      const primaryMeta = primary[0] ? resolveKnowledgeMeta(primary[0], lang) : undefined;
      const aCrossDomain = aMeta.domain !== primaryMeta?.domain ? 1 : 0;
      const bCrossDomain = bMeta.domain !== primaryMeta?.domain ? 1 : 0;
      if (aCrossDomain !== bCrossDomain) {
        return bCrossDomain - aCrossDomain;
      }

      const aSibling = aMeta.parentRoute === primaryMeta?.parentRoute ? 1 : 0;
      const bSibling = bMeta.parentRoute === primaryMeta?.parentRoute ? 1 : 0;
      if (aSibling !== bSibling) {
        return bSibling - aSibling;
      }

      const aPreferred = aMeta.domain === intent.preferDomain ? 1 : 0;
      const bPreferred = bMeta.domain === intent.preferDomain ? 1 : 0;
      if (aPreferred !== bPreferred) {
        return bPreferred - aPreferred;
      }

      const aEntry = aMeta.level === 'entry' ? 1 : 0;
      const bEntry = bMeta.level === 'entry' ? 1 : 0;
      if (aEntry !== bEntry) {
        return bEntry - aEntry;
      }

      return b.score - a.score;
    })
    .forEach((candidate) => {
      if (graphExpanded.length >= (intent.graphIntent ? 8 : 7)) return;
      if (!candidate.item.canonicalRoute || selectedRoutes.has(candidate.item.canonicalRoute)) return;
      graphExpanded.push(candidate.item);
      selectedRoutes.add(candidate.item.canonicalRoute);
    });

  return [...primary, ...graphExpanded];
}

export function getBuiltInKnowledge(lang: Language = 'en'): KnowledgeItem[] {
  return buildRuntimeKnowledge(lang);
}

export function selectRelevantKnowledge(
  userQuery: string,
  builtInKnowledge?: KnowledgeItem[],
  lang: Language = 'en',
): KnowledgeItem[] {
  const effectiveBuiltIn = (builtInKnowledge ?? getBuiltInKnowledge(lang)).filter(
    (item) => !item.locale || item.locale === lang,
  );
  const rawQueryTokens = expandRawQueryTokens(tokenizePreserveCase(userQuery));
  const queryTokens = new Set(expandQueryTokens(tokenize(userQuery)));
  const compactTerms = new Set(buildCompactTerms(userQuery, rawQueryTokens));
  const queryIntent = inferQueryIntent(userQuery);

  if (queryTokens.size === 0) {
    const runtimeSummaries = effectiveBuiltIn.filter(
      (item) => item.retrievalKind === 'runtime-route-summary',
    );
    return runtimeSummaries.length ? runtimeSummaries.slice(0, 3) : effectiveBuiltIn.slice(0, 3);
  }

  const rankedBuiltin = selectLexicalKnowledge(
    queryTokens,
    userQuery,
    rawQueryTokens,
    compactTerms,
    effectiveBuiltIn,
    queryIntent,
    lang,
  );

  if (rankedBuiltin.length) return rankedBuiltin;

  const runtimeSummaries = effectiveBuiltIn.filter(
    (item) => item.retrievalKind === 'runtime-route-summary',
  );
  return runtimeSummaries.length ? runtimeSummaries.slice(0, 3) : effectiveBuiltIn.slice(0, 3);
}

export function buildKnowledgePrompt(knowledgeItems: KnowledgeItem[]): string {
  if (!knowledgeItems.length) return '';

  const serialized = knowledgeItems
    .map((item, index) => {
      const trimmed =
        item.content.length > 1400 ? `${item.content.slice(0, 1400)}...` : item.content;
      return `[${index + 1}] (${item.source.toUpperCase()}) ${item.title}\n${trimmed}`;
    })
    .join('\n\n');

  return [
    'Knowledge context for this response:',
    '- Use only the reference corpus provided below.',
    '- If uncertain, state uncertainty instead of fabricating.',
    '',
    serialized,
  ].join('\n');
}

/**
 * Combines fixed internal guardrails with dynamically selected
 * knowledge items (RAG documents) into one system prompt string.
 */
export function buildSystemPrompt(
  guardrailInstructions: string,
  knowledgeItems: KnowledgeItem[],
): string {
  const knowledgePart = buildKnowledgePrompt(knowledgeItems);
  return [guardrailInstructions, knowledgePart].filter(Boolean).join('\n\n---\n\n');
}
