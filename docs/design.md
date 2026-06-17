# APEX Top-Up Platform — Frontend Design & UI/UX Specification

This document provides a comprehensive UI/UX design specification for the APEX Top-Up frontend web application. It outlines the design tokens, layouts, visual components, user interaction flows, validation states, and API integrations for each page of the application.

---

## 🎨 1. Design System & Tokens

### A. Color Palette
To create a premium, high-tech financial aesthetic, the platform uses a modern dark theme based on **HSL Tailored Colors**:

| Token Name | Hex Code | HSL Representation | Primary Purpose / Role |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#0B0F19` | `hsl(224, 38%, 7%)` | Primary page background |
| `--bg-secondary` | `#151D30` | `hsl(222, 39%, 14%)` | Cards, sidebars, panel background |
| `--bg-tertiary` | `#1E2942` | `hsl(222, 38%, 19%)` | Input fields, active navigation highlights |
| `--border-color` | `#2D3D60` | `hsl(221, 36%, 28%)` | Consistent borders and grid lines |
| `--text-primary` | `#F3F4F6` | `hsl(220, 14%, 96%)` | Dominant text, high contrast headers |
| `--text-secondary` | `#9CA3AF` | `hsl(220, 9%, 64%)` | Secondary body text, labels, inactive tabs |
| `--accent-teal` | `#10B981` | `hsl(160, 84%, 39%)` | Primary action buttons, credit status, wallets |
| `--accent-teal-hover`| `#059669` | `hsl(160, 93%, 30%)` | Accent teal hover state |
| `--accent-blue` | `#3B82F6` | `hsl(217, 91%, 60%)` | Info alerts, badges, user-specific highlights |
| `--accent-orange` | `#F59E0B` | `hsl(38, 92%, 50%)` | Warning alert, pending status badge |
| `--accent-red` | `#EF4444` | `hsl(0, 84%, 60%)` | Error notifications, debit status, failed badge |

### B. Typography
- **Primary Font**: `Inter`, Sans-serif (configured via Google Fonts).
- **Secondary/Display Font**: `Outfit`, Sans-serif (for large numbers, currency displays, and hero headers).
- **Font Sizes**:
  - `h1`: `2.25rem` (36px) — Bold (Outfit)
  - `h2`: `1.5rem` (24px) — Semi-Bold (Outfit)
  - `h3`: `1.25rem` (20px) — Semi-Bold (Inter)
  - `body-large`: `1.125rem` (18px) — Regular (Inter)
  - `body`: `1rem` (16px) — Regular (Inter)
  - `small`/`label`: `0.875rem` (14px) — Medium (Inter)
  - `number-xl`: `3rem` (48px) — Semi-Bold (Outfit) (used for wallet balances)

### C. Glassmorphism & Borders
- **Card Backgrounds**: Backdrop blur applied to dark secondary boxes.
  - `backdrop-filter: blur(12px) saturate(180%);`
  - `background-color: rgba(21, 29, 48, 0.75);`
  - `border: 1px solid rgba(45, 61, 96, 0.4);`
- **Border Radii**:
  - Small Elements (Badges, Small Inputs): `6px` (`rounded-sm`)
  - Medium Elements (Standard Buttons, Text Inputs): `10px` (`rounded-md`)
  - Large Elements (Cards, Panels, Modals): `16px` (`rounded-lg`)

