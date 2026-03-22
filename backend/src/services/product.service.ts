import { prisma } from '../config';
import { Product } from '@prisma/client';

/**
 * Fetch all products (Public)
 */
export const getAllProducts = async (): Promise<Product[]> => {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }, // Newest drops first
  });
};

/**
 * Fetch a single product by ID (Public)
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

/**
 * Create a new product (Admin Only)
 */
export const createProduct = async (data: Omit<Product, 'createdAt' | 'updatedAt'>): Promise<Product> => {
  // Check if ID already exists (e.g., "act001-hoodie")
  const existing = await prisma.product.findUnique({ where: { id: data.id } });
  if (existing) {
    throw new Error(`Product with ID ${data.id} already exists.`);
  }

  return await prisma.product.create({
    data,
  });
};

/**
 * Update a product (Admin Only)
 */
export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

/**
 * Delete a product (Admin Only)
 */
export const deleteProduct = async (id: string): Promise<Product> => {
  return await prisma.product.delete({
    where: { id },
  });
};