'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { blockUserAction, deleteUserAction } from '@/actions/admin';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDateShort } from '@/lib/utils/formatDate';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';
import type { AdminUser } from '@/types/models';

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

type OptimisticUser = AdminUser & { pending?: boolean };
type OptimisticAction = { type: 'block'; id: string } | { type: 'delete'; id: string };

/**
 * Client boundary that owns the user list via useOptimistic, seeded by the
 * server-fetched `users` from UsersPanel. Block/delete update the UI at 0ms; the
 * server action then calls revalidatePath('/admin') and router.refresh() supplies
 * the reconciled data within the same transition (so the optimistic state holds
 * until the truth paints — no flash). On failure the optimistic change auto-reverts
 * and we surface a toast.
 */
export function UsersTable({ users }: { users: AdminUser[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  const [optimisticUsers, applyOptimistic] = useOptimistic<OptimisticUser[], OptimisticAction>(
    users,
    (state, action) => {
      switch (action.type) {
        case 'block':
          return state.map((u) =>
            u.id === action.id ? { ...u, isBlocked: !u.isBlocked, pending: true } : u,
          );
        case 'delete':
          return state.filter((u) => u.id !== action.id);
      }
    },
  );

  function handleBlock(user: AdminUser) {
    startTransition(async () => {
      applyOptimistic({ type: 'block', id: user.id });
      const res = await blockUserAction(user.id, !user.isBlocked);
      if (res.error) {
        toast('Action failed', 'error');
        return; // optimistic toggle auto-reverts
      }
      toast(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`, 'success');
      router.refresh();
    });
  }

  function handleDelete(user: AdminUser) {
    setConfirmDelete(null);
    startTransition(async () => {
      applyOptimistic({ type: 'delete', id: user.id });
      const res = await deleteUserAction(user.id);
      if (res.error) {
        toast('Delete failed', 'error');
        return; // removed row is restored on revert
      }
      toast('User deleted', 'success');
      router.refresh();
    });
  }

  function renderActions(user: OptimisticUser, className?: string) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <button
          onClick={() => handleBlock(user)}
          disabled={user.pending}
          title={user.isBlocked ? 'Unblock user' : 'Block user'}
          className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-tertiary)] hover:bg-[rgba(255,185,95,0.1)] transition-all disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-xl">
            {user.isBlocked ? 'lock_open' : 'block'}
          </span>
        </button>
        <button
          onClick={() => setConfirmDelete(user)}
          disabled={user.pending}
          title="Delete user"
          className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[rgba(255,180,171,0.1)] transition-all disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-xl">delete_forever</span>
        </button>
      </div>
    );
  }

  if (optimisticUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
        <span className="material-symbols-outlined text-4xl opacity-40">manage_accounts</span>
        <p className="text-sm">No users found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 6px' }}>
          <thead>
            <tr>
              {['User', 'Email', 'Balance', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-[10px] font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {optimisticUsers.map((user) => (
              <tr
                key={user.id}
                className={cn('group transition-opacity', user.pending && 'opacity-50')}
                style={{ background: 'rgba(38,42,53,0.4)' }}
              >
                <td className="px-4 py-3 rounded-l-[var(--radius-md)]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                      }}
                    >
                      {initials(user.name)}
                    </div>
                    <span className="font-semibold text-[var(--color-on-surface)] whitespace-nowrap">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--color-on-surface-variant)] max-w-[180px] truncate">
                  {user.email}
                </td>
                <td className="px-4 py-3 font-mono text-[var(--color-on-surface)] whitespace-nowrap">
                  {formatCurrency(user.balance ?? 0)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === 'admin' ? 'info' : 'neutral'}>{user.role}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-on-surface-variant)] whitespace-nowrap">
                  {formatDateShort(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.isBlocked ? 'error' : 'success'}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </Badge>
                </td>
                <td className="px-4 py-3 rounded-r-[var(--radius-md)]">
                  {renderActions(
                    user,
                    'justify-end opacity-0 group-hover:opacity-100 transition-opacity',
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {optimisticUsers.map((user) => (
          <div
            key={user.id}
            className={cn(
              'rounded-[var(--radius-md)] p-4 flex flex-col gap-3 transition-opacity',
              user.pending && 'opacity-50',
            )}
            style={{ background: 'rgba(38,42,53,0.5)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: 'var(--color-secondary-container)',
                  color: 'var(--color-on-secondary-container)',
                }}
              >
                {initials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--color-on-surface)] truncate">{user.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] truncate">{user.email}</p>
              </div>
              <span className="font-mono text-sm text-[var(--color-on-surface)] whitespace-nowrap">
                {formatCurrency(user.balance ?? 0)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge variant={user.role === 'admin' ? 'info' : 'neutral'}>{user.role}</Badge>
                <Badge variant={user.isBlocked ? 'error' : 'success'}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </Badge>
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  {formatDateShort(user.createdAt)}
                </span>
              </div>
              {renderActions(user)}
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="glass-panel rounded-[var(--radius-lg)] p-6 w-full max-w-sm"
            style={{ border: '1px solid rgba(255,180,171,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ color: 'var(--color-error)', fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <h3 className="font-semibold text-[var(--color-on-surface)]">Delete User</h3>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[var(--color-on-surface)]">{confirmDelete.name}</strong>? This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={isPending}
                className="flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: 'var(--color-error-container)', color: 'var(--color-error)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
