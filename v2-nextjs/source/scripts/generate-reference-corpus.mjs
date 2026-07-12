import fs from 'node:fs/promises';
import path from 'node:path';

import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import stripMarkdown from 'strip-markdown';
import { buildReferenceCorpusFingerprint } from './lib/referenceCorpusFingerprint.mjs';
import { getSpecialIndexEvidence } from './lib/specialIndexEvidence.mjs';
import { writeStableJsonArtifact } from './lib/stableJsonArtifact.mjs';

const ROOT = process.cwd();
const DRAFTS_ROOT = path.join(ROOT, 'docs', 'reference-authoring', 'drafts');
const PROMOTION_CONFIG_PATH = path.join(ROOT, 'docs', 'reference-authoring', 'runtime-promotion.json');
const OUTPUT_ROOT = path.join(ROOT, 'generated', 'reference-corpus');
const LOCALES = ['ko', 'en', 'ja', 'es', 'pt'];

async function readPromotionConfig() {
  const raw = await fs.readFile(PROMOTION_CONFIG_PATH, 'utf8');
  return JSON.parse(raw);
}

const ROUTE_LABELS = {
  en: {
    card: 'Card',
    location: 'Location',
    dq: 'Developmental Quality',
    determinants: 'Determinants',
    fq: 'Form Quality',
    pair: 'Pair',
    contents: 'Contents',
    popular: 'Popular',
    z: 'Z Score',
    score: 'Score',
    gphr: 'G/PHR',
    'special-score': 'Special Score',
    'scoring-input': 'Scoring Input',
    'result-interpretation': 'Result Interpretation',
  },
  ko: {
    card: '\uCE74\uB4DC',
    location: '\uC704\uCE58',
    dq: '\uBC1C\uB2EC\uC9C8',
    determinants: '\uACB0\uC815\uC778',
    fq: '\uD615\uD0DC\uC9C8',
    pair: '\uC30D\uBC18\uC751',
    contents: '\uB0B4\uC6A9',
    popular: '\uB300\uC911\uBC18\uC751',
    z: 'Z\uC810\uC218',
    score: '\uC810\uC218',
    gphr: 'G/PHR',
    'special-score': '\uD2B9\uC218\uC810\uC218',
    'scoring-input': '\uBD80\uD638\uD654',
    'result-interpretation': '\uD574\uC11D',
  },
  ja: {
    card: '\u30AB\u30FC\u30C9',
    location: '\u4F4D\u7F6E',
    dq: '\u767A\u9054\u6C34\u6E96',
    determinants: '\u6C7A\u5B9A\u56E0',
    fq: '\u5F62\u614B\u6C34\u6E96',
    pair: '\u5BFE\u53CD\u5FDC',
    contents: '\u5185\u5BB9',
    popular: '\u5E73\u51E1\u53CD\u5FDC',
    z: 'Z\u5F97\u70B9',
    score: '\u5F97\u70B9',
    gphr: 'G/PHR',
    'special-score': '\u7279\u6B8A\u30B9\u30B3\u30A2',
    'scoring-input': '\u7B26\u53F7\u5316\u5165\u529B',
    'result-interpretation': '\u7D50\u679C\u89E3\u91C8',
  },
  es: {
    card: 'L\u00E1mina',
    location: 'Localizaci\u00F3n',
    dq: 'Calidad evolutiva',
    determinants: 'Determinantes',
    fq: 'Calidad formal',
    pair: 'Par',
    contents: 'Contenidos',
    popular: 'Popular',
    z: 'Puntuaci\u00F3n Z',
    score: 'Puntuaci\u00F3n',
    gphr: 'G/PHR',
    'special-score': 'Puntuaciones especiales',
    'scoring-input': 'Entrada de codificaci\u00F3n',
    'result-interpretation': 'Interpretaci\u00F3n de resultados',
  },
  pt: {
    card: 'Cart\u00E3o',
    location: 'Localiza\u00E7\u00E3o',
    dq: 'Qualidade evolutiva',
    determinants: 'Determinantes',
    fq: 'Qualidade formal',
    pair: 'Par',
    contents: 'Conte\u00FAdos',
    popular: 'Popular',
    z: 'Pontua\u00E7\u00E3o Z',
    score: 'Pontua\u00E7\u00E3o',
    gphr: 'G/PHR',
    'special-score': 'Pontua\u00E7\u00F5es especiais',
    'scoring-input': 'Entrada de codifica\u00E7\u00E3o',
    'result-interpretation': 'Interpreta\u00E7\u00E3o de resultados',
  },
};

