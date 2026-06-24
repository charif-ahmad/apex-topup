import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export type AdminTab = 'users' | 'services' | 'audit';

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'users', label: 'User Administration', icon: 'manage_accounts' },
  { id: 'services', label: 'Service Management', icon: 'account_tree' },
  { id: 'audit', label: 'Platform Audit Ledger', icon: 'policy' },
];

/**
 * Presentational tab shell. The active tab is a URL param, so the tab bar is just
 * a set of <Link>s — selecting one is a soft navigation that re-renders the page
 * Server Component with the new `tab`. Switching tabs starts each tab fresh by
 * linking to a bare `?tab=` (drops the previous tab's filters/page).
 */
export function AdminTabs({ activeTab, children }: { activeTab: AdminTab; children: React.ReactNode }) {
  return (
    <div
      className="glass-panel rounded-[var(--radius-lg)] overflow-hidden flex flex-col"
      style={{ background: 'rgba(21,29,48,0.75)', minHeight: '560px' }}
    >
      <div
        className="flex overflow-x-auto"
        style={{
          borderBottom: '1px solid rgba(60,74,66,0.2)',
          background: 'rgba(23,27,38,0.5)',
        }}
      >
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin?tab=${tab.id}`}
            scroll={false}
            className={cn(
              'flex items-center gap-2 px-5 py-4 text-xs font-semibold tracking-wide whitespace-nowrap border-b-2 transition-all',
              activeTab === tab.id
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
            )}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="p-6 flex-1">{children}</div>
    </div>
  );
}
