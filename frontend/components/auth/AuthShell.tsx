interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(circle at 50% 50%, #151d30 0%, #0b0f19 100%)' }}
    >
      {/* Atmospheric blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full"
          style={{ background: 'rgba(78,222,163,0.05)', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full"
          style={{ background: 'rgba(5,102,217,0.05)', filter: 'blur(120px)' }}
        />
      </div>

      {/* Card */}
      <main className="relative z-10 w-full max-w-[440px]">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{
                background: 'var(--color-primary)',
                boxShadow: '0 8px 24px -4px rgba(78,222,163,0.3)',
              }}
            >
              <span
                className="material-symbols-outlined text-[var(--color-on-primary)] text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
            <h1
              className="text-3xl font-bold tracking-tight uppercase"
              style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}
            >
              APEX
            </h1>
          </div>
          <h2
            className="text-2xl font-semibold text-[var(--color-on-surface)] text-center"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {title}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">{subtitle}</p>
        </div>

        {children}
      </main>

      {/* Security badge */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 w-full max-w-[90vw] px-4 text-center opacity-40 hover:opacity-100 transition-opacity">
        <span
          className="material-symbols-outlined text-sm text-[var(--color-on-surface-variant)]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified_user
        </span>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
          AES-256 Multi-Layer Encryption Active
        </span>
      </div>
    </div>
  );
}
