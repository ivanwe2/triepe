"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation'; 
import { ShoppingCart, Menu, ArrowLeft } from "lucide-react";
import { useCartStore } from '@/store/useCartStore';

const MOCK_PRODUCTS = [
  {
    id: "act001-hoodie",
    title: "ACT 001 HEAVYWEIGHT HOODIE",
    price: 120,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    status: "NEW",
    description: "Constructed from 500gsm brushed French terry cotton. Features distressed ribbing, dropped shoulders, and a cropped, boxy silhouette. Signature braille branding on the back. Washed for a vintage, lived-in feel."
  },
  {
    id: "deathstalker-tee",
    title: "DEATHSTALKER TEE",
    price: 45,
    category: "tops",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    status: null,
    description: "Premium 250gsm heavyweight cotton tee. Oversized fit with thick collar ribbing. Features the deathstalker graphic screen-printed on the front. Pre-shrunk."
  },
  // ... omitting others for brevity, but they would be here
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetailsPage() {
  const params = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem); // Hook into Zustand
  
  const productId = params?.id || "act001-hoodie";
  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("PLEASE SELECT A SIZE");
      return;
    }
    
    // Dispatch to global store
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-400 selection:text-black">
      <main className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16 min-h-screen">
        
        <Link href="/store" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-12">
          <ArrowLeft size={16} /> Back to Collection
        </Link>
        {/* Product Container */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-3/5">
            <div className="relative w-full aspect-[4/5] bg-zinc-900 border border-zinc-800">
              {product.status && (
                <div className="absolute top-6 left-6 z-20 px-4 py-2 text-sm font-black tracking-widest uppercase bg-white text-black">
                  {product.status}
                </div>
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover grayscale contrast-125"
                priority
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-2/5 flex flex-col pt-4 lg:pt-12">
            
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4" style={{ fontFamily: 'Impact, sans-serif' }}>
              {product.title}
            </h1>
            
            <p className="text-2xl font-medium tracking-widest text-zinc-300 mb-8">
              ${product.price} USD
            </p>

            <div className="w-full h-[1px] bg-zinc-800 mb-8" />

            <p className="text-zinc-400 leading-relaxed tracking-wide mb-12">
              {product.description || "Archival piece. Heavyweight construction. Refer to size guide for exact measurements."}
            </p>

            {/* Size Selector */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">Select Size</span>
                <button className="text-xs tracking-widest uppercase border-b border-zinc-600 text-zinc-400 hover:text-white pb-[2px]">Size Guide</button>
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-4 text-center font-bold tracking-wider transition-all duration-200 border ${
                      selectedSize === size 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent text-white border-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-6 bg-white text-black font-black text-xl tracking-widest uppercase hover:bg-zinc-300 transition-colors flex justify-center items-center gap-3 relative overflow-hidden group"
            >
              <span className="relative z-10">{selectedSize ? 'ADD TO CART' : 'SELECT A SIZE'}</span>
              <div className="absolute inset-0 bg-zinc-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </button>

            {/* Product Meta */}
            <div className="mt-12 space-y-4 text-sm tracking-widest text-zinc-500 uppercase">
              <p className="flex justify-between border-b border-zinc-900 pb-2">
                <span>SKU</span>
                <span className="text-zinc-300">{product.id.toUpperCase()}</span>
              </p>
              <p className="flex justify-between border-b border-zinc-900 pb-2">
                <span>SHIPPING</span>
                <span className="text-zinc-300">WORLDWIDE</span>
              </p>
              <p className="flex justify-between border-b border-zinc-900 pb-2">
                <span>RETURNS</span>
                <span className="text-zinc-300">14 DAYS</span>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}