import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import type { Transaction } from '@/types/models';

interface TransactionTableProps {
  transactions: Transaction[];
}

/**
 * Pure presentational table. No data fetching, no state — the caller (a Server
 * Component) is responsible for fetching and passing `transactions`. Safe to use
 * from both server and client trees since it has no hooks or server-only imports.
 */
export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
        <span className="material-symbols-outlined text-4xl opacity-40">receipt_long</span>
        <p className="text-sm">No transactions found</p>
      </div>
    );
  }

  return (
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
    </>
  );
}
