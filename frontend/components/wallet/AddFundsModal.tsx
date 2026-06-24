'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
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
  /**
   * Hands the validated amount to the parent, which owns the optimistic
   * pending-row + addFunds lifecycle and closes this modal at 0ms.
   */
  onAddFunds: (amount: number) => void;
}

export function AddFundsModal({ onClose, onAddFunds }: AddFundsModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const currentAmount = watch('amount');

  function onSubmit(data: FormData) {
    onAddFunds(data.amount);
  }

  return (
    <Modal open onClose={onClose} title="Add Funds">
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
            Simulated payment — 80% success rate. The top-up shows as pending, then
            confirms once the payment clears.
          </p>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" type="submit">
              Add Funds
            </Button>
          </div>
        </form>
    </Modal>
  );
}
