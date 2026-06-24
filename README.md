# ⚡ APEX Top-Up Platform

An enterprise-level full-stack digital top-up web platform built with a modern dark theme and high-tech financial aesthetic. It enables users to purchase mobile recharges, internet packages, and gaming gift cards using an internal wallet system.

---

## 🚀 Features

### 👤 Authentication & User Management
- **Role-Based Access Control (RBAC):** Distinct permissions for `user` and `admin` roles.
- **Secure Auth:** JWT session management with HTTP-only cookies and password hashing using `bcrypt`.
- **User Profiles:** Authenticated users can view and update their profile details.

### 💰 Wallet System & Payment Simulation
- **Auto-created Wallet:** A digital wallet is generated automatically for each user upon registration.
- **Simulated Payment Gateway:** Users can add funds to their wallet via a checkout modal with randomized approval rate configured from the backend.
- **Atomic Transactions:** Deducts funds on purchases with full integrity verification to prevent negative balances.

### 🛍️ Services & Recharge
- **Service Categories:** Mobile recharge, internet packs, and digital gift cards.
- **Interactive Directory:** Live searching, category filtering, and single-click purchase confirmation flows.

### 📊 Transaction Ledger
- **History Tracking:** Comprehensive transaction records of credits (funding) and debits (purchases).
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
- **State Management:** React Context API (`AuthContext`, `WalletContext`, `ThemeContext`)
- **Form Handling:** React Hook Form & Zod validation

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API architecture)
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
├── backend/                  # Express REST API
│   ├── prisma/               # Prisma Schema & Database Seeds
│   └── src/
│       ├── config/           # Database connections and Env variables
│       ├── controllers/      # API logic and route handlers
│       ├── middleware/       # Auth, validation, & error handling
│       ├── routes/           # REST Route endpoints
│       ├── services/         # Business logic layer
│       ├── utils/            # Shared utility functions
│       └── validators/       # Request body validator schemas
│
├── frontend/                 # Next.js App Router UI
│   ├── actions/              # Server Actions for API communications
│   ├── app/                  # Pages, routes and layouts
│   ├── components/           # Reusable UI components
│   ├── context/              # Authentication & Wallet contexts
│   ├── lib/                  # Shared helper tools
│   └── types/                # TypeScript type definitions
│
└── docs/                     # Project Specifications & Diagrams
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

# Probability (0..1) that a simulated add-funds payment succeeds
PAYMENT_SUCCESS_RATE=0.8
CORS_ORIGIN="http://localhost:3000"

# Default seed admin credentials
ADMIN_EMAIL="admin@apex.local"
ADMIN_PASSWORD="change-me"
ADMIN_NAME="Apex Admin"
```

### Frontend (`/frontend/.env.local`)

```ini
API_URL=http://localhost:4000
```

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- Running **PostgreSQL** instance

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
   *(Update database credentials and secrets inside `.env`)*

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
   Create a `.env.local` file in `/frontend` directory:
   ```bash
   echo "API_URL=http://localhost:4000" > .env.local
   ```

4. **Start the web app:**
   ```bash
   npm run dev
   ```
   The Next.js application will run on `http://localhost:3000`.

---

## 📡 API Endpoints Reference

All backend REST API endpoints are prefixed with `/api`.

### 🔐 Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and set auth cookie/JWT |

### 👤 Profile
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | User | Get profile details |
| `PUT` | `/api/user/profile` | User | Update user profile |

### 💰 Wallet
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wallet` | User | Retrieve wallet balance |
| `POST` | `/api/wallet/add` | User | Add funds to wallet (Simulated Payment) |

### 🛍️ Services
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | User | List all active top-up services |
| `POST` | `/api/services` | Admin | Create a new top-up service |
| `PUT` | `/api/services/:id` | Admin | Update a top-up service |
| `DELETE` | `/api/services/:id` | Admin | Soft-deactivate/Delete service |

### ⚡ Top-Up Execution
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/topup` | User | Process top-up transaction |

### 📊 Transactions
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | User | Fetch paginated personal transaction history |

### 🛡️ Admin Panel Control
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin | Fetch users list |
| `PATCH` | `/api/admin/users/:id/block` | Admin | Block or unblock a user profile |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user account permanently |
| `GET` | `/api/admin/transactions` | Admin | View global audit transaction ledger |
| `GET` | `/api/admin/analytics` | Admin | Retrieve platform financial and usage stats |

---

## 📄 License
This project is proprietary and confidential.
