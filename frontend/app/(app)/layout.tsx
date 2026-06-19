import { redirect } from 'next/navigation';
import { getProfileAction } from '@/actions/user';
import { AuthProvider } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await getProfileAction();
  } catch {
    redirect('/login');
  }

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
