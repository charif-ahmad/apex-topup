'use server';

import { cookies } from 'next/headers';
import { serverFetch } from '@/lib/server/client';
import type { User } from '@/types/models';

const COOKIE_OPTS = { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };

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
    const store = await cookies();
    store.set('apex_user', JSON.stringify(res.data), COOKIE_OPTS);
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Update failed' };
  }
}
