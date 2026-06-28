'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import { loginAction } from '@/actions/auth';
import { cn } from '@/lib/utils/cn';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const result = await loginAction(data.email, data.password);
    if (result?.error) {
      toast(result.error, 'error');
    }
  }

  return (
    <div className="glass-card rounded-[var(--radius-lg)] p-6 md:p-8 space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-4" noValidate>
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block ml-1 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
          >
            {t('auth.email')}
          </label>
          <div
            className={cn(
              'relative flex items-center rounded-[var(--radius-md)] group',
              'bg-[var(--color-surface-container-low)] border transition-all',
              errors.email
                ? 'border-[var(--color-error)]'
                : 'border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_1px_var(--color-primary),0_0_12px_rgba(78,222,163,0.15)]',
            )}
          >
            <span className="material-symbols-outlined absolute left-4 text-xl text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors pointer-events-none">
              alternate_email
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              className="w-full bg-transparent border-none focus:outline-none text-[var(--color-on-surface)] text-sm py-3 pl-12 pr-4 placeholder:text-[var(--color-on-surface-variant)]/40"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[var(--color-error)] px-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
            >
              {t('auth.password')}
            </label>
            {/* <span className="text-xs text-[var(--color-primary)] font-semibold cursor-default opacity-40">
              Forgot?
            </span> */}
          </div>
          <div
            className={cn(
              'relative flex items-center rounded-[var(--radius-md)] group',
              'bg-[var(--color-surface-container-low)] border transition-all',
              errors.password
                ? 'border-[var(--color-error)]'
                : 'border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_1px_var(--color-primary),0_0_12px_rgba(78,222,163,0.15)]',
            )}
          >
            <span className="material-symbols-outlined absolute left-4 text-xl text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors pointer-events-none">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-transparent border-none focus:outline-none text-[var(--color-on-surface)] text-sm py-3 pl-12 pr-12 placeholder:text-[var(--color-on-surface-variant)]/40"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--color-error)] px-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-[var(--radius-md)]',
            'bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-base',
            'shadow-[0_8px_24px_-4px_rgba(78,222,163,0.3)] transition-all active:scale-[0.98]',
            'hover:bg-[var(--color-primary-fixed)] group disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-[var(--color-on-primary)] border-t-transparent rounded-full animate-spin" />
              {t('auth.authenticating')}
            </>
          ) : (
            <>
              {t('auth.signIn')}
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      {/* <div className="flex items-center gap-4 py-1">
        <div className="h-px flex-1 bg-[var(--color-outline-variant)]/20" />
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]/60">
          or continue with
        </span>
        <div className="h-px flex-1 bg-[var(--color-outline-variant)]/20" />
      </div> */}

      {/* Social (decorative) */}
      {/* <div className="grid grid-cols-2 gap-3">
        {[
          { icon: 'shield', label: 'SSO' },
          { icon: 'fingerprint', label: 'Passkey' },
        ].map(({ icon, label }) => (
          <button
            key={label}
            type="button"
            disabled
            className="flex items-center justify-center gap-2 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/20 text-[var(--color-on-surface)] text-sm font-semibold opacity-40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
          </button>
        ))}
      </div> */}

      {/* Footer link */}
      <p className="text-center text-sm text-[var(--color-on-surface-variant)]">
        {t('auth.noAccount')}{' '}
        <Link
          href="/register"
          className="text-[var(--color-primary)] font-semibold hover:underline transition-all"
        >
          {t('auth.register')}
        </Link>
      </p>
    </div>
  );
}
