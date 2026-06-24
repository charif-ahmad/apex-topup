import { Suspense } from 'react';
import { getAnalyticsAction } from '@/actions/admin';
import { AnalyticsCards } from '@/components/admin/AnalyticsCards';
import { AdminTabs } from '@/components/admin/AdminTabs';
import type { AdminTab } from '@/components/admin/AdminTabs';
import { UsersPanel } from '@/components/admin/UsersPanel';
import { ServicesPanel } from '@/components/admin/ServicesPanel';
import { AuditPanel } from '@/components/admin/AuditPanel';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { firstParam as first, type SearchParams } from '@/lib/utils/searchParams';

const TABS: AdminTab[] = ['users', 'services', 'audit'];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const tabParam = first(sp.tab) as AdminTab | undefined;
  const tab: AdminTab = tabParam && TABS.includes(tabParam) ? tabParam : 'users';
  // Re-key Suspense on the full query so changing a filter/page (or the tab)
  // shows the skeleton while the active panel refetches server-side.
  const suspenseKey = `${tab}:${first(sp.search) ?? ''}:${first(sp.status) ?? ''}:${first(sp.category) ?? ''}:${first(sp.page) ?? ''}`;

  let analytics = null;
  try {
    analytics = await getAnalyticsAction();
  } catch {
    // analytics stays null, cards show 0
  }

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <header
        className="lg:sticky lg:top-0 z-20 px-4 sm:px-6 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3 flex-wrap"
        style={{
          background: 'rgba(21,29,48,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(60,74,66,0.2)',
        }}
      >
        <div className="min-w-0">
          <h1
            className="text-xl sm:text-2xl font-bold text-[var(--color-on-surface)]"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Admin Control
          </h1>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            System oversight and platform governance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'var(--color-surface-container-high)',
              border: '1px solid rgba(60,74,66,0.3)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--color-primary)' }}
            />
            <span className="text-[var(--color-on-surface)]">SYSTEM LIVE</span>
          </div>
        </div>
      </header>

      <div className="page-container py-6 md:py-8 space-y-6">
        <AnalyticsCards analytics={analytics} loading={false} />
        <AdminTabs activeTab={tab}>
          <Suspense key={suspenseKey} fallback={<SkeletonTable rows={8} cols={5} />}>
            {tab === 'users' && <UsersPanel searchParams={sp} />}
            {tab === 'services' && <ServicesPanel searchParams={sp} />}
            {tab === 'audit' && <AuditPanel searchParams={sp} />}
          </Suspense>
        </AdminTabs>
      </div>
    </div>
  );
}
