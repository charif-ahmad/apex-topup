import { Suspense } from 'react';
import { AppShell } from './AppShell';
import { AppShellSkeleton } from '@/components/layout/AppShellSkeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // The auth work (cookies/profile) lives in <AppShell> below this <Suspense> so
  // it doesn't block the route from streaming (Next 16 blocking-route rule).
  return (
    <Suspense fallback={<AppShellSkeleton />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
