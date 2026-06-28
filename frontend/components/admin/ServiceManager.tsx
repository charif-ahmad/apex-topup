'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import {
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
import type { Service } from '@/types/models';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.enum(['mobile', 'internet', 'giftcard'], {
    errorMap: () => ({ message: 'Pick a category' }),
  }),
  price: z.number({ invalid_type_error: 'Enter a valid price' }).min(0.01, 'Price must be > 0'),
  provider: z.string().min(2, 'Provider is required'),
  isActive: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const CATEGORY_ICONS: Record<string, string> = {
  mobile: 'smartphone',
  internet: 'wifi',
  giftcard: 'card_giftcard',
};

const STATUS_FILTERS = ['all', 'active', 'inactive'] as const;
const CATEGORY_FILTERS = ['all', 'mobile', 'internet', 'giftcard'] as const;

type OptimisticService = Service & { pending?: boolean };
type OptimisticAction =
  | { type: 'create'; service: Service }
  | { type: 'update'; id: number; payload: ServicePayload }
  | { type: 'delete'; id: number };

interface ServiceManagerProps {
  /** Already filtered (by the URL params) and fetched server-side. */
  services: Service[];
  filteredCount: number;
  totalCount: number;
}

/**
 * Client island for service CRUD. It does NOT fetch — `services` arrives as props
 * from ServicesPanel (a Server Component) and is re-supplied via router.refresh()
 * after a mutation (the actions call revalidatePath). The status/category filters
 * are written to the URL so the server re-filters; only modal/form state is local.
 */
const STATUS_FILTER_KEYS: Record<string, 'admin.filterAll' | 'admin.filterActive' | 'admin.filterInactive'> = {
  all: 'admin.filterAll',
  active: 'admin.filterActive',
  inactive: 'admin.filterInactive',
};

const CATEGORY_FILTER_KEYS: Record<string, 'admin.filterAll' | 'admin.catMobile' | 'admin.catInternet' | 'admin.catGiftcard'> = {
  all: 'admin.filterAll',
  mobile: 'admin.catMobile',
  internet: 'admin.catInternet',
  giftcard: 'admin.catGiftcard',
};

