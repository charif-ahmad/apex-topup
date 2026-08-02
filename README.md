# ⚡ APEX Top-Up Platform

An enterprise-level full-stack digital top-up web platform built with a modern dark theme and high-tech financial aesthetic. It enables users to purchase mobile recharges, internet packages, and gaming gift cards using an internal wallet system integrated with Stripe checkout.

---

## 🚀 Features

### 👤 Authentication & User Management
- **Role-Based Access Control (RBAC):** Distinct permissions for `user` and `admin` roles.
- **Secure Auth:** JWT session management with HTTP-only cookies and password hashing using `bcrypt`.
- **User Profiles:** Authenticated users can view and update their profile details.

### 💳 Wallet System & Stripe Payment Integration
- **Auto-created Wallet:** A digital wallet is generated automatically for each user upon registration.
- **Stripe Checkout Gateway:** Secure hosted checkout powered by **Stripe API** for funding user wallets with credit/debit card processing.
- **Automated Payment Verification:** Verification of Stripe session IDs to credit wallet balances instantly upon successful payment.
- **Atomic Transactions:** Deducts funds on purchases with full database integrity verification to prevent negative balances.

### 🛍️ Services & Recharge
- **Service Categories:** Mobile recharge, internet packs, and digital gift cards.
- **Interactive Directory:** Live searching, category filtering, and single-click purchase confirmation flows.

### 📊 Transaction Ledger
- **History Tracking:** Comprehensive transaction records of credits (funding via Stripe) and debits (purchases).
- **Advanced Filtering & Pagination:** Filter by transaction type, status, and date ranges.

### 🛡️ Admin Control Panel
- **Analytics Dashboard:** Metrics showing total platform revenue, user registrations, and transaction volume.
- **Service CRUD Management:** Full create, read, update, and soft-delete/deactivate capabilities for services.
- **User Administration:** Management panel to view, block, or permanently delete users.
- **Platform Audit Ledger:** Global access to monitor all user transactions.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js (App Router) & React
- **Styling:** CSS Variables, Tailwind CSS, & custom modern UI elements
- **Payments:** Stripe Client SDK / Publishable Key Integration
- **State Management:** React Context API (`AuthContext`, `ToastContext`, `LanguageContext`)
- **Form Handling:** React Hook Form & Zod validation

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API architecture)
- **Payment Processing:** **Stripe Node.js SDK** (`stripe` npm package)
- **Database ORM:** Prisma ORM
- **Database Engine:** PostgreSQL

### Security
- Password hashing with **bcrypt**
- Request validation via **Zod** schema middleware
- API protection via **Helmet**, **CORS**, and **Express Rate Limit**

---

## 📁 Repository Structure

```text
/apex-topup
├── backend/                  # Express REST API & Stripe Integration
│   ├── prisma/               # Prisma Schema & Database Seeds
│   └── src/
│       ├── config/           # Database connections and Env variables
│       ├── controllers/      # API logic and route handlers
│       ├── middleware/       # Auth, validation, & rate limiting
│       ├── routes/           # REST Route endpoints
│       ├── services/         # Business logic & Payment (Stripe) services
│       ├── utils/            # Shared utility functions
│       └── validators/       # Request body validator schemas
│
├── frontend/                 # Next.js App Router UI
│   ├── actions/              # Server Actions for API & Payment communications
│   ├── app/                  # Pages, routes and layouts
│   ├── components/           # Reusable UI components
│   ├── context/              # Authentication & Language contexts
│   ├── lib/                  # Shared helper tools
│   └── types/                # TypeScript type definitions
│
└── docs/                     # Project Specifications & Diagrams
    └── use_case_diagram_topup_platform.png
```

---

## ⚙️ Environment Variables

Copy the environment examples and customize them to configure the platform.

### Backend (`/backend/.env`)

```ini
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/apex_topup?schema=public"
JWT_SECRET="your-long-secure-random-jwt-secret-string"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=10
PORT=4000

# Stripe Payment Gateway Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"

# Default seed admin credentials
ADMIN_EMAIL="admin@apex.local"
ADMIN_PASSWORD="change-me"
ADMIN_NAME="Apex Admin"
```

### Frontend (`/frontend/.env.local`)

```ini
API_URL="http://localhost:4000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
```

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- Running **PostgreSQL** instance
- **Stripe Account** (for test keys)

---

### Step 1: Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *(Add your `STRIPE_SECRET_KEY` and database credentials inside `.env`)*

4. **Initialize Database & Run Migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database:**
   *(Creates the admin account and populates initial digital services)*
   ```bash
   npm run seed
   ```

6. **Start the API server:**
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:4000`.

---

### Step 2: Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(Add your `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` inside `.env.local`)*

4. **Start the web app:**
   ```bash
   npm run dev
   ```
   The Next.js application will run on `http://localhost:3000`.

---

## 📡 API Documentation

For detailed REST API endpoints reference and access permissions, see [docs/API.md](docs/API.md).
