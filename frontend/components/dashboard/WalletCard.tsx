'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface WalletCardProps {
  balance: number;
}

export function WalletCard({ balance }: WalletCardProps) {
  return (
    <div
      className="glass-card rounded-[var(--radius-lg)] p-6 relative overflow-hidden"
      style={{ background: 'rgba(21,29,48,0.75)' }}
    >
      {/* Teal glow blob */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'rgba(78,222,163,0.08)', filter: 'blur(60px)' }}
      />

      {/* Gradient top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, rgba(78,222,163,0.5) 0%, transparent 100%)' }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ background: 'rgba(78,222,163,0.1)', border: '1px solid rgba(78,222,163,0.2)' }}
            >
              <span
                className="material-symbols-outlined text-[var(--color-primary)] text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
            <span
              className="text-lg font-semibold text-[var(--color-on-surface)]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Main Wallet
            </span>
          </div>
          {/* Decorative chip */}
          <div
            className="w-14 h-9 rounded-[var(--radius-sm)] flex items-center justify-center overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, var(--color-tertiary), var(--color-on-tertiary-container))',
            }}
          >
            <div
              className="w-10 h-px rounded-full opacity-40"
              style={{ background: 'var(--color-tertiary-fixed-dim)' }}
            />
          </div>
        </div>

        {/* Balance */}
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
            Available Balance
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span
              className="text-[40px] leading-tight font-medium text-[var(--color-on-surface)]"
              style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-0.01em' }}
            >
              {formatCurrency(balance)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(60,74,66,0.3)' }}
        >
          <Link
            href="/wallet"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] font-semibold text-sm transition-all active:scale-95 hover:scale-[1.02]"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              boxShadow: '0 8px 24px -4px rgba(78,222,163,0.3)',
            }}
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Add Funds
          </Link>
          <Link
            href="/transactions"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] font-semibold text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)] transition-all"
            style={{ border: '1px solid var(--color-outline-variant)' }}
          >
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            History
          </Link>
        </div>
      </div>
    </div>
  );
}
