'use server';

import { serverFetch } from '@/lib/server/client';
import type { Service } from '@/types/models';

export async function listServicesAction(): Promise<Service[]> {
  // The public service catalog is identical for every user and changes rarely,
  // so cache it for 60s to avoid re-fetching on every navigation. The admin
  // variant below stays uncached because it includes inactive services.
  const res = await serverFetch<{ services: Service[] }>('/services', {
    next: { revalidate: 60 },
  });
  return res.data.services;
}

export async function listAllServicesAdminAction(): Promise<Service[]> {
  const res = await serverFetch<{ services: Service[] }>('/services?all=true');
  return res.data.services;
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
