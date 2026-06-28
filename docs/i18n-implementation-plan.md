# Multi-Language Support (i18n) — Implementation Plan
## APEX Top-Up Platform | Next.js App Router

---

## Overview

This plan adds **English / Arabic** language support to the APEX frontend without changing any existing route structures or breaking any current functionality. The approach uses a lightweight **React Context + JSON dictionary** strategy — no URL-based routing changes (`/en/`, `/ar/`), keeping implementation fast and safe.

**Estimated effort:** ~1 day of focused work.

---

## Strategy: Context-Based i18n (No URL Prefix)

| Concern | Decision | Why |
|---|---|---|
| Language storage | `localStorage` + cookie | Persists across page reloads, accessible in middleware |
| URL structure | **No change** (`/dashboard` stays `/dashboard`) | Zero risk of breaking existing routes |
| Language detection | Stored preference → browser header → default `en` | Standard UX |
| RTL support | Toggled via `dir` attribute on `<html>` | Tailwind CSS v4 `rtl:` variants work automatically |
| Translation format | Plain `.json` files | Simple, no build-step, easy to extend |
| Library | **None** (custom hook) | Zero dependencies, full control |

---

## File Structure to Add

```
frontend/
├── locales/
│   ├── en.json          ← All English strings (source of truth)
│   └── ar.json          ← Arabic translations
├── context/
│   └── LanguageContext.tsx    ← NEW: Provider + hook
├── components/
│   └── ui/
│       └── LanguageSwitcher.tsx   ← NEW: EN / AR toggle button
```

---

## Step 1 — Create Translation Files

### `frontend/locales/en.json`

```json
{
  "nav": {
    "dashboard": "Dashboard",
    "wallet": "My Wallet",
    "services": "Services",
    "transactions": "Transactions",
    "profile": "Profile",
    "adminPanel": "Admin Panel",
    "signOut": "Sign Out"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Create Account",
    "loginTitle": "Welcome back",
    "loginSubtitle": "Sign in to your APEX account",
    "registerTitle": "Get Started",
    "registerSubtitle": "Create your APEX account for free",
    "email": "Email Address",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "name": "Full Name",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "signingIn": "Signing in...",
    "signingUp": "Creating account..."
  },
  "dashboard": {
    "title": "Dashboard",
    "greeting": "Welcome back",
    "totalSpent": "Total Spent",
    "activeServices": "Active Services",
    "totalTransactions": "Total Transactions",
    "recentActivity": "Recent Activity",
    "quickTopup": "Quick Top-Up",
    "viewAll": "View All"
  },
  "wallet": {
    "title": "My Wallet",
    "balance": "Available Balance",
    "addFunds": "Add Funds",
    "addFundsTitle": "Add Funds to Wallet",
    "amount": "Amount (USD)",
    "proceed": "Proceed to Payment",
    "processing": "Processing...",
    "paymentSuccess": "Payment Approved!",
    "paymentFailed": "Payment Declined",
    "returnToWallet": "Return to Wallet",
    "tryAgain": "Try Again",
    "fundingRules": "Funding Guidelines",
    "minAmount": "Minimum deposit: $1.00",
    "maxAmount": "Maximum deposit: $100,000.00"
  },
  "services": {
    "title": "Services Directory",
    "searchPlaceholder": "Search services...",
    "all": "All",
    "mobile": "Mobile Recharge",
    "internet": "Internet Packs",
    "giftCard": "Gift Cards",
    "buyNow": "Buy Now",
    "unavailable": "Unavailable",
    "price": "Price",
    "provider": "Provider",
    "confirmPurchase": "Confirm Purchase",
    "confirmMessage": "Are you sure you want to purchase",
    "confirmFor": "for",
    "insufficientFunds": "Insufficient wallet funds. You need",
    "addFundsLink": "Add Funds to Wallet",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "purchasing": "Processing..."
  },
  "transactions": {
    "title": "Transaction History",
    "type": "Type",
    "status": "Status",
    "dateFrom": "Date From",
    "dateTo": "Date To",
    "filter": "Filter",
    "reset": "Reset",
    "all": "All",
    "credit": "Credit",
    "debit": "Debit",
    "pending": "Pending",
    "success": "Success",
    "failed": "Failed",
    "description": "Description",
    "amount": "Amount",
    "date": "Date",
    "reference": "Reference",
    "fundsLoad": "Funds Load",
    "noTransactions": "No transactions found yet.",
    "showing": "Showing",
    "to": "to",
    "of": "of",
    "transactions": "transactions"
  },
  "profile": {
    "title": "Profile Settings",
    "name": "Full Name",
    "email": "Email Address",
    "newPassword": "New Password",
    "passwordHint": "Leave blank to keep current password",
    "saveChanges": "Save Changes",
    "saving": "Saving...",
    "successMessage": "Profile updated successfully."
  },
  "admin": {
    "title": "Admin Control Panel",
    "analytics": "Analytics",
    "users": "User Management",
    "servicesTab": "Service Management",
    "auditLog": "Audit Ledger",
    "totalRevenue": "Total Platform Revenue",
    "totalUsers": "Total Users",
    "totalTransactions": "Total Transactions",
    "block": "Block",
    "unblock": "Unblock",
    "delete": "Delete",
    "addService": "+ Add New Service",
    "search": "Search users...",
    "role": "Role",
    "joined": "Joined",
    "walletBalance": "Balance",
    "actions": "Actions"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong.",
    "retry": "Retry",
    "close": "Close",
    "save": "Save",
    "edit": "Edit",
    "back": "Back",
    "name": "Name",
    "email": "Email",
    "active": "Active",
    "inactive": "Inactive",
    "user": "User",
    "admin": "Admin"
  }
}
```

