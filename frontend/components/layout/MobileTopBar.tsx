'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { SidebarContent } from './Sidebar';

/**
 * Top bar shown below `lg`. Holds the APEX logo and a hamburger button that
 * opens a sliding drawer reusing <SidebarContent />. Closes on link tap,
 * overlay click, or Escape; locks body scroll while open.
 */
export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Top bar */}
      {/* Trailing padding (pe-28) reserves room in the top-trailing corner for the
          global FloatingLanguageSwitcher so the hamburger never sits under it. */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between ps-4 pe-28 h-14 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]/90 backdrop-blur-md safe-pt">
        <span className="text-lg font-bold font-[var(--font-outfit)] text-[var(--color-primary)]">
          APEX
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 right-0 z-50 flex flex-col w-72 max-w-[85vw] border-l border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );
}
