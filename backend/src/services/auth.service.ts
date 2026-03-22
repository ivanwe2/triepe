import bcrypt from 'bcrypt';
import { prisma, SALT_ROUNDS } from '../config';
import { generateToken } from '../utils/jwt.util';

/**
 * Handles the business logic for logging in a user.
 */
export const loginUser = async (email: string, passwordRaw: string) => {
  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(passwordRaw, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate Token
  const token = generateToken({ userId: user.id, role: user.role });

  // 4. Return user data (excluding password) and token
  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Handles the business logic for registering a new user/admin.
 */
export const registerUser = async (email: string, passwordRaw: string, role: 'USER' | 'ADMIN' = 'USER') => {
  // 1. Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already in use');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(passwordRaw, SALT_ROUNDS);

  // 3. Create user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role
    }
  });

  // 4. Generate Token
  const token = generateToken({ userId: newUser.id, role: newUser.role });

  const { password, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token
  };
};