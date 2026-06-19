'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { updateProfileAction } from '@/actions/user';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateShort } from '@/lib/utils/formatDate';
import { cn } from '@/lib/utils/cn';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '' },
  });

  async function onSubmit(data: FormData) {
    const result = await updateProfileAction(data.name);
    if (result.error) {
      toast(result.error, 'error');
      return;
    }
    if (result.data) {
      updateUser(result.data);
      toast('Profile updated successfully', 'success');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const initials =
    user?.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';

  return (
    <div className="page-container py-6 md:py-8">
      <header className="mb-6 md:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Profile Settings
        </h1>
        <p className="text-[var(--color-on-surface-variant)] mt-1">
          Manage your account information and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left — avatar + account info */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div
            className="glass-card rounded-[var(--radius-lg)] p-6 flex flex-col items-center gap-4"
            style={{ background: 'rgba(21,29,48,0.75)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                background: 'rgba(78,222,163,0.1)',
                border: '2px solid rgba(78,222,163,0.3)',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-outfit)',
              }}
            >
              {initials}
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--color-on-surface)]">{user?.name}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{user?.email}</p>
              <span
                className="inline-block mt-2 px-2 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background:
                    user?.role === 'admin' ? 'rgba(173,198,255,0.15)' : 'rgba(78,222,163,0.1)',
                  color:
                    user?.role === 'admin' ? 'var(--color-secondary)' : 'var(--color-primary)',
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <div
            className="glass-card rounded-[var(--radius-lg)] p-5 flex flex-col gap-4"
            style={{ background: 'rgba(21,29,48,0.75)' }}
          >
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              Account Details
            </h3>
            {[
              {
                label: 'Member Since',
                value: user ? formatDateShort(user.createdAt) : '—',
                icon: 'calendar_today',
              },
              { label: 'Account ID', value: user?.id.slice(0, 8).toUpperCase() ?? '—', icon: 'tag' },
              { label: 'Email Verified', value: 'Yes', icon: 'verified' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] text-xl">
                  {icon}
                </span>
                <div>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{label}</p>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — edit form */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div
            className="glass-card rounded-[var(--radius-lg)] p-6"
            style={{ background: 'rgba(21,29,48,0.75)' }}
          >
            <h2
              className="text-base font-semibold text-[var(--color-on-surface)] mb-6"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Personal Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input label="Full Name" error={errors.name?.message} {...register('name')} />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
                  Email Address
                </label>
                <div
                  className="px-4 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--color-on-surface-variant)]"
                  style={{
                    background: 'var(--color-surface-container)',
                    border: '1px solid var(--color-outline-variant)',
                  }}
                >
                  {user?.email}
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  Email cannot be changed after registration.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={!isDirty}
                  className={cn('transition-all', saved && 'bg-[var(--color-primary-container)]')}
                >
                  {saved ? (
                    <>
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      Saved
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div
            className="glass-card rounded-[var(--radius-lg)] p-6"
            style={{ background: 'rgba(21,29,48,0.75)' }}
          >
            <h2
              className="text-base font-semibold text-[var(--color-on-surface)] mb-4"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Security
            </h2>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">
                  lock
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--color-on-surface)]">Password</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    Last changed: unknown
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
