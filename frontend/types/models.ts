export type UserRole = 'user' | 'admin';
export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AdminUser extends User {
  isBlocked: boolean;
  balance: number;
}

export interface Wallet {
  id: number;
  userId: string;
  balance: number;
}

export interface ServiceSummary {
  id: number;
  name: string;
  category: string;
}

export interface Transaction {
  id: number;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  serviceId: number | null;
  reference: string | null;
  createdAt: string;
  service: ServiceSummary | null;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  provider: string;
  isActive: boolean;
  createdAt: string;
}

export interface Analytics {
  totalRevenue: number;
  totalUsers: number;
  totalTransactions: number;
}
