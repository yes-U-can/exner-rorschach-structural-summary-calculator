import { SUPPORTED_LANGUAGES, type Language } from '@/i18n/config';
import type { ChatCitation, ChatMessageMetadata, CodingAssistSuggestion } from '@/types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

function normalizeChatCitations(value: unknown): ChatCitation[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item) => {
      const locale =
        typeof item.locale === 'string' && isLanguage(item.locale.trim())
          ? (item.locale.trim() as Language)
          : null;
      const source: ChatCitation['source'] = item.source === 'builtin' ? 'builtin' : null;

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

export function parseChatMessageMetadata(metadataJson: unknown): ChatMessageMetadata | undefined {
  if (typeof metadataJson !== 'string' || !metadataJson.trim()) return undefined;

  try {
    const parsed = JSON.parse(metadataJson) as Record<string, unknown>;
    const metadata: ChatMessageMetadata = {};

    if (typeof parsed.workflowType === 'string') {
      metadata.workflowType = parsed.workflowType as ChatMessageMetadata['workflowType'];
    }
    if (typeof parsed.locale === 'string') {
      metadata.locale = parsed.locale;
    }

    const citations = normalizeChatCitations(parsed.citations);
    if (citations.length > 0) {
      metadata.citations = citations;
    }

    if (isRecord(parsed.codingSuggestion)) {
      metadata.codingSuggestion = parsed.codingSuggestion as unknown as CodingAssistSuggestion;
    }

    return Object.keys(metadata).length > 0 ? metadata : undefined;
  } catch {
    return undefined;
  }
}

function routeFromCitationId(citationId: string): string | null {
  const trimmed = citationId.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('route:')) {
    return trimmed.slice('route:'.length).trim() || null;
  }

  const localePrefixed = trimmed.match(/^[a-z]{2}:(.+)$/i);
  if (localePrefixed?.[1]) {
    return localePrefixed[1].trim() || null;
  }

  return null;
}

function localeFromCitationId(citationId: string): Language | null {
  const localePrefixed = citationId.trim().match(/^([a-z]{2}):(.+)$/i);
  if (!localePrefixed?.[1]) return null;
  return isLanguage(localePrefixed[1]) ? localePrefixed[1] : null;
}

export function toChatCitationHref(
  citation: Pick<ChatCitation, 'id' | 'canonicalRoute' | 'locale'>,
  language: Language,
): string | null {
  const canonicalRoute = citation.canonicalRoute?.trim() || routeFromCitationId(citation.id);
  if (!canonicalRoute) return null;
  const hrefLocale = citation.locale ?? localeFromCitationId(citation.id) ?? language;

  const safeSegments = canonicalRoute
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment));

  if (safeSegments.length === 0) return null;
  return `/ref/${safeSegments.join('/')}?lang=${hrefLocale}`;
}
