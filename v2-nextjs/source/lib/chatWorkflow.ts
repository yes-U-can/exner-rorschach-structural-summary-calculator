import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from '@/i18n/config';
import type {
  ChatWorkflowMode,
  CodingAssistContext,
  CodingAssistContextRowSnapshot,
  RorschachResponse,
  SessionUiPreferences,
} from '@/types';

export const CHAT_WORKFLOW_MODES = ['interpretation', 'coding_assist'] as const;

const CODING_FIELDS = [
  'location',
  'dq',
  'determinants',
  'fq',
  'pair',
  'contents',
  'popular',
  'z',
  'specialScores',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
}

function normalizeExistingCodes(input: unknown): CodingAssistContext['existingCodes'] {
  const source = isRecord(input) ? input : {};
  return {
    location: typeof source.location === 'string' ? source.location : '',
    dq: typeof source.dq === 'string' ? source.dq : '',
    determinants: toStringArray(source.determinants),
    fq: typeof source.fq === 'string' ? source.fq : '',
    pair: typeof source.pair === 'string' ? source.pair : 'none',
    contents: toStringArray(source.contents),
    popular: Boolean(source.popular),
    z: typeof source.z === 'string' ? source.z : '',
    specialScores: toStringArray(source.specialScores),
  };
}

function buildExistingCodesFromResponse(
  response: Pick<
    RorschachResponse,
    'location' | 'dq' | 'determinants' | 'fq' | 'pair' | 'contents' | 'popular' | 'z' | 'specialScores'
  >,
): CodingAssistContext['existingCodes'] {
  return {
    location: response.location,
    dq: response.dq,
    determinants: [...response.determinants],
    fq: response.fq,
    pair: response.pair,
    contents: [...response.contents],
    popular: response.popular,
    z: response.z,
    specialScores: [...response.specialScores],
  };
}

function normalizeRowSnapshot(input: unknown, fallbackRowIndex: number): CodingAssistContextRowSnapshot | null {
  if (!isRecord(input)) return null;
  if (typeof input.card !== 'string' || !input.card.trim()) return null;
  if (typeof input.responseMemo !== 'string' || !input.responseMemo.trim()) return null;

  const rowIndex =
    typeof input.rowIndex === 'number' && Number.isFinite(input.rowIndex)
      ? input.rowIndex
      : fallbackRowIndex;

  return {
    rowIndex,
    card: input.card.trim(),
    responseMemo: input.responseMemo.trim(),
    existingCodes: normalizeExistingCodes(input.existingCodes),
  };
}

function normalizeSelectedRowIndices(
  input: unknown,
  sheetRows: CodingAssistContextRowSnapshot[],
  fallbackFocusRowIndex: number | null,
) {
  const validRowIndices = new Set(sheetRows.map((row) => row.rowIndex));
  const normalized = Array.isArray(input)
    ? input
        .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
        .filter((value) => validRowIndices.has(value))
    : [];

  if (normalized.length > 0) {
    return [...new Set(normalized)].sort((a, b) => a - b);
  }

  if (fallbackFocusRowIndex !== null && validRowIndices.has(fallbackFocusRowIndex)) {
    return [fallbackFocusRowIndex];
  }

  return [];
}

type ChatRetrievalMessage = {
  role: 'user' | 'ai';
  content: string;
};

export function parseChatWorkflowMode(input: unknown): ChatWorkflowMode | null {
  if (typeof input === 'string' && (CHAT_WORKFLOW_MODES as readonly string[]).includes(input)) {
    return input as ChatWorkflowMode;
  }
  return null;
}

export function normalizeChatWorkflowMode(input: unknown): ChatWorkflowMode {
  return parseChatWorkflowMode(input) ?? 'interpretation';
}

export function normalizeWorkflowLocale(input: unknown): Language {
  if (typeof input === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(input)) {
    return input as Language;
  }
  return DEFAULT_LANGUAGE;
}

export function buildCodingAssistContext(args: {
  focusRowIndex: number | null;
  responses: RorschachResponse[];
  selectedRowIndices?: number[];
}): CodingAssistContext {
  const nonEmptyRows = args.responses
    .map((response, rowIndex) => ({ response, rowIndex }))
    .filter(({ response }) => Boolean(response.response?.trim()))
    .map(({ response, rowIndex }) => ({
      rowIndex,
      card: response.card,
      responseMemo: response.response,
      existingCodes: buildExistingCodesFromResponse(response),
    }));

  const focusRow =
    args.focusRowIndex === null
      ? null
      : nonEmptyRows.find((row) => row.rowIndex === args.focusRowIndex) ?? {
          rowIndex: args.focusRowIndex,
          card: args.responses[args.focusRowIndex]?.card ?? '',
          responseMemo: args.responses[args.focusRowIndex]?.response ?? '',
          existingCodes: buildExistingCodesFromResponse(args.responses[args.focusRowIndex] ?? {
            location: '',
            dq: '',
            determinants: [],
            fq: '',
            pair: 'none',
            contents: [],
            popular: false,
            z: '',
            specialScores: [],
          }),
        };
  const fallbackExistingCodes = buildExistingCodesFromResponse({
    location: '',
    dq: '',
    determinants: [],
    fq: '',
    pair: 'none',
    contents: [],
    popular: false,
    z: '',
    specialScores: [],
  });

  const selectedRowIndices = normalizeSelectedRowIndices(
    args.selectedRowIndices,
    nonEmptyRows,
    focusRow?.rowIndex ?? null,
  );

  return {
    rowIndex: focusRow?.rowIndex ?? null,
    focusRowIndex: focusRow?.rowIndex ?? null,
    selectedRowIndices,
    sheetRows: nonEmptyRows,
    card: focusRow?.card ?? '',
    responseMemo: focusRow?.responseMemo ?? '',
    existingCodes: focusRow?.existingCodes ?? fallbackExistingCodes,
  };
}

