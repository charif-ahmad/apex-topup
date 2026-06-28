'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { executeTopupAction } from '@/actions/topup';
import { QuickTopupList } from '@/components/dashboard/QuickTopupList';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import type { Service, Transaction } from '@/types/models';

interface DashboardActivityProps {
  services: Service[];
  walletBalance: number;
  transactions: Transaction[];
}

/**
 * Client owner for the dashboard's activity row. Holds the recent-transactions
 * list via useOptimistic (seeded by server data) so a purchase from QuickTopupList
 * appends a `pending` debit row at 0ms and reconciles on refresh — same pattern as
 * the wallet top-up. topup is deterministic (only insufficient funds fail, which the
 * UI blocks), so we always refresh to reflect the server's recorded row.
 */
export function DashboardActivity({ services, walletBalance, transactions }: DashboardActivityProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [optimisticTxns, addOptimisticTxn] = useOptimistic(
    transactions,
    (state, pending: Transaction) => [pending, ...state],
  );

  function handleConfirm(service: Service): Promise<boolean> {
    return new Promise((resolve) => {
      startTransition(async () => {
        addOptimisticTxn({
          id: -Date.now(), // temp id; replaced by the real row on refresh
          userId: user?.id ?? '',
          type: 'debit',
          amount: service.price,
          status: 'pending',
          serviceId: service.id,
          reference: null,
          createdAt: new Date().toISOString(),
          service: { id: service.id, name: service.name, category: service.category },
        });

        const res = await executeTopupAction(service.id);
        // Always reconcile: refresh swaps the optimistic pending row for the
        // server's recorded row (success or failed), or drops it if nothing was
        // persisted. Balance/stats update with it. Toast is handled by the modal.
        router.refresh();
        resolve(!res.error && res.data?.transaction.status === 'success');
      });
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-4">
        <h2
          className="text-base font-semibold text-[var(--color-on-surface)] flex items-center gap-2 mb-4"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">bolt</span>
          {t('dashboard.quickTopup')}
        </h2>
        <QuickTopupList services={services} walletBalance={walletBalance} onConfirm={handleConfirm} />
      </div>

      <div className="lg:col-span-8">
        <RecentTransactions transactions={optimisticTxns} loading={false} />
      </div>
    </div>
  );
}
