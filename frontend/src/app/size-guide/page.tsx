import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SizeGuidePage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO STORE
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
          SIZE GUIDE
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4">THE TRIEPE FIT</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Our garments are constructed with a custom drop-shoulder, slightly oversized block intended to embody the modern streetwear silhouette. We recommend taking your true size for our intended fit. If you prefer a highly exaggerated, baggy look, we suggest sizing up one size.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-6">STANDARD MEASUREMENTS (TOPS)</h2>
            <div className="overflow-x-auto border border-zinc-800 bg-[#050505]">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase bg-zinc-900/50">
                    <th className="p-6 font-bold text-white border-r border-zinc-800">Size</th>
                    <th className="p-6 font-medium">Chest (cm)</th>
                    <th className="p-6 font-medium">Length (cm)</th>
                    <th className="p-6 font-medium">Shoulders (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-sm tracking-wider">
                  <tr className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">S</td>
                    <td className="p-6 text-zinc-300">56</td>
                    <td className="p-6 text-zinc-300">70</td>
                    <td className="p-6 text-zinc-300">52</td>
                  </tr>
                  <tr className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">M</td>
                    <td className="p-6 text-zinc-300">58</td>
                    <td className="p-6 text-zinc-300">72</td>
                    <td className="p-6 text-zinc-300">54</td>
                  </tr>
                  <tr className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">L</td>
                    <td className="p-6 text-zinc-300">60</td>
                    <td className="p-6 text-zinc-300">74</td>
                    <td className="p-6 text-zinc-300">56</td>
                  </tr>
                  <tr className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">XL</td>
                    <td className="p-6 text-zinc-300">62</td>
                    <td className="p-6 text-zinc-300">76</td>
                    <td className="p-6 text-zinc-300">58</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">XXL</td>
                    <td className="p-6 text-zinc-300">64</td>
                    <td className="p-6 text-zinc-300">78</td>
                    <td className="p-6 text-zinc-300">60</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-zinc-600 text-xs tracking-widest uppercase mt-4">
              * Measurements are approximate and may vary slightly depending on the exact garment and washing process.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}