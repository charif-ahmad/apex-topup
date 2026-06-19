'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceCard } from '@/components/services/ServiceCard';
import { PurchaseModal } from '@/components/services/PurchaseModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import type { Service } from '@/types/models';

const CATEGORIES = ['All', 'mobile', 'internet', 'giftcard'];

interface ServicesClientProps {
  initialServices: Service[];
  walletBalance: number;
}

export function ServicesClient({ initialServices, walletBalance }: ServicesClientProps) {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Service | null>(null);
  const router = useRouter();

  const filtered =
    category === 'All'
      ? initialServices
      : initialServices.filter((s) => s.category.toLowerCase() === category);

  return (
    <div className="page-container py-6 md:py-8">
      <header className="mb-6 md:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Services Directory
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1">
          Select a service to top up instantly from your wallet.
        </p>
      </header>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold capitalize transition-all border',
              category === cat
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:border-[var(--color-primary)]',
            )}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs text-[var(--color-on-surface-variant)] self-center">
          {filtered.length} services
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-5xl opacity-30">apps</span>
          <p className="text-sm">No services in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((svc) => (
            <ServiceCard key={svc.id} service={svc} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <PurchaseModal
          service={selected}
          walletBalance={walletBalance}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
