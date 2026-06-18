import 'server-only';
import { cookies } from 'next/headers';
import type { ApiSuccess, ApiError } from '@/types/api';

const BASE = process.env.API_URL ?? 'http://localhost:4000';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function serverFetch<T>(path: string, options?: RequestInit): Promise<ApiSuccess<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('apex_token')?.value;

  const res = await fetch(`${BASE}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const json: unknown = await res.json();

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiRequestError(
      err.error?.message ?? 'Request failed',
      err.error?.statusCode ?? res.status,
      err.error?.details,
    );
  }

  return json as ApiSuccess<T>;
}
