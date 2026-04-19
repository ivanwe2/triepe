// ==========================================
// DYNAMIC URL RESOLVER (Prevents Next.js caching bugs)
// ==========================================
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // 1. If in Browser, always use NEXT_PUBLIC_API_URL
    return (
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(
        /\/$/,
        "",
      ) + "/api"
    );
  }

  // 2. If on Server (Docker or Vercel), cascade gracefully:
  //    -> INTERNAL_API_URL (Docker)
  //    -> NEXT_PUBLIC_API_URL (Vercel)
  //    -> localhost (Fallback)
  const serverUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";
  return serverUrl.replace(/\/$/, "") + "/api";
};

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
  image: string;
  status: "NEW" | "SOLD OUT" | null;
  description?: string;
  variants?: ProductVariant[];
  gallery?: string[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  priceAtBuy: number; // The price at which the item was bought
  product?: Product;
  productTitle?: string; // Added to match the order item rendering
  productImage?: string; // Added to match the order item rendering
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  deliveryMethod: string;
  city?: string;
  country?: string; // Added to match the delivery info
  zipCode?: string; // Added to match the delivery info
  addressOrOffice?: string;
  address?: string; // Standardized address field
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

// ==========================================
// PAYLOAD INTERFACES (For POST/PUT requests)
// ==========================================

export interface CreateProductPayload {
  id?: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  status: "NEW" | "SOLD OUT" | null;
  variants: ProductVariant[];
  gallery?: string[];
}

export interface UpdateProductPayload {
  title?: string;
  price?: number;
  category?: string;
  description?: string;
  status?: "NEW" | "SOLD OUT" | null;
  variants?: ProductVariant[];
  image?: string;
  gallery?: string[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: "SPEEDY" | "ECONT" | "IN_STORE";
  paymentMethod: "CASH_ON_DELIVERY";
  city?: string;
  addressOrOffice?: string;
  notes?: string;
  privacyConsentAt: string;
  items: { productId: string; quantity: number; size: string }[];
}

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getApiUrl()}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getApiUrl()}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function createOrder(
  orderPayload: CreateOrderPayload,
): Promise<Order> {
  const res = await fetch(`${getApiUrl()}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit order");
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

const ADMIN_TOKEN_KEY = "triepe_admin_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function adminHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getStoredToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function loginAdmin(credentials: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  if (data.data?.token && typeof window !== "undefined") {
    localStorage.setItem(ADMIN_TOKEN_KEY, data.data.token);
  }

  return data.data;
}

export async function logoutAdmin() {
  const res = await fetch(`${getApiUrl()}/auth/logout`, {
    method: "POST",
    headers: adminHeaders(),
    credentials: "include",
  });

  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }

  if (!res.ok) throw new Error("Logout failed");
  return true;
}

export async function getAdminOrders(): Promise<Order[]> {
  const res = await fetch(`${getApiUrl()}/orders`, {
    headers: adminHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  return data.data;
}

export async function getAdminOrderById(id: string): Promise<Order> {
  const res = await fetch(`${getApiUrl()}/orders/${id}`, {
    headers: adminHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch order");
  return data.data;
}

export async function createAdminProduct(
  productPayload: CreateProductPayload,
): Promise<Product> {
  const res = await fetch(`${getApiUrl()}/products`, {
    method: "POST",
    headers: adminHeaders(),
    credentials: "include",
    body: JSON.stringify(productPayload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create product");
  return data.data;
}

export async function updateAdminProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const res = await fetch(`${getApiUrl()}/products/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update product");
  return data.data;
}

export async function deleteAdminProduct(id: string) {
  const res = await fetch(`${getApiUrl()}/products/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete product");
  }
  return true;
}

export async function updateAdminOrderStatus(id: string, status: string) {
  const res = await fetch(`${getApiUrl()}/orders/${id}/status`, {
    method: "PATCH",
    headers: adminHeaders(),
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to update order status");
  }
  return await res.json();
}

export async function verifyAdminSession() {
  const res = await fetch(`${getApiUrl()}/auth/me`, {
    method: "GET",
    headers: adminHeaders(),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");
  return true;
}