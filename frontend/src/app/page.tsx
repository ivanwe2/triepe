"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, ArrowRight } from "lucide-react";
import leftModel from "../assets/landing-page/left-model.png";
import centerModel from "../assets/landing-page/center-model.png";
import rightModel from "../assets/landing-page/right-model.png";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-gray-400 selection:text-black relative">
      
      <div className="fixed top-[15vh] md:top-[12vh] w-full flex justify-center z-0 pointer-events-none opacity-90 px-4 md:px-8">
        <div className="w-full max-w-[1600px] flex flex-col" style={{ fontFamily: 'Impact, sans-serif' }}>
          {/* Pushed Left */}
          <h1 className="text-[18vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-zinc-800 text-left md:ml-[-2vw]">
            REDEFINING
          </h1>
          {/* Pushed Right, slightly darker, pulled up slightly to overlap tight */}
          <h1 className="text-[18vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-zinc-900 text-right mt-2 md:-mt-4 md:mr-[-2vw]">
            STREETWEAR
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="relative w-full z-10">
        
        {/* COLLAGE SECTION */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto pt-32 md:pt-40 px-4 md:px-8 flex flex-col items-center pb-[20vh] md:pb-[30vh]">
          
          {/* 1. HERO BANNER (Center Model) */}
          <div 
            className="w-full z-20 relative"
            style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
          >
            <Image 
              src={centerModel} 
              alt="Triebe Collection Hero" 
              width={1600}
              height={1000}
              priority
              className="w-full h-auto object-contain drop-shadow-2xl" 
            />
          </div>

          {/* 2. BOTTOM ROW (Left & Right Models) */}
          <div className="w-full md:w-[95%] flex justify-between z-30 mt-[-15vw] md:mt-[-8vw] relative">
            
            {/* Left Model */}
            <div 
              className="w-[48%] md:w-[45%]"
              style={{ transform: `translateY(${scrollY * 0.35}px)` }}
            >
              <Image 
                src={leftModel} 
                alt="Streetwear Look 1" 
                width={800}
                height={1200}
                className="w-full h-auto object-contain drop-shadow-2xl" 
              />
            </div>

            {/* Right Model */}
            <div 
              className="w-[48%] md:w-[42%] mt-[8%]"
              style={{ transform: `translateY(${scrollY * 0.45}px)` }}
            >
              <Image 
                src={rightModel} 
                alt="Streetwear Look 2" 
                width={800}
                height={1200}
                className="w-full h-auto object-contain drop-shadow-2xl" 
              />
            </div>
          </div>
        </div>

        {/* TRANSITION & CTA SECTION */}
        <div className="relative z-40 bg-black w-full pt-20 pb-10 flex flex-col items-center shadow-[0_-20px_50px_rgba(0,0,0,1)]">
          <Link
            href="/store"
            className="group relative px-10 py-5 bg-white text-black font-bold text-xl hover:bg-gray-200 transition-all duration-300 overflow-hidden flex items-center gap-4"
          >
            <span className="relative z-10">EXPLORE COLLECTION</span>
            <ArrowRight
              size={24}
              className="relative z-10 group-hover:translate-x-2 transition-transform"
            />
          </Link>
        </div>

        {/* BOTTOM PRODUCTS TEASER */}
        <div className="relative z-40 bg-black w-full pt-16 pb-20">
          <div className="max-w-[1400px] px-6 md:px-12 mx-auto border-t border-zinc-800 pt-16">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-4xl tracking-wide font-bold" style={{ fontFamily: 'Impact, sans-serif' }}>LATEST DROPS</h2>
              <Link
                href="/store"
                className="text-gray-400 hover:text-white transition-colors border-b border-gray-400 hover:border-white pb-1"
              >
                VIEW ALL
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: "1f", title: "HEAVYWEIGHT HOODIE", price: "$85" },
                { id: "v1", title: "CARGO PANTS V1", price: "$110" },
                { id: "a1", title: "GRAPHIC TEE", price: "$45" },
              ].map((product, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="w-full h-[450px] bg-zinc-900 overflow-hidden relative border border-zinc-800">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 text-2xl tracking-widest font-bold" style={{ fontFamily: 'Impact, sans-serif' }}>
                      <ShoppingCart size={40} className="mb-4 opacity-50" />
                      ITEM: {product.id}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-semibold text-lg">{product.title}</span>
                    <span className="text-gray-400">{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
