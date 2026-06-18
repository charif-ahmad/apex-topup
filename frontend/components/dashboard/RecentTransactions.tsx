import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import type { Transaction } from '@/types/models';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  return (
    <div
      className="glass-card rounded-[var(--radius-lg)] p-6 flex flex-col gap-4"
      style={{ background: 'rgba(21,29,48,0.75)' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-outfit)' }}>
          Recent Transactions
        </h2>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={3} />
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-4xl opacity-40">receipt_long</span>
          <p className="text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(60,74,66,0.3)' }}>
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 py-3">
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                style={{
                  background:
                    tx.type === 'credit'
                      ? 'rgba(78,222,163,0.1)'
                      : 'rgba(173,198,255,0.1)',
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

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                  {tx.service?.name ?? (tx.type === 'credit' ? 'Wallet Top-up' : 'Purchase')}
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  {formatDate(tx.createdAt)}
                </p>
              </div>

              {/* Amount + Status */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className="text-sm font-semibold"
                  style={{ color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)' }}
                >
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <StatusBadge status={tx.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