const SECTION_LABELS = {
  en: {
    aliases: 'Aliases',
    definition: 'Definition',
    conditions: 'Conditions',
    interpretation: 'Interpretation',
    cautions: 'Cautions',
    related: 'Related Variables',
    crossReferences: 'Cross References',
    evidence: 'Evidence Note',
  },
  ko: {
    aliases: '\uBCC4\uCE6D/\uAC80\uC0C9\uC5B4',
    definition: '\uD575\uC2EC \uC815\uC758',
    conditions: '\uCC44\uC810/\uC801\uC6A9 \uC870\uAC74',
    interpretation: '\uD574\uC11D \uD3EC\uC778\uD2B8',
    cautions: '\uC8FC\uC758\uC0AC\uD56D/\uAC10\uBCC4 \uAE30\uC900',
    related: '\uAD00\uB828 \uBCC0\uC218',
    crossReferences: '\uC0C1\uD638 \uCC38\uC870',
    evidence: '\uADFC\uAC70 \uBA54\uBAA8',
  },
  ja: {
    aliases: '\u5225\u540D/\u691C\u7D22\u8A9E',
    definition: '\u6838\u5FC3\u5B9A\u7FA9',
    conditions: '\u63A1\u70B9/\u9069\u7528\u6761\u4EF6',
    interpretation: '\u89E3\u91C8\u30DD\u30A4\u30F3\u30C8',
    cautions: '\u6CE8\u610F\u4E8B\u9805/\u9451\u5225\u57FA\u6E96',
    related: '\u95A2\u9023\u5909\u6570',
    crossReferences: '\u76F8\u4E92\u53C2\u7167',
    evidence: '\u6839\u62E0\u30E1\u30E2',
  },
  es: {
    aliases: 'Alias / t\u00E9rminos de b\u00FAsqueda',
    definition: 'Definici\u00F3n central',
    conditions: 'Condiciones de aplicaci\u00F3n',
    interpretation: 'Puntos de interpretaci\u00F3n',
    cautions: 'Precauciones / distinciones',
    related: 'Variables relacionadas',
    crossReferences: 'Referencias cruzadas',
    evidence: 'Nota de evidencia',
  },
  pt: {
    aliases: 'Aliases / termos de busca',
    definition: 'Defini\u00E7\u00E3o central',
    conditions: 'Condi\u00E7\u00F5es de aplica\u00E7\u00E3o',
    interpretation: 'Pontos de interpreta\u00E7\u00E3o',
    cautions: 'Cuidados / distin\u00E7\u00F5es',
    related: 'Vari\u00E1veis relacionadas',
    crossReferences: 'Refer\u00EAncias cruzadas',
    evidence: 'Nota de evid\u00EAncia',
  },
};

