'use client';

import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils/cn';

/**
 * App-wide floating language toggle. Pinned to the top *trailing* corner —
 * top-right in LTR, top-left in RTL — so it stays out of the way of the auth
 * card and the app's content. Rendered once at the root so it shows on every
 * page (auth + app) without living inside the sidebar.
 */
export function FloatingLanguageSwitcher() {
  const { isRTL } = useLanguage();

  return (
    <div
      className={cn(
        'fixed top-3 z-[60] safe-pt',
        isRTL ? 'left-3' : 'right-3',
      )}
    >
      <LanguageSwitcher
        compact
        className={cn(
          'shadow-lg backdrop-blur-md',
          'bg-[color-mix(in_srgb,var(--color-surface-container)_85%,transparent)]',
          'text-[var(--color-on-surface)]',
        )}
      />
    </div>
  );
}
