export type EphemeralChatContextMessage = {
  role: 'user' | 'ai';
  content: string;
};

export type EphemeralChatContextResult =
  | { ok: true; messages: EphemeralChatContextMessage[] }
  | { ok: false; error: string };

export const MAX_CONTEXT_MESSAGES = 12;
export const MAX_CONTEXT_MESSAGE_CHARS = 4000;
export const MAX_CONTEXT_TOTAL_CHARS = 16000;

const CONTEXT_TRUNCATION_MARKER = '\n[... truncated for conversation context ...]\n';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function truncateContextContent(content: string, maxChars: number): string {
  if (content.length <= maxChars) return content;
  if (maxChars <= CONTEXT_TRUNCATION_MARKER.length + 2) {
    return content.slice(-maxChars);
  }

  const availableChars = maxChars - CONTEXT_TRUNCATION_MARKER.length;
  const headChars = Math.ceil(availableChars * 0.65);
  const tailChars = availableChars - headChars;

  return [
    content.slice(0, headChars).trimEnd(),
    CONTEXT_TRUNCATION_MARKER,
    content.slice(-tailChars).trimStart(),
  ].join('');
}

export function normalizeEphemeralChatContext(input: unknown): EphemeralChatContextResult {
  if (input === undefined || input === null) {
    return { ok: true, messages: [] };
  }

  if (!Array.isArray(input)) {
    return { ok: false, error: 'Chat context must be an array.' };
  }

  const recentItems = input.slice(-MAX_CONTEXT_MESSAGES);
  const normalizedMessages: EphemeralChatContextMessage[] = [];

  for (const item of recentItems) {
    if (!isRecord(item)) {
      return { ok: false, error: 'Chat context messages must be objects.' };
    }

    const role = item.role;
    if (role !== 'user' && role !== 'ai') {
      return { ok: false, error: 'Chat context only allows user and ai roles.' };
    }

    if (typeof item.content !== 'string') {
      return { ok: false, error: 'Chat context content must be text.' };
    }

    const content = item.content.trim();
    if (!content) {
      continue;
    }

    normalizedMessages.push({
      role,
      content: truncateContextContent(content, MAX_CONTEXT_MESSAGE_CHARS),
    });
  }

  const recentMessages: EphemeralChatContextMessage[] = [];
  let remainingChars = MAX_CONTEXT_TOTAL_CHARS;

  for (let index = normalizedMessages.length - 1; index >= 0 && remainingChars > 0; index -= 1) {
    const message = normalizedMessages[index];
    const content = truncateContextContent(message.content, remainingChars);
    if (!content) continue;
    recentMessages.push({ ...message, content });
    remainingChars -= content.length;
  }

  return { ok: true, messages: recentMessages.reverse() };
}