const HEADING_LABELS = new Map([
  ['aliases / search terms', 'Aliases'],
  ['aliases', 'Aliases'],
  ['alias / t\u00E9rminos de b\u00FAsqueda', 'Aliases'],
  ['aliases / termos de busca', 'Aliases'],
  ['\uBCC4\uCE6D/\uAC80\uC0C9\uC5B4', 'Aliases'],
  ['\u5225\u540D/\u691C\u7D22\u8A9E', 'Aliases'],
  ['core definition', 'Definition'],
  ['definition', 'Definition'],
  ['definici\u00F3n central', 'Definition'],
  ['defini\u00E7\u00E3o central', 'Definition'],
  ['\uD575\uC2EC \uC815\uC758', 'Definition'],
  ['\u6838\u5FC3\u5B9A\u7FA9', 'Definition'],
  ['application conditions', 'Conditions'],
  ['conditions', 'Conditions'],
  ['condiciones de aplicaci\u00F3n', 'Conditions'],
  ['condi\u00E7\u00F5es de aplica\u00E7\u00E3o', 'Conditions'],
  ['\uCC44\uC810/\uC801\uC6A9 \uC870\uAC74', 'Conditions'],
  ['\u63A1\u70B9/\u9069\u7528\u6761\u4EF6', 'Conditions'],
  ['interpretation points', 'Interpretation'],
  ['interpretation', 'Interpretation'],
  ['puntos de interpretaci\u00F3n', 'Interpretation'],
  ['pontos de interpreta\u00E7\u00E3o', 'Interpretation'],
  ['\uD574\uC11D \uD3EC\uC778\uD2B8', 'Interpretation'],
  ['\u89E3\u91C8\u30DD\u30A4\u30F3\u30C8', 'Interpretation'],
  ['cautions / distinctions', 'Cautions'],
  ['precauciones / distinciones', 'Cautions'],
  ['cuidados / distin\u00E7\u00F5es', 'Cautions'],
  ['\uC8FC\uC758\uC0AC\uD56D/\uAC10\uBCC4 \uAE30\uC900', 'Cautions'],
  ['\u6CE8\u610F\u4E8B\u9805/\u9451\u5225\u57FA\u6E96', 'Cautions'],
  ['related variables', 'Related Variables'],
  ['variables relacionadas', 'Related Variables'],
  ['vari\u00E1veis relacionadas', 'Related Variables'],
  ['\uAD00\uB828 \uBCC0\uC218', 'Related Variables'],
  ['\u95A2\u9023\u5909\u6570', 'Related Variables'],
  ['cross references', 'Cross References'],
  ['referencias cruzadas', 'Cross References'],
  ['refer\u00EAncias cruzadas', 'Cross References'],
  ['\uC0C1\uD638 \uCC38\uC870', 'Cross References'],
  ['\u76F8\u4E92\u53C2\u7167', 'Cross References'],
  ['evidence note', 'Evidence Note'],
  ['nota de evidencia', 'Evidence Note'],
  ['nota de evid\u00EAncia', 'Evidence Note'],
  ['\uADFC\uAC70 \uBA54\uBAA8', 'Evidence Note'],
  ['\u6839\u62E0\u30E1\u30E2', 'Evidence Note'],
]);

function buildReferenceUrlSlug(canonicalRoute) {
  const parts = canonicalRoute.split('/').filter(Boolean);
  const slug = [];

  for (let index = 0; index < parts.length; index += 1) {
    const current = parts[index];
    const next = parts[index + 1];

    if (current === 'v' && next === '+') {
      slug.push('v-plus');
      index += 1;
      continue;
    }

    if (current === '+') {
      slug.push('plus');
      continue;
    }

    if (current === '-') {
      slug.push('minus');
      continue;
    }

    slug.push(current);
  }

  return slug;
}

function isCorruptedText(value) {
  return /(\?{2,}|�)/u.test(value ?? '');
}

