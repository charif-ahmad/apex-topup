'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { addFundsAction } from '@/actions/wallet';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { Pagination } from '@/components/ui/Pagination';
import type { Transaction } from '@/types/models';

// Lazy-loaded: only mounts when "Add Funds" is tapped. This keeps react-hook-form
// + zod (its validation stack) out of the wallet page's initial bundle.
const AddFundsModal = dynamic(
  () => import('@/components/wallet/AddFundsModal').then((m) => m.AddFundsModal),
  { ssr: false },
);

interface WalletPageClientProps {
  initialBalance: number;
  transactions: Transaction[];
  page: number;
  totalPages: number;
}

export function WalletPageClient({ initialBalance, transactions, page, totalPages }: WalletPageClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Optimistic ledger: a top-up appends a `pending` credit row instantly. On
  // server confirmation router.refresh() supplies the real (reconciled) row; on
  // a failed payment or error the optimistic row auto-reverts and we toast.
  const [optimisticTxns, addOptimisticTxn] = useOptimistic(
    transactions,
    (state, pending: Transaction) => [pending, ...state],
  );

  function handleAddFunds(amount: number) {
    setShowAdd(false); // close the input modal at 0ms; the pending row is the feedback
    startTransition(async () => {
      addOptimisticTxn({
        id: -Date.now(), // temp id; replaced by the real row on refresh
        userId: user?.id ?? '',
        type: 'credit',
        amount,
        status: 'pending',
        serviceId: null,
        reference: null,
        createdAt: new Date().toISOString(),
        service: null,
      });

      const res = await addFundsAction(amount);
      if (res.error) {
        // Unknown server state (transport/validation) — drop the optimistic row.
        toast(res.error, 'error');
        return;
      }
      // The backend records every attempt (success OR failed) as a real
      // transaction, so we reconcile in both cases: refresh swaps the optimistic
      // `pending` row for the recorded row. Balance only moves on success.
      if (res.data?.paymentStatus === 'failed') {
        toast('Payment simulation failed. Please try again.', 'error');
      } else {
        toast(`MYR ${amount} added successfully!`, 'success');
      }
      router.refresh(); // optimistic pending holds until the reconciled data paints
    });
  }

  return (
    <div className="page-container py-6 md:py-8">
      <header className="mb-6 md:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Wallet Management
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1">
          Manage your digital assets and funding history.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
        {/* Balance Card */}
        <div className="lg:col-span-7">
          <div
            className="glass-card rounded-[var(--radius-lg)] p-6 relative overflow-hidden flex flex-col gap-6"
            style={{ background: 'rgba(21,29,48,0.75)' }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(78,222,163,0.6) 0%, transparent 100%)' }}
            />
            <div
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'rgba(78,222,163,0.06)', filter: 'blur(80px)' }}
            />

            <div className="relative z-10 flex items-start justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-primary)]">
                Available Liquidity
              </span>
              <span
                className="material-symbols-outlined text-[var(--color-primary)] opacity-50 text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>

            <div className="relative z-10">
              <span
                className="text-[clamp(32px,5vw,48px)] font-medium text-[var(--color-on-surface)] leading-tight"
                style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.01em' }}
              >
                {formatCurrency(initialBalance)}
              </span>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">
                Account holder:{' '}
                <span className="text-[var(--color-on-surface)] font-medium">{user?.name}</span>
              </p>
            </div>

            <div
              className="relative z-10 flex flex-wrap gap-3 pt-4"
              style={{ borderTop: '1px solid rgba(60,74,66,0.3)' }}
            >
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  boxShadow: '0 8px 24px -4px rgba(78,222,163,0.3)',
                }}
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                Add Funds
              </button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {[
            { label: 'Currency', value: 'Malaysian Ringgit (MYR)', icon: 'payments' },
            { label: 'Account Type', value: 'Digital Wallet', icon: 'account_balance' },
            { label: 'Security', value: 'AES-256 Encrypted', icon: 'shield' },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="glass-card rounded-[var(--radius-md)] p-4 flex items-center gap-4"
              style={{ background: 'rgba(21,29,48,0.75)' }}
            >
              <div
                className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                style={{ background: 'rgba(78,222,163,0.1)' }}
              >
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">{icon}</span>
              </div>
              <div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{label}</p>
                <p className="text-sm font-semibold text-[var(--color-on-surface)]">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div
        className="glass-card rounded-[var(--radius-lg)] p-4 sm:p-6"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <h2
          className="text-base font-semibold text-[var(--color-on-surface)] mb-4"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Transaction History
        </h2>
        <div className="flex flex-col gap-4">
          <TransactionTable transactions={optimisticTxns} />
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>

      {showAdd && (
        <AddFundsModal onClose={() => setShowAdd(false)} onAddFunds={handleAddFunds} />
      )}
    </div>
  );
}
