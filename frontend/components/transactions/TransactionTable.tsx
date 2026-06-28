'use client';

import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import type { Transaction } from '@/types/models';

interface TransactionTableProps {
  transactions: Transaction[];
}

/**
 * Pure presentational table. No data fetching — the caller passes `transactions`.
 * It's a client component so labels react to the active locale.
 */
export function TransactionTable({ transactions }: TransactionTableProps) {
  const { t } = useLanguage();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
        <span className="material-symbols-outlined text-4xl opacity-40">receipt_long</span>
        <p className="text-sm">{t('transactions.empty')}</p>
      </div>
    );
  }

  // Per-column alignment. Headers and data share the same `align` so a column's
  // heading always sits over its cells — in both LTR and RTL (logical text-start /
  // text-end flip automatically with the `dir` attribute on <html>).
  const columns = [
    { key: 'date', label: t('transactions.colDate'), align: 'text-start' },
    { key: 'description', label: t('transactions.colDescription'), align: 'text-start' },
    { key: 'type', label: t('transactions.colType'), align: 'text-start' },
    { key: 'amount', label: t('transactions.colAmount'), align: 'text-end' },
    { key: 'status', label: t('transactions.colStatus'), align: 'text-start' },
  ];

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(60,74,66,0.4)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.align} py-2 pb-3 pe-4 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]`}
                >
                  {col.label}
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
                <td className="py-3 pe-4 text-start text-[var(--color-on-surface-variant)] whitespace-nowrap">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="py-3 pe-4 text-start text-[var(--color-on-surface)] max-w-[200px] truncate">
                  {tx.service?.name ?? (tx.type === 'credit' ? t('tx.walletTopup') : t('tx.servicePurchase'))}
                </td>
                <td className="py-3 pe-4 text-start">
                  <TypeBadge type={tx.type} />
                </td>
                <td
                  className="py-3 pe-4 font-semibold text-end"
                  style={{
                    color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)',
                  }}
                >
                  <span dir="ltr" className="inline-block">
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </td>
                <td className="py-3 text-start">
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
                {tx.service?.name ?? (tx.type === 'credit' ? t('tx.walletTopup') : t('tx.purchase'))}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                {formatDate(tx.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                dir="ltr"
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
