"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Package,
  MapPin,
  User,
  Truck,
  Calendar,
  Hash,
} from "lucide-react";
import { getAdminOrderById, updateAdminOrderStatus, Order } from "@/lib/api";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const EMAIL_STATUSES = ["CONFIRMED", "SHIPPED", "COMPLETED"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getAdminOrderById(id);
        setOrder(data);
      } catch (err) {
        toast.error("Session expired or order not found.");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, router]);

  const initiateStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;
    const newStatus = pendingStatus;
    setPendingStatus(null);
    setIsUpdating(true);
    const toastId = toast.loading(`Updating order status to ${newStatus}...`);
    try {
      await updateAdminOrderStatus(id, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Status updated to ${newStatus}`, { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to update status", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelStatusChange = () => setPendingStatus(null);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase">
        <Loader2 className="animate-spin mr-3" size={24} /> RETRIEVING ORDER
        DATABANKS...
      </div>
    );
  }

  // FIX: Calculate Subtotal to dynamically get Shipping
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.priceAtBuy * item.quantity,
    0,
  );
  const shippingCost = Math.max(0, order.totalAmount - subtotal);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase"
          >
            <ArrowLeft size={16} /> Back to Terminal
          </Link>

          <div className="flex flex-wrap gap-2 bg-[#050505] p-2 border border-zinc-900">
            {["PENDING", "CONFIRMED", "SHIPPED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => initiateStatusChange(status)}
                disabled={isUpdating || order.status === status}
                className={`px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
                  order.status === status
                    ? "bg-white text-black"
                    : "bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#050505] border border-zinc-900 p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1
              className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-3 flex items-center gap-4"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              <Hash size={32} className="text-zinc-700 hidden md:block" />
              {order.id.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <Calendar size={14} />{" "}
                {new Date(order.createdAt).toLocaleString()}
              </span>
              <span>•</span>
              <span
                className={`px-2 py-0.5 border ${
                  order.status === "COMPLETED"
                    ? "border-green-500 text-green-500"
                    : order.status === "SHIPPED"
                      ? "border-blue-500 text-blue-500"
                      : order.status === "CONFIRMED"
                        ? "border-indigo-500 text-indigo-500"
                        : order.status === "CANCELLED"
                          ? "border-red-500 text-red-500"
                          : "border-yellow-500 text-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">
              Total Authorized
            </p>
            <p className="text-3xl font-black tracking-widest">
              €{order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="flex items-center gap-3 text-sm font-black tracking-widest uppercase border-b border-zinc-900 pb-4 mb-6">
                <Package size={18} /> Order Manifest
              </h2>

              <div className="space-y-6">
                {order.items.map((item, idx) => {
                  const currentPrice = item.priceAtBuy || 0;

                  return (
                    <div
                      key={idx}
                      className="flex gap-6 items-center border border-zinc-900 p-4 hover:border-zinc-700 transition-colors bg-black"
                    >
                      <div className="w-20 h-28 bg-zinc-900 border border-zinc-800 shrink-0 relative overflow-hidden">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold uppercase text-[10px]">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase mb-1">
                          {item.productId}
                        </p>
                        <h4 className="font-bold tracking-widest uppercase text-sm mb-2">
                          {item.productTitle || "Unknown Product"}
                        </h4>
                        <div className="flex gap-4">
                          <span className="px-2 py-1 bg-white text-black text-[10px] font-black uppercase">
                            SIZE: {item.size}
                          </span>
                          <span className="px-2 py-1 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase">
                            QTY: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* FIX: NaN resolved by utilizing the exact priceAtBuy numerical value */}
                        <p className="font-black tracking-widest text-lg">
                          €{(currentPrice * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-zinc-600 text-[10px] tracking-widest uppercase mt-1">
                          €{currentPrice.toFixed(2)} ea
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col gap-2 text-sm font-bold tracking-widest uppercase text-zinc-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">€{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-zinc-900 text-xl font-black text-white">
                  <span>TOTAL</span>
                  <span>€{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="flex items-center gap-3 text-sm font-black tracking-widest uppercase border-b border-zinc-900 pb-4 mb-6">
                <User size={18} /> Customer Data
              </h2>
              <div className="space-y-6 text-sm font-bold tracking-wider">
                <div>
                  <p className="text-zinc-600 text-[10px] uppercase mb-1">
                    Full Name
                  </p>
                  <p className="text-white">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-zinc-600 text-[10px] uppercase mb-1">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="text-white border-b border-zinc-700 hover:border-white transition-colors"
                  >
                    {order.customerEmail}
                  </a>
                </div>
                <div>
                  <p className="text-zinc-600 text-[10px] uppercase mb-1">
                    Phone
                  </p>
                  <p className="text-white">{order.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="flex items-center gap-3 text-sm font-black tracking-widest uppercase border-b border-zinc-900 pb-4 mb-6">
                <MapPin size={18} /> Logistics
              </h2>
              <div className="space-y-6 text-sm font-bold tracking-wider">
                <div>
                  <p className="text-zinc-600 text-[10px] uppercase mb-2">
                    Method
                  </p>
                  <span className="px-3 py-1 bg-white text-black text-[10px] uppercase inline-flex items-center gap-2">
                    <Truck size={12} /> {order.deliveryMethod}
                  </span>
                </div>

                {order.deliveryMethod !== "IN_STORE" ? (
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase mb-2">
                      Destination
                    </p>
                    <div className="bg-black p-4 border border-zinc-800 text-zinc-300 leading-relaxed">
                      <p>{order.customerName}</p>
                      <p>{order.addressOrOffice || order.address}</p>
                      <p>
                        {order.city} {order.zipCode}
                      </p>
                      <p className="text-white mt-2">
                        {order.country || "Bulgaria"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase mb-2">
                      Destination
                    </p>
                    <div className="bg-black p-4 border border-zinc-800 text-yellow-500 leading-relaxed">
                      STORE PICKUP PROTOCOL
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase mb-2">
                      Customer Notes
                    </p>
                    <div className="bg-zinc-900 p-4 border-l-2 border-white text-zinc-300 italic text-xs">
                      "{order.notes}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {pendingStatus && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
          onClick={cancelStatusChange}
        >
          <div
            className="bg-[#050505] border border-zinc-800 p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-black tracking-widest uppercase mb-6 border-b border-zinc-800 pb-4">
              Confirm Status Change
            </h2>

            <p className="text-zinc-300 tracking-wide text-sm mb-3">
              Change order status to{" "}
              <strong className="text-white uppercase">{pendingStatus}</strong>?
            </p>

            {EMAIL_STATUSES.includes(pendingStatus) ? (
              <p className="text-xs tracking-widest text-indigo-400 uppercase mb-6">
                ✉ An email notification will be sent to{" "}
                <span className="text-white">{order.customerEmail}</span>.
              </p>
            ) : (
              <p className="text-xs tracking-widest text-zinc-600 uppercase mb-6">
                No email will be sent for this status.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmStatusChange}
                disabled={isUpdating}
                className="flex-1 py-3 bg-white text-black font-black tracking-widest text-xs uppercase hover:bg-zinc-300 transition-colors disabled:opacity-50"
              >
                {isUpdating ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={cancelStatusChange}
                disabled={isUpdating}
                className="flex-1 py-3 bg-transparent text-zinc-400 border border-zinc-700 font-black tracking-widest text-xs uppercase hover:border-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
