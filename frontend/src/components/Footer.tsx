import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-zinc-900 pt-16 pb-8 px-6 md:px-12 text-white mt-auto z-40 relative">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-24 mb-16">
        
        {/* Brand Column */}
        <div className="flex flex-col md:w-1/3">
          <img src="/logo.png" alt="Triepe Logo" className="h-20 object-contain self-start mb-6" />
          <p className="text-zinc-500 text-sm tracking-widest leading-relaxed uppercase max-w-sm">
            Redefining conventional streetwear.
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex gap-16 md:gap-24 md:w-2/3 md:justify-end">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest uppercase mb-2">Shop</h4>
            <Link href="/store" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">Collection 001</Link>
            <Link href="/store" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">All Products</Link>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">Size Guide</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest uppercase mb-2">Support</h4>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">FAQ</Link>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">Shipping</Link>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">Returns</Link>
            <Link href="#" className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} TRIEPE. ALL RIGHTS RESERVED.
        </p>
        
        <div className="flex gap-6">
          <a href="https://www.instagram.com/tr13pe/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
            <Facebook size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}