import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';

export default function TransactionsLoading() {
  return (
    <div className="page-container py-6 md:py-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-80 mb-8" />

      <div
        className="glass-card rounded-[var(--radius-lg)] p-4 sm:p-6"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <SkeletonTable rows={8} cols={5} />
      </div>
    </div>
  );
}
