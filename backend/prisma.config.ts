import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Prisma is now explicitly asking for 'datasource.url' here instead of 'migrate'
  datasource: {
    url: process.env.DATABASE_URL,
  },
} as any);