'use client';

import { formatCurrency } from '@/lib/utils/formatCurrency';
import type { Service } from '@/types/models';

const CATEGORY_ICONS: Record<string, string> = {
  mobile: 'smartphone',
  internet: 'wifi',
  giftcard: 'card_giftcard',
};

interface ServiceCardProps {
  service: Service;
  onSelect: (s: Service) => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const icon = CATEGORY_ICONS[service.category.toLowerCase()] ?? 'bolt';

  return (
    <button
      onClick={() => onSelect(service)}
      className="group flex flex-col gap-4 p-5 rounded-[var(--radius-lg)] text-left transition-all hover:-translate-y-0.5"
      style={{
        background: 'rgba(21,29,48,0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(45,61,96,0.4)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(78,222,163,0.4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(45,61,96,0.4)';
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
        style={{ background: 'rgba(78,222,163,0.1)', border: '1px solid rgba(78,222,163,0.2)' }}
      >
        <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">{icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold text-[var(--color-on-surface)] text-sm leading-snug line-clamp-2">{service.name}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5 truncate">{service.provider}</p>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <span
          className="text-lg font-semibold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {formatCurrency(service.price)}
        </span>
        <span
          className="flex items-center gap-1 px-3 py-1 rounded-[var(--radius-sm)] text-xs font-semibold transition-all"
          style={{ background: 'rgba(78,222,163,0.1)', color: 'var(--color-primary)' }}
        >
          Buy
          <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </span>
      </div>
    </button>
  );
}
