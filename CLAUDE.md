# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Triepe is a full-stack e-commerce platform (brutalist streetwear store) with a decoupled monorepo structure:
- `frontend/` — Next.js 15 (App Router, Turbopack), hosted on Vercel
- `backend/` — Express.js + TypeScript + Prisma 7, hosted on Google Cloud Run
- Database: PostgreSQL on Neon.tech (serverless)

## Commands

### Backend (`cd backend`)
```bash
npm run dev      # ts-node-dev with hot reload
npm run build    # generates Prisma client + compiles TypeScript
npm run seed     # manually run Prisma seed script
npm start        # production: migrate → seed → start compiled JS
```

### Frontend (`cd frontend`)
```bash
npm run dev      # Next.js dev server on port 3000
npm run build    # Next.js production build
npm run lint     # ESLint (next/core-web-vitals + TypeScript)
```

### Full Stack (Docker)
```bash
docker compose up   # PostgreSQL:5432, Backend:4000, Frontend:3000
```

### CI Pipeline
The GitHub Actions pipeline runs `tsc` type checks and Prisma client generation for both backend and frontend on every PR. All merges to `main` require these checks to pass — no direct pushes to `main`.

## Architecture

### Frontend Structure (`frontend/src/`)
- `app/` — Next.js App Router pages (store, checkout, admin, contact, faq)
- `components/` — Navbar, CartDrawer, Footer, MobileMenu, ImageUpload, StoreWrapper
- `store/` — Zustand cart state with localStorage persistence
- `lib/api.ts` — Centralized fetch client with environment-aware URL resolution (browser uses `NEXT_PUBLIC_API_URL`; SSR uses `INTERNAL_API_URL` for Docker networking)
- `config/shipping.ts` — Shipping method definitions (SPEEDY, ECONT, IN_STORE with pricing)

### Backend Structure (`backend/src/`)
- `controllers/` → `services/` pattern: controllers handle HTTP, services own business logic
- `middlewares/` — `requireAuth` and `requireAdmin` JWT middleware
- `config.ts` — Prisma client singleton, JWT constants
- `services/email.service.ts` — AWS SES integration for order notifications
- `services/cloudinary.service.ts` — Image upload/delete

### Data Model (Prisma)
Key relationships:
- `Product` has many `ProductVariant` (size + stock tracking)
- `Order` has many `OrderItem` (snapshots `priceAtBuy`, `productTitle`, `productImage` at purchase time)
- `User` has roles `USER | ADMIN`; orders have status `PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED`

### Authentication
JWT stored in cookies (`jwt`). Backend validates via `requireAuth`/`requireAdmin` middleware checking `req.cookies.jwt`. JWT payload: `{ userId, role }`, 7-day expiry.

### Data Fetching Patterns
- SSR product fetches use `next: { revalidate: 60 }` for ISR
- All client-side mutations use `credentials: "include"` for cookie auth
- Server-side fetches prefer `INTERNAL_API_URL` over `NEXT_PUBLIC_API_URL`

## Important Notes

### Next.js Version Warning
This project uses Next.js 15 with React 19 and Turbopack. APIs and conventions may differ from earlier versions. Read `node_modules/next/dist/docs/` before writing Next.js-specific code and heed deprecation notices.

### TypeScript Config
Backend uses strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — treat indexed accesses and optional properties with care.

### Deployment
- Frontend deploys automatically to Vercel on merge to `main`
- Backend deploys to GCP Cloud Run; `npm start` runs `prisma migrate deploy` before serving
- Admin user is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars on first deploy
