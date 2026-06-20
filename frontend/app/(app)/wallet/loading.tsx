import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonTable } from '@/components/ui/Skeleton';

export default function WalletLoading() {
  return (
    <div className="page-container py-6 md:py-8">
      <Skeleton className="h-8 w-56 mb-2" />
      <Skeleton className="h-4 w-72 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
        <div className="lg:col-span-7">
          <Skeleton className="h-52 rounded-[var(--radius-lg)]" />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] rounded-[var(--radius-md)]" />
          ))}
        </div>
      </div>

      <div
        className="glass-card rounded-[var(--radius-lg)] p-4 sm:p-6"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <Skeleton className="h-6 w-40 mb-4" />
        <SkeletonTable rows={6} cols={5} />
      </div>
    </div>
  );
}
