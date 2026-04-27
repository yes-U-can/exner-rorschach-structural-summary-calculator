export type EphemeralChatContextMessage = {
  role: 'user' | 'ai';
  content: string;
};

export type EphemeralChatContextResult =
  | { ok: true; messages: EphemeralChatContextMessage[] }
  | { ok: false; error: string };

const MAX_CONTEXT_MESSAGES = 12;
const MAX_CONTEXT_MESSAGE_CHARS = 4000;
const MAX_CONTEXT_TOTAL_CHARS = 16000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeEphemeralChatContext(input: unknown): EphemeralChatContextResult {
  if (input === undefined || input === null) {
    return { ok: true, messages: [] };
  }

  if (!Array.isArray(input)) {
    return { ok: false, error: 'Chat context must be an array.' };
  }

  const recentItems = input.slice(-MAX_CONTEXT_MESSAGES);
  const messages: EphemeralChatContextMessage[] = [];
  let totalChars = 0;

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

    if (content.length > MAX_CONTEXT_MESSAGE_CHARS) {
      return { ok: false, error: 'A chat context message is too large.' };
    }

    totalChars += content.length;
    if (totalChars > MAX_CONTEXT_TOTAL_CHARS) {
      return { ok: false, error: 'Chat context is too large.' };
    }

    messages.push({ role, content });
  }

  return { ok: true, messages };
}

