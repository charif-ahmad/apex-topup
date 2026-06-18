'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import { listUsersAction, blockUserAction, deleteUserAction } from '@/actions/admin';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDateShort } from '@/lib/utils/formatDate';
import { Badge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import type { AdminUser } from '@/types/models';

export function UsersTable() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listUsersAction(page, 10);
      setUsers(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  async function handleBlock(user: AdminUser) {
    setActionId(user.id);
    const res = await blockUserAction(user.id, !user.isBlocked);
    setActionId(null);
    if (res.error) {
      toast('Action failed', 'error');
    } else {
      toast(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`, 'success');
      load();
    }
  }

  async function handleDelete(user: AdminUser) {
    setActionId(user.id);
    const res = await deleteUserAction(user.id);
    setActionId(null);
    if (res.error) {
      toast('Delete failed', 'error');
    } else {
      toast('User deleted', 'success');
      setConfirmDelete(null);
      load();
    }
  }

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] text-sm bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <span className="text-xs text-[var(--color-on-surface-variant)]">{total} users total</span>
      </div>

      {loading ? (
        <SkeletonTable rows={8} cols={5} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-4xl opacity-40">manage_accounts</span>
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-colors"
                  style={{ background: 'rgba(38,42,53,0.4)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(38,42,53,0.8)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(38,42,53,0.4)';
                  }}
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
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleBlock(user)}
                        disabled={actionId === user.id}
                        title={user.isBlocked ? 'Unblock user' : 'Block user'}
                        className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-tertiary)] hover:bg-[rgba(255,185,95,0.1)] transition-all disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {user.isBlocked ? 'lock_open' : 'block'}
                        </span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        disabled={actionId === user.id}
                        title="Delete user"
                        className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[rgba(255,180,171,0.1)] transition-all disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-xl">delete_forever</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm border transition-colors',
              page === 1
                ? 'opacity-40 cursor-not-allowed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
                : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
            )}
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            Prev
          </button>
          <span className="text-xs text-[var(--color-on-surface-variant)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] text-sm border transition-colors',
              page === totalPages
                ? 'opacity-40 cursor-not-allowed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]'
                : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
            )}
          >
            Next
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      )}

      {/* Delete confirm modal */}
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
                disabled={actionId === confirmDelete.id}
                className="flex-1 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors disabled:opacity-50"
                style={{ background: 'var(--color-error-container)', color: 'var(--color-error)' }}
              >
                {actionId === confirmDelete.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
