'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { registerAction } from '@/actions/auth';
import { cn } from '@/lib/utils/cn';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

interface FieldWrapProps {
  icon: string;
  error?: string;
  children: React.ReactNode;
}

function FieldWrap({ icon, error, children }: FieldWrapProps) {
  return (
    <div
      className={cn(
        'relative flex items-center rounded-[var(--radius-md)] group',
        'bg-[var(--color-surface-container-low)] border transition-all',
        error
          ? 'border-[var(--color-error)]'
          : 'border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_1px_var(--color-primary),0_0_12px_rgba(78,222,163,0.15)]',
      )}
    >
      <span className="material-symbols-outlined absolute left-4 text-xl text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-transparent border-none focus:outline-none text-[var(--color-on-surface)] text-sm py-3 pl-12 pr-4 placeholder:text-[var(--color-on-surface-variant)]/40';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const result = await registerAction(data.name, data.email, data.password);
    if (result.error) {
      toast(result.error, 'error');
      return;
    }
    toast('Account created! Welcome to APEX.', 'success');
    router.push('/dashboard');
  }

  return (
    <div className="glass-card rounded-[var(--radius-lg)] p-6 md:p-8 space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block ml-1 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
          >
            Full Name
          </label>
          <FieldWrap icon="person" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              className={inputCls}
              {...register('name')}
            />
          </FieldWrap>
          {errors.name && (
            <p className="text-xs text-[var(--color-error)] px-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block ml-1 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
          >
            Email Address
          </label>
          <FieldWrap icon="alternate_email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              className={inputCls}
              {...register('email')}
            />
          </FieldWrap>
          {errors.email && (
            <p className="text-xs text-[var(--color-error)] px-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block ml-1 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
          >
            Password
          </label>
          <FieldWrap icon="lock" error={errors.password?.message}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              className={cn(inputCls, 'pr-12')}
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
          </FieldWrap>
          {errors.password && (
            <p className="text-xs text-[var(--color-error)] px-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block ml-1 text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
          >
            Confirm Password
          </label>
          <FieldWrap icon="lock_reset" error={errors.confirmPassword?.message}>
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className={cn(inputCls, 'pr-12')}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-xl">
                {showConfirm ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </FieldWrap>
          {errors.confirmPassword && (
            <p className="text-xs text-[var(--color-error)] px-1">
              {errors.confirmPassword.message}
            </p>
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
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-[var(--color-on-surface-variant)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[var(--color-primary)] font-semibold hover:underline transition-all"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
