import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Store, Globe } from 'lucide-react';
import { SHIPPING_METHODS } from '@/config/shipping';

export default function ShippingPage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO HOME
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
          SHIPPING POLICY
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Domestic Shipping */}
          <div className="p-8 md:p-12 border border-zinc-900 bg-[#050505]">
            <div className="flex items-center gap-4 mb-6">
              <Truck size={32} className="text-white" />
              <h2 className="text-2xl font-bold tracking-widest uppercase">DOMESTIC (BULGARIA)</h2>
            </div>
            <p className="text-zinc-400 tracking-wide leading-relaxed mb-6">
              All domestic orders are processed within 1-2 business days. We partner with the leading couriers to ensure secure and fast delivery to your door or preferred office.
            </p>
            <ul className="space-y-4 text-sm tracking-widest uppercase text-zinc-300">
              <li className="flex justify-between border-b border-zinc-800 pb-2">
                <span>{SHIPPING_METHODS.SPEEDY_OFFICE.name}</span>
                <span className="font-bold text-white">€{SHIPPING_METHODS.SPEEDY_OFFICE.price.toFixed(2)} EUR</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800 pb-2">
                <span>{SHIPPING_METHODS.SPEEDY_ADDRESS.name}</span>
                <span className="font-bold text-white">€{SHIPPING_METHODS.SPEEDY_ADDRESS.price.toFixed(2)} EUR</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800 pb-2">
                <span>{SHIPPING_METHODS.ECONT_OFFICE.name}</span>
                <span className="font-bold text-white">€{SHIPPING_METHODS.ECONT_OFFICE.price.toFixed(2)} EUR</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800 pb-2">
                <span>{SHIPPING_METHODS.ECONT_ADDRESS.name}</span>
                <span className="font-bold text-white">€{SHIPPING_METHODS.ECONT_ADDRESS.price.toFixed(2)} EUR</span>
              </li>
              <li className="flex justify-between pt-2 text-zinc-500 text-xs">
                <span>* Delivery typically takes 1-3 business days after dispatch. Prices may vary slightly based on final weight.</span>
              </li>
            </ul>
          </div>

          {/* In-Store Pickup */}
          <div className="p-8 md:p-12 border border-zinc-900 bg-[#050505]">
            <div className="flex items-center gap-4 mb-6">
              <Store size={32} className="text-white" />
              <h2 className="text-2xl font-bold tracking-widest uppercase">IN-STORE PICKUP</h2>
            </div>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Local to Plovdiv? Select "In Store" at checkout to bypass shipping fees. <br /><br />
              <strong className="text-white">Triepe Flagship Store</strong><br />
              Working on it...<br /><br />
              <span className="text-sm text-zinc-500 uppercase tracking-widest">Please wait for your "Ready for Pickup" confirmation email/call before arriving.</span>
            </p>
          </div>

          {/* International Shipping */}
          <div className="p-8 md:p-12 border border-zinc-900 bg-[#050505]">
            <div className="flex items-center gap-4 mb-6">
              <Globe size={32} className="text-white" />
              <h2 className="text-2xl font-bold tracking-widest uppercase">INTERNATIONAL ORDERS</h2>
            </div>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              We are expanding our global logistics footprint. Currently, international orders outside of Bulgaria are processed manually on a case-by-case basis to ensure the best possible shipping rates.
            </p>
            <div className="mt-6 p-4 border border-zinc-800 bg-black text-sm tracking-widest uppercase text-center">
              To request an international shipment, email <a href="mailto:sales@triepe.com" className="text-white hover:underline mx-2">sales@triepe.com</a> with your desired items and shipping address.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}