import { redirect } from 'next/navigation';
import { getProfileAction } from '@/actions/user';
import { AuthProvider } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
