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

        {/* Footer Socials */}
        <div className="p-8 border-t border-zinc-900 flex gap-6">
          <a href="https://www.instagram.com/tr13pe/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Facebook size={24} />
          </a>
        </div>
      </div>
    </>
  );
}