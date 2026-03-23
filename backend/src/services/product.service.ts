import { prisma } from '../config';
import { Product, ProductVariant } from '@prisma/client';

export interface CreateProductPayload extends Omit<Product, 'createdAt' | 'updatedAt'> {
  variants: { size: string; stock: number }[];
  gallery?: string[];
}

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      variants: { where: { stock: { gt: 0 } } }
    }
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { size: 'asc' } }
    }
  });
};

export const createProduct = async (data: CreateProductPayload) => {
  const existing = await prisma.product.findUnique({ where: { id: data.id } });
  if (existing) {
    throw new Error(`Product with ID ${data.id} already exists.`);
  }

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
      gallery: data.gallery || [], // <-- Save the array to Postgres!
      status: initialStatus,
      variants: {
        create: data.variants
      }
    },
    include: { variants: true }
  });
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  return await prisma.product.update({ where: { id }, data });
};

export const updateVariantStock = async (productId: string, size: string, newStock: number) => {
  return await prisma.productVariant.update({
    where: { productId_size: { productId, size } },
    data: { stock: newStock }
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};