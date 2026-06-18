'use server';

import { serverFetch } from '@/lib/server/client';
import type { Wallet } from '@/types/models';

export async function getWalletAction(): Promise<number> {
  const res = await serverFetch<{ balance: number }>('/wallet');
  return res.data.balance;
}

export interface AddFundsResult {
  paymentStatus: 'success' | 'failed';
  balance?: number;
  transaction: { reference: string };
}

export async function addFundsAction(
  amount: number,
): Promise<{ data?: AddFundsResult; error?: string }> {
  try {
    const res = await serverFetch<AddFundsResult>('/wallet/add', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add funds' };
  }
}
