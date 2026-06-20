import { Skeleton } from '@/components/ui/Skeleton';

export default function ServicesLoading() {
  return (
    <div className="page-container py-6 md:py-8">
      <Skeleton className="h-8 w-56 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
