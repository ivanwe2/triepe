"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { createOrder, CreateOrderPayload, OrderItem } from "@/lib/api";
import {
  SHIPPING_METHODS,
  ShippingMethodId,
  getShippingOptions,
} from "@/config/shipping";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");
  const [addressOrOffice, setAddressOrOffice] = useState("");
  const [notes, setNotes] = useState("");

  // Link to our new centralized shipping ID
  const [shippingMethodId, setShippingMethodId] =
    useState<ShippingMethodId>("SPEEDY_OFFICE");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <h1
          className="text-4xl font-black tracking-widest uppercase mb-4"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          CART IS EMPTY
        </h1>
        <p className="text-zinc-500 tracking-widest uppercase mb-8">
          You have no items to checkout.
        </p>
        <Link
          href="/store"
          className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-300 transition-colors"
        >
          RETURN TO STORE
        </Link>
      </div>
    );
  }

  // --- PRICING CALCULATIONS ---
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const selectedShipping = SHIPPING_METHODS[shippingMethodId];
  const shippingCost = selectedShipping.price;
  const orderTotal = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Map the generic shipping ID to the specific backend enum ('SPEEDY' | 'ECONT' | 'IN_STORE')
      const backendCourierMethod = selectedShipping.courier as
        | "SPEEDY"
        | "ECONT"
        | "IN_STORE";

      // Enforce the payload to strictly match our API interface
      const payload: CreateOrderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        deliveryMethod: backendCourierMethod,
        paymentMethod: "CASH_ON_DELIVERY",
        city,
        // Prepend context to the address string so the admin knows if it's an office or address
        addressOrOffice: `[${selectedShipping.name}] ${addressOrOffice}`,
        notes,
        // Secure mapping: we intentionally do NOT send price here to prevent tampering
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      await createOrder(payload);
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 pt-32 text-center">
        <CheckCircle2 size={64} className="text-green-500 mb-8" />
        <h1
          className="text-5xl font-black tracking-widest uppercase mb-4"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          ORDER CONFIRMED
        </h1>
        <p className="text-zinc-400 tracking-widest uppercase max-w-md mx-auto mb-12">
          Thank you for your purchase. We have received your order and are
          processing it now.
        </p>
        <Link
          href="/store"
          className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-300 transition-colors"
        >
          RETURN TO STORE
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8"
        >
          <ArrowLeft size={16} /> BACK TO STORE
        </Link>

        <h1
          className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          CHECKOUT
        </h1>

        {error && (
          <div className="mb-8 p-4 border border-red-500/50 bg-red-500/10 text-red-500 flex items-start gap-3">
            <AlertCircle className="shrink-0" />
            <p className="text-sm font-bold tracking-widest uppercase">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* LEFT: CHECKOUT FORM */}
          <div className="lg:col-span-7">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-12"
            >
              {/* CONTACT INFO */}
              <section>
                <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4 mb-6 text-zinc-300">
                  1. Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white focus:outline-none transition-colors tracking-wider text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white focus:outline-none transition-colors tracking-wider text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white focus:outline-none transition-colors tracking-wider text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* SHIPPING METHOD */}
              <section>
                <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4 mb-6 text-zinc-300">
                  2. Shipping Method (Bulgaria)
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {getShippingOptions().map((method) => (
                    <label
                      key={method.id}
                      className={`p-4 border cursor-pointer transition-colors flex items-center justify-between ${shippingMethodId === method.id ? "border-white bg-[#050505]" : "border-zinc-800 bg-black hover:border-zinc-600"}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.id}
                          checked={shippingMethodId === method.id}
                          onChange={(e) =>
                            setShippingMethodId(
                              e.target.value as ShippingMethodId,
                            )
                          }
                          className="w-4 h-4 accent-white bg-black border-zinc-800"
                        />
                        <div>
                          <p className="font-bold tracking-widest uppercase text-sm">
                            {method.name}
                          </p>
                          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">
                            {method.estimatedDays}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold tracking-widest uppercase text-sm">
                        {method.price === 0
                          ? "FREE"
                          : `€${method.price.toFixed(2)}`}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* DELIVERY ADDRESS */}
              {shippingMethodId !== "IN_STORE" && (
                <section>
                  <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4 mb-6 text-zinc-300">
                    3. Delivery Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                        City / Town
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white focus:outline-none transition-colors tracking-wider text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                        {shippingMethodId.includes("OFFICE")
                          ? "Courier Office Name or Address"
                          : "Full Street Address"}
                      </label>
                      <input
                        type="text"
                        required
                        value={addressOrOffice}
                        onChange={(e) => setAddressOrOffice(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white focus:outline-none transition-colors tracking-wider text-sm"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* PAYMENT INFO (Informational) */}
              <section>
                <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4 mb-6 text-zinc-300">
                  4. Payment
                </h2>
                <div className="p-6 border border-zinc-800 bg-[#050505] flex items-start gap-4 text-zinc-400">
                  <Truck className="shrink-0 text-white mt-1" size={24} />
                  <div>
                    <h3 className="text-white font-bold tracking-widest uppercase mb-2 text-sm">
                      Cash on Delivery Only
                    </h3>
                    <p className="text-sm leading-relaxed tracking-wide">
                      Currently, we only accept payment via Cash on Delivery
                      (Standard for Bulgaria). You will pay the courier in cash
                      or by card upon receiving the parcel.
                    </p>
                  </div>
                </div>
              </section>

              <div className="md:col-span-2">
                <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-white focus:outline-none transition-colors tracking-wider text-sm resize-none"
                />
              </div>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 p-8 border border-zinc-800 bg-[#050505]">
              <h2
                className="text-2xl font-black tracking-widest uppercase mb-8 border-b border-zinc-800 pb-6"
                style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
              >
                SUMMARY
              </h2>

              {/* Items */}
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-20 h-24 bg-zinc-900 border border-zinc-800 shrink-0 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full grayscale contrast-125"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                      <h4 className="font-bold tracking-widest uppercase text-sm leading-tight mb-2">
                        {item.title}
                      </h4>
                      <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">
                        SIZE: {item.size}
                      </p>
                      <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
                        QTY: {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold tracking-widest uppercase text-sm mt-1">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-4">
                <div className="flex justify-between text-sm tracking-widest uppercase text-zinc-400">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm tracking-widest uppercase text-zinc-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "FREE"
                      : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div
                  className="flex justify-between text-2xl font-black tracking-widest uppercase text-white border-t border-zinc-800 pt-6 mt-6"
                  style={{
                    fontFamily: "var(--font-koulen), Impact, sans-serif",
                  }}
                >
                  <span>TOTAL</span>
                  <span>€{orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="w-full mt-10 py-5 bg-white text-black font-black tracking-widest text-lg uppercase hover:bg-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> PROCESSING...
                  </>
                ) : (
                  "PLACE ORDER"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
