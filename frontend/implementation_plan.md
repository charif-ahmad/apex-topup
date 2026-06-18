# Implementation Plan — APEX Frontend (Next.js + TypeScript)

## ما فهمته من المشروع

### 1. الـ Backend (موجود ومكتمل)
- **Express.js + Prisma + PostgreSQL** — جاهز على port `4000`
- كل الـ responses لها نفس الشكل:
  - **نجاح:** `{ success: true, message?, data: T }`
  - **خطأ:** `{ success: false, error: { message, statusCode, details? } }`
- المصادقة عبر **JWT Bearer Token** في `Authorization` header
- Token يحتوي على `{ sub: userId, role: 'user' | 'admin' }`
- **الـ Base URL:** `http://localhost:4000/api`

### 2. Endpoints الفعلية المتاحة
| الـ Endpoint | Method | Auth | وصف |
|---|---|---|---|
| `/api/health` | GET | — | Health check |
| `/api/auth/register` | POST | — | تسجيل مستخدم جديد |
| `/api/auth/login` | POST | — | تسجيل الدخول، يُرجع token |
| `/api/user/profile` | GET | User | بيانات المستخدم |
| `/api/user/profile` | PUT | User | تعديل الاسم |
| `/api/wallet` | GET | User | رصيد المحفظة |
| `/api/wallet/add` | POST | User | إضافة رصيد (محاكاة دفع) |
| `/api/transactions` | GET | User | سجل العمليات (paginated + filters) |
| `/api/services` | GET | Public | قائمة الخدمات النشطة |
| `/api/services` | POST | Admin | إنشاء خدمة جديدة |
| `/api/services/:id` | PUT | Admin | تعديل خدمة |
| `/api/services/:id` | DELETE | Admin | حذف خدمة |
| `/api/topup` | POST | User | تنفيذ عملية شراء خدمة |
| `/api/admin/users` | GET | Admin | كل المستخدمين (paginated) |
| `/api/admin/users/:id/block` | PATCH | Admin | حظر/رفع حظر مستخدم |
| `/api/admin/users/:id` | DELETE | Admin | حذف مستخدم |
| `/api/admin/transactions` | GET | Admin | كل العمليات (paginated + filters) |
| `/api/admin/analytics` | GET | Admin | إجمالي الإيرادات، المستخدمين، العمليات |

### 3. أشكال البيانات الرئيسية (من Prisma Schema)
- **User:** `{ id: string (UUID), name, email, role: 'user'|'admin', createdAt }`
- **Wallet:** `{ id, userId, balance: number }`
- **Transaction:** `{ id, userId, type: 'credit'|'debit', amount: number, status: 'pending'|'success'|'failed', serviceId?, reference?, createdAt, service?: { id, name, category } }`
- **Service:** `{ id, name, category, price: number, provider, isActive, createdAt }`
- **Pagination:** كل القوائم تُرجع `{ items, page, limit, total, totalPages }`

### 4. التصميم (من ملفات Stitch)
- **Framework:** Tailwind CSS مع Design System مخصص (نفس المتغيرات الموجودة في الـ HTML)
- **8 شاشات:** Home, Sign In, Dashboard, My Wallet, Services Directory, Transaction History, Profile Settings, Admin Control
- **المكونات المشتركة:** Sidebar موحد، Mobile Bottom Nav، Skeleton loaders

---

## الخطة التقنية

### Stack المختار
| العنصر | الاختيار | السبب |
|---|---|---|
| Framework | **Next.js last version(16)** (App Router) | مطلوب في PROJECT.md + Server/Client Components |
| Language | **TypeScript** (strict mode) | type safety، لا `any`، `unknown` للـ error handling |
| Styling | **Tailwind CSS v4** | نفس نظام التصميم الموجود في Stitch |
| HTTP Client | **Fetch API native** مع wrapper مخصص | لا حاجة لـ Axios في Next.js 16 |
| State Management | **React Context API + `useReducer`** | كافٍ للمشروع، أبسط من Redux |
| Forms | **React Hook Form v7 + Zod** | Type-safe validation يتطابق مع Backend Zod schemas |
| Icons | **Material Symbols** (نفس Stitch) | تناسق مع التصميم |
| Fonts | **Google Fonts: Outfit + Inter** | مطابق لـ Design System |

