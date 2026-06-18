'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils/cn';

const USER_NAV = [
  { label: 'Home', href: '/dashboard', icon: 'dashboard' },
  { label: 'Wallet', href: '/wallet', icon: 'account_balance_wallet' },
  { label: 'Services', href: '/services', icon: 'apps' },
  { label: 'History', href: '/transactions', icon: 'receipt_long' },
  { label: 'Profile', href: '/profile', icon: 'manage_accounts' },
];

const ADMIN_NAV = [
  { label: 'Home', href: '/dashboard', icon: 'dashboard' },
  { label: 'Admin', href: '/admin', icon: 'admin_panel_settings' },
  { label: 'Wallet', href: '/wallet', icon: 'account_balance_wallet' },
  { label: 'Profile', href: '/profile', icon: 'manage_accounts' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const nav = user?.role === 'admin' ? ADMIN_NAV : USER_NAV;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]">
      <div className="flex items-center justify-around px-2 py-1 safe-pb">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-[var(--radius-md)] transition-colors min-w-[52px]',
                active
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)]',
              )}
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
