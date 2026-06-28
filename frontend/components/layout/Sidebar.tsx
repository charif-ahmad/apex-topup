'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

/**
 * The inner content of the sidebar (logo, nav, user/logout). Shared between the
 * fixed desktop sidebar and the sliding mobile drawer. `onNavigate` lets the
 * drawer close itself when a link is tapped.
 */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const userNav: NavItem[] = [
    { label: t('nav.dashboard'), href: '/dashboard', icon: 'dashboard' },
    { label: t('nav.wallet'), href: '/wallet', icon: 'account_balance_wallet' },
    { label: t('nav.services'), href: '/services', icon: 'apps' },
    { label: t('nav.transactions'), href: '/transactions', icon: 'receipt_long' },
    { label: t('nav.profile'), href: '/profile', icon: 'manage_accounts' },
  ];

  const adminNav: NavItem[] = [
    { label: t('nav.dashboard'), href: '/dashboard', icon: 'dashboard' },
    { label: t('nav.adminPanel'), href: '/admin', icon: 'admin_panel_settings' },
    { label: t('nav.wallet'), href: '/wallet', icon: 'account_balance_wallet' },
    { label: t('nav.services'), href: '/services', icon: 'apps' },
    { label: t('nav.transactions'), href: '/transactions', icon: 'receipt_long' },
    { label: t('nav.profile'), href: '/profile', icon: 'manage_accounts' },
  ];

  const nav = user?.role === 'admin' ? adminNav : userNav;

  return (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--color-outline-variant)]">
        <span className="text-xl font-bold font-[var(--font-outfit)] text-[var(--color-primary)]">
          APEX
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                active
                  ? 'bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]',
              )}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[var(--color-outline-variant)]">
        {user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          {t('nav.signOut')}
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] sticky top-0 h-screen">
      <SidebarContent />
    </aside>
  );
}