### `frontend/locales/ar.json`

```json
{
  "nav": {
    "dashboard": "لوحة التحكم",
    "wallet": "محفظتي",
    "services": "الخدمات",
    "transactions": "المعاملات",
    "profile": "الملف الشخصي",
    "adminPanel": "لوحة الإدارة",
    "signOut": "تسجيل الخروج"
  },
  "auth": {
    "signIn": "تسجيل الدخول",
    "signUp": "إنشاء حساب",
    "loginTitle": "مرحباً بعودتك",
    "loginSubtitle": "سجّل دخولك إلى حساب APEX",
    "registerTitle": "ابدأ الآن",
    "registerSubtitle": "أنشئ حساب APEX مجاناً",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "confirmPassword": "تأكيد كلمة المرور",
    "name": "الاسم الكامل",
    "noAccount": "ليس لديك حساب؟",
    "hasAccount": "لديك حساب بالفعل؟",
    "signingIn": "جارِ تسجيل الدخول...",
    "signingUp": "جارِ إنشاء الحساب..."
  },
  "dashboard": {
    "title": "لوحة التحكم",
    "greeting": "مرحباً بعودتك",
    "totalSpent": "إجمالي الإنفاق",
    "activeServices": "الخدمات النشطة",
    "totalTransactions": "إجمالي المعاملات",
    "recentActivity": "النشاط الأخير",
    "quickTopup": "شحن سريع",
    "viewAll": "عرض الكل"
  },
  "wallet": {
    "title": "محفظتي",
    "balance": "الرصيد المتاح",
    "addFunds": "إضافة رصيد",
    "addFundsTitle": "إضافة رصيد إلى المحفظة",
    "amount": "المبلغ (دولار)",
    "proceed": "المتابعة إلى الدفع",
    "processing": "جارِ المعالجة...",
    "paymentSuccess": "تمت الموافقة على الدفع!",
    "paymentFailed": "رُفضت عملية الدفع",
    "returnToWallet": "العودة إلى المحفظة",
    "tryAgain": "حاول مجدداً",
    "fundingRules": "إرشادات التمويل",
    "minAmount": "الحد الأدنى للإيداع: 1.00$",
    "maxAmount": "الحد الأقصى للإيداع: 100,000.00$"
  },
  "services": {
    "title": "دليل الخدمات",
    "searchPlaceholder": "ابحث عن خدمة...",
    "all": "الكل",
    "mobile": "شحن الجوال",
    "internet": "باقات الإنترنت",
    "giftCard": "بطاقات الهدايا",
    "buyNow": "اشترِ الآن",
    "unavailable": "غير متوفر",
    "price": "السعر",
    "provider": "المزود",
    "confirmPurchase": "تأكيد الشراء",
    "confirmMessage": "هل أنت متأكد من شراء",
    "confirmFor": "بمبلغ",
    "insufficientFunds": "رصيد المحفظة غير كافٍ. تحتاج إلى",
    "addFundsLink": "إضافة رصيد إلى المحفظة",
    "confirm": "تأكيد",
    "cancel": "إلغاء",
    "purchasing": "جارِ المعالجة..."
  },
  "transactions": {
    "title": "سجل المعاملات",
    "type": "النوع",
    "status": "الحالة",
    "dateFrom": "من تاريخ",
    "dateTo": "إلى تاريخ",
    "filter": "تصفية",
    "reset": "إعادة تعيين",
    "all": "الكل",
    "credit": "إيداع",
    "debit": "سحب",
    "pending": "معلّق",
    "success": "ناجح",
    "failed": "فاشل",
    "description": "الوصف",
    "amount": "المبلغ",
    "date": "التاريخ",
    "reference": "المرجع",
    "fundsLoad": "تحميل رصيد",
    "noTransactions": "لا توجد معاملات بعد.",
    "showing": "عرض",
    "to": "إلى",
    "of": "من أصل",
    "transactions": "معاملات"
  },
  "profile": {
    "title": "إعدادات الملف الشخصي",
    "name": "الاسم الكامل",
    "email": "البريد الإلكتروني",
    "newPassword": "كلمة المرور الجديدة",
    "passwordHint": "اتركها فارغة للاحتفاظ بكلمة المرور الحالية",
    "saveChanges": "حفظ التغييرات",
    "saving": "جارِ الحفظ...",
    "successMessage": "تم تحديث الملف الشخصي بنجاح."
  },
  "admin": {
    "title": "لوحة تحكم الإدارة",
    "analytics": "الإحصائيات",
    "users": "إدارة المستخدمين",
    "servicesTab": "إدارة الخدمات",
    "auditLog": "سجل المراجعة",
    "totalRevenue": "إجمالي الإيرادات",
    "totalUsers": "إجمالي المستخدمين",
    "totalTransactions": "إجمالي المعاملات",
    "block": "حظر",
    "unblock": "رفع الحظر",
    "delete": "حذف",
    "addService": "+ إضافة خدمة جديدة",
    "search": "البحث عن مستخدم...",
    "role": "الدور",
    "joined": "تاريخ الانضمام",
    "walletBalance": "الرصيد",
    "actions": "الإجراءات"
  },
  "common": {
    "loading": "جارِ التحميل...",
    "error": "حدث خطأ ما.",
    "retry": "إعادة المحاولة",
    "close": "إغلاق",
    "save": "حفظ",
    "edit": "تعديل",
    "back": "رجوع",
    "name": "الاسم",
    "email": "البريد",
    "active": "نشط",
    "inactive": "غير نشط",
    "user": "مستخدم",
    "admin": "مدير"
  }
}
```

