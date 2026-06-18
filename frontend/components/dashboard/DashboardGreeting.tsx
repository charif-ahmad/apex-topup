'use client';

import { useAuth } from '@/context/AuthContext';

export function DashboardGreeting() {
  const { user } = useAuth();

  return (
    <header className="mb-8">
      <h1
        className="text-3xl font-semibold text-[var(--color-on-surface)]"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        Financial Overview
      </h1>
      <p className="text-[var(--color-on-surface-variant)] mt-1">
        Welcome back, {user?.name ?? '—'}. Manage your assets and track spending.
      </p>
    </header>
  );
}
