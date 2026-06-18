import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Analytics } from '@/types/models';

interface AnalyticsCardsProps {
  analytics: Analytics | null;
  loading: boolean;
}

const CARDS = [
  {
    key: 'totalRevenue' as const,
    label: 'Total Revenue',
    icon: 'payments',
    bgIcon: 'payments',
    accent: 'var(--color-primary)',
    accentBg: 'rgba(78,222,163,0.1)',
    trend: '+12.4%',
    trendIcon: 'trending_up',
    suffix: '',
    format: (v: number) => formatCurrency(v),
    progress: 75,
  },
  {
    key: 'totalUsers' as const,
    label: 'Total Users',
    icon: 'group',
    bgIcon: 'group',
    accent: 'var(--color-secondary)',
    accentBg: 'rgba(173,198,255,0.1)',
    trend: '+4.2%',
    trendIcon: 'trending_up',
    suffix: 'Active',
    format: (v: number) => v.toLocaleString(),
    progress: 60,
  },
  {
    key: 'totalTransactions' as const,
    label: 'Transactions',
    icon: 'swap_horiz',
    bgIcon: 'swap_horiz',
    accent: 'var(--color-tertiary)',
    accentBg: 'rgba(255,185,95,0.1)',
    trend: '0.0%',
    trendIcon: 'trending_flat',
    suffix: 'Processed',
    format: (v: number) => v.toLocaleString(),
    progress: 90,
  },
];

export function AnalyticsCards({ analytics, loading }: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="glass-panel rounded-[var(--radius-lg)] p-6 relative overflow-hidden group"
          style={{ background: 'rgba(21,29,48,0.75)' }}
        >
          {/* Decorative big icon */}
          <div
            className="absolute -right-3 -bottom-3 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"
            style={{ color: card.accent }}
          >
            <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {card.bgIcon}
            </span>
          </div>

          {/* Top row */}
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              {card.label}
            </span>
            <span
              className="flex items-center gap-1 text-xs font-bold"
              style={{ color: card.accent }}
            >
              <span className="material-symbols-outlined text-sm">{card.trendIcon}</span>
              {card.trend}
            </span>
          </div>

          {/* Value */}
          {loading ? (
            <Skeleton className="h-9 w-32 mb-4" />
          ) : (
            <div className="flex items-baseline gap-2 mb-4">
              <span
                className="text-3xl font-bold text-[var(--color-on-surface)]"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {card.format(analytics?.[card.key] ?? 0)}
              </span>
              {card.suffix && (
                <span className="text-sm text-[var(--color-on-surface-variant)]">{card.suffix}</span>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ background: 'var(--color-surface-container-highest)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${card.progress}%`, background: card.accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
