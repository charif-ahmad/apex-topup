import { Suspense } from 'react';
import { getWalletAction } from '@/actions/wallet';
import { listTransactionsAction, getTransactionSummaryAction } from '@/actions/transactions';
import { listServicesAction } from '@/actions/services';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { DashboardActivity } from '@/components/dashboard/DashboardActivity';
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Skeleton } from '@/components/ui/Skeleton';

// Skeletons for independent streaming sections
function WalletCardSkeleton() {
  return <Skeleton className="h-56 rounded-[var(--radius-lg)]" />;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="col-span-2 h-20 rounded-[var(--radius-lg)]" />
      <Skeleton className="h-24 rounded-[var(--radius-lg)]" />
      <Skeleton className="h-24 rounded-[var(--radius-lg)]" />
    </div>
  );
}

function DashboardActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
      <div className="lg:col-span-4 flex flex-col gap-3">
        <Skeleton className="h-6 w-32 mb-1" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-[var(--radius-md)]" />
        ))}
      </div>
      <div className="lg:col-span-8">
        <Skeleton className="h-64 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}

// Server Components for fetching and rendering independent data parts
async function WalletSection() {
  const balance = await getWalletAction().catch(() => 0);
  return <WalletCard balance={balance} />;
}

async function StatsSection() {
  const [summaryResult, svcResult] = await Promise.allSettled([
    getTransactionSummaryAction(),
    listServicesAction(),
  ]);

  const summary =
    summaryResult.status === 'fulfilled'
      ? summaryResult.value
      : { totalSpent: 0, totalTransactions: 0 };
  const services = svcResult.status === 'fulfilled' ? svcResult.value : [];
  const totalSpent = summary.totalSpent;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className="col-span-2 glass-card rounded-[var(--radius-lg)] p-4 flex items-center justify-between"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
            Total Spent
          </span>
          <p
            className="text-xl font-bold text-[var(--color-on-surface)] mt-1"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center"
          style={{ background: 'rgba(173,198,255,0.1)' }}
        >
          <span
            className="material-symbols-outlined text-[var(--color-secondary)] text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            insights
          </span>
        </div>
      </div>

      <div
        className="glass-card rounded-[var(--radius-lg)] p-4"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
          Services
        </span>
        <p
          className="text-xl font-bold text-[var(--color-tertiary)] mt-1"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {services.length}
        </p>
        <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">Active</p>
      </div>

      <div
        className="glass-card rounded-[var(--radius-lg)] p-4"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
          Transactions
        </span>
        <p
          className="text-xl font-bold text-[var(--color-primary)] mt-1"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {summary.totalTransactions}
        </p>
        <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">Total</p>
      </div>
    </div>
  );
}

async function DashboardActivitySection() {
  const [walletResult, txResult, svcResult] = await Promise.allSettled([
    getWalletAction(),
    listTransactionsAction({ limit: 5 }),
    listServicesAction(),
  ]);

  const walletBalance = walletResult.status === 'fulfilled' ? walletResult.value : 0;
  const transactions = txResult.status === 'fulfilled' ? txResult.value.items : [];
  const services = svcResult.status === 'fulfilled' ? svcResult.value : [];

  return (
    <DashboardActivity
      services={services}
      walletBalance={walletBalance}
      transactions={transactions}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className="page-container py-6 md:py-8">
      <DashboardGreeting />

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
        <div className="lg:col-span-7">
          <Suspense fallback={<WalletCardSkeleton />}>
            <WalletSection />
          </Suspense>
        </div>

        {/* Quick stats */}
        <div className="lg:col-span-5">
          <Suspense fallback={<StatsSkeleton />}>
            <StatsSection />
          </Suspense>
        </div>
      </div>

      {/* Bottom row — client owner for the optimistic pending-debit purchase flow */}
      <Suspense fallback={<DashboardActivitySkeleton />}>
        <DashboardActivitySection />
      </Suspense>
    </div>
  );
}

