'use client';

import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { StatusBadge, TypeBadge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import type { Transaction } from '@/types/models';

/** Presentational ledger table; client component so labels follow the locale. */
export function AuditTable({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
        <span className="material-symbols-outlined text-4xl opacity-40">policy</span>
        <p className="text-sm">{t('admin.auditEmpty')}</p>
      </div>
    );
  }

  // Per-column alignment, shared by header + data so columns line up in LTR and RTL.
  const columns = [
    { key: 'date', label: t('transactions.colDate'), align: 'text-start' },
    { key: 'userId', label: t('admin.colUserId'), align: 'text-start' },
    { key: 'description', label: t('transactions.colDescription'), align: 'text-start' },
    { key: 'type', label: t('transactions.colType'), align: 'text-start' },
    { key: 'amount', label: t('transactions.colAmount'), align: 'text-end' },
    { key: 'status', label: t('transactions.colStatus'), align: 'text-start' },
  ];

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(60,74,66,0.4)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.align} py-2 pb-3 pe-4 text-[10px] font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)]`}
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
                style={{ borderBottom: '1px solid rgba(60,74,66,0.15)' }}
              >
                <td className="py-3 pe-4 text-start text-[var(--color-on-surface-variant)] whitespace-nowrap text-xs">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="py-3 pe-4 text-start text-[var(--color-on-surface-variant)] font-mono text-xs">
                  {tx.userId.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-3 pe-4 text-start text-[var(--color-on-surface)] max-w-[160px] truncate">
                  {tx.service?.name ?? (tx.type === 'credit' ? t('tx.walletTopup') : t('tx.purchase'))}
                </td>
                <td className="py-3 pe-4 text-start">
                  <TypeBadge type={tx.type} />
                </td>
                <td
                  className="py-3 pe-4 font-semibold text-end whitespace-nowrap"
                  style={{ color: tx.type === 'credit' ? 'var(--color-primary)' : 'var(--color-on-surface)' }}
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
                {tx.service?.name ?? (tx.type === 'credit' ? t('tx.walletTopup') : t('tx.purchase'))}
              </p>
              <span
                dir="ltr"
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
