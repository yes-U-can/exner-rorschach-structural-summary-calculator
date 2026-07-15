import type { ChatMessageMetadata } from '@/types';
import { normalizeEphemeralChatContext } from '@/lib/chatEphemeralContext';

export const EPHEMERAL_CHAT_CLEAR_EVENT = 'rorschach:ephemeral-ai-chat-clear';

const STORAGE_PREFIX = 'rorschach_ephemeral_ai_chat_v1:';
const MAX_STORED_MESSAGES = 24;
const LEGACY_STREAM_STATUS_SUFFIXES = [
  '[Stream interrupted]',
  '[응답 스트림이 중단되었습니다]',
  '[応答ストリームが中断されました]',
  '[La transmisión se interrumpió]',
  '[O fluxo de resposta foi interrompido]',
];

export function stripLegacyStreamStatus(content: string) {
  const trimmed = content.trimEnd();
  const suffix = LEGACY_STREAM_STATUS_SUFFIXES.find((candidate) => trimmed.endsWith(candidate));
  return suffix ? trimmed.slice(0, -suffix.length).trimEnd() : content;
}

export type StoredEphemeralChatMessage = {
  id: number;
  role: 'user' | 'ai';
  content: string;
  statusNotice?: string;
  metadata?: ChatMessageMetadata;
  uiOnly?: boolean;
};

export function buildEphemeralChatStorageKey(args: {
  userId: string | null | undefined;
  mode: 'interpretation' | 'coding_assist';
  scope?: string | null;
}) {
  const userId = args.userId?.trim();
  if (!userId) return null;
  return `${STORAGE_PREFIX}${userId}:${args.mode}:${args.scope?.trim() || 'default'}`;
}

export function readEphemeralChatMessages<T extends StoredEphemeralChatMessage>(storageKey: string | null): T[] {
  if (!storageKey || typeof window === 'undefined') return [];

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((message): message is T => (
        typeof message === 'object' &&
        message !== null &&
        (message.role === 'user' || message.role === 'ai') &&
        typeof message.content === 'string'
      ))
      .slice(-MAX_STORED_MESSAGES);
  } catch {
    sessionStorage.removeItem(storageKey);
    return [];
  }
}

export function writeEphemeralChatMessages(storageKey: string | null, messages: StoredEphemeralChatMessage[]) {
  if (!storageKey || typeof window === 'undefined') return;

  const storable = messages
    .filter((message) => message.content.trim())
    .slice(-MAX_STORED_MESSAGES);

  try {
    if (storable.length === 0) {
      sessionStorage.removeItem(storageKey);
      return;
    }
    sessionStorage.setItem(storageKey, JSON.stringify(storable));
  } catch {
    // If the browser refuses storage, keep chat in memory only.
  }
}

export function clearAllEphemeralChatStorage() {
  if (typeof window === 'undefined') return;

  for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith(STORAGE_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  }

  window.dispatchEvent(new Event(EPHEMERAL_CHAT_CLEAR_EVENT));
}

export function toEphemeralChatContext(messages: StoredEphemeralChatMessage[]) {
  const contextMessages = messages
    .filter((message) => !message.uiOnly)
    .filter((message) => message.role === 'user' || message.role === 'ai')
    .filter((message) => message.content.trim())
    .map((message) => ({
      role: message.role,
      content: stripLegacyStreamStatus(message.content),
    }))
    .filter((message) => message.content.trim());

  const result = normalizeEphemeralChatContext(contextMessages);
  return result.ok ? result.messages : [];
}
