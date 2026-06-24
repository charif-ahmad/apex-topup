import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Streaming fallback for the authenticated shell. The chrome (Sidebar/MobileNav)
 * reads the user via useAuth, so it can't render until auth resolves — this
 * placeholder lets Next stream the static structure immediately while the
 * cookie/auth work happens below a <Suspense> boundary (avoids blocking the route).
 */
export function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] sticky top-0 h-screen p-4 gap-3">
        <Skeleton className="h-8 w-32 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-[var(--radius-md)]" />
        ))}
      </aside>
      <main className="flex-1 min-w-0 p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
      </main>
    </div>
  );
}
