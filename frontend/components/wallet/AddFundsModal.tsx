'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useToast } from '@/context/ToastContext';
import { addFundsAction } from '@/actions/wallet';
import { cn } from '@/lib/utils/cn';

const schema = z.object({
  amount: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .min(1, 'Minimum is MYR 1.00')
    .max(10000, 'Maximum is MYR 10,000 per transaction'),
});

type FormData = z.infer<typeof schema>;

const QUICK_AMOUNTS = [10, 50, 100, 500];

interface AddFundsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFundsModal({ onClose, onSuccess }: AddFundsModalProps) {
  const { toast } = useToast();
  const [result, setResult] = useState<{ reference: string; newBalance: number } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const currentAmount = watch('amount');

  async function onSubmit(data: FormData) {
    const res = await addFundsAction(data.amount);
    if (res.error) {
      toast(res.error, 'error');
      return;
    }
    if (res.data) {
      setResult({ reference: res.data.reference, newBalance: res.data.wallet.balance });
      toast(`MYR ${data.amount} added successfully!`, 'success');
      onSuccess();
    }
  }

  return (
    <Modal open onClose={onClose} title="Add Funds">
      {result ? (
        <div className="flex flex-col items-center gap-5 py-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(78,222,163,0.15)', border: '2px solid var(--color-primary)' }}
          >
            <span
              className="material-symbols-outlined text-[var(--color-primary)] text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-on-surface)] font-semibold text-lg">Funds Added!</p>
            <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">
              New balance:{' '}
              <span className="text-[var(--color-primary)] font-bold">
                {formatCurrency(result.newBalance)}
              </span>
            </p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-2">
              Ref: {result.reference}
            </p>
          </div>
          <Button variant="primary" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Quick select amounts */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] mb-3">
              Select Amount
            </p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setValue('amount', amt, { shouldValidate: true })}
                  className={cn(
                    'py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all border',
                    currentAmount === amt
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                      : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
                  )}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
              Custom Amount (MYR)
            </label>
            <div
              className={cn(
                'relative flex items-center rounded-[var(--radius-md)]',
                'bg-[var(--color-surface-container-high)] border transition-all',
                errors.amount
                  ? 'border-[var(--color-error)]'
                  : 'border-[var(--color-outline-variant)] focus-within:border-[var(--color-primary)]',
              )}
            >
              <span className="absolute left-4 text-sm text-[var(--color-on-surface-variant)]">
                MYR
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                max="10000"
                placeholder="0.00"
                className="w-full bg-transparent border-none focus:outline-none text-[var(--color-on-surface)] text-sm py-3 pl-14 pr-4"
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-[var(--color-error)]">{errors.amount.message}</p>
            )}
          </div>

          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Simulated payment — 80% success rate. Funds are credited instantly on success.
          </p>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" isLoading={isSubmitting} type="submit">
              Add Funds
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
