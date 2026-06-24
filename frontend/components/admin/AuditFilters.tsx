'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';

/** Status filter for the audit ledger — sole writer of `?status=`, resets page. */
export function AuditFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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
        <option value="">All Statuses</option>
        <option value="success">Success</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
      <span className="ml-auto text-xs text-[var(--color-on-surface-variant)]">{total} records</span>
    </div>
  );
}
