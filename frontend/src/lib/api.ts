const isServer = typeof window === 'undefined';

// 1. If on Server AND in Docker, use INTERNAL_API_URL
// 2. If on Server in Vercel, fall back to NEXT_PUBLIC_API_URL (GCP)
// 3. If in Browser, always use NEXT_PUBLIC_API_URL
const BASE_URL = isServer 
  ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;
// ==========================================
// CORE DOMAIN INTERFACES
// ==========================================

export interface ProductVariant {
  id?: string;
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string; // Cloudinary URL
  status: "NEW" | "SOLD OUT" | null;
  description?: string;
  variants?: ProductVariant[];
  gallery?: string[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  deliveryMethod: string;
  city: string;
  createdAt: string;
  items: OrderItem[];
}

// ==========================================
// PAYLOAD INTERFACES (For POST requests)
// ==========================================

export interface CreateProductPayload {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string; // Cloudinary URL
  status: "NEW" | "SOLD OUT" | null;
  variants: ProductVariant[];
  gallery?: string[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'SPEEDY' | 'ECONT' | 'IN_STORE';
  paymentMethod: 'CASH_ON_DELIVERY';
  city?: string;
  addressOrOffice?: string;
  notes?: string;
  items: OrderItem[];
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

export async function createOrder(orderPayload: CreateOrderPayload): Promise<Order> {
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
  
  const json = await res.json();
  return json.data;
}

// ==========================================
// ADMIN (PROTECTED) ENDPOINTS
// ==========================================

export async function loginAdmin(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data.data; 
}

export async function getAdminOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data.data;
}

// FIXED: Using concrete CreateProductPayload instead of 'any'
export async function createAdminProduct(productPayload: CreateProductPayload, token: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(productPayload),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create product');
  return data.data;
}

export async function deleteAdminProduct(id: string, token: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to delete product');
  }
  return true;
}

export async function updateAdminOrderStatus(id: string, status: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ status })
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to update order status');
  }
  return await res.json();
}