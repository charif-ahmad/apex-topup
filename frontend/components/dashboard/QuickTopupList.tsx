'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Service } from '@/types/models';

// Lazy-loaded: the modal only mounts on tap, so keeping it (and its topup
// action) out of the dashboard's initial bundle cuts the JS parsed at load.
const PurchaseModal = dynamic(
  () => import('@/components/services/PurchaseModal').then((m) => m.PurchaseModal),
  { ssr: false },
);

const CATEGORY_ICONS: Record<string, string> = {
  mobile: 'smartphone',
  internet: 'wifi',
  giftcard: 'card_giftcard',
};

function categoryIcon(cat: string): string {
  return CATEGORY_ICONS[cat.toLowerCase()] ?? 'bolt';
}

interface QuickTopupListProps {
  services: Service[];
  walletBalance: number;
  loading?: boolean;
  onConfirm: (service: Service) => Promise<boolean>;
}

export function QuickTopupList({ services, walletBalance, loading = false, onConfirm }: QuickTopupListProps) {
  const [selected, setSelected] = useState<Service | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-[var(--radius-md)]" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {services.slice(0, 3).map((svc) => (
          <button
            key={svc.id}
            onClick={() => setSelected(svc)}
            className="group flex items-center gap-4 p-4 rounded-[var(--radius-md)] text-left transition-all hover:border-[var(--color-primary)]/50"
            style={{
              background: 'var(--color-surface-container-low)',
              border: '1px solid rgba(60,74,66,0.3)',
            }}
          >
            <div
              className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
              style={{ background: 'rgba(78,222,163,0.1)', border: '1px solid rgba(78,222,163,0.15)' }}
            >
              <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">
                {categoryIcon(svc.category)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-on-surface)] text-sm truncate">
                {svc.name}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)]">{svc.provider}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                {formatCurrency(svc.price)}
              </span>
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] group-hover:translate-x-1 group-hover:text-[var(--color-primary)] transition-all text-xl">
                chevron_right
              </span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <PurchaseModal
          service={selected}
          walletBalance={walletBalance}
          onClose={() => setSelected(null)}
          onConfirm={onConfirm}
          onSuccess={() => setSelected(null)}
        />
      )}
    </>
  );
}