### D. Animations & Transitions
- **Button / Nav Hover**: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` (smooth scaling or background shift).
- **Card Hover Effects**: Cards lift slightly on hover.
  - `transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.5);`
- **Skeleton Loading State**: A pulsing shimmer effect for asynchronous loads.
  - `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }`
- **Modal Transitions**: Fade-in overlay with a scale-up modal content container.

---

## 🧭 2. Global Layout & Components

The application adopts a split viewport layout. Unauthenticated routes use a standard single-column site layout, while authenticated routes display a persistent **Sidebar + Main Content Area** layout.

```
+-------------------------------------------------------------+
|                        Global Navbar                        |
+-------------------------------------------------------------+
|             |                                               |
|             |             Main Content Panel                |
|             |             (Dashboard, Services,             |
|   Sidebar   |              Wallet, etc.)                    |
|             |                                               |
|             |                                               |
+-------------+-----------------------------------------------+
```

### A. Global Navbar Component
- **Aesthetic**: Sticky glassmorphism header at the top of the viewport (`backdrop-filter`).
- **Left Section**:
  - Platform Logo: `APEX` (styled in Bold White text) with a Teal Bolt icon (`⚡`).
- **Middle Section** (Visible for Guests):
  - Quick marketing links: "Features", "Services", "About Us".
- **Right Section** (Dynamic based on Auth state):
  - *Guest State*:
    - "Login" Button (Outline style, teal border, redirects to `/login`).
    - "Register" Button (Solid style, teal background, white text, redirects to `/register`).
  - *User State*:
    - **Wallet Indicator Badge**: Displays `Wallet: $X.XX` (Teal background, white text. Links directly to `/wallet`).
    - **User Dropdown Trigger**: Displays user's name (with a small down chevron). Clicking opens a dropdown menu with:
      - Profile Settings (links to `/profile`).
      - Transaction History (links to `/transactions`).
      - Admin Panel (only if `user.role === 'admin'`, links to `/admin`).
      - Logout Button (Red highlighted text, clears JWT token and redirects to Home).

### B. Navigation Sidebar Component
- **Behavior**: Sticky, fixed-width (`260px`) sidebar on the left side of the viewport for authenticated pages. Collaspable on mobile screens via a hamburger toggle.
- **Top Brand Area**:
  - Shows user profile preview card: Initials Avatar (Teal circle, white letter), User's Full Name, and Role Badge (`User` in Grey or `Admin` in Blue).
- **Navigation Links**:
  - `Dashboard` (Icon: Grid) — links to `/dashboard`
  - `Services` (Icon: Storefront) — links to `/services`
  - `My Wallet` (Icon: Wallet) — links to `/wallet`
  - `Transaction History` (Icon: History) — links to `/transactions`
  - `Admin Control` (Icon: Shield, *visible to Admin role only*) — links to `/admin`
- **Bottom Actions**:
  - Help & Support link.
  - Logout link (triggering JWT flush).

### C. Standardized Toast Notifications
A global system-wide toast system positioned in the **Top-Right corner** to display asynchronous process results:
- **Success Toast**: Teal checkmark icon, teal border, descriptive message (e.g., "Top-up successful!").
- **Error Toast**: Red cross icon, red border, error description from backend error object (e.g., "Insufficient wallet balance").
- **Info Toast**: Blue info icon, blue border, informative note.

---

## 📄 3. Page Specifications & Component Breakdown

### 3.1 Home / Landing Page (`/`)
- **Access**: Public (unauthenticated/guest).
- **Layout**: Full-width, single-column page.
- **Hero Section**:
  - Large main headline in `Outfit` font: "Recharge Instantly. Play & Connect Without Limits."
  - Sub-headline: "The enterprise-level wallet platform for mobile recharge, internet packs, and gaming gift cards."
  - CTA Button 1: "Get Started Now" (Solid Teal, links to `/register`).
  - CTA Button 2: "Explore Services" (Outline Blue, scrolls down to Service Showcase).
- **Service Showcase Grid**:
  - Static visual preview of popular top-up categories (Mobile, Internet, Gaming Cards) using simulated card structures.
- **Platform Features Section**:
  - Three columns showing key benefits:
    1. **Secured Ledger**: All financial transactions are atomized and logged.
    2. **Instant Delivery**: Simulated digital vouchers and recharges are generated in seconds.
    3. **Zero Maintenance Fees**: Create a wallet for free, load funds, and recharge on the go.

---

### 3.2 Login Page (`/login`)
- **Access**: Public.
- **Layout**: Centered card layout on dark gradient background.

```
+---------------------------------------------+
|                 APEX Logo                   |
|              Sign in to Apex                |
+---------------------------------------------+
| Email Address                               |
| [ input: email                            ] |
|                                             |
| Password                                    |
| [ input: password                         ] |
+---------------------------------------------+
| [          Button: Sign In (Teal)         ] |
+---------------------------------------------+
| New to Apex? Create an account (link)       |
+---------------------------------------------+
```

- **Form Fields & Validation Rules**:
  - **Email Input**:
    - Type: `email`. Required.
    - Placeholder: `name@company.com`.
    - Client-Side Validation: Must match basic email regex structure. Shows red outline and warning message: *"Please enter a valid email address."*
  - **Password Input**:
    - Type: `password`. Required.
    - Placeholder: `••••••••`.
    - Validation: Cannot be empty.
- **Actions & Logic**:
  - **Sign In Button**:
    - Action: Dispatches input to backend `POST /api/auth/login`.
    - Active State: Shows a loading circular spinner inside the button. Sets input fields to `disabled` to prevent double submissions.
    - Failure handling: Reads standard error response (e.g., `401 Unauthorized`) and displays an error box above the inputs: *"Invalid credentials. Please check your email and password."*
    - Success handling: Stores JWT token in client state/cookies, sets global auth state, and redirects user to `/dashboard`.
  - **Redirect Link**: *"New to APEX? Create an account"* (redirects to `/register`).

---

### 3.3 Register Page (`/register`)
- **Access**: Public.
- **Layout**: Centered card layout.
- **Form Fields & Validation Rules**:
  - **Name Input**:
    - Type: `text`. Required.
    - Placeholder: `John Doe`.
    - Validation: Must be at least 2 characters.
  - **Email Input**:
    - Type: `email`. Required.
    - Placeholder: `johndoe@email.com`.
    - Validation: Must be a valid email syntax.
  - **Password Input**:
    - Type: `password`. Required.
    - Placeholder: `Minimum 8 characters`.
    - Validation: Must be at least 8 characters. Shows password strength indicator (Weak/Medium/Strong).
  - **Confirm Password Input**:
    - Type: `password`. Required.
    - Validation: Must match the Password input value exactly. Red alert: *"Passwords do not match."*
- **Actions & Logic**:
  - **Sign Up Button**:
    - Action: Dispatches data to backend `POST /api/auth/register`.
    - Active State: Disables fields, shows loading spinner.
    - Failure handling: If backend returns `409 Conflict` (e.g., *"Email is already registered"*), highlights Email field in red and displays error text.
    - Success handling: Automatically logs user in using the returned JWT token, displays a welcome toast notification, and redirects to `/dashboard`.

---

### 3.4 User Dashboard (`/dashboard`)
- **Access**: Authenticated users only.
- **Layout**: Sidebar Layout.
- **A. Wallet Balance Card (WalletCard)**:
  - Background: Dark gradient glassmorphism with an embedded gold chip design.
  - Elements:
    - Label: `AVAILABLE WALLET BALANCE`
    - Large Balance display: `$0.00` (displays actual user balance formatted using the `Outfit` font).
    - Quick Action Button: `+ Add Funds` (Outline Teal button, redirects to `/wallet`).
  - Loading State: Shows a glowing shimmer box while fetching data from `/api/wallet`.

- **B. Recent Activity Panel (TransactionTable)**:
  - Header: `Recent Transactions` (with a link to view all transactions at `/transactions`).
  - Table Structure: Shows the last 5 transactions:
    - **Date Column**: Formatted as `MMM DD, YYYY` (e.g. `Jun 17, 2026`).
    - **Type Column**: Displays badge styled as:
      - Credit (Green background, up-arrow icon, label `Credit`).
      - Debit (Red background, down-arrow icon, label `Debit`).
    - **Amount Column**: Format `+$X.XX` in green text for credits, or `-$X.XX` in white text for debits.
    - **Status Column**: Badge displays:
      - `Success` (Teal background).
      - `Failed` (Red background).
      - `Pending` (Orange background).
  - Empty State: If transaction count is 0, displays a clean illustration with text: *"No transactions found yet. Load funds to get started!"*

- **C. Quick Top-up Selection Grid**:
  - Header: `Fast Recharge Services`
  - Body: A 3-column layout showing the top 3 popular services.
  - Service Card preview: Shows provider icon, service name, price, and a quick "Recharge" trigger that redirects to `/services` with the service selected.

---

### 3.5 Wallet Management Page (`/wallet`)
- **Access**: Authenticated users only.
- **Layout**: Sidebar Layout.
- **Main View**:
  - Split layout:
    - *Left Side*: Current balance display + list of funding rules.
    - *Right Side*: Add Funds Card.
- **Add Funds Card Elements**:
  - **Amount Input**:
    - Type: `number`. Required.
    - Placeholder: `Enter amount in USD ($)`.
    - Input Validation: Must be greater than 0, maximum allowed value is `100,000` (aligning with `wallet.validator.js` constraint).
    - Invalid inputs show helper text: *"Amount must be between $1 and $100,000"*.
  - **Submit Button**: `Proceed to Simulated Payment` (Solid Teal button).

#### 💳 Simulated Payment Gateway Flow:
Upon clicking the submit button, the page triggers a **Simulated Payment Modal** to simulate an external checkout:

```
+-----------------------------------------------------------+
|               SIMULATED PAYMENT GATEWAY                   |
+-----------------------------------------------------------+
| Amount to Load: $50.00                                    |
| Reference ID: [Generated UUID]                            |
+-----------------------------------------------------------+
| [ Animated loading indicator / Spinner ]                  |
| "Processing card transaction with bank simulation..."     |
+-----------------------------------------------------------+
```

1. **Transaction Submission**: Client makes a `POST /api/wallet/add` request with `amount` payload.
2. **Processing State**: Modal locks and shows a spinning loader with text: *"Verifying funds with card network..."* (duration 1.5s).
3. **Outcome Resolution**: 
   - Based on backend processing (which rolls a randomized success state depending on `env.paymentSuccessRate`):
     - **On SUCCESS Outcome**:
       - Modal updates icon to green checkmark.
       - Message: *"Payment Approved! $X.XX loaded to your wallet."*
       - Close Button appears: `Return to Wallet` (which updates dashboard state and updates balance).
     - **On FAILED Outcome**:
       - Modal updates icon to red warning symbol.
       - Message: *"Transaction Declined. Bank simulation rolled a failure. No funds were debited."*
       - Close Button appears: `Try Again`.

---

### 3.6 Services Directory Page (`/services`)
- **Access**: Authenticated users only.
- **Layout**: Sidebar Layout.
- **Features**:
  - **Category Tabs**: Row of filter buttons: `All`, `Mobile Recharge` (Icon: Phone), `Internet Packs` (Icon: Wifi), `Gift Cards` (Icon: Gift).
    - Clicking a tab filters the displayed service cards locally (or via query params `?category=x`).
  - **Search Bar**: Text field to search service list by name or provider.

#### ServiceCard Component Structure:
Each service is rendered inside a card container:

```
+-----------------------------------------------------------+
| [Category Icon]                     Badge: [Active/Inactive] |
|                                                           |
| Service Name (e.g. Steam Gift Card $20)                    |
| Provider: Steam                                           |
+-----------------------------------------------------------+
| Price: $20.00                   Button: [Buy Now (Teal)]  |
+-----------------------------------------------------------+
```

- **Interactive Details**:
  - **Buy Now Button**:
    - If user has insufficient balance: Button remains enabled, but the confirm modal handles the warning.
    - If service is inactive: Button is disabled and labeled `Unavailable`.
  - **Purchase Confirmation Modal**:
    - Triggered by clicking `Buy Now`.
    - Content: *"Are you sure you want to purchase **[Service Name]** for **$[Price]**? This amount will be immediately deducted from your wallet balance."*
    - **Insufficient Funds Warning**:
      - If `wallet.balance < service.price`, the modal replaces the "Confirm" button with a message: *"Insufficient wallet funds. You need $[Required] more."* and shows a link button: `Add Funds to Wallet` (which redirects to `/wallet`).
    - **Confirm Button**:
      - Triggers `POST /api/topup` with `{ serviceId }`.
      - Shows loader. On success, updates user's balance, displays a success toast message containing the transaction details, and closes modal.

---

### 3.7 Transaction History Page (`/transactions`)
- **Access**: Authenticated users only.
- **Layout**: Sidebar Layout.
- **A. Filter Form Grid**:
  - 4-column search form wrapping inputs:
    1. **Type Selector**: Dropdown (`All`, `Credit`, `Debit`).
    2. **Status Selector**: Dropdown (`All`, `Success`, `Failed`, `Pending`).
    3. **Date From**: Date input.
    4. **Date To**: Date input.
  - Buttons:
    - `Filter` (Solid Blue).
    - `Reset` (Outline Gray, clears form inputs and re-fetches default).
- **B. TransactionTable Component**:
  - Table displaying the columns:
    - `ID/Ref`: Unique transactional ID or reference.
    - `Date`: Localized date and time.
    - `Type`: credit (green) / debit (red) indicator.
    - `Description`: If debit, lists the purchased service name. If credit, lists "Funds Load".
    - `Amount`: Dynamic color values.
    - `Status`: Colored pill badges.
- **C. Pagination Controls**:
  - Displayed underneath the table:
    - Text: `Showing X to Y of Z transactions`
    - Prev Button (disabled if on page 1).
    - Next Button (disabled if on the last page).
    - Page number boxes (interactive, allows jumping directly to a page).
  - Logic: Interacts with `GET /api/transactions?page=X&limit=10&type=Y&status=Z...` endpoints.

---

### 3.8 Admin Panel Page (`/admin`)
- **Access**: Authenticated Admin Role Only (`role === 'admin'`).
- **Layout**: Sidebar Layout.
- **A. Analytics Dash Cards**:
  - Shows 3 main cards with performance counts (fetched from `/api/admin/analytics`):
    1. **Total Platform Revenue**: Formatted currency sum of successful debits.
    2. **Total Users**: Count of registered profiles.
    3. **Total Transactions**: Sum of all logged transactions.

- **B. Tabbed Control Panels**:
  - Admin interacts via 3 view tabs:

#### Tab 1: User Administration
- **User List Table**: Columns: User Name, Email, Role, Created Date, Status (Active/Blocked), Wallet Balance, Action Buttons.
- **Block Toggle Action**:
  - Button labeled `Block` (Red outline) or `Unblock` (Teal outline) depending on current status.
  - Action: Triggers `PATCH /api/admin/users/:id/block` with body `{ isBlocked: true/false }`.
- **Delete User Action**:
  - Button labeled `Delete` (Trash icon).
  - Triggers a **Double Confirmation Modal**: *"Warning! Deleting this user will remove their wallet and all transaction history. Type DELETE to confirm."*
  - Action: Triggers `DELETE /api/admin/users/:id`.

#### Tab 2: Service CRUD Management
- **Top Actions Bar**: `+ Add New Service` button (opens creation modal).
- **Service Management List Table**: Columns: Name, Category, Provider, Price, Active Status, Action Buttons (Edit, Deactivate/Delete).
- **Create Service Modal**:
  - Form Fields: Name (text), Category dropdown (Mobile, Internet, Gift Card), Price (positive decimal), Provider (text).
  - Action: `POST /api/services` (creates and appends to services directory).
- **Edit Service Modal**:
  - Pre-filled inputs with existing service attributes.
  - Action: `PUT /api/services/:id`.
- **Deactivate/Delete Action**:
  - Clicking `Delete` (Trash icon) triggers `DELETE /api/services/:id`.
  - UI displays dynamic feedback toast:
    - If service has transaction history, shows toast: *"Service referenced by transactions; soft-deactivated successfully."*
    - If service is unreferenced, shows toast: *"Service permanently deleted."*

#### Tab 3: Platform Audit Ledger
- Shows all transactions made on the platform by all users. Includes searching by `user_id` or user's email, filtering by transaction status, and full pagination.

---

## 💾 4. State Management (Client-Side)

The application uses the React **Context API** (or equivalent state container) to share global variables:
- **`AuthContext`**:
  - `user`: Holds `{ id, name, email, role }` decrypted from JWT payload.
  - `token`: Stored JWT.
  - `isAuthenticated`: Boolean value.
  - `login(token)`: Updates state and cookies.
  - `logout()`: Cleans up cookies, state, and redirects.
- **`WalletContext`**:
  - `balance`: Current wallet balance.
  - `fetchBalance()`: Utility function to trigger GET `/api/wallet` and update balance.
- **`ThemeContext`**:
  - Manages Dark/Light mode theme state.

---

## 📱 5. Responsive Grid & Mobile UX Guidelines

- **Breakpoints**:
  - Mobile: `< 640px` (Sidebar collapses into absolute drawer, tables switch to card lists).
  - Tablet: `640px` to `1024px` (Sidebar collapses into icon-only layout).
  - Desktop: `> 1024px` (Full sidebar + panel layout).
- **Mobile Optimizations**:
  - Form inputs are sized `16px` font size to prevent automatic iOS zoom behaviors.
  - Tables utilize horizontal scroll indicators (`overflow-x-auto`) to ensure clear alignment.
  - Interactive buttons have a minimum touch target size of `44px x 44px`.
