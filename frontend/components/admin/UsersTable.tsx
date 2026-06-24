import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDateShort } from '@/lib/utils/formatDate';
import { Badge } from '@/components/ui/Badge';
import { UserActions } from '@/components/admin/UserActions';
import type { AdminUser } from '@/types/models';

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

/**
 * Pure presentational user list — server-rendered. Data arrives as props from
 * UsersPanel; the only client JS is the per-row <UserActions> island.
 */
export function UsersTable({ users }: { users: AdminUser[] }) {
  if (users.length === 0) {
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
            {users.map((user) => (
              <tr key={user.id} className="group transition-colors" style={{ background: 'rgba(38,42,53,0.4)' }}>
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
                  <UserActions
                    user={user}
                    className="justify-end opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-[var(--radius-md)] p-4 flex flex-col gap-3"
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
              <UserActions user={user} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
