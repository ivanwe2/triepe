"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Package,
  Clock,
  Truck,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { getAdminOrders, updateAdminOrderStatus, Order } from "@/lib/api";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await getAdminOrders();
        const found = orders.find((o) => o.id === id);
        if (!found) throw new Error("Order not found");
        setOrder(found);
      } catch (err: any) {
        setStatusMessage({
          text: err.message || "Failed to load order",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    setStatusMessage(null);

    try {
      // FIX: Ensure we use 'DELIVERED' to match the backend OrderStatus enum
      await updateAdminOrderStatus(order.id, newStatus);

      // Update local state to reflect the change immediately
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));

      setStatusMessage({
        text: `Order status updated to ${newStatus}`,
        type: "success",
      });

      // Clear message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error("Update failed:", err);
      setStatusMessage({
        text: err.message || "Failed to update status",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen bg-black text-white p-20 flex flex-col items-center">
        <p className="mb-4">Order not found.</p>
        <Link
          href="/admin"
          className="text-white underline font-bold tracking-widest uppercase text-xs"
        >
          Return to Dashboard
        </Link>
      </div>
    );

  const subtotal = order.items.reduce((acc, item) => {
    // FIX: Use priceAtBuy to match your backend service implementation and fallback to product price
    const itemPrice =
      (item as any).priceAtBuy || item.price || item.product?.price || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const shippingCost = Math.max(0, order.totalAmount - subtotal);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-4 md:px-12 selection:bg-gray-400 selection:text-black">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8"
        >
          <ArrowLeft size={16} /> BACK TO DASHBOARD
        </Link>

        {statusMessage && (
          <div
            className={`mb-6 p-4 border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              statusMessage.type === "success"
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-red-500 bg-red-500/10 text-red-500"
            }`}
          >
            <CheckCircle size={18} />
            <span className="text-xs font-bold tracking-widest uppercase">
              {statusMessage.text}
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div>
            <h1
              className="text-4xl md:text-6xl font-black tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              ORDER #{order.id.slice(0, 8)}
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 text-sm tracking-widest uppercase font-bold">
              <span className="flex items-center gap-1">
                <Clock size={14} />{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`px-3 py-1 text-xs rounded-none border ${
                  order.status === "DELIVERED" || order.status === "COMPLETED"
                    ? "border-green-500 text-green-500"
                    : order.status === "SHIPPED"
                      ? "border-blue-500 text-blue-500"
                      : "border-yellow-500 text-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleStatusUpdate("SHIPPED")}
              disabled={
                isUpdating ||
                order.status === "SHIPPED" ||
                order.status === "DELIVERED"
              }
              className="px-6 py-3 border border-zinc-700 hover:border-blue-500 text-sm font-bold tracking-widest uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isUpdating ? "UPDATING..." : "MARK AS SHIPPED"}
            </button>
            <button
              onClick={() => handleStatusUpdate("DELIVERED")}
              disabled={isUpdating || order.status === "DELIVERED"}
              className="px-6 py-3 bg-white text-black text-sm font-bold tracking-widest uppercase transition-colors hover:bg-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isUpdating ? "UPDATING..." : "MARK COMPLETED"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-zinc-900 bg-[#050505] p-8">
              <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-3">
                <Package size={20} /> ITEMS ({order.items.length})
              </h3>
              <div className="space-y-6">
                {order.items.map((item, idx) => {
                  // FIX: Prioritize priceAtBuy to align with backend schema
                  const currentPrice =
                    (item as any).priceAtBuy ||
                    item.price ||
                    item.product?.price ||
                    0;
                  return (
                    <div
                      key={idx}
                      className="flex gap-6 items-center border-b border-zinc-900 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-24 bg-zinc-900 border border-zinc-800 shrink-0">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            className="w-full h-full object-cover grayscale contrast-125"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold tracking-widest uppercase text-sm">
                          {item.product?.title || "Unknown Product"}
                        </h4>
                        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mt-1">
                          SIZE: {item.size}
                        </p>
                        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold tracking-widest uppercase text-sm">
                          €{(currentPrice * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-zinc-600 text-[10px] tracking-widest uppercase">
                          €{currentPrice.toFixed(2)} ea
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-zinc-900 bg-[#050505] p-8">
              <h3 className="text-xl font-bold tracking-widest uppercase mb-6">
                ORDER NOTES
              </h3>
              <p className="text-zinc-400 text-sm tracking-wide leading-relaxed italic">
                {order.notes || "No notes provided."}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-zinc-900 bg-[#050505] p-8">
              <h3 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                CUSTOMER
              </h3>
              <div className="space-y-4">
                <p className="font-bold tracking-widest uppercase">
                  {order.customerName}
                </p>
                <div className="flex items-center gap-2 text-zinc-400 text-sm tracking-wider">
                  <Mail size={14} /> {order.customerEmail}
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-sm tracking-wider">
                  <Phone size={14} /> {order.customerPhone}
                </div>
              </div>
            </div>

            <div className="border border-zinc-900 bg-[#050505] p-8">
              <h3 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                <Truck size={20} /> SHIPPING
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between tracking-widest uppercase">
                  <span className="text-zinc-500">METHOD</span>
                  <span className="font-bold">{order.deliveryMethod}</span>
                </div>
                <div className="flex justify-between tracking-widest uppercase">
                  <span className="text-zinc-500">CITY</span>
                  <span className="font-bold">{order.city || "-"}</span>
                </div>
                <div className="pt-4 border-t border-zinc-900">
                  <span className="text-zinc-500 block text-xs tracking-widest uppercase mb-2">
                    ADDRESS / OFFICE
                  </span>
                  <p className="text-zinc-300 font-bold leading-relaxed">
                    {order.addressOrOffice || "No address provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-zinc-900 bg-white text-black p-8">
              <h3
                className="text-lg font-black tracking-widest uppercase mb-6 border-b border-black/10 pb-4"
                style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
              >
                PAYMENT SUMMARY
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                  <span>SUBTOTAL</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                  <span>SHIPPING</span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
              </div>
              <div
                className="flex justify-between text-2xl font-black tracking-widest uppercase border-t border-black/10 pt-4"
                style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
              >
                <span>TOTAL</span>
                <span>€{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// todo sold out logic and the statuses and all that