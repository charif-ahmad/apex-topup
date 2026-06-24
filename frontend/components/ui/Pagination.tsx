'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
}

/**
 * URL-driven pagination. Writes only the `page` search param (preserving every
 * other param, e.g. the active admin `tab` or a `search` query) so the parent
 * Server Component can read it and fetch the matching slice. State lives in the
 * URL — back button and shareable links work for free.
 */
export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  function goTo(target: number) {
    const params = new URLSearchParams(searchParams);
    if (target <= 1) params.delete('page');
    else params.set('page', String(target));
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  const btn = (disabled: boolean) =>
    cn(
      'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm border transition-colors',
      disabled
        ? 'opacity-40 cursor-not-allowed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
        : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
    );

  return (
    <div className={cn('flex items-center justify-between pt-2 transition-opacity', isPending && 'opacity-60')}>
      <button onClick={() => goTo(page - 1)} disabled={page <= 1} className={btn(page <= 1)}>
        <span className="material-symbols-outlined text-base">chevron_left</span>
        Prev
      </button>
      <span className="text-xs text-[var(--color-on-surface-variant)]">
        Page {page} of {totalPages}
      </span>
      <button onClick={() => goTo(page + 1)} disabled={page >= totalPages} className={btn(page >= totalPages)}>
        Next
        <span className="material-symbols-outlined text-base">chevron_right</span>
      </button>
    </div>
  );
}
