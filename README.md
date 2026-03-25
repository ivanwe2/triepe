# Triepe

A high-performance, full-stack e-commerce platform built with a focus on **Brutalist Design**, **Type Safety**, and **Scalable Cloud Infrastructure**.

---

## 🏗️ Technical Architecture

Triepe is built using a modern, decoupled monorepo architecture, ensuring separation of concerns, independent scaling, and a hardened production environment.

### **Frontend**
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
* **Language:** TypeScript (Strict Mode)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Brutalist UI Design System)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Hosting:** [Vercel](https://vercel.com/) (Edge Network)

### **Backend**
* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **ORM:** [Prisma 7](https://www.prisma.io/)
* **Hosting:** [Google Cloud Run](https://cloud.google.com/run) (Serverless Containers)
* **Process Management:** Native JS execution in production for high-performance cold starts and dynamic DB seeding.

### **Database & Storage**
* **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon.tech](https://neon.tech/) Serverless)
* **Media Storage:** [Cloudinary](https://cloudinary.com/) (Optimized image and video delivery)
* **DNS & Infrastructure:** [Cloudflare](https://www.cloudflare.com/) (Full Strict SSL, DNS-only API routing)

---

## 🛡️ Infrastructure & Quality Assurance

This repository is "Hardened" for production. We follow industry-standard DevOps practices to ensure the `main` branch remains a sacred, stable environment.

### **1. Continuous Integration (GitHub Actions)**
Every Pull Request triggers an automated **Triepe CI Pipeline** that:
* Isolates Backend and Frontend builds into concurrent, parallel jobs.
* Runs TypeScript compiler checks (`tsc`) to catch type-mismatches across the stack.
* Generates Prisma clients to verify database schema integrity.
* Prevents merging if any build, type-check, or linting fails.

### **2. Branch Protection & Repository Rulesets**
* **Admin-Enforced Protection:** No direct pushes allowed to `main`, even for owners.
* **Status Check Mandates:** `test-backend` and `test-frontend` must pass before the "Merge" button is enabled.
* **PR-First Workflow:** All changes require a formal Pull Request, creating a transparent audit trail.

### **3. Production DNS & Routing**
* **Primary Domain:** `triepe.com`
* **Redirects:** `www.triepe.com` → `triepe.com` via Permanent 308 Redirects.
* **Backend API:** Hosted on Google Cloud Run with custom origin-matching security and secure SSL/TLS handshakes via Cloudflare.

---

## 🔒 Security Implementation

* **CORS Management:** Strict origin-matching. In production, only authorized domains and Vercel preview URLs can communicate with the API.
* **Rate Limiting:** Global limits applied to the API (100 req/15min) with strict limiters on Auth and Checkout routes.
* **Proxy Trust:** Configured to `trust proxy` for accurate IP tracking through Cloudflare and GCP layers.
* **Helmet.js:** Integrated to secure HTTP headers against common vulnerabilities like XSS and Clickjacking.
* **JWT Authentication:** Secure token-based access using `bcrypt` hashing for Admin operations and sensitive order management.

---