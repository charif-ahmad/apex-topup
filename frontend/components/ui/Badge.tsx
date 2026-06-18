import { cn } from '@/lib/utils/cn';
import type { TransactionStatus, TransactionType } from '@/types/models';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)]',
  error: 'bg-[color-mix(in_srgb,var(--color-error)_15%,transparent)] text-[var(--color-error)]',
  warning: 'bg-[color-mix(in_srgb,var(--color-tertiary)_15%,transparent)] text-[var(--color-tertiary)]',
  info: 'bg-[color-mix(in_srgb,var(--color-secondary)_15%,transparent)] text-[var(--color-secondary)]',
  neutral: 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-xs font-semibold tracking-wide',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, { label: string; variant: BadgeVariant }> = {
    success: { label: 'Success', variant: 'success' },
    failed: { label: 'Failed', variant: 'error' },
    pending: { label: 'Pending', variant: 'warning' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function TypeBadge({ type }: { type: TransactionType }) {
  const map: Record<TransactionType, { label: string; variant: BadgeVariant }> = {
    credit: { label: 'Credit', variant: 'success' },
    debit: { label: 'Debit', variant: 'info' },
  };
  const { label, variant } = map[type];
  return <Badge variant={variant}>{label}</Badge>;
}
