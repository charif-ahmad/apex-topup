'use server';

import { serverFetch } from '@/lib/server/client';
import type { User } from '@/types/models';

export async function getProfileAction(): Promise<User> {
  const res = await serverFetch<User>('/user/profile');
  return res.data;
}

export async function updateProfileAction(
  name: string,
): Promise<{ data?: User; error?: string }> {
  try {
    const res = await serverFetch<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Update failed' };
  }
}
