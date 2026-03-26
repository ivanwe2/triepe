import React from "react";

export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-900 pb-8 gap-6">
          <div className="space-y-4">
            <div className="h-12 w-64 bg-zinc-900 animate-pulse"></div>
            <div className="h-4 w-96 bg-zinc-900 animate-pulse"></div>
          </div>
          <div className="h-4 w-24 bg-zinc-900 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-24 bg-zinc-900 animate-pulse rounded-full"></div>
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-zinc-900 animate-pulse mb-6 border border-zinc-800"></div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-zinc-900 animate-pulse"></div>
                <div className="h-4 w-1/4 bg-zinc-900 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}