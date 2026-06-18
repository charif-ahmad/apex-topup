'use client';

import { useState, useEffect, useCallback } from 'react';
import { listAllTransactionsAction } from '@/actions/admin';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import type { Transaction } from '@/types/models';

export function AuditLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAllTransactionsAction({
        page,
        limit: 15,
        status: statusFilter ? (statusFilter as 'pending' | 'success' | 'failed') : undefined,
      });
      setTransactions(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="px-3 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <span className="ml-auto text-xs text-[var(--color-on-surface-variant)]">{total} records</span>
      </div>

      {loading ? (
        <SkeletonTable rows={10} cols={6} />
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-4xl opacity-40">policy</span>
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(60,74,66,0.4)' }}>
                  {['Date', 'User ID', 'Description', 'Type', 'Amount', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pb-3 pr-4 text-[10px] font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-[var(--color-surface-container-high)]/30 transition-colors"
                    style={{ borderBottom: '1px solid rgba(60,74,66,0.15)' }}
                  >
                    <td className="py-3 pr-4 text-[var(--color-on-surface-variant)] whitespace-nowrap text-xs">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-3 pr-4 text-[var(--color-on-surface-variant)] font-mono text-xs">
                      {tx.userId.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4 text-[var(--color-on-surface)] max-w-[160px] truncate">
                      {tx.service?.name ?? (tx.type === 'credit' ? 'Wallet Top-up' : 'Purchase')}
                    </td>
                    <td className="py-3 pr-4">
                      <TypeBadge type={tx.type} />
                    </td>
                    <td
                      className="py-3 pr-4 font-semibold whitespace-nowrap"
                      style={{
                        color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)',
                      }}
                    >
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm border transition-colors',
                  page === 1
                    ? 'opacity-40 cursor-not-allowed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
                )}
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
                Prev
              </button>
              <span className="text-xs text-[var(--color-on-surface-variant)]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm border transition-colors',
                  page === totalPages
                    ? 'opacity-40 cursor-not-allowed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
                )}
              >
                Next
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
