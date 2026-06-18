import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign In | APEX' };

export default function LoginPage() {
  return (
    <AuthShell title="Sign in to Apex" subtitle="Access your high-fidelity digital vault">
      <LoginForm />
    </AuthShell>
  );
}
