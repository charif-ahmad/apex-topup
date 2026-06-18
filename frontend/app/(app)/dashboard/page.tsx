import { getWalletAction } from '@/actions/wallet';
import { listTransactionsAction } from '@/actions/transactions';
import { listServicesAction } from '@/actions/services';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { QuickTopupList } from '@/components/dashboard/QuickTopupList';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default async function DashboardPage() {
  const [walletResult, txResult, svcResult] = await Promise.allSettled([
    getWalletAction(),
    listTransactionsAction({ limit: 5 }),
    listServicesAction(),
  ]);

  const wallet = walletResult.status === 'fulfilled' ? walletResult.value : null;
  const transactions = txResult.status === 'fulfilled' ? txResult.value.items : [];
  const services = svcResult.status === 'fulfilled' ? svcResult.value : [];

  const totalSpent = transactions
    .filter((t) => t.type === 'debit' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      <DashboardGreeting />

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7">
          <WalletCard wallet={wallet} loading={false} />
        </div>

        {/* Quick stats */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
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
              {transactions.length}
            </p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">Recent</p>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4">
          <h2
            className="text-base font-semibold text-[var(--color-on-surface)] flex items-center gap-2 mb-4"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">bolt</span>
            Quick Top-up
          </h2>
          <QuickTopupList services={services} walletBalance={wallet?.balance ?? 0} />
        </div>

        <div className="xl:col-span-8">
          <RecentTransactions transactions={transactions} loading={false} />
        </div>
      </div>
    </div>
  );
}