---

## هيكل المجلدات المقترح

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route Group — صفحات بدون sidebar
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/                    # Route Group — صفحات المستخدم المسجل
│   │   ├── layout.tsx            # AppLayout: Sidebar + MobileNav
│   │   ├── dashboard/page.tsx
│   │   ├── wallet/page.tsx
│   │   ├── services/page.tsx
│   │   ├── transactions/page.tsx
│   │   └── profile/page.tsx
│   ├── (admin)/                  # Route Group — صفحات Admin فقط
│   │   ├── layout.tsx            # AdminGuard + AdminSidebar
│   │   └── admin/page.tsx
│   ├── layout.tsx                # Root layout: HTML, fonts, providers
│   ├── page.tsx                  # Home / Landing Page
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── ui/                       # Primitives (Button, Input, Badge, Modal, Skeleton...)
│   ├── layout/                   # Sidebar, MobileNav, AppHeader, Topbar
│   ├── auth/                     # LoginForm, RegisterForm
│   ├── dashboard/                # WalletCard, QuickTopupList, RecentTransactions
│   ├── wallet/                   # BalanceCard, AddFundsForm, PaymentModal
│   ├── services/                 # ServiceCard, ServiceGrid, PurchaseModal
│   ├── transactions/             # TransactionTable, TransactionFilters, Pagination
│   ├── profile/                  # ProfileForm, SecurityCard
│   └── admin/                    # UsersTable, ServiceCRUD, AnalyticsCards, AuditLog
├── lib/
│   ├── api/                      # API client layer
│   │   ├── client.ts             # fetch wrapper مع type-safe
│   │   ├── auth.ts               # register, login
│   │   ├── user.ts               # getProfile, updateProfile
│   │   ├── wallet.ts             # getWallet, addFunds
│   │   ├── transactions.ts       # listTransactions
│   │   ├── services.ts           # listServices, createService, updateService, deleteService
│   │   ├── topup.ts              # executeTopup
│   │   └── admin.ts              # listUsers, blockUser, deleteUser, listAllTx, analytics
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useWallet.ts
│   │   └── useToast.ts
│   └── utils/
│       ├── formatCurrency.ts
│       ├── formatDate.ts
│       └── cn.ts                 # className merger (clsx + tailwind-merge)
├── types/
│   ├── api.ts                    # ApiResponse<T>, ApiError types
│   ├── models.ts                 # User, Wallet, Transaction, Service (مشتقة من Prisma)
│   └── auth.ts                   # AuthContext types
├── context/
│   ├── AuthContext.tsx            # AuthProvider: user, token, login(), logout()
│   └── ToastContext.tsx           # Global toast notifications
├── middleware.ts                  # Next.js middleware: route protection + role guard
├── .env.local
├── tailwind.config.ts
├── tsconfig.json                  # strict: true
└── package.json
```

---

## Types المقترحة (`types/`)

```typescript
// types/api.ts
export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
    statusCode: number;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// types/models.ts
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
```

---

## API Client (`lib/api/client.ts`)

```typescript
// type-safe fetch wrapper — لا any، الأخطاء unknown
async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  token?: string
): Promise<ApiSuccess<T>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const json: unknown = await res.json();

  // Type narrowing بدلاً من casting مباشر
  if (!res.ok) {
    const err = json as ApiError;
    throw new Error(err.error?.message ?? 'Request failed');
  }

  return json as ApiSuccess<T>;
}
```

---

## استراتيجية Skeleton Loading

كل section يعرض عناصر Skeleton أثناء التحميل:
- **WalletCard Skeleton** — مستطيل يومض مكان الرصيد
- **ServiceGrid Skeleton** — 8 بطاقات وهمية
- **TransactionTable Skeleton** — 5 صفوف وهمية
- **AnalyticsCards Skeleton** — 3 بطاقات وهمية
- **UsersTable Skeleton** — 5 صفوف وهمية

يُستخدم نمط `loading.tsx` في App Router (يظهر تلقائياً أثناء تحميل الصفحة) + `Suspense` boundaries للـ components المستقلة.

---

## Route Protection (`middleware.ts`)

```
/login, /register         → Public (redirect to /dashboard if logged in)
/dashboard, /wallet, ...  → Protected (redirect to /login if no token)
/admin                    → Admin only (redirect to /dashboard if role ≠ admin)
```

يقرأ الـ middleware الـ token من `localStorage` عبر cookie مشفرة (HttpOnly-compatible).

---

## AuthContext Strategy

```typescript
// context/AuthContext.tsx
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// Actions: LOGIN, LOGOUT, SET_LOADING
// يُحفظ token في localStorage
// عند كل refresh: يُحاول تحميل بيانات المستخدم من /api/user/profile
```

---

## الصفحات والمكونات

### صفحات المستخدم
| الصفحة | الـ Data المطلوب | Skeleton |
|---|---|---|
| Dashboard | wallet + last 5 transactions + services | WalletCard + 3 quick service cards + 5 tx rows |
| Wallet | wallet + transactions | BalanceCard + tx list |
| Services | services list | 8 service cards |
| Transactions | transactions (paginated + filterable) | table rows |
| Profile | user profile | form fields |

### صفحات Admin
| الصفحة | الـ Data المطلوب | Skeleton |
|---|---|---|
| Admin Panel (Analytics tab) | analytics | 3 stat cards |
| Admin Panel (Users tab) | users (paginated) | table rows |
| Admin Panel (Services tab) | all services | service list |
| Admin Panel (Transactions tab) | all transactions | table rows |

---

## مراحل التنفيذ

### Phase 1 — Bootstrap
1. إنشاء Next.js 16 project داخل `frontend/`
2. إعداد TypeScript strict mode + Tailwind CSS v4
3. نسخ Design System tokens (الألوان والـ typography من ملفات Stitch)
4. إنشاء UI primitives: Button, Input, Badge, Skeleton, Modal

### Phase 2 — Auth Layer
5. إنشاء `AuthContext` + `lib/api/auth.ts`
6. بناء صفحتي Login + Register مع validation (Zod + React Hook Form)
7. إعداد `middleware.ts` لحماية الـ routes

### Phase 3 — User Pages
8. Dashboard: WalletCard + QuickTopup + RecentTransactions
9. Wallet: BalanceCard + AddFundsForm + Payment Result Modal
10. Services: ServiceGrid + PurchaseModal
11. Transactions: TransactionTable + Filters + Pagination
12. Profile: ProfileForm

### Phase 4 — Admin Pages
13. Admin Control Panel: AnalyticsCards + UsersTable + ServiceCRUD + AllTransactions

### Phase 5 — Polish
14. Unify Sidebar + MobileNav (كما في الخطة السابقة للـ Stitch)
15. Skeleton loaders لكل section
16. Error handling + Toast notifications
17. Home / Landing Page

---

## ملاحظات مهمة

> [!IMPORTANT]
> - `tsconfig.json` يجب أن يكون `strict: true`، `noImplicitAny: true`
> - لا يُستخدم `as any` في أي مكان — كل casting يمر عبر type narrowing أو `unknown`
> - كل الـ async errors تُعالج في `catch (err: unknown)` وتُحوّل إلى رسائل مفهومة
> - كل حقل مالي (`balance`, `amount`, `price`) يُعرض بـ `formatCurrency()` ولا يُعامل كـ string

> [!NOTE]
> الـ Backend يعمل على port `4000`، سيُضاف `NEXT_PUBLIC_API_URL=http://localhost:4000` في `.env.local`
> وعند الـ deployment: يُحدّث إلى الـ URL الفعلي على Railway/Render

---

## Open Questions

1. هل تريد تفعيل **Dark Mode toggle** فعلي (light/dark) أم نبقى على Dark فقط كما في التصميم؟
2. هل يجب نقل ملفات Stitch HTML كـ **مرجع بصري فقط** أم تحويل بعضها مباشرة لـ `.tsx`؟
3. هل نبدأ بالـ **User pages أولاً** ثم Admin، أم نبنيها بالتوازي؟
