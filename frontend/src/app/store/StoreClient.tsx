"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal } from "lucide-react";
import { Product } from '@/lib/api';

const CATEGORIES = ["ALL", "NEW DROPS", "TOPS", "OUTERWEAR", "BOTTOMS"];

export default function StoreClient({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Filtering Logic using REAL Postgres data
  const filteredProducts = initialProducts.filter(product => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "NEW DROPS") return product.status === "NEW";
    return product.category.toUpperCase() === activeCategory;
  });

  return (
    <>
      {/* Header Section */}
      <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="text-6xl md:text-8xl tracking-tighter font-black uppercase text-zinc-100 leading-none" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
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
          <Link href={`/store/${product.id}`} key={product.id} className="group flex flex-col cursor-pointer">
            
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden mb-5">
              
              {/* Status Badge */}
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
              <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase text-zinc-100" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
                {product.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-zinc-400 text-sm tracking-widest">
                  USD ${product.price.toFixed(2)}
                </span>
                
                <span className="text-white text-sm font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  + VIEW ITEM
                </span>
              </div>
            </div>

          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="w-full py-32 flex flex-col items-center justify-center border border-zinc-900 border-dashed">
          <h3 className="text-2xl font-bold tracking-widest text-zinc-600 uppercase" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
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
    </>
  );
}