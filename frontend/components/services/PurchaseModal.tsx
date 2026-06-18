'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useToast } from '@/context/ToastContext';
import { executeTopupAction } from '@/actions/topup';
import type { Service } from '@/types/models';

interface PurchaseModalProps {
  service: Service;
  walletBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PurchaseModal({ service, walletBalance, onClose, onSuccess }: PurchaseModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);

  const insufficient = walletBalance < service.price;

  async function handleConfirm() {
    setLoading(true);
    const res = await executeTopupAction(service.id);
    setLoading(false);

    if (res.error) {
      toast(res.error, 'error');
      setResult('failed');
      return;
    }

    if (res.data?.transaction.status === 'success') {
      setResult('success');
      toast(`${service.name} purchased successfully!`, 'success');
      router.refresh();
      onSuccess();
    } else {
      setResult('failed');
      toast('Transaction failed. Please try again.', 'error');
    }
  }

  return (
    <Modal open onClose={onClose} title="Confirm Purchase">
      <div className="flex flex-col gap-5">
        {/* Service summary */}
        <div
          className="rounded-[var(--radius-md)] p-4 flex items-center gap-4"
          style={{ background: 'var(--color-surface-container-high)' }}
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(78,222,163,0.1)', border: '1px solid rgba(78,222,163,0.2)' }}
          >
            <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">
              bolt
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--color-on-surface)]">{service.name}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              {service.provider} · {service.category}
            </p>
          </div>
          <span
            className="text-xl font-bold text-[var(--color-on-surface)]"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {formatCurrency(service.price)}
          </span>
        </div>

        {/* Balance info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-on-surface-variant)]">Your balance</span>
          <span
            className="font-semibold"
            style={{ color: insufficient ? 'var(--color-error)' : 'var(--color-primary)' }}
          >
            {formatCurrency(walletBalance)}
          </span>
        </div>
        {insufficient && (
          <p className="text-xs text-[var(--color-error)] -mt-3">
            Insufficient balance. Please top up your wallet first.
          </p>
        )}

        {/* Result */}
        {result && (
          <div
            className="flex items-center gap-3 p-3 rounded-[var(--radius-md)]"
            style={{
              background: result === 'success' ? 'rgba(78,222,163,0.1)' : 'rgba(147,0,10,0.2)',
            }}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{
                color: result === 'success' ? 'var(--color-primary)' : 'var(--color-error)',
                fontVariationSettings: "'FILL' 1",
              }}
            >
              {result === 'success' ? 'check_circle' : 'cancel'}
            </span>
            <span className="text-sm text-[var(--color-on-surface)]">
              {result === 'success' ? 'Purchase successful!' : 'Transaction failed'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleConfirm}
            isLoading={loading}
            disabled={insufficient || result !== null}
          >
            {result ? 'Done' : 'Confirm Purchase'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
