"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/lib/api";

export default function AddToCartSection({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Safely extract available sizes from variants, fallback to standard if none
  const availableSizes =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => v.size)
      : ["S", "M", "L", "XL", "XXL"];

  const isSoldOut = product.status === "SOLD OUT";
  const isButtonDisabled = isSoldOut || !selectedSize;

  const handleAddToCart = () => {
    if (isButtonDisabled) return; // Failsafe

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      image: product.image,
      quantity: 1,
    });
  };

  // Determine button text
  let buttonText = "SELECT A SIZE";
  if (isSoldOut) buttonText = "SOLD OUT";
  else if (selectedSize) buttonText = "ADD TO CART";

  return (
    <>
      {/* Size Selector */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">
            Select Size
          </span>
          <button className="text-xs tracking-widest uppercase border-b border-zinc-600 text-zinc-400 hover:text-white pb-[2px]">
            Size Guide
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              disabled={isSoldOut}
              className={`py-4 text-center font-bold tracking-wider transition-all duration-200 border ${
                selectedSize === size
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-zinc-700 hover:border-zinc-400 disabled:opacity-30 disabled:hover:border-zinc-700 disabled:cursor-not-allowed"
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
        disabled={isButtonDisabled}
        className={`w-full py-6 font-black text-xl tracking-widest uppercase transition-all flex justify-center items-center gap-3 relative overflow-hidden group ${
          isButtonDisabled
            ? "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
            : "bg-white text-black hover:bg-zinc-300"
        }`}
      >
        <span className="relative z-10">{buttonText}</span>

        {/* Only show the hover animation if the button is active */}
        {!isButtonDisabled && (
          <div className="absolute inset-0 bg-zinc-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        )}
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
    </>
  );
}
