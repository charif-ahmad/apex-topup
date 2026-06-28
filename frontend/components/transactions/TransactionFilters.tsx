'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils/cn';

const SELECT_CLASS =
  'px-3 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]';

/**
 * Filter controls are the single writer of `type`/`status` search params. The URL
 * is the source of truth — the parent Server Component reads these params, refetches,
 * and streams new rows. Changing a filter resets pagination back to page 1.
 */
export function TransactionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const type = searchParams.get('type') ?? '';
  const status = searchParams.get('status') ?? '';

  function setParam(key: 'type' | 'status', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page'); // a new filter invalidates the current page
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className={cn('flex flex-wrap gap-3 transition-opacity', isPending && 'opacity-60')}>
      <select
        className={SELECT_CLASS}
        value={type}
        onChange={(e) => setParam('type', e.target.value)}
      >
        <option value="">{t('transactions.allTypes')}</option>
        <option value="credit">{t('tx.credit')}</option>
        <option value="debit">{t('tx.debit')}</option>
      </select>

      <select
        className={SELECT_CLASS}
        value={status}
        onChange={(e) => setParam('status', e.target.value)}
      >
        <option value="">{t('transactions.allStatuses')}</option>
        <option value="success">{t('tx.success')}</option>
        <option value="pending">{t('tx.pending')}</option>
        <option value="failed">{t('tx.failed')}</option>
      </select>
    </div>
  );
}