function formatLeafTitle(segment) {
  if (!segment) return '';
  if (/^[a-z0-9%+-]{1,4}$/i.test(segment)) {
    return segment.toUpperCase();
  }
  return segment
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function getRouteLabel(locale, segment) {
  return ROUTE_LABELS[locale]?.[segment] ?? ROUTE_LABELS.en[segment] ?? formatLeafTitle(segment);
}

function sanitizeDisplayTitle(locale, canonicalRoute, displayTitle) {
  const trimmed = String(displayTitle ?? '').trim();
  if (trimmed && !isCorruptedText(trimmed)) {
    return trimmed;
  }

  const routeParts = canonicalRoute.split('/').filter(Boolean);
  if (routeParts.length === 0) {
    return trimmed || canonicalRoute;
  }

  if (routeParts.length === 1) {
    return getRouteLabel(locale, routeParts[0]);
  }

  const categorySegment = routeParts.at(-2);
  const leafSegment = routeParts.at(-1);
  const categoryLabel = getRouteLabel(locale, categorySegment);

  if (!leafSegment || leafSegment === categorySegment) {
    return `[${categoryLabel}]`;
  }

  return `[${categoryLabel}] ${formatLeafTitle(leafSegment)}`;
}

function getLocalizedSectionLabel(locale, kind) {
  return SECTION_LABELS[locale]?.[kind] ?? SECTION_LABELS.en[kind];
}

function sanitizeAliases(aliases) {
  return aliases.filter((alias) => !isCorruptedText(alias));
}

function inferSectionKind({ normalizedHeading, docKind, sectionIndex }) {
  switch (normalizedHeading) {
    case 'Aliases':
      return 'aliases';
    case 'Definition':
      return 'definition';
    case 'Conditions':
      return 'conditions';
    case 'Interpretation':
    case 'Range Cautions':
    case 'Reading Cautions':
      return docKind.startsWith('interpretation-') ? 'interpretation' : 'cautions';
    case 'Cautions':
    case 'Limits':
      return 'cautions';
    case 'Related Variables':
      return 'related';
    case 'Cross References':
      return 'crossReferences';
    case 'Evidence Note':
      return 'evidence';
    default:
      break;
  }

  if (sectionIndex === 0) return 'aliases';
  if (sectionIndex === 1) return 'definition';
  if (sectionIndex === 2) return docKind.startsWith('interpretation-') ? 'interpretation' : 'conditions';
  if (sectionIndex === 3) return 'cautions';
  if (sectionIndex === 4) return 'crossReferences';
  return 'evidence';
}

function buildSafeRefLabel(locale, route) {
  return sanitizeDisplayTitle(locale, route, route);
}

function buildSafeRefHref(route) {
  const encodedRoute = encodeURIComponent(route)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
  return `ref://${encodedRoute}`;
}

function sanitizeCrossReferenceMarkdown(locale, markdown) {
  return markdown.replace(/\[([^\]]*?)\]\(ref:\/\/([^)]+)\)/g, (_match, _label, rawRoute) => {
    const canonicalRoute = decodeURIComponent(rawRoute);
    const safeLabel = buildSafeRefLabel(locale, canonicalRoute);
    return `[${safeLabel}](${buildSafeRefHref(canonicalRoute)})`;
  });
}

function buildFallbackSectionMarkdown({ locale, sectionKind, canonicalRoute, sanitizedTitle, aliases, relatedRoutes }) {
  const safeAliases = aliases.length > 0 ? aliases : [formatLeafTitle(canonicalRoute.split('/').at(-1))];
  const crossReferenceLines = relatedRoutes.map((route) => `- [${buildSafeRefLabel(locale, route)}](${buildSafeRefHref(route)})`);

  const fallbackCopyEn = {
    definition: `${sanitizedTitle} is a curated reference entry used by this service for Rorschach scoring and interpretation support.`,
    conditions: `Review this item with the service's coding rules and the surrounding response context before finalizing a code.`,
    interpretation: `Interpret this item together with the surrounding Structural Summary context rather than as a stand-alone conclusion.`,
    cautions: `Do not rely on this item in isolation. Check adjacent variables, alternative explanations, and the full response context.`,
    related: `Review nearby variables and directly linked references together before deciding how much weight to place on this item.`,
    evidence: `This reference page is part of the curated runtime corpus maintained for this service.`,
    crossReferences: `Review the linked references below when you need adjacent rules or connected interpretation context.`,
  };

  const fallbackCopy = {
    en: fallbackCopyEn,
    ko: fallbackCopyEn,
    ja: fallbackCopyEn,
    es: fallbackCopyEn,
    pt: fallbackCopyEn,
  };

  if (sectionKind === 'aliases') {
    return safeAliases.map((alias) => `- ${alias}`).join('\n');
  }

  if (sectionKind === 'crossReferences') {
    if (crossReferenceLines.length > 0) {
      return [fallbackCopy[locale].crossReferences, '', ...crossReferenceLines].join('\n');
    }
    return fallbackCopy[locale].crossReferences;
  }

  if (sectionKind === 'related') {
    if (crossReferenceLines.length > 0) {
      return [fallbackCopy[locale].related, '', ...crossReferenceLines].join('\n');
    }
    return fallbackCopy[locale].related;
  }

  return fallbackCopy[locale][sectionKind] ?? fallbackCopy[locale].evidence;
}

