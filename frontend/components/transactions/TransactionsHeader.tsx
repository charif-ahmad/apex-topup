'use client';

import { useLanguage } from '@/context/LanguageContext';

/** Locale-aware header for the (server-rendered) transactions page. */
export function TransactionsHeader() {
  const { t } = useLanguage();
  return (
    <header className="mb-6 md:mb-8">
      <h1
        className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)]"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        {t('transactions.title')}
      </h1>
      <p className="text-[var(--color-on-surface-variant)] mt-1">
        {t('transactions.subtitle')}
      </p>
    </header>
  );
}

/** Locale-aware "N transactions" count, used inside the server view. */
export function TransactionsCount({ total }: { total: number }) {
  const { t } = useLanguage();
  return (
    <span className="self-end -mt-2 text-xs text-[var(--color-on-surface-variant)]">
      {t('transactions.count', { count: total })}
    </span>
  );
}
