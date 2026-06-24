import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import type { Transaction } from '@/types/models';

/** Pure presentational, server-rendered ledger table. */
export function AuditTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
        <span className="material-symbols-outlined text-4xl opacity-40">policy</span>
        <p className="text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
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
                  style={{ color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)' }}
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

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="rounded-[var(--radius-md)] p-4 flex flex-col gap-2"
            style={{ background: 'rgba(38,42,53,0.5)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
                {tx.service?.name ?? (tx.type === 'credit' ? 'Wallet Top-up' : 'Purchase')}
              </p>
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)' }}
              >
                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <TypeBadge type={tx.type} />
                <StatusBadge status={tx.status} />
              </div>
              <span className="text-xs font-mono text-[var(--color-on-surface-variant)]">
                {tx.userId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-[var(--color-on-surface-variant)]">
              {formatDate(tx.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
