"use client";

import Image from 'next/image';
import { X, Trash2 } from "lucide-react";
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, removeItem } = useCartStore();

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-zinc-900 z-[70] transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col text-white`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <h2 className="text-2xl font-black tracking-widest uppercase" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>YOUR CART</h2>
          <button onClick={closeCart} className="hover:rotate-90 transition-transform text-zinc-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
              <p className="tracking-widest text-sm font-bold uppercase mb-4">Cart is empty</p>
              <button onClick={closeCart} className="text-white border-b border-white pb-1 tracking-widest text-xs uppercase hover:text-gray-300">CONTINUE SHOPPING</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-zinc-900/50 p-3 border border-zinc-800/50">
                <div className="relative w-24 h-32 bg-black flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover grayscale" />
                </div>
                <div className="flex flex-col flex-1 py-1">
                  <h3 className="text-sm font-bold tracking-widest uppercase leading-tight mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-xs tracking-widest mb-auto">SIZE: {item.size} <span className="ml-2">QTY: {item.quantity}</span></p>
                  
                  <div className="flex items-end justify-between mt-4">
                    <p className="font-bold tracking-wider">€{item.price}</p>
                    <button 
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-zinc-900 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-6 text-lg tracking-widest font-bold uppercase">
              <span className="text-zinc-400">SUBTOTAL</span>
              <span>€{cartTotal} EUR</span>
            </div>
            {/* <button className="w-full py-5 bg-white text-black font-black text-xl tracking-widest uppercase hover:bg-zinc-300 transition-colors">
              CHECKOUT
            </button> */}
            <Link 
              href="/checkout"
              onClick={closeCart} 
              className="w-full py-5 bg-white text-black font-black text-xl tracking-widest uppercase hover:bg-zinc-300 transition-colors flex justify-center items-center"
            >
              CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
}