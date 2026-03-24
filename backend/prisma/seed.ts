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

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // SECURITY: Prevent seeding if passwords aren't set in the environment
  if (!adminEmail || !adminPassword) {
    console.error("⚠️ [WARNING]: ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment variables.");
    console.error("Skipping database seed. If this is production, make sure you set these variables!");
    process.exit(0); // Exit safely without crashing the deployment
  }

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
      // name: 'Triepe Admin' // Added Name for your dashboard UI
    }
  });

  console.log(`✅ Admin created securely!`);
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Password is secure and hashed.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });