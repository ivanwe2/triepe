"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  LogOut,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Inbox,
  Truck,
  Menu,
  X,
} from "lucide-react";
import {
  getAllProducts,
  getAdminOrders,
  deleteAdminProduct,
  logoutAdmin,
  Product,
  Order,
} from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FIX: Added Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, oData] = await Promise.all([
          getAllProducts(),
          getAdminOrders(),
        ]);
        setProducts(pData);
        // Sort orders by newest first
        setOrders(
          oData.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } catch (err) {
        console.error("Auth expired or fetch failed");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteAdminProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  if (isLoading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase">
        AUTHENTICATING...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gray-400 selection:text-black flex flex-col">
      {/* MOBILE HEADER (Visible only on small screens) */}
      <header className="lg:hidden flex items-center justify-between p-6 border-b border-zinc-900 bg-[#050505] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Triepe" className="h-6 object-contain" />
          <span className="text-xs font-black tracking-widest text-zinc-500 uppercase mt-1">
            TERMINAL
          </span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="text-white">
          <Menu size={28} />
        </button>
      </header>

      {/* MOBILE SIDEBAR BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop Fixed, Mobile Drawer) */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#050505] border-r border-zinc-900 flex flex-col z-[70] transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
          <div>
            <img src="/logo.png" alt="Triepe" className="h-10 object-contain" />
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-600 mt-2">
              ADMIN PANEL v0.2
            </p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <button
            onClick={() => {
              setActiveTab("orders");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "orders" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
          >
            <Inbox size={18} /> Orders
            {pendingOrders > 0 && (
              <span
                className={`ml-auto w-5 h-5 flex items-center justify-center text-[10px] rounded-full ${activeTab === "orders" ? "bg-black text-white" : "bg-white text-black"}`}
              >
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("products");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "products" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
          >
            <ShoppingBag size={18} /> Products
          </button>
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
          >
            <ExternalLink size={18} /> View Store
          </Link>
        </nav>

        <div className="p-6 border-t border-zinc-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 md:p-12 overflow-x-hidden">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#050505] border border-zinc-900 p-8">
            <p className="text-zinc-500 text-xs font-black tracking-widest uppercase mb-1">
              Total Revenue
            </p>
            <h3
              className="text-3xl font-black tracking-tighter"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              €{totalRevenue.toFixed(2)}
            </h3>
          </div>
          <div className="bg-[#050505] border border-zinc-900 p-8">
            <p className="text-zinc-500 text-xs font-black tracking-widest uppercase mb-1">
              Total Orders
            </p>
            <h3
              className="text-3xl font-black tracking-tighter"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              {orders.length}
            </h3>
          </div>
          <div className="bg-[#050505] border border-zinc-900 p-8 border-l-4 border-l-blue-500 sm:col-span-2 md:col-span-1">
            <p className="text-zinc-500 text-xs font-black tracking-widest uppercase mb-1">
              Active Drops
            </p>
            <h3
              className="text-3xl font-black tracking-tighter"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              {products.length}
            </h3>
          </div>
        </div>

        {activeTab === "orders" ? (
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <h2
                className="text-3xl font-black tracking-widest uppercase"
                style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
              >
                RECENT ORDERS
              </h2>
            </div>

            <div className="border border-zinc-900 bg-[#050505] overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-[10px] tracking-widest uppercase bg-zinc-900/30">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Method</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold tracking-widest uppercase">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-colors"
                    >
                      <td className="p-4 font-black text-white">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <p className="text-white">{order.customerName}</p>
                        <p className="text-zinc-600 text-[10px] mt-1 truncate max-w-[150px]">
                          {order.customerEmail}
                        </p>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <Truck size={14} className="text-zinc-600" />
                        <span>{order.deliveryMethod}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-[10px] border ${
                            order.status === "COMPLETED" ||
                            order.status === "DELIVERED"
                              ? "border-green-500 text-green-500"
                              : order.status === "SHIPPED"
                                ? "border-blue-500 text-blue-500"
                                : "border-yellow-500 text-yellow-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-white">
                        €{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <ChevronRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <h2
                className="text-3xl font-black tracking-widest uppercase"
                style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
              >
                INVENTORY
              </h2>
              <Link
                href="/admin/products/new"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-black tracking-widest text-sm uppercase transition-colors hover:bg-zinc-300"
              >
                <Plus size={18} /> New Drop
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#050505] border border-zinc-900 p-6 flex gap-6 group hover:border-zinc-700 transition-colors"
                >
                  <div className="w-24 h-32 bg-zinc-900 border border-zinc-800 shrink-0 relative overflow-hidden">
                    <img
                      src={product.image}
                      className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-110"
                      alt={product.title}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold tracking-widest uppercase text-sm mb-1 truncate">
                        {product.title}
                      </h4>
                      <p className="text-zinc-500 text-xs font-black tracking-widest mb-2">
                        €{product.price.toFixed(2)}
                      </p>
                      <span
                        className={`text-[10px] font-black tracking-widest px-2 py-1 uppercase ${product.status === "NEW" ? "bg-white text-black" : product.status === "SOLD OUT" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-zinc-800 text-zinc-500"}`}
                      >
                        {product.status || "STANDARD"}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-900">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
