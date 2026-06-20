# Production Deployment & Debugging Report

This document provides a comprehensive technical overview of the current system architecture, environment configurations, and active deployment issues for the **APEX Top-Up Platform** to assist in quick resolution.

---

## 1. System Architecture Overview

The application is a full-stack digital top-up platform built with a decoupled frontend and backend:

*   **Database (Supabase):** Managed PostgreSQL instance.
*   **Backend (Render):** Node.js Express REST API using Prisma ORM.
*   **Frontend (Vercel):** Next.js application using React Server Components (RSC) and Server Actions.

```mermaid
graph TD
    Vercel[Next.js Frontend on Vercel]
    Render[Express.js Backend on Render]
    Supabase[PostgreSQL on Supabase]

    Vercel -- HTTP/HTTPS Server Actions --> Render
    Render -- Connection Pooler (6543) --> Supabase
    Developer -- Direct Migration (5432) --> Supabase
```

---

## 2. Database Connection Architecture (Supabase & Prisma)

To accommodate Prisma running in a serverless/cloud environment, we configured a dual-connection string system in `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Purpose of Dual URLs:
1.  **`DATABASE_URL` (Connection Pooler):** Points to the Supabase Connection Pooler on port **6543** (with `?pgbouncer=true` and `&connection_limit=1`). This prevents connection exhaustion by reusing database connections during runtime API requests.
2.  **`DIRECT_URL` (Direct Connection):** Points to the direct database address on port **5432**. This is required for running Prisma migrations (`prisma migrate dev` or `prisma db push`) because connection poolers do not support migration commands.

---

## 3. Environment Variables Configuration

### A. Backend (Render Environment Variables)
The backend requires these environment variables to be explicitly set in the Render Dashboard:

| Key | Example / Recommended Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require` | Connection to transaction pooler. Must include `sslmode=require`. |
| `DIRECT_URL` | `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres` | Direct connection for migrations (only if running migrations during build). |
| `JWT_SECRET` | *Strong random string (e.g., generated with crypto)* | Used to sign JWT session tokens. |
| `JWT_EXPIRES_IN` | `1d` | Token expiry. |
| `BCRYPT_SALT_ROUNDS`| `10` | Password hashing complexity. |
| `PORT` | `10000` | Port for Express server. |
| `CORS_ORIGIN` | `https://apex-topup-vercel-app-url.vercel.app` | URL of the deployed Vercel frontend (no trailing slash). |

> **Build Command on Render:**
> `npm install && npx prisma generate`
> *(Note: We removed `npx prisma migrate deploy` from the Render build command because direct port 5432 might be restricted in some environments, and database migrations are run locally or manually via Supabase dashboard to keep the build process stable).*

### B. Frontend (Vercel Environment Variables)
The frontend Next.js app requires:

| Key | Example / Recommended Value | Purpose |
| :--- | :--- | :--- |
| `API_URL` | `https://apex-topup.onrender.com` | Base URL of the backend REST API on Render. |

*Warning: Ensure there is **no trailing slash** in `API_URL` and that it uses **https://** rather than **http://**.*

---

## 4. Current Production Issues & Diagnosis

We are currently troubleshooting two critical symptoms in the production environment:

### Issue A: `Route not found: GET /api/auth/login` (404 Error)
*   **Symptom:** When attempting to log in or register, the user receives a "Failed" message, and logs show:
    `{"success":false,"error":{"message":"Route not found: GET /api/auth/login","statusCode":404}}`
*   **Root Cause Analysis:**
    *   The frontend uses Server Actions to make requests. The `authPost` action fetches `${BASE}/api/auth/login` using the `POST` method.
    *   If `process.env.API_URL` (i.e. `BASE`) is configured as `http://apex-topup.onrender.com` (using `http://` instead of `https://`), Render's load balancer redirects the request from HTTP to HTTPS.
    *   When a HTTP client (such as Node.js `fetch` in Next.js Server Components) follows a standard `301/302` redirect on a `POST` request, it changes the method to `GET` by default.
    *   Consequently, the request reaches the backend Express router as `GET /api/auth/login`. Since the backend only registers a `POST /login` route, Express triggers the 404 handler.
*   **Solution:**
    *   Update Vercel's environment variables. Ensure `API_URL` is explicitly set to `https://apex-topup.onrender.com` (specifically check that it starts with **`https://`**).
    *   Ensure there are no typos, leading/trailing spaces, or repeated URLs in the value.

### Issue B: `500 Internal Server Error` on POST requests
*   **Symptom:** When calling endpoints like `/api/auth/register`, the backend logs show a `500 Internal server error` during database connection.
*   **Root Cause Analysis:**
    *   Prisma cannot establish a secure connection to the Supabase PostgreSQL transaction pooler.
    *   This is typically caused by missing the SSL parameter on cloud hostings like Render. Without explicit SSL configuration, cloud platforms fail to negotiate the handshake with Supabase.
*   **Solution:**
    *   Ensure `sslmode=require` is appended to the connection string on Render.
    *   Verify `DATABASE_URL` format on Render matches:
        `postgresql://[USER].[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require`
    *   Check for any surrounding double quotes `"` in the environment variables values entered on the Render Dashboard. (Render imports them literally, so `"https://..."` becomes a malformed URL).

---

## 5. Summary Handoff Checklist for Expert

To restore full functionality, please verify the following:

1.  **Vercel Dashboard Settings:**
    *   [ ] Verify `API_URL` environment variable exists.
    *   [ ] Confirm `API_URL` starts with `https://` (e.g., `https://apex-topup.onrender.com`).
    *   [ ] Confirm there is no trailing slash (e.g., `https://apex-topup.onrender.com` and NOT `https://apex-topup.onrender.com/`).
    *   [ ] Redepoly the frontend on Vercel to ensure the environment variables are correctly loaded into the build runtime.

2.  **Render Dashboard Settings:**
    *   [ ] Verify `DATABASE_URL` has `sslmode=require` query parameter.
    *   [ ] Ensure no environment variable value is wrapped in quotes (`"`).
    *   [ ] Confirm `CORS_ORIGIN` matches the exact Vercel production domain (e.g., `https://apex-topup.vercel.app` or `https://apex-topup-q7jix9nf7-charif-ahmads-projects.vercel.app`).
    *   [ ] Review Render log output during registration for any Prisma initialization errors (`P1001`, `P2002`, etc.) to confirm successful DB handshakes.
