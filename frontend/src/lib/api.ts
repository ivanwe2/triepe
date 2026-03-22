// This file acts as your "Backend". 
// All Database queries will eventually go in here.

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  status: "NEW" | "SOLD OUT" | null;
  description?: string;
};

// 1. Move the mock data here temporarily
const MOCK_PRODUCTS: Product[] = [
  {
    id: "act001-hoodie",
    title: "ACT 001 HEAVYWEIGHT HOODIE",
    price: 120,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    status: "NEW",
    description: "Constructed from 500gsm brushed French terry cotton. Features distressed ribbing, dropped shoulders, and a cropped, boxy silhouette."
  },
  {
    id: "deathstalker-tee",
    title: "DEATHSTALKER TEE",
    price: 45,
    category: "tops",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    status: null,
    description: "Premium 250gsm heavyweight cotton tee. Oversized fit with thick collar ribbing."
  },
  {
    id: "cargo-v1",
    title: "OVERSIZED CARGO V1",
    price: 140,
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1000&auto=format&fit=crop",
    status: "SOLD OUT",
  }
];

// 2. Export ASYNC functions. 
// Right now they return mock data, but later they will await Prisma/Supabase calls.

export async function getAllProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // LATER: return await prisma.product.findMany();
  return MOCK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // LATER: return await prisma.product.findUnique({ where: { id } });
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  return product || null;
}