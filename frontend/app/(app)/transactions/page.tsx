import { TransactionTable } from '@/components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="page-container py-6 md:py-8">
      <header className="mb-6 md:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Transaction History
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1">
          Full audit trail of all your wallet activity.
        </p>
      </header>

      <div
        className="glass-card rounded-[var(--radius-lg)] p-4 sm:p-6"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <TransactionTable showFilters />
      </div>
    </div>
  );
}
