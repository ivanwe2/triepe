"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu } from "lucide-react";
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const toggleMenu = useCartStore((state) => state.toggleMenu);
  const items = useCartStore((state) => state.items);
  
  // Hydration fix for Next.js (prevents server/client mismatch on initial load)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-8 md:px-12 pointer-events-auto">
      <div className="flex items-center">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Triepe Logo"
            className="h-12 md:h-20 object-contain cursor-pointer drop-shadow-lg"
          />
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-12 font-medium text-lg z-50">
        <Link href="/" className="hover:text-gray-300 transition-colors border-b-2 border-transparent hover:border-white pb-1">
          HOME
        </Link>
        <Link href="/store" className="hover:text-gray-300 transition-colors border-b-2 border-transparent hover:border-white pb-1">
          STORE
        </Link>
        
        {/* Changed from Link to Button to trigger the Drawer */}
        <button 
          onClick={toggleCart} 
          className="flex items-center gap-2 hover:text-gray-300 transition-colors border-b-2 border-transparent hover:border-white pb-1 relative"
        >
          CART <ShoppingCart size={20} />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-3 -right-4 bg-white text-black text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex items-center gap-6 z-50">
        {/* I added a cart icon here for mobile users! */}
        <button onClick={toggleCart} className="relative">
          <ShoppingCart size={28} />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
        <button onClick={toggleMenu} className="cursor-pointer">
          <Menu size={32} />
        </button>
      </div>
    </nav>
  );
}