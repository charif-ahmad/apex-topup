# 📡 APEX Top-Up Platform - REST API Reference

All backend REST API endpoints are prefixed with `/api`.  
Base URL: `http://localhost:4000/api`

---

## 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Login and obtain auth JWT cookie |

---

## 👤 User Profile (`/api/user`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | User | Get current user profile details |
| `PUT` | `/api/user/profile` | User | Update user profile details |

---

## 💰 Wallet & Stripe Payments (`/api/wallet`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wallet` | User | Retrieve current user wallet balance |
| `POST` | `/api/wallet/add` | User | Create a Stripe Checkout session for funding |
| `POST` | `/api/wallet/verify-session` | User | Verify Stripe checkout session & credit wallet |

---

## 🛍️ Top-Up Services (`/api/services`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | User | List all active top-up services |
| `POST` | `/api/services` | Admin | Create a new top-up service |
| `PUT` | `/api/services/:id` | Admin | Update an existing top-up service |
| `DELETE` | `/api/services/:id` | Admin | Soft-deactivate/Delete service |

---

## ⚡ Purchase Top-Up (`/api/topup`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/topup` | User | Process top-up service purchase from wallet |

---

## 📊 Transaction History (`/api/transactions`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | User | Fetch paginated personal transaction history |

---

## 🛡️ Admin Control Panel (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin | Fetch users list with pagination |
| `PATCH` | `/api/admin/users/:id/block` | Admin | Block or unblock a user profile |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user account permanently |
| `GET` | `/api/admin/transactions` | Admin | View global audit transaction ledger |
| `GET` | `/api/admin/analytics` | Admin | Retrieve platform financial & usage analytics |
