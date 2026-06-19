'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        className={cn(
          'glass-panel rounded-[var(--radius-lg)] p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto',
          'border border-[var(--color-outline-variant)]',
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-on-surface)] font-[var(--font-outfit)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
