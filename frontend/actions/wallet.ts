'use server';

import { serverFetch } from '@/lib/server/client';
import type { Wallet } from '@/types/models';

export async function getWalletAction(): Promise<Wallet> {
  const res = await serverFetch<Wallet>('/wallet');
  return res.data;
}

export async function addFundsAction(
  amount: number,
): Promise<{ data?: { wallet: Wallet; reference: string }; error?: string }> {
  try {
    const res = await serverFetch<{ wallet: Wallet; reference: string }>('/wallet/add', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add funds' };
  }
}
