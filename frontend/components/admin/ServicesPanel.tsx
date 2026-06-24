import { listAllServicesAdminAction } from '@/actions/services';
import { ServiceManager } from '@/components/admin/ServiceManager';
import { firstParam, type SearchParams } from '@/lib/utils/searchParams';

/**
 * Async Server Component for the Services tab. The admin catalog is a small
 * unpaginated list, so we fetch it whole and filter server-side from the URL
 * params, then hand the filtered slice to the ServiceManager client island.
 */
export async function ServicesPanel({ searchParams }: { searchParams: SearchParams }) {
  const status = firstParam(searchParams.status) ?? 'all';
  const category = firstParam(searchParams.category) ?? 'all';

  const all = await listAllServicesAdminAction();

  const filtered = all.filter((s) => {
    const statusOk =
      status === 'all' ||
      (status === 'active' && s.isActive) ||
      (status === 'inactive' && !s.isActive);
    const categoryOk = category === 'all' || s.category === category;
    return statusOk && categoryOk;
  });

  return <ServiceManager services={filtered} filteredCount={filtered.length} totalCount={all.length} />;
}
