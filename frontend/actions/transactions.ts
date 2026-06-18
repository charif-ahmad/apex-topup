'use server';

import { serverFetch } from '@/lib/server/client';
import type { Transaction } from '@/types/models';
import type { PaginatedResult } from '@/types/api';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'credit' | 'debit';
  status?: 'pending' | 'success' | 'failed';
  from?: string;
  to?: string;
}

export async function listTransactionsAction(
  filters: TransactionFilters = {},
): Promise<PaginatedResult<Transaction>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined) params.set(k, String(v));
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await serverFetch<PaginatedResult<Transaction>>(`/transactions${query}`);
  return res.data;
}
