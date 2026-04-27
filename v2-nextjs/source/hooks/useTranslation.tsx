'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Language, DEFAULT_LANGUAGE, STORAGE_KEY, SUPPORTED_LANGUAGES } from '@/i18n/config';
import { getTranslation, getTranslations } from '@/i18n/client';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

function normalizeLanguage(value: string | null | undefined): Language | null {
  return SUPPORTED_LANGUAGES.includes(value as Language) ? (value as Language) : null;
}

function readUrlLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  return normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const urlLang = readUrlLanguage();
    if (urlLang) {
      return urlLang;
    }
    const savedLang = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    if (savedLang) {
      return savedLang;
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage errors
    }
  }, [language]);

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