---

## Step 2 — Create `LanguageContext.tsx`

```tsx
// frontend/context/LanguageContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import enDict from '@/locales/en.json';
import arDict from '@/locales/ar.json';

export type Locale = 'en' | 'ar';

const DICTIONARIES = { en: enDict, ar: arDict } as const;
type Dictionary = typeof enDict;

// Nested key accessor: t('nav.dashboard') → "Dashboard"
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & string];

type TranslationKey = NestedKeyOf<Dictionary>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj) as string ?? path;
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'apex_locale';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'en' || saved === 'ar') {
      setLocaleState(saved);
    }
  }, []);

  // Apply dir + lang on the <html> element whenever locale changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = DICTIONARIES[locale] as Record<string, unknown>;
      return getNestedValue(dict, key);
    },
    [locale],
  );

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t, isRTL: locale === 'ar' }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
```

---

## Step 3 — Create `LanguageSwitcher.tsx`

```tsx
// frontend/components/ui/LanguageSwitcher.tsx
'use client';

import { useLanguage, type Locale } from '@/context/LanguageContext';
import { cn } from '@/lib/utils/cn';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  const toggle = () => setLocale(locale === 'en' ? 'ar' : 'en');

  return (
    <button
      onClick={toggle}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold',
        'border border-[var(--color-outline)] text-[var(--color-on-surface-variant)]',
        'hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]',
        'transition-colors duration-200',
        className,
      )}
    >
      <span className="material-symbols-outlined text-sm">language</span>
      {locale === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
```

> **Note:** Add `language` to the Material Symbols icon list in `app/layout.tsx`.

---

## Step 4 — Wire `LanguageProvider` into Root Layout

```diff
// app/layout.tsx
import { ToastProvider } from '@/context/ToastContext';
+ import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout({ children }) {
  return (
    // Note: lang + dir are now controlled dynamically by LanguageContext effect.
    // We keep lang="en" as the SSR default; client hydration overrides it.
    <html lang="en" dir="ltr" className={`...`} suppressHydrationWarning>
      <body>
+       <LanguageProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
+       </LanguageProvider>
      </body>
    </html>
  );
}
```

---

## Step 5 — Add Switcher to Navigation

**Sidebar** (`components/layout/Sidebar.tsx`) — add at the bottom of the user section:

```diff
+ import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
  ...
  <div className="px-3 py-4 border-t ...">
+   <div className="px-3 mb-3">
+     <LanguageSwitcher className="w-full justify-center" />
+   </div>
    {user && (...)}
    <button onClick={logout}>...</button>
  </div>
```

