'use server';

import { serverFetch } from '@/lib/server/client';
import type { Transaction } from '@/types/models';

// Shape returned by the backend POST /api/topup: the created transaction plus
// the new wallet balance and a service summary.
export interface TopupResult {
  transaction: Transaction;
  balance: number;
  service: { id: number; name: string; price: number };
}

export async function executeTopupAction(
  serviceId: number,
): Promise<{ data?: TopupResult; error?: string }> {
  try {
    const res = await serverFetch<TopupResult>('/topup', {
      method: 'POST',
      body: JSON.stringify({ serviceId }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Purchase failed' };
  }
}
