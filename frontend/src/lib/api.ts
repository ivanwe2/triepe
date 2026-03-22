const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  status: "NEW" | "SOLD OUT" | null;
  description?: string;
};

// 1. Fetch All Products (for the Store Grid)
export async function getAllProducts(): Promise<Product[]> {
  try {
    // We use next: { revalidate: 60 } to cache the products for 60 seconds
    // This makes your site load instantly while still updating frequently!
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array if backend is down so site doesn't crash
  }
}

// 2. Fetch Single Product (for the Product Details Page)
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// 3. Submit an Order (for Checkout)
export async function createOrder(orderPayload: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to submit order');
  }

  return await res.json();
}