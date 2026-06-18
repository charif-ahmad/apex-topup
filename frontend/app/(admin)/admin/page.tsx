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
        className="sticky top-0 z-20 px-6 md:px-8 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(21,29,48,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(60,74,66,0.2)',
        }}
      >
        <div>
          <h1
            className="text-2xl font-bold text-[var(--color-on-surface)]"
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

      <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
        <AnalyticsCards analytics={analytics} loading={false} />
        <AdminTabs />
      </div>
    </div>
  );
}
