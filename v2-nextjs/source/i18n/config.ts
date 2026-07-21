export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'es', 'pt'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: Language = 'ko';

export function normalizeLanguage(value: string | null | undefined): Language | null {
  return SUPPORTED_LANGUAGES.includes(value as Language) ? (value as Language) : null;
}

export function resolveLanguage(value: string | null | undefined): Language {
  return normalizeLanguage(value) ?? DEFAULT_LANGUAGE;
}

export const DOCUMENT_LANGUAGE_TAG_BY_LANGUAGE: Record<Language, string> = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  es: 'es',
  pt: 'pt-BR',
};

export function getDocumentLanguageTag(language: Language): string {
  return DOCUMENT_LANGUAGE_TAG_BY_LANGUAGE[language];
}

export const LANGUAGE_NAMES: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  es: 'Español',
  pt: 'Português',
};

export const STORAGE_KEY = 'rorschach_language';
