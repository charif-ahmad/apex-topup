'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Debounced, URL-driven search. The input mirrors the `search` param and writes
 * it back (resetting `page`) at most once every 350ms via router.replace, so the
 * parent Server Component refetches. `replace` keeps each keystroke out of the
 * history stack. This is the *one* legitimate useEffect: syncing an external
 * system (a debounce timer) to local input state — not data fetching.
 */
export function UserSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { t } = useLanguage();

  const current = searchParams.get('search') ?? '';
  const [value, setValue] = useState(current);
  // Track the value we last pushed so external URL changes (e.g. tab switch
  // clearing the query) re-sync the input without fighting user typing.
  const lastPushed = useRef(current);

  useEffect(() => {
    if (value === lastPushed.current) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set('search', value);
      else params.delete('search');
      params.delete('page');
      lastPushed.current = value;
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 350);
    return () => clearTimeout(id);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:flex-1 sm:max-w-sm">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-xl pointer-events-none">
        search
      </span>
      <input
        type="text"
        placeholder={t('admin.searchPlaceholder')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
      />
    </div>
  );
}
