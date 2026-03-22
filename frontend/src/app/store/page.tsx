"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, SlidersHorizontal } from "lucide-react";

// ==========================================
// BACKEND-READY DATA STRUCTURE
// When your API is ready, you will fetch an array of objects just like this.
// ==========================================
const MOCK_PRODUCTS = [
  {
    id: "act001-hoodie",
    title: "ACT 001 HEAVYWEIGHT HOODIE",
    price: 120,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    status: "NEW", // Can be NEW, SOLD OUT, or null
  },
  {
    id: "deathstalker-tee",
    title: "DEATHSTALKER TEE",
    price: 45,
    category: "tops",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    status: null,
  },
  {
    id: "cargo-v1",
    title: "OVERSIZED CARGO V1",
    price: 140,
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1000&auto=format&fit=crop",
    status: "SOLD OUT",
  },
  {
    id: "braille-longsleeve",
    title: "BRAILLE ARCHIVE LONGSLEEVE",
    price: 65,
    category: "tops",
    image: "https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=1000&auto=format&fit=crop",
    status: null,
  },
  {
    id: "distressed-knit",
    title: "DISTRESSED KNIT SWEATER",
    price: 95,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
    status: "NEW",
  },
  {
    id: "tactical-vest",
    title: "TACTICAL UTILITY VEST",
    price: 110,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    status: null,
  }
];

const CATEGORIES = ["ALL", "NEW DROPS", "TOPS", "OUTERWEAR", "BOTTOMS"];

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Filtering Logic (Ready for backend queries)
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "NEW DROPS") return product.status === "NEW";
    return product.category.toUpperCase() === activeCategory;
  });

  return ( 
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-400 selection:text-black">
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 pt-32 md:pt-40 pb-20 min-h-screen">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl tracking-tighter font-black uppercase text-zinc-100 leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>
              COLLECTION <br />
              <span className="text-zinc-600">001</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-md text-sm md:text-base tracking-wide uppercase">
              The inaugural drop. Redefining conventional silhouettes through an industrial lens.
            </p>
          </div>
          
          <button className="md:hidden flex items-center gap-2 border border-zinc-800 px-4 py-2 text-sm font-bold tracking-widest uppercase">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="hidden md:flex flex-wrap gap-8 mb-12 border-b border-zinc-900 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm tracking-widest font-bold uppercase transition-colors ${
                activeCategory === cat ? "text-white" : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {filteredProducts.map((product) => (
            // In the future, this Link will go to `/store/${product.id}`
            <Link href={`/store/${product.id}`} key={product.id} className="group flex flex-col cursor-pointer">
              
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden mb-5">
                
                {/* Status Badge (NEW / SOLD OUT) */}
                {product.status && (
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-black tracking-widest uppercase ${
                    product.status === 'SOLD OUT' ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-black'
                  }`}>
                    {product.status}
                  </div>
                )}

                {/* Product Image */}
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                    product.status === 'SOLD OUT' ? 'grayscale opacity-50' : 'grayscale contrast-125'
                  }`}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10" />
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-1 pr-4">
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-zinc-100" style={{ fontFamily: 'Impact, sans-serif' }}>
                  {product.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-zinc-400 text-sm tracking-widest">
                    USD ${product.price}
                  </span>
                  
                  {/* Subtle Add indicator on hover */}
                  <span className="text-white text-sm font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    + VIEW ITEM
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>

        {/* Empty State (If a filter has no items) */}
        {filteredProducts.length === 0 && (
          <div className="w-full py-32 flex flex-col items-center justify-center border border-zinc-900 border-dashed">
            <h3 className="text-2xl font-bold tracking-widest text-zinc-600 uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
              NO DROPS IN THIS CATEGORY YET
            </h3>
            <button 
              onClick={() => setActiveCategory("ALL")}
              className="mt-6 border-b border-white pb-1 text-sm tracking-widest hover:text-zinc-400 transition-colors"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}

      </main>
    </div>
  );
}