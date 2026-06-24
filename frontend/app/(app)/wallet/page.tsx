import { Suspense } from 'react';
import { getWalletAction } from '@/actions/wallet';
import { listTransactionsAction } from '@/actions/transactions';
import { WalletPageClient } from './WalletPageClient';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';

type SearchParams = { [key: string]: string | string[] | undefined };

function WalletContentSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
        <div className="lg:col-span-7">
          <Skeleton className="h-52 rounded-[var(--radius-lg)]" />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] rounded-[var(--radius-md)]" />
          ))}
        </div>
      </div>

      <div
        className="glass-card rounded-[var(--radius-lg)] p-4 sm:p-6"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <Skeleton className="h-6 w-40 mb-4" />
        <SkeletonTable rows={6} cols={5} />
      </div>
    </div>
  );
}

async function WalletContentSection({ page }: { page: number }) {
  const [balance, transactions] = await Promise.all([
    getWalletAction().catch(() => 0),
    listTransactionsAction({ page, limit: 10 }),
  ]);

  return (
    <WalletPageClient
      initialBalance={balance}
      transactions={transactions.items}
      page={page}
      totalPages={transactions.totalPages}
    />
  );
}

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, Number(pageParam) || 1);

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

      <Suspense fallback={<WalletContentSkeleton />}>
        <WalletContentSection page={page} />
      </Suspense>
    </div>
  );
}
