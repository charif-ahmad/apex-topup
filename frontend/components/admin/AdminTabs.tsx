'use client';

import { useState } from 'react';
import { UsersTable } from '@/components/admin/UsersTable';
import { ServiceCRUD } from '@/components/admin/ServiceCRUD';
import { AuditLedger } from '@/components/admin/AuditLedger';
import { cn } from '@/lib/utils/cn';

type Tab = 'users' | 'services' | 'audit';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'users', label: 'User Administration', icon: 'manage_accounts' },
  { id: 'services', label: 'Service Management', icon: 'account_tree' },
  { id: 'audit', label: 'Platform Audit Ledger', icon: 'policy' },
];

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  return (
    <div
      className="glass-panel rounded-[var(--radius-lg)] overflow-hidden flex flex-col"
      style={{ background: 'rgba(21,29,48,0.75)', minHeight: '560px' }}
    >
      {/* Tab bar */}
      <div
        className="flex overflow-x-auto"
        style={{
          borderBottom: '1px solid rgba(60,74,66,0.2)',
          background: 'rgba(23,27,38,0.5)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-4 text-xs font-semibold tracking-wide whitespace-nowrap border-b-2 transition-all',
              activeTab === tab.id
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
            )}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 flex-1">
        {activeTab === 'users' && <UsersTable />}
        {activeTab === 'services' && <ServiceCRUD />}
        {activeTab === 'audit' && <AuditLedger />}
      </div>
    </div>
  );
}
