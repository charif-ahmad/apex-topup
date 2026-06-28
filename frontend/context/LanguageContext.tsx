'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import enDict from '@/locales/en.json';
import arDict from '@/locales/ar.json';

export type Locale = 'en' | 'ar';

const DICTIONARIES = { en: enDict, ar: arDict } as const;
type Dictionary = typeof enDict;

// Nested key accessor: t('nav.dashboard') → "Dashboard"
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & string];

type TranslationKey = NestedKeyOf<Dictionary>;

/** Replaces `{token}` placeholders in a string with the matching param value. */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`,
  );
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'apex_locale';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load the saved preference on mount (client-only; SSR renders the `en` default).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'en' || saved === 'ar') {
      setLocaleState(saved);
    }
  }, []);

  // Apply dir + lang on the <html> element whenever locale changes so Tailwind's
  // `rtl:` variants and native bidi alignment kick in.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    // Mirror to a cookie so the preference is also readable server-side if needed.
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = DICTIONARIES[locale] as Record<string, unknown>;
      return interpolate(getNestedValue(dict, key), params);
    },
    [locale],
  );

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t, isRTL: locale === 'ar' }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
