import { TransactionTable } from '@/components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      <header className="mb-8">
        <h1
          className="text-3xl font-semibold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Transaction History
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1">
          Full audit trail of all your wallet activity.
        </p>
      </header>

      <div
        className="glass-card rounded-[var(--radius-lg)] p-6"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <TransactionTable showFilters />
      </div>
    </div>
  );
}
