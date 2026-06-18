'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';
import {
  listServicesAction,
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from '@/actions/services';
import type { ServicePayload } from '@/actions/services';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Service } from '@/types/models';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.enum(['mobile', 'internet', 'giftcard'], {
    errorMap: () => ({ message: 'Pick a category' }),
  }),
  price: z
    .number({ invalid_type_error: 'Enter a valid price' })
    .min(0.01, 'Price must be > 0'),
  provider: z.string().min(2, 'Provider is required'),
  isActive: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const CATEGORY_ICONS: Record<string, string> = {
  mobile: 'smartphone',
  internet: 'wifi',
  giftcard: 'card_giftcard',
};

export function ServiceCRUD() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await listServicesAction();
      setServices(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function openCreate() {
    setEditing(null);
    reset({ name: '', category: 'mobile', price: 0, provider: '', isActive: true });
    setModalOpen(true);
  }

  function openEdit(svc: Service) {
    setEditing(svc);
    reset({
      name: svc.name,
      category: svc.category as 'mobile' | 'internet' | 'giftcard',
      price: svc.price,
      provider: svc.provider,
      isActive: svc.isActive,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: FormData) {
    const payload: ServicePayload = {
      name: data.name,
      category: data.category,
      price: data.price,
      provider: data.provider,
      isActive: data.isActive ?? true,
    };

    const result = editing
      ? await updateServiceAction(editing.id, payload)
      : await createServiceAction(payload);

    if (result.error) {
      toast(result.error, 'error');
      return;
    }

    toast(editing ? 'Service updated' : 'Service created', 'success');
    setModalOpen(false);
    load();
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    const result = await deleteServiceAction(id);
    setDeletingId(null);
    if (result.error) {
      toast('Delete failed', 'error');
    } else {
      toast('Service deleted', 'success');
      load();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-on-surface-variant)]">{services.length} services</span>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <span className="material-symbols-outlined text-xl">add</span>
          New Service
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[var(--radius-md)]" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-4xl opacity-40">account_tree</span>
          <p className="text-sm">No services yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] group transition-colors"
              style={{ background: 'rgba(38,42,53,0.5)', border: '1px solid rgba(60,74,66,0.3)' }}
            >
              <div
                className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                style={{ background: 'rgba(78,222,163,0.1)' }}
              >
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">
                  {CATEGORY_ICONS[svc.category] ?? 'bolt'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-[var(--color-on-surface)] text-sm truncate">
                    {svc.name}
                  </p>
                  <Badge variant={svc.isActive ? 'success' : 'neutral'}>
                    {svc.isActive ? 'Active' : 'Off'}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  {svc.provider} · {svc.category}
                </p>
                <p className="text-sm font-semibold text-[var(--color-primary)] mt-0.5">
                  {formatCurrency(svc.price)}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(svc)}
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[rgba(78,222,163,0.1)] transition-all"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(svc.id)}
                  disabled={deletingId === svc.id}
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[rgba(255,180,171,0.1)] transition-all disabled:opacity-40"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-xl">
                    {deletingId === svc.id ? 'hourglass_empty' : 'delete_forever'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Service' : 'New Service'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Service Name" error={errors.name?.message} {...register('name')} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              Category
            </label>
            <select
              className="w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              {...register('category')}
            >
              <option value="mobile">Mobile</option>
              <option value="internet">Internet</option>
              <option value="giftcard">Gift Card</option>
            </select>
            {errors.category && (
              <p className="text-xs text-[var(--color-error)]">{errors.category.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              Price (MYR)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-[var(--color-error)]">{errors.price.message}</p>
            )}
          </div>

          <Input label="Provider" error={errors.provider?.message} {...register('provider')} />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-[var(--color-primary)]"
              {...register('isActive')}
            />
            <span className="text-sm text-[var(--color-on-surface)]">Active (visible to users)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" isLoading={isSubmitting} type="submit">
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
