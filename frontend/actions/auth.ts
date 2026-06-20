'use server';

import { cookies } from 'next/headers';
import type { User } from '@/types/models';

const BASE = process.env.API_URL ?? 'http://localhost:4000';

interface AuthData {
  token: string;
  user: User;
}

async function authPost(path: string, body: object): Promise<AuthData> {
  // console.log(`${BASE}/api${path}`);
  const res = await fetch(`${BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? 'Request failed');
  return json.data as AuthData;
}

function setAuthCookies(
  store: Awaited<ReturnType<typeof cookies>>,
  token: string,
  role: string,
) {
  const opts = { httpOnly: true, path: '/', maxAge: 86400, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
  store.set('apex_token', token, opts);
  store.set('apex_role', role, opts);
}

export async function loginAction(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  try {
    const { token, user } = await authPost('/auth/login', { email, password });
    setAuthCookies(await cookies(), token, user.role);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Login failed' };
  }
}

export async function registerAction(
  name: string,
  email: string,
  password: string,
): Promise<{ error?: string }> {
  try {
    const { token, user } = await authPost('/auth/register', { name, email, password });
    setAuthCookies(await cookies(), token, user.role);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Registration failed' };
  }
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete('apex_token');
  store.delete('apex_role');
}
