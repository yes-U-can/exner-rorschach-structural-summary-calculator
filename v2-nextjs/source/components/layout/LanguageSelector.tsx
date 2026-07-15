'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type Language } from '@/i18n/config';
import { usePathname, useRouter } from 'next/navigation';

const CLIENT_TRANSLATED_PATHS = new Set(['/', '/chat']);

const LANGUAGE_CODES: Record<Language, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
  es: 'ES',
  pt: 'PT',
};

const SELECT_LABELS: Record<Language, string> = {
  ko: '\uC5B8\uC5B4 \uC120\uD0DD',
  en: 'Select language',
  ja: '\u8A00\u8A9E\u3092\u9078\u629E',
  es: 'Seleccionar idioma',
  pt: 'Selecionar idioma',
};

export default function LanguageSelector({
  variant = 'default',
  compact = false,
}: {
  variant?: 'default' | 'sidebar' | 'compact';
  compact?: boolean;
}) {
  const { language, setLanguage } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: Language) => {
    if (lang === language) return;

    setLanguage(lang);

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('lang', lang);
    const currentPathname = pathname || '/';
    const nextUrl = params.toString() ? `${currentPathname}?${params.toString()}` : currentPathname;

    if (typeof window !== 'undefined' && CLIENT_TRANSLATED_PATHS.has(currentPathname)) {
      window.history.replaceState(window.history.state, '', nextUrl);
      return;
    }

    router.replace(nextUrl, { scroll: false });
  };

  const selectLabel = SELECT_LABELS[language] ?? SELECT_LABELS.en;
  const isSidebarVariant = variant === 'sidebar' || variant === 'compact';
  return (
    <Listbox value={language} onChange={handleLanguageChange}>
      <div className={`ui-language-root ui-language-root-${variant} ${compact ? 'is-compact' : ''}`}>
        <ListboxButton
          aria-label={selectLabel}
          title={selectLabel}
          className="ui-language-button"
        >
          <span className="ui-language-current">
            <GlobeAltIcon className="ui-language-icon" aria-hidden="true" />
            <span className="ui-language-current-code">{LANGUAGE_CODES[language]}</span>
            <span className="ui-language-current-name">{LANGUAGE_NAMES[language]}</span>
          </span>
          <ChevronDownIcon className="ui-language-chevron" aria-hidden="true" />
        </ListboxButton>

        <ListboxOptions
          modal={false}
          className={`ui-language-menu ui-language-menu-${variant}`}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <ListboxOption
              key={lang}
              value={lang}
              aria-label={isSidebarVariant ? LANGUAGE_NAMES[lang] : undefined}
              title={isSidebarVariant ? LANGUAGE_NAMES[lang] : undefined}
              className={({ active, selected }) =>
                [
                  'ui-language-option',
                  selected ? 'is-selected' : '',
                  active ? 'is-active' : '',
                ].join(' ')
              }
            >
              {({ selected }) => (
                <>
                  <span className="ui-language-option-label">
                    <span className="ui-language-option-code">{LANGUAGE_CODES[lang]}</span>
                    <span>{LANGUAGE_NAMES[lang]}</span>
                  </span>
                  {selected ? <CheckIcon className="ui-language-check" aria-hidden="true" /> : null}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
