"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import {
  ArrowLeft,
  Lock,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { createOrder } from "@/lib/api";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("");
  const [addressOrOffice, setAddressOrOffice] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState<
    "SPEEDY" | "ECONT" | "IN_STORE"
  >("SPEEDY");
  const [paymentMethod] = useState<"CASH_ON_DELIVERY">("CASH_ON_DELIVERY");

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shippingCost = deliveryMethod === "IN_STORE" ? 0 : 6.5;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    // Basic frontend validation
    if (!customerName || !customerPhone || !customerEmail) {
      setError("Please fill in all contact details.");
      return;
    }
    if (deliveryMethod !== "IN_STORE" && (!city || !addressOrOffice)) {
      setError("Please provide your City and Courier Office/Address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format the cart items to match what the backend expects
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
      }));

      // Call the Node.js API
      await createOrder({
        customerName,
        customerEmail,
        customerPhone,
        deliveryMethod,
        paymentMethod,
        city: deliveryMethod === "IN_STORE" ? "Plovdiv" : city,
        addressOrOffice:
          deliveryMethod === "IN_STORE"
            ? "Triepe Flagship Kapana"
            : addressOrOffice,
        items: orderItems,
      });

      // Success!
      setOrderSuccess(true);
      clearCart();
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <main className="w-full max-w-3xl mx-auto px-6 pt-40 pb-24 min-h-screen flex flex-col items-center text-center">
        <CheckCircle2 size={80} className="text-white mb-8" />
        <h1
          className="text-5xl font-black uppercase tracking-tighter mb-4"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          ORDER CONFIRMED
        </h1>
        <p className="text-zinc-400 tracking-widest leading-relaxed mb-12">
          Thank you for your purchase, {customerName}. <br />
          We have received your order and are preparing it for shipment via{" "}
          {deliveryMethod}. <br />A confirmation email has been sent to{" "}
          {customerEmail}.
        </p>
        <Link
          href="/store"
          className="py-4 px-12 bg-white text-black font-black tracking-widest uppercase hover:bg-zinc-300 transition-colors"
        >
          RETURN TO STORE
        </Link>
      </main>
    );
  }

  // EMPTY CART SCREEN
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32 px-6">
        <h1
          className="text-4xl font-black tracking-widest uppercase mb-6"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          YOUR CART IS EMPTY
        </h1>
        <Link
          href="/store"
          className="border-b border-white pb-1 tracking-widest hover:text-zinc-400 transition-colors"
        >
          RETURN TO STORE
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-24 min-h-screen">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8"
      >
        <ArrowLeft size={16} /> BACK TO CART
      </Link>

      <h1
        className="text-5xl font-black uppercase tracking-tighter mb-12"
        style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
      >
        SECURE CHECKOUT
      </h1>

      {error && (
        <div className="mb-8 p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm tracking-widest font-bold uppercase">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* LEFT COLUMN: FORMS */}
        <div className="w-full lg:w-3/5 space-y-12">
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4">
              1. Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="FULL NAME"
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="PHONE NUMBER"
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                className="w-full md:col-span-2 bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4">
              2. Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setDeliveryMethod("SPEEDY")}
                className={`p-4 border flex flex-col items-center gap-3 transition-colors ${deliveryMethod === "SPEEDY" ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600"}`}
              >
                <Truck size={24} />
                <span className="font-bold tracking-widest text-sm">
                  SPEEDY
                </span>
              </button>
              <button
                onClick={() => setDeliveryMethod("ECONT")}
                className={`p-4 border flex flex-col items-center gap-3 transition-colors ${deliveryMethod === "ECONT" ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600"}`}
              >
                <Truck size={24} />
                <span className="font-bold tracking-widest text-sm">ECONT</span>
              </button>
              <button
                onClick={() => setDeliveryMethod("IN_STORE")}
                className={`p-4 border flex flex-col items-center gap-3 transition-colors ${deliveryMethod === "IN_STORE" ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600"}`}
              >
                <Store size={24} />
                <span className="font-bold tracking-widest text-sm">
                  IN STORE
                </span>
              </button>
            </div>

            {deliveryMethod !== "IN_STORE" ? (
              <div className="grid grid-cols-1 gap-4 pt-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="CITY"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
                />
                <input
                  type="text"
                  value={addressOrOffice}
                  onChange={(e) => setAddressOrOffice(e.target.value)}
                  placeholder="COURIER OFFICE NAME OR STREET ADDRESS"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
                />
              </div>
            ) : (
              <div className="p-6 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm tracking-widest leading-relaxed uppercase">
                Pick up available at our flagship store.
                <br />
                Plovdiv, Kapana District, UI. Hristo Dyukmedzhiev 14.
                <br />
                Please wait for the confirmation email before arriving.
              </div>
            )}
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-widest uppercase border-b border-zinc-800 pb-4">
              3. Payment
            </h2>
            <div className="flex flex-col gap-4">
              <div className="p-6 border flex items-center justify-between cursor-pointer transition-colors bg-zinc-900 border-white text-white">
                <div className="flex items-center gap-4">
                  <Banknote size={24} />
                  <div>
                    <h3 className="font-bold tracking-widest uppercase text-sm">
                      Pay on Delivery
                    </h3>
                    <p className="text-xs text-zinc-500 tracking-wider mt-1">
                      Pay with cash or card upon receiving
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-white">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
              </div>
              <div className="p-6 border border-zinc-900 bg-black/50 flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <CreditCard size={24} className="text-zinc-600" />
                  <div>
                    <h3 className="font-bold tracking-widest uppercase text-sm text-zinc-600">
                      Credit / Debit Card
                    </h3>
                    <p className="text-xs text-zinc-700 tracking-wider mt-1">
                      Online payments coming soon
                    </p>
                  </div>
                </div>
                <Lock size={20} className="text-zinc-700" />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="w-full lg:w-2/5">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 sticky top-32">
            <h2
              className="text-2xl font-black tracking-widest uppercase mb-8"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              ORDER SUMMARY
            </h2>

            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-28 bg-black flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="text-sm font-bold tracking-widest uppercase leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-xs tracking-widest">
                      SIZE: {item.size} <span className="mx-2">|</span> QTY:{" "}
                      {item.quantity}
                    </p>
                    <p className="font-bold tracking-wider mt-auto">
                      €{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-4 text-sm tracking-widest uppercase">
              <div className="flex justify-between text-zinc-400">
                <span>SUBTOTAL</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>SHIPPING ({deliveryMethod})</span>
                <span>
                  {shippingCost === 0 ? "FREE" : `€${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-zinc-800">
                <span>TOTAL</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full mt-10 py-6 bg-white text-black font-black text-xl tracking-widest uppercase hover:bg-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> PROCESSING...
                </>
              ) : (
                "CONFIRM ORDER"
              )}
            </button>
            <p className="text-center text-xs text-zinc-600 tracking-widest uppercase mt-4">
              By confirming, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
