import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllProducts } from "@/lib/api";
import ParallaxHero from "./ParallaxHero";
import CloudinaryWrapper from "@/components/ClodinaryWrapper";

export default async function LandingPage() {
  // 1. Fetch live data from Postgres (Cached for blazing speed)
  const allProducts = await getAllProducts();
  
  // 2. Slice only the newest 3 active drops for the landing page
  const latestDrops = allProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-gray-400 selection:text-black relative">
      
      {/* BACKGROUND TYPOGRAPHY */}
      <div className="fixed top-[15vh] md:top-[12vh] w-full flex justify-center z-0 pointer-events-none opacity-90 px-4 md:px-8">
        <div className="w-full max-w-[1600px] flex flex-col" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
          <h1 className="text-[18vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-zinc-800 text-left md:ml-[-2vw]">
            REDEFINING
          </h1>
          <h1 className="text-[18vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-zinc-900 text-right mt-2 md:-mt-4 md:mr-[-2vw]">
            STREETWEAR
          </h1>
        </div>
      </div>

      <main className="relative w-full z-10">
        
        {/* PARALLAX HERO SECTION (Client Component) */}
        <ParallaxHero />

        {/* TRANSITION & CTA SECTION (With the left-to-right fill animation) */}
        <div className="relative z-40 bg-black w-full pt-20 pb-10 flex flex-col items-center shadow-[0_-20px_50px_rgba(0,0,0,1)]">
          <Link
            href="/store"
            className="group relative px-10 py-5 bg-black border-2 border-white text-white font-bold text-xl transition-all duration-300 overflow-hidden flex items-center gap-4"
          >
            {/* The White Slide Fill Background */}
            <div className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0 z-0" />
            
            {/* The Text & Arrow (z-index above the fill, text changes to black on hover) */}
            <span className="relative z-10 tracking-widest uppercase group-hover:text-black transition-colors duration-500">
              EXPLORE COLLECTION
            </span>
            <ArrowRight
              size={24}
              className="relative z-10 group-hover:text-black group-hover:translate-x-2 transition-all duration-500"
            />
          </Link>
        </div>

        {/* BOTTOM PRODUCTS TEASER (Live Data) */}
        <div className="relative z-40 bg-black w-full pt-16 pb-20">
          <div className="max-w-[1400px] px-6 md:px-12 mx-auto border-t border-zinc-800 pt-16">
            
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-4xl tracking-wide font-bold" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
                LATEST DROPS
              </h2>
              <Link
                href="/store"
                className="text-gray-400 hover:text-white transition-colors border-b border-gray-400 hover:border-white pb-1 tracking-widest text-sm font-bold uppercase"
              >
                VIEW ALL
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestDrops.length === 0 ? (
                <div className="col-span-3 py-32 border border-zinc-900 border-dashed flex items-center justify-center text-zinc-600 font-bold tracking-widest uppercase text-xl" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
                  NO DROPS AVAILABLE
                </div>
              ) : (
                latestDrops.map((product) => (
                  <Link href={`/store/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
                    
                    {/* Cloudinary Image Container */}
                    <div className="w-full aspect-[4/5] bg-zinc-900 overflow-hidden relative border border-zinc-800 mb-4">
                      {product.status && (
                        <div className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-black tracking-widest uppercase ${
                          product.status === 'SOLD OUT' ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-black'
                        }`}>
                          {product.status}
                        </div>
                      )}

                      <CloudinaryWrapper
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                          product.status === 'SOLD OUT' ? 'grayscale opacity-50' : 'grayscale contrast-125'
                        }`}
                      />
                      
                      {/* Dark overlay that fades on hover */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                    </div>

                    {/* Product Metadata */}
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg uppercase tracking-wider text-zinc-100" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
                        {product.title}
                      </span>
                      <span className="text-zinc-400 tracking-widest font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                  </Link>
                ))
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}