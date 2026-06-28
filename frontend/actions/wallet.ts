'use server';

import { serverFetch } from '@/lib/server/client';
import type { Transaction } from '@/types/models';

export async function getWalletAction(): Promise<number> {
  const res = await serverFetch<{ balance: number }>('/wallet');
  return res.data.balance;
}

export interface InitiateAddFundsResult {
  checkoutUrl: string;
  transaction: Transaction;
}

export interface VerifySessionResult {
  transaction: Transaction;
  balance?: number;
}

export async function addFundsAction(
  amount: number,
): Promise<{ data?: InitiateAddFundsResult; error?: string }> {
  try {
    const res = await serverFetch<InitiateAddFundsResult>('/wallet/add', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to initiate payment' };
  }
}

export async function verifySessionAction(
  sessionId: string,
): Promise<{ data?: VerifySessionResult; error?: string }> {
  try {
    const res = await serverFetch<VerifySessionResult>('/wallet/verify-session', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to verify payment' };
  }
}
