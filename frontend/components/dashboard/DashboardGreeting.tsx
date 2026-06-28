'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export function DashboardGreeting() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="mb-8">
      <h1
        className="text-3xl font-semibold text-[var(--color-on-surface)]"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {t('dashboard.title')}
      </h1>
      <p className="text-[var(--color-on-surface-variant)] mt-1">
        {t('dashboard.greeting', { name: user?.name ?? '—' })}
      </p>
    </header>
  );
}
