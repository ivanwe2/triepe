Triepe v0.1 - Production Deployment Guide

This document outlines the architecture, environment variables, and step-by-step process for deploying the Triepe e-commerce platform to production.

🏗 Infrastructure Architecture

Frontend: Next.js 15 (Hosted on Vercel)

Backend: Node.js / Express (Hosted on Google Cloud Run)

Database: PostgreSQL (Hosted on Neon.tech)

Media Storage: Cloudinary

🔐 Environment Variables Checklist

Before deploying, ensure you have these values ready:

Backend (GCP Cloud Run) Environment Variables:

NODE_ENV: production

PORT: 8080 (Cloud Run defaults to 8080)

DATABASE_URL: postgresql://[user]:[password]@[neon-host]/[dbname]?sslmode=require

JWT_SECRET: [Generate a long, random secure string]

CLOUDINARY_CLOUD_NAME: [Your Cloud Name]

CLOUDINARY_API_KEY: [Your API Key]

CLOUDINARY_API_SECRET: [Your API Secret]

ADMIN_EMAIL: admin@triepe.com (Used securely on first deploy to seed the DB)

ADMIN_PASSWORD: [Your highly secure password]

Frontend (Vercel) Environment Variables:

NEXT_PUBLIC_API_URL: https://[your-gcp-cloud-run-url].a.run.app

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: [Your Cloud Name]

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: [Your Unsigned Preset Name]

🚀 Step-by-Step Deployment Guide

Phase 1: Database Provisioning (Neon)

Create a free account at Neon.tech.

Create a new project (Name: triepe-db, Postgres Version: 15+).

Copy the Connection String (DATABASE_URL).

Phase 2: Backend Deployment (Google Cloud Run)

Google Cloud Run will automatically build your Docker container or Node app and run it on Google's edge network.

Create an account at Google Cloud Console.

Enable the Cloud Run API and Cloud Build API.

Go to Cloud Run -> Create Service.

Select "Continuously deploy new revisions from a source repository".

Connect your GitHub account and select the triepe repository.

Build Settings:

Branch: ^main$

Build Type: Go/Node.js/Python (Buildpacks). Cloud Build will automatically detect your package.json.

Source directory: /backend

Service Settings:

Authentication: Allow unauthenticated invocations (This allows the internet to reach your API; CORS protects it).

Container port: 8080

Open the Variables & Secrets tab and add the Backend checklist from above.

Click Create.
Note: Upon successful deployment, the npm start script will automatically run npx prisma migrate deploy to set up the Neon database tables!

Phase 3: Frontend Deployment (Vercel)

Create an account at Vercel.com.

Click Add New -> Project.

Import your GitHub repository.

Configuration:

Root Directory: Edit this and select frontend.

Framework Preset: Next.js.

Open the Environment Variables section and paste the Frontend checklist from above. (Make sure NEXT_PUBLIC_API_URL is the Cloud Run URL!)

Click Deploy.

⚙️ CI/CD Pipeline & Updates

This repository utilizes a GitOps workflow.

Continuous Integration: On every push to main, GitHub Actions (ci.yml) will install dependencies and run TypeScript checks.

Continuous Deployment: - If the GitHub Action passes, Vercel automatically pulls the frontend folder and updates the live website.

Google Cloud Build automatically pulls the backend folder, rebuilds the API, runs any new database migrations, and deploys.

To push an update to production:

git add .
git commit -m "feat: updated storefront design"
git push origin main
