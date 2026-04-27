import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import type { CodingAssistCitation, CodingAssistFieldProposal, CodingAssistSuggestion } from '@/types';

export const CODING_JSON_START = '<exnersicp_coding_json>';
export const CODING_JSON_END = '</exnersicp_coding_json>';

const CODING_FIELDS = new Set([
  'location',
  'dq',
  'determinants',
  'fq',
  'pair',
  'contents',
  'popular',
  'z',
  'specialScores',
]);
const PROPOSAL_TYPES = new Set(['string', 'string_array', 'boolean']);
const CONFIDENCE_LEVELS = new Set(['low', 'medium', 'high']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLanguage(value: string): boolean {
  return SUPPORTED_LANGUAGES.includes(value as (typeof SUPPORTED_LANGUAGES)[number]);
}

function normalizeCitations(value: unknown): CodingAssistCitation[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => {
      const locale: CodingAssistCitation['locale'] =
        typeof item.locale === 'string' && isLanguage(item.locale.trim())
          ? (item.locale.trim() as CodingAssistCitation['locale'])
          : null;
      const source: CodingAssistCitation['source'] = item.source === 'builtin' ? 'builtin' : null;

      return {
        id: typeof item.id === 'string' ? item.id.trim() : '',
        title: typeof item.title === 'string' ? item.title.trim() : '',
        canonicalRoute: typeof item.canonicalRoute === 'string' ? item.canonicalRoute.trim() : null,
        retrievalKind: typeof item.retrievalKind === 'string' ? item.retrievalKind.trim() : null,
        locale,
        source,
      };
    })
    .filter((item) => item.id && item.title);
}

function normalizeProposal(value: unknown): CodingAssistFieldProposal | null {
  if (!isRecord(value)) return null;
  if (typeof value.field !== 'string' || !CODING_FIELDS.has(value.field)) return null;
  if (typeof value.type !== 'string' || !PROPOSAL_TYPES.has(value.type)) return null;
  if (typeof value.reason !== 'string' || !value.reason.trim()) return null;

  const confidence = typeof value.confidence === 'string' && CONFIDENCE_LEVELS.has(value.confidence)
    ? value.confidence
    : 'medium';

  if (value.type === 'string' && typeof value.value !== 'string') return null;
  if (value.type === 'boolean' && typeof value.value !== 'boolean') return null;
  if (value.type === 'string_array') {
    if (!Array.isArray(value.value)) return null;
    if (!value.value.every((item) => typeof item === 'string')) return null;
  }

  return {
    field: value.field as CodingAssistFieldProposal['field'],
    type: value.type as CodingAssistFieldProposal['type'],
    value: value.value as CodingAssistFieldProposal['value'],
    reason: value.reason.trim(),
    confidence: confidence as CodingAssistFieldProposal['confidence'],
    citations: normalizeCitations(value.citations),
  };
}

export function parseCodingAssistSuggestion(payload: unknown): CodingAssistSuggestion | null {
  if (!isRecord(payload)) return null;
  if (typeof payload.summary !== 'string') return null;

  const questions = Array.isArray(payload.questions)
    ? payload.questions.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    : [];

  const proposals = Array.isArray(payload.proposals)
    ? payload.proposals.map(normalizeProposal).filter((item): item is CodingAssistFieldProposal => Boolean(item))
    : [];

  return {
    summary: payload.summary.trim(),
    needsMoreContext: Boolean(payload.needsMoreContext),
    questions,
    proposals,
  };
}

export function splitCodingAssistResponse(content: string): {
  displayText: string;
  suggestion: CodingAssistSuggestion | null;
} {
  const start = content.indexOf(CODING_JSON_START);
  const end = content.indexOf(CODING_JSON_END);
  if (start === -1 || end === -1 || end <= start) {
    return { displayText: content.trim(), suggestion: null };
  }

  const jsonText = content.slice(start + CODING_JSON_START.length, end).trim();
  const displayText = `${content.slice(0, start)}${content.slice(end + CODING_JSON_END.length)}`.trim();

  try {
    const parsed = JSON.parse(jsonText);
    return {
      displayText,
      suggestion: parseCodingAssistSuggestion(parsed),
    };
  } catch {
    return { displayText, suggestion: null };
  }
}
