import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-background)]">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold font-[var(--font-outfit)] text-[var(--color-primary)] mb-4">
          APEX
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-lg mb-10">
          Fast, secure digital top-up and wallet services.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-[10px] bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-[10px] border border-[var(--color-outline)] text-[var(--color-on-surface)] font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
