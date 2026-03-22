import { prisma } from '../config';
import { Product, ProductVariant } from '@prisma/client';

export interface CreateProductPayload extends Omit<Product, 'createdAt' | 'updatedAt'> {
  variants: { size: string; stock: number }[];
}

/**
 * Fetch all products (Public)
 * Includes available variants so the frontend knows what sizes to show!
 */
export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      variants: {
        where: { stock: { gt: 0 } } // FIXED: Prisma uses 'gt' for greater than
      }
    }
  });
};

/**
 * Fetch a single product by ID (Public)
 */
export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { size: 'asc' } // Keep sizes organized (e.g., L, M, S, XL)
      }
    }
  });
};

/**
 * Create a new product with its initial inventory (Admin Only)
 */
export const createProduct = async (data: CreateProductPayload) => {
  const existing = await prisma.product.findUnique({ where: { id: data.id } });
  if (existing) {
    throw new Error(`Product with ID ${data.id} already exists.`);
  }

  // Calculate initial status automatically
  const totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);
  const initialStatus = data.status || (totalStock === 0 ? 'SOLD OUT' : 'NEW');

  return await prisma.product.create({
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image,
      status: initialStatus,
      // Create the variants at the exact same time
      variants: {
        create: data.variants
      }
    },
    include: { variants: true }
  });
};

/**
 * Update a product's basic info (Admin Only)
 */
export const updateProduct = async (id: string, data: Partial<Product>) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

/**
 * Update stock for a specific size (Admin Only - Inventory Management)
 */
export const updateVariantStock = async (productId: string, size: string, newStock: number) => {
  return await prisma.productVariant.update({
    where: {
      productId_size: {
        productId,
        size
      }
    },
    data: { stock: newStock }
  });
};

/**
 * Delete a product (Admin Only)
 */
export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { id },
  });
};