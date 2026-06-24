import { listAllTransactionsAction } from '@/actions/admin';
import { AuditTable } from '@/components/admin/AuditTable';
import { AuditFilters } from '@/components/admin/AuditFilters';
import { Pagination } from '@/components/ui/Pagination';
import { firstParam, pageParam, type SearchParams } from '@/lib/utils/searchParams';
import type { TransactionFilters } from '@/actions/transactions';

const PAGE_SIZE = 15;

/** Async Server Component for the Audit tab. Reads `status`/`page` from the URL. */
export async function AuditPanel({ searchParams }: { searchParams: SearchParams }) {
  const page = pageParam(searchParams.page);
  const status = firstParam(searchParams.status) as TransactionFilters['status'];

  const data = await listAllTransactionsAction({ page, limit: PAGE_SIZE, status });

  return (
    <div className="flex flex-col gap-4">
      <AuditFilters total={data.total} />
      <AuditTable transactions={data.items} />
      <Pagination page={page} totalPages={data.totalPages} />
    </div>
  );
}
