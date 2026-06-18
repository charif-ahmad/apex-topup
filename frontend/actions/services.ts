'use server';

import { serverFetch } from '@/lib/server/client';
import type { Service } from '@/types/models';

export async function listServicesAction(): Promise<Service[]> {
  const res = await serverFetch<Service[]>('/services');
  return res.data;
}

export interface ServicePayload {
  name: string;
  category: string;
  price: number;
  provider: string;
  isActive?: boolean;
}

export async function createServiceAction(
  payload: ServicePayload,
): Promise<{ data?: Service; error?: string }> {
  try {
    const res = await serverFetch<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Create failed' };
  }
}

export async function updateServiceAction(
  id: number,
  payload: Partial<ServicePayload>,
): Promise<{ data?: Service; error?: string }> {
  try {
    const res = await serverFetch<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return { data: res.data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Update failed' };
  }
}

export async function deleteServiceAction(id: number): Promise<{ error?: string }> {
  try {
    await serverFetch<null>(`/services/${id}`, { method: 'DELETE' });
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Delete failed' };
  }
}
