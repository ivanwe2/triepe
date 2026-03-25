import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Instagram, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO HOME
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
          CONTACT US
        </h1>

        <p className="text-xl text-zinc-400 mb-12 max-w-2xl tracking-wide leading-relaxed">
          Whether you have a question about a drop, need help with an order, or want to discuss a partnership—we are here. Select the appropriate channel below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Support */}
          <div className="p-8 border border-zinc-800 bg-[#050505] hover:border-white transition-colors group">
            <Mail size={24} className="mb-6 text-zinc-500 group-hover:text-white transition-colors" />
            <h2 className="text-lg font-bold tracking-widest uppercase mb-2">Support & Orders</h2>
            <p className="text-sm text-zinc-500 mb-6">For existing orders, returns, and product questions.</p>
            <a href="mailto:support@triepe.com" className="text-sm font-black tracking-widest uppercase border-b border-white pb-1">
              support@triepe.com
            </a>
          </div>

          {/* Sales */}
          <div className="p-8 border border-zinc-800 bg-[#050505] hover:border-white transition-colors group">
            <Mail size={24} className="mb-6 text-zinc-500 group-hover:text-white transition-colors" />
            <h2 className="text-lg font-bold tracking-widest uppercase mb-2">Wholesale & Sales</h2>
            <p className="text-sm text-zinc-500 mb-6">For international shipping requests and stockists.</p>
            <a href="mailto:sales@triepe.com" className="text-sm font-black tracking-widest uppercase border-b border-white pb-1">
              sales@triepe.com
            </a>
          </div>

          {/* Info */}
          <div className="p-8 border border-zinc-800 bg-[#050505] hover:border-white transition-colors group">
            <Mail size={24} className="mb-6 text-zinc-500 group-hover:text-white transition-colors" />
            <h2 className="text-lg font-bold tracking-widest uppercase mb-2">General Inquiries</h2>
            <p className="text-sm text-zinc-500 mb-6">For PR, styling, collaborations, and all other info.</p>
            <a href="mailto:info@triepe.com" className="text-sm font-black tracking-widest uppercase border-b border-white pb-1">
              info@triepe.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 md:p-12 border border-zinc-900 bg-[#050505] flex flex-col justify-center">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 flex items-center gap-3">
              <MapPin size={24} /> FLAGSHIP STORE
            </h2>
            <p className="text-zinc-400 tracking-wide leading-relaxed">
              No physical store at the moment<br />
              Plovdiv, Bulgaria
            </p>
          </div>

          <div className="p-8 md:p-12 border border-zinc-900 bg-[#050505] flex flex-col justify-center">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
              <Instagram size={24} /> SOCIAL
            </h2>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/tr13pe/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-zinc-700 hover:bg-white hover:text-black transition-colors font-bold tracking-widest text-sm uppercase">
                INSTAGRAM
              </a>
              <a href="https://www.tiktok.com/@triepeofficial" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-zinc-700 hover:bg-white hover:text-black transition-colors font-bold tracking-widest text-sm uppercase">
                TIKTOK
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}