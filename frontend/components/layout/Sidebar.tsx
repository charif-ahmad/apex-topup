'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const USER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'My Wallet', href: '/wallet', icon: 'account_balance_wallet' },
  { label: 'Services', href: '/services', icon: 'apps' },
  { label: 'Transactions', href: '/transactions', icon: 'receipt_long' },
  { label: 'Profile', href: '/profile', icon: 'manage_accounts' },
];

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Admin Panel', href: '/admin', icon: 'admin_panel_settings' },
  { label: 'My Wallet', href: '/wallet', icon: 'account_balance_wallet' },
  { label: 'Profile', href: '/profile', icon: 'manage_accounts' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const nav = user?.role === 'admin' ? ADMIN_NAV : USER_NAV;

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[var(--color-outline-variant)]">
        <span className="text-xl font-bold font-[var(--font-outfit)] text-[var(--color-primary)]">
          APEX
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
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
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