**MobileTopBar** — add next to the hamburger button:

```diff
+ import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
  ...
  <header className="lg:hidden ...">
    <span>APEX</span>
+   <div className="flex items-center gap-2">
+     <LanguageSwitcher />
      <button onClick={() => setOpen(true)} ...>
        <span className="material-symbols-outlined">menu</span>
      </button>
+   </div>
  </header>
```

---

## Step 6 — Replace Hardcoded Strings in Components

For each client component, import the hook and replace string literals:

```tsx
// Example: Sidebar.tsx — before
{ label: 'Dashboard', href: '/dashboard', icon: 'dashboard' }

// After
const { t } = useLanguage();
const USER_NAV = [
  { label: t('nav.dashboard'), href: '/dashboard', icon: 'dashboard' },
  { label: t('nav.wallet'),    href: '/wallet',    icon: 'account_balance_wallet' },
  ...
];
```

> For **Server Components** (pages that render on the server), translations stay as English defaults. Only client components (those with `'use client'`) pick up the live locale switch. Since all interactive text is inside client components (Sidebar, forms, modals, tables), this is sufficient.

---

## Files to Modify — Full Checklist

| File | Change |
|---|---|
| `app/layout.tsx` | Wrap with `<LanguageProvider>`, add `language` icon to Material Symbols list |
| `context/LanguageContext.tsx` | **[NEW]** Language provider + `useLanguage` hook |
| `locales/en.json` | **[NEW]** English dictionary |
| `locales/ar.json` | **[NEW]** Arabic dictionary |
| `components/ui/LanguageSwitcher.tsx` | **[NEW]** Toggle button |
| `components/layout/Sidebar.tsx` | Use `t()` for nav labels, add `<LanguageSwitcher>` |
| `components/layout/MobileTopBar.tsx` | Add `<LanguageSwitcher>` to top bar |
| `components/layout/MobileNav.tsx` | Use `t()` for nav labels |
| `components/auth/AuthShell.tsx` | Pass translated `title`/`subtitle` from parent |
| `app/(auth)/login/page.tsx` | Use `t()` for form labels |
| `app/(auth)/register/page.tsx` | Use `t()` for form labels |
| `components/dashboard/WalletCard.tsx` | Use `t()` for labels |
| `components/dashboard/DashboardActivity.tsx` | Use `t()` for section headers |
| `components/wallet/AddFundsForm.tsx` | Use `t()` for labels + button text |
| `components/services/ServicesGrid.tsx` | Use `t()` for category tabs + card buttons |
| `components/services/PurchaseModal.tsx` | Use `t()` for modal text |
| `components/transactions/TransactionTable.tsx` | Use `t()` for column headers + badges |
| `components/transactions/TransactionFilters.tsx` | Use `t()` for filter labels |
| `components/profile/ProfileForm.tsx` | Use `t()` for field labels |
| `components/admin/AnalyticsCards.tsx` | Use `t()` for card titles |
| `components/admin/UsersTable.tsx` | Use `t()` for column headers + action buttons |
| `components/admin/ServiceCRUD.tsx` | Use `t()` for labels |

---

## RTL Layout — What Changes Automatically

Tailwind CSS v4 `rtl:` variants flip layout automatically when `dir="rtl"` is on `<html>`:

```css
/* These already work for RTL with no extra code: */
flex-row → rtl:flex-row-reverse  (if needed)
text-left → rtl:text-right       (if needed)
pl-3 → rtl:pr-3, pr-3 → rtl:pl-3 (padding/margin)
```

The `dir="rtl"` attribute set by `LanguageContext` triggers browser-native RTL alignment for:
- Text alignment in inputs
- Sidebar direction (left vs right)
- Flex row ordering

---

## Verification Plan

1. Toggle language switcher → all visible text switches instantly (no page reload).
2. Reload page → language preference persists from `localStorage`.
3. Switch to Arabic → `<html dir="rtl">` is present in DevTools → text and layout flip correctly.
4. Switch back to English → layout returns to LTR.
5. All navigation labels, form labels, button text, and status badges are translated.

---

## Open Questions Before Implementation

1. Should Arabic fonts load from Google Fonts (e.g., **Noto Sans Arabic** or **Cairo**) for proper Arabic typography, or is the current Latin font sufficient for the demo?
2. Are there any specific pages or components that should **not** be translated (e.g., admin-only pages)?
3. Should the language switcher also appear on the Home (`/`) and Login/Register pages, or only inside the authenticated app?