async function sanitizeSectionContent(args) {
  const sectionKind = inferSectionKind(args);
  const safeHeading = getLocalizedSectionLabel(args.locale, sectionKind);
  const withSafeLinks = sanitizeCrossReferenceMarkdown(args.locale, args.section.markdown);
  const needsFallback = isCorruptedText(args.section.normalizedHeading) || isCorruptedText(withSafeLinks);
  const safeMarkdown = needsFallback
    ? buildFallbackSectionMarkdown({
        locale: args.locale,
        sectionKind,
        canonicalRoute: args.canonicalRoute,
        sanitizedTitle: args.sanitizedTitle,
        aliases: args.aliases,
        relatedRoutes: args.relatedRoutes,
      })
    : withSafeLinks;
  const safeText = await markdownToPlainText(safeMarkdown);

  return {
    heading: safeHeading,
    normalizedHeading: safeHeading,
    markdown: safeMarkdown,
    text: safeText,
  };
}

function normalizeHeading(heading) {
  return HEADING_LABELS.get(heading.trim().toLowerCase()) ?? HEADING_LABELS.get(heading.trim()) ?? heading.trim();
}

async function markdownToPlainText(markdown) {
  const file = await remark().use(remarkGfm).use(stripMarkdown).process(markdown);
  return String(file)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitSections(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let docHeading = '';
  let current = null;
  const sections = [];

  for (const line of lines) {
    if (line.startsWith('# ')) {
      docHeading = line.slice(2).trim();
      continue;
    }
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { heading: line.slice(3).trim(), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }

  if (current) sections.push(current);

  return {
    docHeading,
    sections: sections.map((section) => ({
      heading: section.heading,
      normalizedHeading: normalizeHeading(section.heading),
      markdown: section.lines.join('\n').trim(),
    })),
  };
}

function summarizeDoc({ title, aliases, sections, status, runtimeReady, docKind, relatedRoutes }) {
  const lines = [`[Title] ${title}`];
  if (aliases.length) lines.push(`[Aliases] ${aliases.join(', ')}`);

  for (const section of sections) {
    if (section.normalizedHeading === 'Aliases') continue;
    if (!section.text) continue;
    lines.push(`[${section.normalizedHeading}] ${section.text}`);
  }

  lines.push(`[Corpus Governance] status=${status}; runtime knowledge is curated and reviewed internally.`);
  lines.push(
    runtimeReady
      ? '[AI Usage Guideline] This locale document is runtime-ready and may be used as built-in reference knowledge.'
      : '[AI Usage Guideline] This document is not runtime-ready yet and should not replace guarded runtime knowledge until QA is complete.',
  );

  if (docKind.startsWith('interpretation-')) {
    lines.push(
      '[Interpretive Preconditions] Confirm the relevant scoring inputs and review the surrounding structural-summary context before interpreting this variable.',
    );
    lines.push(
      `[Cross-Checks] Review adjacent variables and linked routes${relatedRoutes.length ? `: ${relatedRoutes.join(', ')}` : ' before concluding.'}`,
    );
    lines.push(
      '[Common Misreading Guard] Do not treat this page as a stand-alone diagnosis rule; check range, profile context, and alternative explanations first.',
    );
  }

  return lines.join('\n');
}

function compactText(text, maxLength = 600) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

async function collectLocaleDocs(locale, promotionConfig) {
  const localeRoot = path.join(DRAFTS_ROOT, locale);
  const routeDocs = [];
  const chunks = [];
  const localePromotion = promotionConfig.locales?.[locale] ?? {};
  const localeRuntimeReady = localePromotion.runtimeReady === true;

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name === 'index.md') {
        const relative = path.relative(localeRoot, fullPath).replace(/\\/g, '/');
        const raw = await fs.readFile(fullPath, 'utf8');
        const parsed = matter(raw);
        const split = splitSections(parsed.content.trim());
        const sections = [];

        for (const section of split.sections) {
          const text = await markdownToPlainText(section.markdown);
          sections.push({
            heading: section.heading,
            normalizedHeading: section.normalizedHeading,
            markdown: section.markdown,
            text,
          });
        }

        const canonicalRoute = String(parsed.data.canonicalRoute);
        const aliases = sanitizeAliases(Array.isArray(parsed.data.aliases) ? parsed.data.aliases.map(String) : []);
        const relatedRoutes = Array.isArray(parsed.data.relatedRoutes)
          ? parsed.data.relatedRoutes.map(String)
          : [];
        const kind = String(parsed.data.docKind);
        const status = String(parsed.data.status ?? 'stub');
        const runtimeReady = localeRuntimeReady && status !== 'stub';
        const sanitizedTitle = sanitizeDisplayTitle(
          locale,
          canonicalRoute,
          String(parsed.data.displayTitle ?? split.docHeading ?? canonicalRoute),
        );
        const sanitizedSections = [];
        for (const [sectionIndex, section] of sections.entries()) {
          sanitizedSections.push(await sanitizeSectionContent({
            locale,
            canonicalRoute,
            sanitizedTitle,
            aliases,
            relatedRoutes,
            docKind: kind,
            section,
            sectionIndex,
          }));
        }
        const specialIndexEvidence = getSpecialIndexEvidence(canonicalRoute, locale);
        if (specialIndexEvidence) {
          sanitizedSections.push({
            heading: specialIndexEvidence.heading,
            normalizedHeading: 'Evidence Strength',
            markdown: [
              `- Evidence tier: \`${specialIndexEvidence.tier}\``,
              `- ${specialIndexEvidence.summary}`,
              `- ${specialIndexEvidence.guardrail}`,
            ].join('\n'),
            text: [
              `Evidence tier: ${specialIndexEvidence.tier}`,
              specialIndexEvidence.summary,
              specialIndexEvidence.guardrail,
            ].join('\n'),
          });
        }
        const bodyMarkdown = [
          `# ${sanitizedTitle}`,
          ...sanitizedSections.flatMap((section) => [
            '',
            `## ${section.heading}`,
            '',
            section.markdown,
          ]),
        ].join('\n').trim();
        const bodyText = summarizeDoc({
          title: sanitizedTitle,
          aliases,
          sections: sanitizedSections,
          status,
          runtimeReady,
          docKind: kind,
          relatedRoutes,
        });
        const slug = buildReferenceUrlSlug(canonicalRoute);
        const entryType = kind.endsWith('entry') ? 'entry' : 'category';

        routeDocs.push({
          canonicalRoute,
          locale,
          kind: entryType,
          docKind: kind,
          id: slug[slug.length - 1],
          slug,
          title: sanitizedTitle,
          bodyMarkdown,
          bodyText,
          excerpt: compactText(bodyText, 360),
          aliases,
          relatedRoutes,
          authorityPolicy: String(parsed.data.authorityPolicy ?? ''),
          evidenceTier: specialIndexEvidence?.tier ?? null,
          status,
          runtimeReady,
          provenanceNote: String(parsed.data.provenanceNote ?? ''),
          sourcePath: `docs/reference-authoring/drafts/${locale}/${relative}`,
        });

        sanitizedSections.forEach((section, index) => {
          const chunkText = [
            `[Title] ${sanitizedTitle}`,
            `[${section.normalizedHeading}] ${section.text}`,
            specialIndexEvidence
              ? `[Evidence Guardrail] tier=${specialIndexEvidence.tier}; ${specialIndexEvidence.summary} ${specialIndexEvidence.guardrail}`
              : null,
          ]
            .filter(Boolean)
            .join('\n');

          chunks.push({
            locale,
            canonicalRoute,
            chunkId: `${canonicalRoute}#${index + 1}`,
            headingPath: [
              sanitizedTitle,
              section.heading,
            ],
            text: chunkText,
            aliases,
            relatedRoutes,
            authorityPolicy: String(parsed.data.authorityPolicy ?? ''),
            evidenceTier: specialIndexEvidence?.tier ?? null,
            status,
            runtimeReady,
          });
        });
      }
    }
  }

  await walk(localeRoot);
  routeDocs.sort((a, b) => a.canonicalRoute.localeCompare(b.canonicalRoute));
  chunks.sort((a, b) => a.chunkId.localeCompare(b.chunkId));
  return { routeDocs, chunks };
}

