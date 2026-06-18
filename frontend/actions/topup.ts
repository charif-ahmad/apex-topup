'use server';

import { serverFetch } from '@/lib/server/client';
import type { Transaction } from '@/types/models';

export async function executeTopupAction(
  serviceId: number,
): Promise<{ data?: Transaction; error?: string }> {
  try {
    const res = await serverFetch<Transaction>('/topup', {
      method: 'POST',
      body: JSON.stringify({ serviceId }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Purchase failed' };
  }
}
