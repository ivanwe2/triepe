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
  variants?: { id: string, size: string, stock: number }[];
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  deliveryMethod: string;
  createdAt: string;
  items: any[];
}

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================
export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
}

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

export async function createOrder(orderPayload: any) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to submit order');
    } else {
      throw new Error(`API Connection Error: Route not found (${res.status})`);
    }
  }
  return await res.json();
}

// ==========================================
// ADMIN (PROTECTED) ENDPOINTS
// ==========================================

export async function loginAdmin(credentials: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.data; // Returns { user, token }
}

export async function getAdminOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data.data;
}