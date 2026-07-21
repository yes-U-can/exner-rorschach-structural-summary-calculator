'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import {
  DEFAULT_LANGUAGE,
  STORAGE_KEY,
  getDocumentLanguageTag,
  normalizeLanguage,
  type Language,
} from '@/i18n/config';
import { getTranslation, getTranslations } from '@/i18n/client';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

function readUrlLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  return normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
}

export function TranslationProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const hasMounted = useRef(false);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      let savedLanguage: Language | null = null;
      try {
        savedLanguage = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
      } catch {
        // ignore storage errors
      }

      const resolvedLanguage = readUrlLanguage() ?? savedLanguage ?? initialLanguage;
      document.documentElement.lang = getDocumentLanguageTag(resolvedLanguage);
      try {
        localStorage.setItem(STORAGE_KEY, resolvedLanguage);
      } catch {
        // ignore storage errors
      }
      if (resolvedLanguage !== language) {
        const timerId = window.setTimeout(() => setLanguageState(resolvedLanguage), 0);
        return () => window.clearTimeout(timerId);
      }
      return;
    }

    document.documentElement.lang = getDocumentLanguageTag(language);
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage errors
    }
  }, [initialLanguage, language]);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    return getTranslation(language, key, params);
  }, [language]);

  const contextValue: TranslationContextType = { language, setLanguage, t };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Export for use in components that need access to all translations
export { getTranslations };
