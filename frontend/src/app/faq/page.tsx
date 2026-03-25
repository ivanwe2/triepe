import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FAQPage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO HOME
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
          FREQUENTLY ASKED
        </h1>

        <div className="space-y-8">
          <div className="p-8 border border-zinc-900 bg-[#050505]">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4">HOW DO I KNOW WHEN A NEW DROP IS HAPPENING?</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Triepe collections are released in strictly limited quantities. The best way to stay informed about upcoming drops, early access, and secret releases is to follow our official Instagram and TikTok accounts. 
            </p>
          </div>

          <div className="p-8 border border-zinc-900 bg-[#050505]">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4">CAN I MODIFY OR CANCEL MY ORDER?</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              To ensure fast delivery, orders are processed almost immediately. Once an order is confirmed, we cannot guarantee modifications or cancellations. If you made an error in your shipping address, please email <a href="mailto:support@triepe.com" className="text-white underline underline-offset-4">support@triepe.com</a> immediately.
            </p>
          </div>

          <div className="p-8 border border-zinc-900 bg-[#050505]">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4">DO YOU RESTOCK SOLD OUT ITEMS?</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              Archival pieces and capsule collections are generally not restocked to maintain their exclusivity. However, essential staple pieces may see occasional restocks. Keep an eye on our socials.
            </p>
          </div>

          <div className="p-8 border border-zinc-900 bg-[#050505]">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4">HOW SHOULD I CARE FOR MY GARMENTS?</h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              To preserve the heavy cotton and specialized prints, we highly recommend washing all garments inside out on a cold, gentle cycle. Hang dry only. Do not iron directly over the graphic prints.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}