function buildManifest(routeDocsByLocale, promotionConfig) {
  const localeSummaries = {};

  for (const locale of LOCALES) {
    const docs = routeDocsByLocale[locale] ?? [];
    const localePromotion = promotionConfig.locales?.[locale] ?? {};
    const entryDocs = docs.filter((doc) => doc.kind === 'entry');
    const categoryDocs = docs.filter((doc) => doc.kind === 'category');
    const runtimeReadyDocs = docs.filter((doc) => doc.runtimeReady);
    const statusCounts = docs.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] ?? 0) + 1;
        return acc;
      },
      { stub: 0, draft: 0, reviewed: 0, locked: 0 }
    );

    localeSummaries[locale] = {
      totalDocs: docs.length,
      entryDocs: entryDocs.length,
      categoryDocs: categoryDocs.length,
      runtimeReadyDocs: runtimeReadyDocs.length,
      statusCounts,
      activeRuntimeSource: runtimeReadyDocs.length === docs.length && docs.length > 0 ? 'reference-corpus' : 'legacy-builtin',
      authorityPolicies: [...new Set(docs.map((doc) => doc.authorityPolicy).filter(Boolean))],
      promotionEnabled: localePromotion.runtimeReady === true,
      promotedAt: localePromotion.promotedAt ?? null,
      promotionReason: localePromotion.reason ?? null,
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    locales: LOCALES,
    localeSummaries,
  };
}

