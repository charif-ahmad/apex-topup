import { Suspense } from 'react';
import { listTransactionsAction } from '@/actions/transactions';
import type { TransactionFilters as Filters } from '@/actions/transactions';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonTable } from '@/components/ui/Skeleton';

const PAGE_SIZE = 10;

type SearchParams = { [key: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  // Re-key Suspense on the params that affect the query so navigating filters/pages
  // shows the skeleton fallback while the server refetches, instead of a stale table.
  const suspenseKey = `${first(sp.page) ?? ''}:${first(sp.type) ?? ''}:${first(sp.status) ?? ''}`;

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
        <div className="flex flex-col gap-4">
          {/* Stays mounted across navigations so selects keep focus/value */}
          <TransactionFilters />

          <Suspense key={suspenseKey} fallback={<SkeletonTable rows={8} cols={5} />}>
            <TransactionsView searchParams={sp} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function TransactionsView({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, Number(first(searchParams.page)) || 1);
  const type = first(searchParams.type) as Filters['type'];
  const status = first(searchParams.status) as Filters['status'];

  const data = await listTransactionsAction({ page, limit: PAGE_SIZE, type, status });

  return (
    <>
      <span className="self-end -mt-2 text-xs text-[var(--color-on-surface-variant)]">
        {data.total} transactions
      </span>
      <TransactionTable transactions={data.items} />
      <Pagination page={page} totalPages={data.totalPages} />
    </>
  );
}
