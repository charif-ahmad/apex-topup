import { redirect } from 'next/navigation';
import { getProfileAction } from '@/actions/user';
import { AuthProvider } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { MobileNav } from '@/components/layout/MobileNav';

/**
 * Admin auth-gated shell. getProfileAction() reads cookies() via serverFetch, so
 * it runs here (below the layout's <Suspense>) to avoid blocking the route.
 */
export async function AdminShell({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await getProfileAction();
  } catch {
    redirect('/login');
  }

  if (user.role !== 'admin') redirect('/dashboard');

  return (
    <AuthProvider initialUser={user}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0">
          <MobileTopBar />
          {children}
        </main>
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
