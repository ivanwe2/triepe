"use client";

import React from 'react';
import Link from 'next/link';
import { X, Instagram, Facebook } from "lucide-react";
import { useCartStore } from '@/store/useCartStore';

export default function MobileMenu() {
  const { isMenuOpen, closeMenu } = useCartStore();

  return (
    <>
      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-[#050505] border-r border-zinc-900 z-[70] transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col md:hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <img src="/logo.png" alt="Triepe Logo" className="h-8 object-contain" />
          <button onClick={closeMenu} className="hover:rotate-90 transition-transform text-zinc-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col p-8 gap-8 justify-center">
          <Link href="/" onClick={closeMenu} className="text-4xl font-black tracking-widest uppercase hover:text-zinc-400 transition-colors" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
            HOME
          </Link>
          <Link href="/store" onClick={closeMenu} className="text-4xl font-black tracking-widest uppercase hover:text-zinc-400 transition-colors" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
            STORE
          </Link>
          <div className="w-12 h-[2px] bg-zinc-800 my-4" />
          <Link href="#" onClick={closeMenu} className="text-lg tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
            SIZE GUIDE
          </Link>
          <Link href="#" onClick={closeMenu} className="text-lg tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
            FAQ / SUPPORT
          </Link>
        </div>

        <div className="p-8 border-t border-zinc-900 flex gap-6 items-center">
          <a href="https://www.instagram.com/tr13pe/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Instagram size={24} />
          </a>
          <a href="https://www.tiktok.com/@triepeofficial?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}