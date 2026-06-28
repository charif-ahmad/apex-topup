'use client';

import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils/cn';

interface LanguageSwitcherProps {
  className?: string;
  /** When true, the text label is hidden on small screens (icon-only). */
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  const toggle = () => setLocale(locale === 'en' ? 'ar' : 'en');

  return (
    <button
      onClick={toggle}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold',
        'border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]',
        'hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]',
        'transition-colors duration-200',
        className,
      )}
    >
      <span className="material-symbols-outlined text-sm">language</span>
      <span className={cn(compact && 'hidden sm:inline')}>
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}
