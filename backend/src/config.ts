import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

// 1. Initialize the native PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. Wrap the pool in Prisma's new adapter
const adapter = new PrismaPg(pool as any);

// 3. Export a singleton Prisma instance using the adapter
export const prisma = new PrismaClient({ adapter });

// Constants
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_super_secret_key_for_dev';
export const JWT_EXPIRES_IN = '7d';
export const SALT_ROUNDS = 10;
export const PORT = process.env.PORT || 4000;