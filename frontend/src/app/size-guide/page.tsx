import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function SizeGuidePage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/store" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO STORE
        </Link>

        <h1
          className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8"
          style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}
        >
          SIZE GUIDE
        </h1>

        <div className="space-y-16">

          {/* THE FIT */}
          <section>
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4">THE TRIEPE FIT</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Our garments are constructed with a custom drop-shoulder, slightly oversized block intended to embody the modern streetwear silhouette. We recommend taking your true size for our intended fit. If you prefer a highly exaggerated, baggy look, consider sizing up one size.
            </p>
            <p className="text-zinc-500 tracking-wide leading-relaxed mt-3 text-sm">
              We carry sizes <strong className="text-zinc-300">XS through XL</strong>. If you&apos;re between sizes or unsure, see the try-at-home policy below — you can always return or exchange.
            </p>
          </section>

          {/* CLOTHING SIZE TABLE */}
          <section>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-6">STANDARD MEASUREMENTS — TOPS &amp; OUTERWEAR (cm)</h2>
            <div className="overflow-x-auto border border-zinc-800 bg-[#050505]">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase bg-zinc-900/50">
                    <th className="p-6 font-bold text-white border-r border-zinc-800">Size</th>
                    <th className="p-6 font-medium">Chest</th>
                    <th className="p-6 font-medium">Length</th>
                    <th className="p-6 font-medium">Shoulders</th>
                  </tr>
                </thead>
                <tbody className="text-sm tracking-wider">
                  <tr className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">XS</td>
                    <td className="p-6 text-zinc-300">54</td>
                    <td className="p-6 text-zinc-300">68</td>
                    <td className="p-6 text-zinc-300">50</td>
                  </tr>
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
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-6 font-black text-white text-lg border-r border-zinc-800">XL</td>
                    <td className="p-6 text-zinc-300">62</td>
                    <td className="p-6 text-zinc-300">76</td>
                    <td className="p-6 text-zinc-300">58</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-zinc-600 text-xs tracking-widest uppercase">
                * All measurements are of the garment itself, laid flat. Chest = half-chest × 2.
              </p>
              <p className="text-zinc-600 text-xs tracking-widest uppercase">
                * Measurements are approximate and may vary ±1–2 cm per garment due to cut and fabric.
              </p>
              <p className="text-zinc-600 text-xs tracking-widest uppercase">
                * Triepe sizing does not directly correspond to other brands — always check these measurements against your own body.
              </p>
            </div>
          </section>

          {/* ONE SIZE */}
          <section>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4">ACCESSORIES &amp; OTHER — ONE SIZE</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Accessories (caps, bags, and similar items) are listed as <strong className="text-zinc-300">ONE SIZE</strong> and are designed to fit universally. Sizing is not a concern for these products, and they are not subject to size-based returns.
            </p>
          </section>

          {/* TRY BEFORE YOU ACCEPT */}
          <section className="border border-zinc-800 bg-[#050505] p-8 space-y-6">
            <h2 className="text-xl font-bold tracking-widest uppercase flex items-center gap-3">
              <RotateCcw size={20} className="text-zinc-400" />
              Try Before You Accept
            </h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Both Speedy and Econt allow you to <strong className="text-zinc-200">open and inspect your parcel at the courier office</strong> before accepting it. If the size doesn&apos;t fit, you can refuse the delivery on the spot — the parcel is returned to us at no extra cost to you.
            </p>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Once a parcel has been accepted, returns are handled on a <strong className="text-zinc-200">case-by-case basis</strong>. Contact us at{" "}
              <a
                href="mailto:support@triepe.com"
                className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors"
              >
                support@triepe.com
              </a>{" "}
              with your order number and reason — we&apos;ll review and get back to you.
            </p>
            <div className="flex flex-wrap gap-4 border-t border-zinc-800 pt-6">
              <Link
                href="/returns"
                className="text-xs font-bold tracking-widest uppercase border-b border-zinc-600 text-zinc-300 hover:text-white hover:border-white pb-[2px] transition-colors"
              >
                Return Policy →
              </Link>
              <Link
                href="/shipping"
                className="text-xs font-bold tracking-widest uppercase border-b border-zinc-600 text-zinc-300 hover:text-white hover:border-white pb-[2px] transition-colors"
              >
                Shipping Info →
              </Link>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
