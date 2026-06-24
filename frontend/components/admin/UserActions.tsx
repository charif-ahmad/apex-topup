'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { blockUserAction, deleteUserAction } from '@/actions/admin';
import { cn } from '@/lib/utils/cn';
import type { AdminUser } from '@/types/models';

/**
 * Client island for per-row mutations. The list itself is server-rendered; only
 * these buttons + confirm dialog ship as client JS. After a mutation the server
 * action calls revalidatePath('/admin'), and router.refresh() pulls the fresh
 * server render — no local list state to keep in sync.
 */
export function UserActions({ user, className }: { user: AdminUser; className?: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleBlock() {
    const res = await blockUserAction(user.id, !user.isBlocked);
    if (res.error) {
      toast('Action failed', 'error');
    } else {
      toast(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`, 'success');
      refresh();
    }
  }

  async function handleDelete() {
    const res = await deleteUserAction(user.id);
    if (res.error) {
      toast('Delete failed', 'error');
    } else {
      toast('User deleted', 'success');
      setConfirmDelete(false);
      refresh();
    }
  }

  return (
    <>
      <div className={cn('flex items-center gap-1', className)}>
        <button
          onClick={handleBlock}
          disabled={isPending}
          title={user.isBlocked ? 'Unblock user' : 'Block user'}
          className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-tertiary)] hover:bg-[rgba(255,185,95,0.1)] transition-all disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-xl">
            {user.isBlocked ? 'lock_open' : 'block'}
          </span>
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={isPending}
          title="Delete user"
          className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[rgba(255,180,171,0.1)] transition-all disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-xl">delete_forever</span>
        </button>
      </div>

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
              <strong className="text-[var(--color-on-surface)]">{user.name}</strong>? This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: 'var(--color-error-container)', color: 'var(--color-error)' }}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
