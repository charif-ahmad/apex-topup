import { listUsersAction } from '@/actions/admin';
import { UsersTable } from '@/components/admin/UsersTable';
import { UserSearch } from '@/components/admin/UserSearch';
import { Pagination } from '@/components/ui/Pagination';
import { firstParam, pageParam, type SearchParams } from '@/lib/utils/searchParams';

const PAGE_SIZE = 10;

/**
 * Async Server Component for the Users tab. Reads `search`/`page` from the URL,
 * fetches the matching slice, and streams it (wrapped in <Suspense> by the page).
 */
export async function UsersPanel({ searchParams }: { searchParams: SearchParams }) {
  const page = pageParam(searchParams.page);
  const search = firstParam(searchParams.search);

  const data = await listUsersAction(page, PAGE_SIZE, search || undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UserSearch />
        <span className="text-xs text-[var(--color-on-surface-variant)]">{data.total} users total</span>
      </div>

      <UsersTable users={data.items} />
      <Pagination page={page} totalPages={data.totalPages} />
    </div>
  );
}
