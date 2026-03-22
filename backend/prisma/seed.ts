import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables so we can access DATABASE_URL
dotenv.config();

// Initialize the native PostgreSQL connection pool and adapter (Prisma 7 requirement)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);

// Pass the adapter into the PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  const adminEmail = 'admin@triepe.com';
  const adminPassword = 'admin123!'; // Change this later!

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists. Skipping...');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create the admin
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    }
  });

  console.log(`✅ Admin created!`);
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });