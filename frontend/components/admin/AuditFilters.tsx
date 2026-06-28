'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils/cn';

/** Status filter for the audit ledger — sole writer of `?status=`, resets page. */
export function AuditFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const status = searchParams.get('status') ?? '';

  function setStatus(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('status', value);
    else params.delete('status');
    params.delete('page');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-3 transition-opacity', isPending && 'opacity-60')}>
      <select
        className="px-3 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">{t('transactions.allStatuses')}</option>
        <option value="success">{t('tx.success')}</option>
        <option value="pending">{t('tx.pending')}</option>
        <option value="failed">{t('tx.failed')}</option>
      </select>
      <span className="ml-auto text-xs text-[var(--color-on-surface-variant)]">{t('admin.recordsCount', { count: total })}</span>
    </div>
  );
}
