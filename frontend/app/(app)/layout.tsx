import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getProfileAction } from '@/actions/user';
import { AuthProvider } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import type { User } from '@/types/models';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let user: User | undefined;

  const cookieStore = await cookies();
  const cached = cookieStore.get('apex_user')?.value;
  if (cached) {
    try {
      user = JSON.parse(cached) as User;
    } catch {
      // fall through to API fetch
    }
  }

  if (!user) {
    try {
      user = await getProfileAction();
    } catch {
      redirect('/login');
    }
  }

  if (!user) redirect('/login');

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
