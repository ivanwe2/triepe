"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAdminOrders,
  getAllProducts,
  deleteAdminProduct,
  Order,
  Product,
} from "@/lib/api";
import {
  LogOut,
  Package,
  RefreshCw,
  AlertCircle,
  Trash2,
  Edit,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"ORDERS" | "PRODUCTS">("ORDERS");

  useEffect(() => {
    const storedToken = localStorage.getItem("triepe_admin_token");
    if (!storedToken) {
      router.push("/admin/login");
      return;
    }
    setToken(storedToken);
    fetchDashboardData(storedToken);
  }, [router]);

  const fetchDashboardData = async (jwt: string) => {
    try {
      setIsLoading(true);
      // Fetch both orders and products simultaneously
      const [ordersData, productsData] = await Promise.all([
        getAdminOrders(jwt),
        getAllProducts(), // This is public, so it doesn't need the token
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err: any) {
      setError("Session expired or unauthorized. Please log in again.");
      localStorage.removeItem("triepe_admin_token");
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${title}? This cannot be undone.`,
      )
    )
      return;

    try {
      await deleteAdminProduct(id, token);
      // Remove from UI
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("triepe_admin_token");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-24 text-white">
        <RefreshCw className="animate-spin mb-4 text-zinc-600" size={32} />
        <p className="tracking-widest font-bold uppercase text-sm text-zinc-500">
          INITIALIZING TERMINAL...
        </p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div>
            <h1
              className="text-5xl font-black tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              SYSTEM TERMINAL
            </h1>
            <p className="text-zinc-500 tracking-widest text-sm uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
              ONLINE & SECURE
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase"
          >
            <LogOut size={16} /> END SESSION
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-12 border-b border-zinc-900">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`pb-4 tracking-widest font-bold uppercase text-sm transition-colors border-b-2 ${activeTab === "ORDERS" ? "border-white text-white" : "border-transparent text-zinc-600 hover:text-zinc-300"}`}
          >
            ORDERS ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("PRODUCTS")}
            className={`pb-4 tracking-widest font-bold uppercase text-sm transition-colors border-b-2 ${activeTab === "PRODUCTS" ? "border-white text-white" : "border-transparent text-zinc-600 hover:text-zinc-300"}`}
          >
            INVENTORY ({products.length})
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "ORDERS" && (
          <div className="bg-[#050505] border border-zinc-900 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase bg-zinc-900/50">
                  <th className="p-6 font-medium">Order ID</th>
                  <th className="p-6 font-medium">Customer</th>
                  <th className="p-6 font-medium">Total</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm tracking-wider">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500 uppercase tracking-widest">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                      <td className="p-6 font-mono text-zinc-400 text-xs">
                        {order.id.split("-")[0].toUpperCase()}
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-white uppercase">{order.customerName}</p>
                        <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                      </td>
                      <td className="p-6 font-bold text-white">
                        €{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-6">
                         <span className={`px-2 py-1 text-xs font-black tracking-widest uppercase ${
                           order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                           order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' : 
                           'bg-zinc-800 text-zinc-300'
                         }`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="p-6 text-right">
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="text-xs font-bold tracking-widest uppercase border-b border-zinc-600 text-zinc-400 hover:text-white pb-1 transition-colors"
                        >
                          VIEW
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "PRODUCTS" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2
                className="text-2xl font-black tracking-widest uppercase"
                style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
              >
                Live Products
              </h2>
              <Link
                href="/admin/products/new"
                className="px-6 py-3 bg-white text-black font-black tracking-widest uppercase text-sm hover:bg-zinc-300 transition-colors"
              >
                + DEPLOY NEW
              </Link>
            </div>

            <div className="bg-[#050505] border border-zinc-900 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase bg-zinc-900/50">
                    <th className="p-6 font-medium">Product</th>
                    <th className="p-6 font-medium">Price</th>
                    <th className="p-6 font-medium">Status</th>
                    <th className="p-6 font-medium">Total Stock</th>
                    <th className="p-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm tracking-wider">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-12 text-center text-zinc-500 uppercase"
                      >
                        No products deployed.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const totalStock =
                        product.variants?.reduce(
                          (sum, v) => sum + v.stock,
                          0,
                        ) || 0;
                      return (
                        <tr
                          key={product.id}
                          className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors"
                        >
                          <td className="p-6 flex items-center gap-4">
                            <div className="w-12 h-16 relative bg-zinc-800">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white uppercase">
                                {product.title}
                              </p>
                              <p className="text-xs text-zinc-500 font-mono">
                                {product.id}
                              </p>
                            </div>
                          </td>
                          <td className="p-6 text-white font-bold">
                            €{product.price.toFixed(2)}
                          </td>
                          <td className="p-6">
                            <span className="px-2 py-1 bg-zinc-800 text-xs text-zinc-300 font-bold uppercase">
                              {product.status || "ACTIVE"}
                            </span>
                          </td>
                          <td className="p-6 text-zinc-300">
                            {totalStock} Units
                          </td>
                          <td className="p-6">
                            <div className="flex justify-end gap-4">
                              <Link
                                href={`/admin/products/edit/${product.id}`}
                                className="text-zinc-500 hover:text-white transition-colors"
                              >
                                <Edit size={18} />
                              </Link>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(product.id, product.title)
                                }
                                className="text-zinc-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
