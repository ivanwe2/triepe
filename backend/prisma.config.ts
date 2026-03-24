import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

// Check if we are in Google Cloud
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  migrations: {
    // Locally: Use ts-node. In Cloud: Use compiled native Node.js!
    seed: isProd ? 'node dist/prisma/seed.js' : 'npx ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});