async function main() {
  const promotionConfig = await readPromotionConfig();
  const routeDocsByLocale = {};
  const chunksByLocale = {};

  for (const locale of LOCALES) {
    const { routeDocs, chunks } = await collectLocaleDocs(locale, promotionConfig);
    routeDocsByLocale[locale] = routeDocs;
    chunksByLocale[locale] = chunks;
  }

  const routeDocsArtifact = {
    generatedAt: new Date().toISOString(),
    locales: LOCALES,
    docsByLocale: routeDocsByLocale,
  };
  const chunksArtifactContent = {
    locales: LOCALES,
    chunksByLocale,
  };
  const chunksArtifact = {
    generatedAt: new Date().toISOString(),
    corpusFingerprint: buildReferenceCorpusFingerprint(chunksArtifactContent),
    ...chunksArtifactContent,
  };
  const manifestArtifact = buildManifest(routeDocsByLocale, promotionConfig);

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  await writeStableJsonArtifact(path.join(OUTPUT_ROOT, 'route-docs.json'), routeDocsArtifact);
  await writeStableJsonArtifact(path.join(OUTPUT_ROOT, 'chunks.json'), chunksArtifact);
  await writeStableJsonArtifact(path.join(OUTPUT_ROOT, 'manifest.json'), manifestArtifact);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
