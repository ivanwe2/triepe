import { prisma } from "../config";
import { Product, ProductVariant } from "@prisma/client";
import { deleteCloudinaryMedia } from "./cloudinary.service";

export interface CreateProductPayload extends Omit<
  Product,
  "createdAt" | "updatedAt"
> {
  variants: { size: string; stock: number }[];
  gallery: string[];
}

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      // FIX: Removed `where: { stock: { gt: 0 } }` so the frontend knows exactly which variants are sold out
      variants: { orderBy: { size: "asc" } },
    },
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { size: "asc" } },
    },
  });
};

export const createProduct = async (data: CreateProductPayload) => {
  const existing = await prisma.product.findUnique({ where: { id: data.id } });
  if (existing) {
    throw new Error(`Product with ID ${data.id} already exists.`);
  }

  const totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);
  const initialStatus = data.status || (totalStock === 0 ? "SOLD OUT" : "NEW");

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
        create: data.variants,
      },
    },
    include: { variants: true },
  });
};

export const updateVariantStock = async (
  productId: string,
  size: string,
  newStock: number,
) => {
  return await prisma.productVariant.update({
    where: { productId_size: { productId, size } },
    data: { stock: newStock },
  });
};

// ADMIN EDIT: Update a product and its variants
export const updateProduct = async (
  id: string,
  data: Partial<Product> & {
    variants?: { id?: string; size: string; stock: number }[];
  },
) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Update stock if variants were provided
    if (data.variants) {
      for (const v of data.variants) {
        if (v.id) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: { stock: v.stock },
          });
        }
      }
    }

    // 2. Derive status from actual stock totals so SOLD OUT clears automatically
    const totalStock = data.variants
      ? data.variants.reduce((sum, v) => sum + v.stock, 0)
      : null;

    let resolvedStatus: string | null;
    if (totalStock !== null && totalStock === 0) {
      resolvedStatus = "SOLD OUT";
    } else if (totalStock !== null && totalStock > 0 && data.status === "SOLD OUT") {
      // Stock was added — clear the SOLD OUT badge
      resolvedStatus = null;
    } else {
      resolvedStatus = data.status ?? null;
    }

    // 3. Update core product details with the resolved status
    return await tx.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        status: resolvedStatus,
      } as any,
    });
  });
};

// ADMIN DELETE: Destroy from DB AND Cloudinary!
export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) throw new Error("Product not found");

  // 1. Delete all media from Cloudinary concurrently
  const allMedia = [product.image, ...product.gallery];
  await Promise.all(allMedia.map((url) => deleteCloudinaryMedia(url)));

  // 2. Delete from PostgreSQL (Variants and OrderItems linked by Cascade will handle themselves if schema is setup correctly, otherwise delete them first)
  return await prisma.product.delete({ where: { id } });
};
