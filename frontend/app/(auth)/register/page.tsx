import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = { title: 'Create Account | APEX' };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Join APEX — secure digital top-up platform">
      <RegisterForm />
    </AuthShell>
  );
}