export function normalizeCodingAssistContext(input: unknown): CodingAssistContext | null {
  if (!isRecord(input)) return null;
  const sheetRowsInput = Array.isArray(input.sheetRows) ? input.sheetRows : [];
  const normalizedSheetRows = sheetRowsInput
    .map((row, index) => normalizeRowSnapshot(row, index))
    .filter((row): row is CodingAssistContextRowSnapshot => Boolean(row));

  const primaryRow = normalizeRowSnapshot(input, 0);
  const fallbackRow = primaryRow ?? normalizedSheetRows[0];

  if (!fallbackRow && normalizedSheetRows.length === 0) return null;

  const focusRowIndex =
    input.focusRowIndex === null
      ? null
      : typeof input.focusRowIndex === 'number' && Number.isFinite(input.focusRowIndex)
      ? input.focusRowIndex
      : fallbackRow?.rowIndex ?? null;

  const focusRow =
    focusRowIndex === null
      ? null
      : normalizedSheetRows.find((row) => row.rowIndex === focusRowIndex) ??
        (primaryRow && primaryRow.rowIndex === focusRowIndex ? primaryRow : null) ??
        fallbackRow;

  const sheetRows = normalizedSheetRows.length > 0
    ? normalizedSheetRows
    : focusRow
      ? [focusRow]
      : [];

  if (sheetRows.length === 0) return null;

  return {
    rowIndex: focusRow?.rowIndex ?? null,
    focusRowIndex: focusRow?.rowIndex ?? null,
    selectedRowIndices: normalizeSelectedRowIndices(input.selectedRowIndices, sheetRows, focusRow?.rowIndex ?? null),
    sheetRows,
    card: focusRow?.card ?? '',
    responseMemo: focusRow?.responseMemo ?? '',
    existingCodes: focusRow?.existingCodes ?? normalizeExistingCodes({}),
  };
}

export function summarizeWorkflowContext(mode: ChatWorkflowMode, context: unknown) {
  if (mode !== 'coding_assist') {
    return isRecord(context) ? context : {};
  }

  const normalized = normalizeCodingAssistContext(context);
  if (!normalized) return {};

  return {
    rowIndex: normalized.rowIndex,
    focusRowIndex: normalized.focusRowIndex,
    selectedRowIndices: normalized.selectedRowIndices,
    sheetRowCount: normalized.sheetRows.length,
    card: normalized.card,
    responseMemoLength: normalized.responseMemo.length,
    existingCodes: CODING_FIELDS.reduce<Record<string, unknown>>((acc, field) => {
      acc[field] = normalized.existingCodes[field];
      return acc;
    }, {}),
  };
}

function normalizeRetrievalSnippet(text: string, maxLength = 220) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

export function buildChatRetrievalQuery(args: {
  mode: ChatWorkflowMode;
  messages: ChatRetrievalMessage[];
  maxUserMessages?: number;
}) {
  if (args.mode === 'coding_assist') {
    const latestUser = [...args.messages]
      .reverse()
      .find((message) => message.role === 'user' && message.content.trim());
    return latestUser?.content.trim() ?? '';
  }

  const maxUserMessages = Math.max(1, args.maxUserMessages ?? 3);
  const normalizedUsers = args.messages
    .filter((message) => message.role === 'user')
    .map((message) => normalizeRetrievalSnippet(message.content))
    .filter(Boolean);

  const deduped: string[] = [];
  const seen = new Set<string>();

  for (let index = normalizedUsers.length - 1; index >= 0; index -= 1) {
    const snippet = normalizedUsers[index];
    const key = snippet.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.unshift(snippet);
    if (deduped.length >= maxUserMessages) {
      break;
    }
  }

  return deduped.join('\n');
}

export function getDefaultSessionUiPreferences(): Required<SessionUiPreferences> {
  return {
    tablePrompts: {
      skipInsertAfterSelectedConfirm: false,
      skipDeleteSelectedConfirm: false,
    },
  };
}

export function normalizeSessionUiPreferences(input: unknown): Required<SessionUiPreferences> {
  const defaults = getDefaultSessionUiPreferences();
  if (!isRecord(input)) {
    return defaults;
  }

  const tablePrompts = isRecord(input.tablePrompts) ? input.tablePrompts : {};

  return {
    tablePrompts: {
      skipInsertAfterSelectedConfirm:
        typeof tablePrompts.skipInsertAfterSelectedConfirm === 'boolean'
          ? tablePrompts.skipInsertAfterSelectedConfirm
          : defaults.tablePrompts.skipInsertAfterSelectedConfirm,
      skipDeleteSelectedConfirm:
        typeof tablePrompts.skipDeleteSelectedConfirm === 'boolean'
          ? tablePrompts.skipDeleteSelectedConfirm
          : defaults.tablePrompts.skipDeleteSelectedConfirm,
    },
  };
}
