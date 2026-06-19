import { getAnalyticsAction } from '@/actions/admin';
import { AnalyticsCards } from '@/components/admin/AnalyticsCards';
import { AdminTabs } from '@/components/admin/AdminTabs';

export default async function AdminPage() {
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
        <AdminTabs />
      </div>
    </div>
  );
}
