import { redirect } from 'next/navigation';
import { getProfileAction } from '@/actions/user';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await getProfileAction();
  } catch {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
