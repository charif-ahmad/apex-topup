# 🚀 PROCODE Assignment — Full-Stack Top-Up Platform (Enterprise-Level)

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Core Functional Requirements](#5-core-functional-requirements)
   - 5.1 [Authentication System](#51-authentication-system)
   - 5.2 [User Dashboard](#52-user-dashboard)
   - 5.3 [Wallet System](#53-wallet-system)
   - 5.4 [Top-Up Services](#54-top-up-services)
   - 5.5 [Admin Panel](#55-admin-panel)
   - 5.6 [Payment Simulation](#56-payment-simulation)
6. [Database Design](#6-database-design)
7. [Backend Requirements (Express)](#7-backend-requirements-express)
8. [Frontend Requirements (Next.js)](#8-frontend-requirements-nextjs)
9. [Business Logic Constraints](#9-business-logic-constraints)
10. [Security Requirements](#10-security-requirements)
11. [Advanced Features](#11-advanced-features-mandatory-for-high-grade)
12. [Bonus Features](#12-bonus-features-optional-but-high-value)
13. [Deployment Requirements](#13-deployment-requirements)
14. [Deliverables](#14-deliverables)
15. [Evaluation Criteria](#15-evaluation-criteria)
16. [Expected Outcome](#16-expected-outcome)
17. [Deadline](#17-deadline)

---

## 1. Project Overview

You are required to design and implement a **full-stack digital top-up platform** similar to systems like FlashVision. The platform enables users to recharge services (mobile, internet, gift cards) using an **internal wallet system**.

The application must follow **modern software engineering practices**, including:

- Modular architecture
- Secure authentication
- Scalable database design
- Clean UI/UX

---

## 2. Objectives

- Build a scalable full-stack system
- Apply real-world architecture (MVC + API-driven frontend)
- Implement secure authentication and authorization
- Manage financial-like transactions (wallet system)
- Deliver production-ready code

---

## 3. Technology Stack

### Frontend

| Technology | Details |
|---|---|
| **Framework** | React.js with Next.js App Router |
| **Styling** | Tailwind CSS or CSS Modules |
| **HTTP Client** | use server action |

### Backend

| Technology | Details |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **API Style** | RESTful API architecture |

### Database

| Technology | Details |
|---|---|
| **DBMS** | PostgreSQL |

### Authentication & Security

| Technology | Details |
|---|---|
| **Tokens** | JWT (JSON Web Token) |
| **Hashing** | bcrypt (password hashing) |

### Deployment

| Layer | Platform |
|---|---|
| **Frontend** | Vercel |
| **Backend** | Railway / Render |
| **Database** | Supabase / Neon |

---

## 4. System Architecture

### Architecture Pattern

| Layer | Technology |
|---|---|
| **Frontend** | Client-side rendering + Server Components (Next.js) |
| **Backend** | REST API (Express) |
| **Database** | Relational (PostgreSQL) |

### Application Layers

```
1. Presentation Layer   →  Frontend (Next.js / React)
2. API Layer            →  Express.js REST API
3. Business Logic Layer →  Controllers / Services
4. Data Access Layer    →  Models / Query Builders
5. Database Layer       →  PostgreSQL
```

---

## 5. Core Functional Requirements

### 5.1 Authentication System

**Features:**

- User registration
- User login
- Secure password storage (bcrypt)
- JWT-based session management
- Role-based access control (RBAC)

**Roles:**

| Role | Description |
|---|---|
| `user` | Standard platform user |
| `admin` | Platform administrator |

---

### 5.2 User Dashboard

**Features:**

- Display wallet balance
- View transaction history
- View purchased services
- Edit profile information

---

### 5.3 Wallet System

**Features:**

- Wallet auto-created per user upon registration
- Add funds (simulated payment)
- Deduct funds during top-up
- Prevent negative balance
- Maintain full transaction logs

---

### 5.4 Top-Up Services

**Categories:**

- 📱 Mobile recharge
- 🌐 Internet packages
- 🎁 Gift cards

**Features:**

- Dynamic service listing fetched from database
- Select service + amount
- Execute top-up transaction
- Deduct balance from wallet
- Record transaction in history

---

### 5.5 Admin Panel

**Features:**

- **User Management:** View, block, and delete users
- **Service Management:** Full CRUD operations on services
- **Transaction Monitoring:** View all platform transactions
- **Basic Analytics:**
  - Total revenue
  - Total number of users
  - Total number of transactions

---

### 5.6 Payment Simulation

**Features:**

- Simulated payment gateway (no real payment integration required by default)
- Random success/failure outcome simulation
- Transaction status handling (`pending` / `success` / `failed`)

---

## 6. Database Design

### Users Table

| Column | Type | Notes |
|---|---|---|
| `id` | UUID / SERIAL | Primary Key |
| `name` | VARCHAR | User's full name |
| `email` | VARCHAR | Unique |
| `password` | VARCHAR | bcrypt hashed |
| `role` | ENUM | `user` or `admin` |
| `created_at` | TIMESTAMP | Auto-generated |

---

### Wallet Table

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL | Primary Key |
| `user_id` | FK → Users | One-to-one relationship |
| `balance` | DECIMAL | Current wallet balance |

---

### Transactions Table

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL | Primary Key |
| `user_id` | FK → Users | Owner of the transaction |
| `type` | ENUM | `credit` or `debit` |
| `amount` | DECIMAL | Transaction amount |
| `status` | ENUM | `pending`, `success`, or `failed` |
| `service_id` | FK → Services | Optional (nullable) |
| `created_at` | TIMESTAMP | Auto-generated |

---

### Services Table

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR | Service name |
| `category` | VARCHAR | e.g. mobile, internet, gift card |
| `price` | DECIMAL | Service price |
| `provider` | VARCHAR | Service provider name |
| `is_active` | BOOLEAN | Whether service is available |

---

## 7. Backend Requirements (Express)

### Folder Structure

```
/backend
├── /controllers       # Route handler logic
├── /routes            # API route definitions
├── /models            # Database models / queries
├── /middleware        # Auth, validation, error handling
├── /services          # Business logic layer
├── /utils             # Helper functions and utilities
├── app.js             # Express app configuration
└── server.js          # Server entry point
```

### Core Middleware

| Middleware | Description |
|---|---|
| **Authentication Middleware** | JWT verification for protected routes |
| **Error Handling Middleware** | Standardized error responses |
| **Request Validation Middleware** | Input sanitization and validation |

### API Endpoints

#### 🔐 Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

#### 👤 User

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/profile` | Get authenticated user's profile |
| `PUT` | `/api/user/profile` | Update authenticated user's profile |

#### 💰 Wallet

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/wallet` | Get wallet balance |
| `POST` | `/api/wallet/add` | Add funds to wallet |

#### 📊 Transactions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Get user's transaction history |

#### 🛍️ Services

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/services` | Public | List all active services |
| `POST` | `/api/services` | Admin only | Create a new service |
| `PUT` | `/api/services/:id` | Admin only | Update a service |
| `DELETE` | `/api/services/:id` | Admin only | Delete a service |

#### ⚡ Top-Up

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/topup` | Execute a top-up transaction |

---

## 8. Frontend Requirements (Next.js)

### Pages

| Page | Description |
|---|---|
| **Home Page** | Landing/marketing page |
| **Login Page** | User authentication |
| **Register Page** | New user registration |
| **Dashboard** | User overview (balance, recent activity) |
| **Wallet Page** | Wallet management and fund top-up |
| **Services Page** | Browse and select top-up services |
| **Transaction History** | Full paginated transaction list |
| **Admin Panel** | Administrative control panel |

### Components

| Component | Description |
|---|---|
| `Navbar` | Top navigation bar |
| `Sidebar` | Side navigation (dashboard/admin) |
| `ServiceCard` | Card displaying a single service |
| `TransactionTable` | Table listing transactions |
| `WalletCard` | Wallet balance display card |
| `Forms` | Login / Register / Top-Up forms |

### State Management

- **Context API** or **Redux** (choose one, justify the choice)

### UI Requirements

- ✅ Fully responsive design (mobile + desktop)
- ✅ Loading states for async operations
- ✅ Error handling and user feedback
- ✅ Clean and intuitive UX flow

---

## 9. Business Logic Constraints

- A user **cannot spend more than their wallet balance** — negative balance is forbidden
- All transactions must be **atomic** (all-or-nothing operations)
- **All financial operations must be logged** in the transactions table
- **Admin-only routes must be protected** and inaccessible to regular users

---

## 10. Security Requirements

| Requirement | Implementation |
|---|---|
| Password Hashing | bcrypt with appropriate salt rounds |
| JWT Expiration | Tokens must have a defined expiration time |
| Input Validation | Sanitize and validate all user inputs |
| SQL Injection Prevention | Use parameterized queries / ORM |
| Admin Route Protection | Role-based middleware on all admin endpoints |

---

## 11. Advanced Features *(Mandatory for High Grade)*

- **Pagination** — for the transactions history list
- **Filtering** — filter transactions by date and/or type
- **Environment Variables** — all secrets stored in `.env` files (never hardcoded)
- **API Error Standardization** — consistent error response format across all endpoints
- **Modular Code Structure** — clean separation of concerns, reusable modules

---

## 12. Bonus Features *(Optional but High Value)*

| Feature | Description |
|---|---|
| 💳 Real Payment API | Stripe integration for actual payments |
| 🔔 Notifications System | In-app or push notifications |
| 📧 Email Verification | Verify user emails on registration |
| 🌍 Multi-Language Support | i18n / localization support |
| 🌙 Dark Mode | Theme toggling (light/dark) |
| 🛡️ Rate Limiting | API protection against abuse and DDoS |

---

## 13. Deployment Requirements

- ✅ Fully deployed **frontend** (Vercel) + **backend** (Railway / Render)
- ✅ Working **live demo** link
- ✅ Production-ready **environment variables** configured on hosting platforms
- ✅ **Database hosted online** (Supabase / Neon)

---

## 14. Deliverables

- 📁 **GitHub Repository** with clean, meaningful commit history
- 📄 **README file** including:
  - Setup and installation instructions
  - Full API documentation
  - List of all environment variables
- 🔗 **Live deployed link** (frontend + backend)
- 📸 **Screenshots** of the running system

---

## 15. Evaluation Criteria

| Criteria | Weight |
|---|---|
| Architecture & Structure | 20% |
| Backend Functionality | 20% |
| Frontend UI/UX | 15% |
| Database Design | 10% |
| Security Implementation | 10% |
| Code Quality | 10% |
| Deployment | 10% |
| Bonus Features | 5% |

> **Total: 100%**

---

## 16. Expected Outcome

By completing this assignment, the student should demonstrate:

- ✅ Full-stack development capability
- ✅ Real-world system design understanding
- ✅ API integration skills
- ✅ Secure coding practices
- ✅ Production deployment experience

---