export function ServiceManager({ services, filteredCount, totalCount }: ServiceManagerProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Separate transitions: `isPending` dims the grid during filter navigation,
  // while mutations rely on per-card pending state (no full-grid dim).
  const [isPending, startTransition] = useTransition();
  const [, startMutation] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const [optimisticServices, applyOptimistic] = useOptimistic<OptimisticService[], OptimisticAction>(
    services,
    (state, action) => {
      switch (action.type) {
        case 'create':
          return [{ ...action.service, pending: true }, ...state];
        case 'update':
          return state.map((s) =>
            s.id === action.id ? { ...s, ...action.payload, pending: true } : s,
          );
        case 'delete':
          return state.filter((s) => s.id !== action.id);
      }
    },
  );

  const activeStatus = searchParams.get('status') ?? 'all';
  const activeCategory = searchParams.get('category') ?? 'all';

  function setFilter(key: 'status' | 'category', value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

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

  function onSubmit(data: FormData) {
    const payload: ServicePayload = {
      name: data.name,
      category: data.category,
      price: data.price,
      provider: data.provider,
      isActive: data.isActive ?? true,
    };
    const editingId = editing?.id ?? null;
    setModalOpen(false); // close at 0ms; the optimistic card carries the feedback

    startMutation(async () => {
      if (editingId != null) {
        applyOptimistic({ type: 'update', id: editingId, payload });
      } else {
        applyOptimistic({
          type: 'create',
          // Temp negative id keeps React keys stable until the real row arrives.
          service: { id: -Date.now(), createdAt: new Date().toISOString(), ...payload, isActive: payload.isActive ?? true },
        });
      }

      const result =
        editingId != null
          ? await updateServiceAction(editingId, payload)
          : await createServiceAction(payload);

      if (result.error) {
        toast(result.error, 'error');
        return; // optimistic insert/update auto-reverts
      }
      toast(editingId != null ? t('admin.serviceUpdated') : t('admin.serviceCreated'), 'success');
      router.refresh();
    });
  }

  function handleDelete(id: number) {
    startMutation(async () => {
      applyOptimistic({ type: 'delete', id });
      const result = await deleteServiceAction(id);
      if (result.error) {
        toast(t('admin.deleteFailed'), 'error');
        return; // removed card is restored on revert
      }
      toast(t('admin.serviceDeleted'), 'success');
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-on-surface-variant)]">
          {t('admin.servicesCount', { filtered: filteredCount, total: totalCount })}
        </span>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <span className="material-symbols-outlined text-xl">add</span>
          {t('admin.newService')}
        </Button>
      </div>

      {/* Filters — written to the URL */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter('status', s)}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold capitalize transition-all border ${
              activeStatus === s
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            {t(STATUS_FILTER_KEYS[s])}
          </button>
        ))}
        <div className="w-px bg-[var(--color-outline-variant)] mx-1" />
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setFilter('category', c)}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold capitalize transition-all border ${
              activeCategory === c
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
                : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            {t(CATEGORY_FILTER_KEYS[c])}
          </button>
        ))}
      </div>

      {optimisticServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-4xl opacity-40">account_tree</span>
          <p className="text-sm">{totalCount === 0 ? t('admin.noServicesYet') : t('admin.noServicesMatch')}</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${isPending ? 'opacity-60' : ''}`}>
          {optimisticServices.map((svc) => (
            <div
              key={svc.id}
              className={`flex items-center gap-4 p-4 rounded-[var(--radius-md)] group transition-opacity ${svc.pending ? 'opacity-50' : ''}`}
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
                  <p className="font-semibold text-[var(--color-on-surface)] text-sm truncate">{svc.name}</p>
                  <Badge variant={svc.isActive ? 'success' : 'neutral'}>
                    {svc.isActive ? t('admin.serviceActive') : t('admin.serviceOff')}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  {svc.provider} · {svc.category}
                </p>
                <p className="text-sm font-semibold text-[var(--color-primary)] mt-0.5">
                  {formatCurrency(svc.price)}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(svc)}
                  disabled={svc.pending}
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[rgba(78,222,163,0.1)] transition-all disabled:opacity-40"
                  title={t('admin.editService')}
                >
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(svc.id)}
                  disabled={svc.pending}
                  className="p-2 rounded-[var(--radius-sm)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[rgba(255,180,171,0.1)] transition-all disabled:opacity-40"
                  title={t('common.delete')}
                >
                  <span className="material-symbols-outlined text-xl">
                    {svc.pending ? 'hourglass_empty' : 'delete_forever'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('admin.editService') : t('admin.newService')}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label={t('admin.serviceName')} error={errors.name?.message} {...register('name')} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              {t('admin.category')}
            </label>
            <select
              className="w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              {...register('category')}
            >
              <option value="mobile">{t('admin.catMobile')}</option>
              <option value="internet">{t('admin.catInternet')}</option>
              <option value="giftcard">{t('admin.catGiftcard')}</option>
            </select>
            {errors.category && <p className="text-xs text-[var(--color-error)]">{errors.category.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              {t('admin.priceMyr')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2.5 text-sm rounded-[var(--radius-md)] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <p className="text-xs text-[var(--color-error)]">{errors.price.message}</p>}
          </div>

          <Input label={t('admin.provider')} error={errors.provider?.message} {...register('provider')} />

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary)]" {...register('isActive')} />
            <span className="text-sm text-[var(--color-on-surface)]">{t('admin.activeVisible')}</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" type="button" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" className="flex-1" isLoading={isSubmitting} type="submit">
              {editing ? t('admin.update') : t('admin.create')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
