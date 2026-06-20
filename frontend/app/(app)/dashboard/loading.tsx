import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="page-container py-6 md:py-8">
      <Skeleton className="h-8 w-48 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-8">
        <div className="lg:col-span-7">
          <Skeleton className="h-56 rounded-[var(--radius-lg)]" />
        </div>
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <Skeleton className="col-span-2 h-20 rounded-[var(--radius-lg)]" />
          <Skeleton className="h-24 rounded-[var(--radius-lg)]" />
          <Skeleton className="h-24 rounded-[var(--radius-lg)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-32 mb-1" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-[var(--radius-md)]" />
          ))}
        </div>
        <div className="lg:col-span-8">
          <Skeleton className="h-64 rounded-[var(--radius-lg)]" />
        </div>
      </div>
    </div>
  );
}
