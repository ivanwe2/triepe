import React from "react";
import { Menu } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Mobile Header Skeleton */}
      <header className="lg:hidden flex items-center justify-between p-6 border-b border-zinc-900 bg-[#050505] sticky top-0 z-40">
        <div className="h-6 w-24 bg-zinc-900 animate-pulse"></div>
        <Menu size={28} className="text-zinc-800" />
      </header>

      {/* Sidebar Skeleton (Desktop only) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-[#050505] border-r border-zinc-900 flex-col z-[70]">
        <div className="p-8 border-b border-zinc-900">
          <div className="h-8 w-32 bg-zinc-900 animate-pulse mb-2"></div>
          <div className="h-3 w-20 bg-zinc-900 animate-pulse"></div>
        </div>
        <nav className="flex-1 p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full bg-zinc-900 animate-pulse"></div>
          ))}
        </nav>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 md:p-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#050505] border border-zinc-900 p-8 h-32 animate-pulse">
              <div className="h-3 w-24 bg-zinc-800 mb-4"></div>
              <div className="h-8 w-32 bg-zinc-800"></div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex justify-between mb-8">
          <div className="h-8 w-48 bg-zinc-900 animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="border border-zinc-900 bg-[#050505] p-4">
          <div className="space-y-4">
            <div className="h-8 w-full bg-zinc-900 animate-pulse border-b border-zinc-800"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-zinc-900 animate-pulse"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}