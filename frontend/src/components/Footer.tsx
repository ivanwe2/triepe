import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-zinc-900 pt-16 pb-8 px-6 md:px-12 text-white mt-auto z-40 relative">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-24 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col md:w-1/3">
          <img
            src="/logo.png"
            alt="Triepe Logo"
            className="h-20 object-contain self-start mb-6"
          />
          <p className="text-zinc-500 text-sm tracking-widest leading-relaxed uppercase max-w-sm">
            Redefining conventional streetwear.<br />
            Since 2018.
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex gap-16 md:gap-24 md:w-2/3 md:justify-end">
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest uppercase mb-2">
              Shop
            </h4>
            <Link
              href="/store"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              Collection 032
            </Link>
            <Link
              href="/store"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/size-guide"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              Size Guide
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest uppercase mb-2">
              Support
            </h4>
            <Link
              href="/faq"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/shipping"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              Shipping
            </Link>
            <Link
              href="/returns"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              Returns
            </Link>
            <Link
              href="/contact"
              className="text-zinc-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} TRIEPE. ALL RIGHTS RESERVED.
        </p>

        <div className="flex gap-6 items-center">
          <a
            href="https://www.instagram.com/tr13pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-white transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@triepeofficial?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-white transition-colors"
          >
            {/* Custom TikTok SVG */}
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
