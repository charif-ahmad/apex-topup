'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';

/**
 * Error Boundary for the authenticated app segment (Next.js App Router). It catches
 * errors thrown while rendering any page under (app) — e.g. an ApiRequestError from
 * a Server Component data fetch — and renders a friendly fallback inside the existing
 * sidebar/nav chrome (the layout above the boundary keeps rendering).
 *
 * Note: in production Next sanitizes server-thrown error messages on the client and
 * only exposes `error.digest`. So "blocked" detection works in dev but degrades to a
 * generic message in prod — for a guaranteed blocked-account experience, handle the
 * 403 at the source (serverFetch / middleware). See the chat for that follow-up.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log for observability; the boundary swallows the error from the UI.
    console.error(error);
  }, [error]);

  const isBlocked = /blocked|suspend/i.test(error.message);

  async function signOut() {
    await logoutAction();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="page-container flex items-center justify-center min-h-[70vh] py-10">
      <div
        className="glass-card rounded-[var(--radius-lg)] p-8 sm:p-10 max-w-md w-full flex flex-col items-center text-center gap-4"
        style={{ background: 'rgba(21,29,48,0.75)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: isBlocked ? 'rgba(255,180,171,0.12)' : 'rgba(255,185,95,0.12)',
          }}
        >
          <span
            className="material-symbols-outlined text-4xl"
            style={{
              color: isBlocked ? 'var(--color-error)' : 'var(--color-tertiary)',
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {isBlocked ? 'gpp_bad' : 'error'}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="text-xl sm:text-2xl font-semibold text-[var(--color-on-surface)]"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {isBlocked ? 'Account Suspended' : 'Something went wrong'}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            {isBlocked
              ? 'Your account has been blocked and can no longer access this area. Please sign out and contact support if you believe this is a mistake.'
              : 'We hit an unexpected error loading this page. You can try again, or head back to your dashboard.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          {isBlocked ? (
            <Button variant="primary" className="flex-1" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <>
              <Button variant="primary" className="flex-1" onClick={() => reset()}>
                Try Again
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </>
          )}
        </div>

        {error.digest && (
          <p className="text-[10px] font-mono text-[var(--color-on-surface-variant)]/60 mt-1">
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
