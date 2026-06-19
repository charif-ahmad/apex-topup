'use client';

import { useState, useEffect, useCallback } from 'react';
import { listTransactionsAction } from '@/actions/transactions';
import type { TransactionFilters } from '@/actions/transactions';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import type { Transaction } from '@/types/models';

interface TransactionTableProps {
  filters?: TransactionFilters;
  showFilters?: boolean;
}

export function TransactionTable({ filters: externalFilters, showFilters = false }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters>({ limit: 10 });

  // Serialize externalFilters to a stable string so the callback/effect do not
  // re-run on every render when a caller passes an inline object literal.
  const externalKey = JSON.stringify(externalFilters ?? {});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const merged = { ...filters, ...externalFilters, page };
      const res = await listTransactionsAction(merged);
      setTransactions(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
    // externalKey is the stable serialization of externalFilters — using it
    // instead of externalFilters avoids infinite re-renders from object identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, externalKey, page]);

  useEffect(() => { load(); }, [load]);

  function setFilter<K extends keyof TransactionFilters>(key: K, val: TransactionFilters[K]) {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4">
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <select
            className="px-3 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
            value={filters.type ?? ''}
            onChange={(e) =>
              setFilter('type', (e.target.value as 'credit' | 'debit') || undefined)
            }
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          <select
            className="px-3 py-2 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
            value={filters.status ?? ''}
            onChange={(e) =>
              setFilter(
                'status',
                (e.target.value as 'pending' | 'success' | 'failed') || undefined,
              )
            }
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* <button
            onClick={() => { setFilters({ limit: 10 }); setPage(1); }}
            className="px-3 py-2 rounded-[var(--radius-md)] text-sm border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
          >
            Clear
          </button> */}

          <span className="ml-auto text-xs text-[var(--color-on-surface-variant)] self-center">
            {total} transactions
          </span>
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={8} cols={5} />
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-4xl opacity-40">receipt_long</span>
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(60,74,66,0.4)' }}>
                  {['Date', 'Description', 'Type', 'Amount', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 pb-3 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] pr-4"
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
                    style={{ borderBottom: '1px solid rgba(60,74,66,0.2)' }}
                  >
                    <td className="py-3 pr-4 text-[var(--color-on-surface-variant)] whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="py-3 pr-4 text-[var(--color-on-surface)] max-w-[200px] truncate">
                      {tx.service?.name ?? (tx.type === 'credit' ? 'Wallet Top-up' : 'Service Purchase')}
                    </td>
                    <td className="py-3 pr-4">
                      <TypeBadge type={tx.type} />
                    </td>
                    <td
                      className="py-3 pr-4 font-semibold text-right"
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

          {/* Mobile list */}
          <div
            className="md:hidden flex flex-col divide-y"
            style={{ borderColor: 'rgba(60,74,66,0.3)' }}
          >
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 py-3">
                <div
                  className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                  style={{
                    background: tx.type === 'credit' ? 'rgba(78,222,163,0.1)' : 'rgba(173,198,255,0.1)',
                  }}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{
                      color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-secondary)',
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                    {tx.service?.name ?? (tx.type === 'credit' ? 'Wallet Top-up' : 'Purchase')}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)',
                    }}
                  >
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
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
