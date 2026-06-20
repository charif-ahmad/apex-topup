import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="min-h-screen">
      <header
        className="px-4 sm:px-6 md:px-8 py-3 md:py-4 flex items-center justify-between gap-3"
        style={{
          background: 'rgba(21,29,48,0.85)',
          borderBottom: '1px solid rgba(60,74,66,0.2)',
        }}
      >
        <div>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-7 w-28 rounded-full" />
      </header>

      <div className="page-container py-6 md:py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[var(--radius-lg)]" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}
