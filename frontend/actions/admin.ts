'use server';

import { serverFetch } from '@/lib/server/client';
import type { AdminUser, Transaction, Analytics } from '@/types/models';
import type { PaginatedResult } from '@/types/api';
import type { TransactionFilters } from './transactions';

export async function listUsersAction(
  page = 1,
  limit = 20,
  search?: string,
): Promise<PaginatedResult<AdminUser>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set('search', search);
  const res = await serverFetch<PaginatedResult<AdminUser>>(`/admin/users?${params.toString()}`);
  return res.data;
}

export async function blockUserAction(
  id: string,
  isBlocked: boolean,
): Promise<{ error?: string }> {
  try {
    await serverFetch<AdminUser>(`/admin/users/${id}/block`, {
      method: 'PATCH',
      body: JSON.stringify({ isBlocked }),
    });
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Action failed' };
  }
}

export async function deleteUserAction(id: string): Promise<{ error?: string }> {
  try {
    await serverFetch<null>(`/admin/users/${id}`, { method: 'DELETE' });
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

export async function listAllTransactionsAction(
  filters: TransactionFilters = {},
): Promise<PaginatedResult<Transaction>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v));
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await serverFetch<PaginatedResult<Transaction>>(`/admin/transactions${query}`);
  return res.data;
}

export async function getAnalyticsAction(): Promise<Analytics> {
  const res = await serverFetch<Analytics>('/admin/analytics');
  return res.data;
}
