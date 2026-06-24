import { Suspense } from 'react';
import { AdminShell } from './AdminShell';
import { AppShellSkeleton } from '@/components/layout/AppShellSkeleton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth/role work lives in <AdminShell> below this <Suspense> so it doesn't
  // block the route from streaming (Next 16 blocking-route rule).
  return (
    <Suspense fallback={<AppShellSkeleton />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
