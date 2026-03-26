import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-24">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-6rem)]">
        
        {/* Left: Image Skeleton */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-zinc-900 bg-[#050505] min-h-[50vh] lg:min-h-0 flex items-center justify-center p-12">
          <div className="w-full max-w-md aspect-[3/4] bg-zinc-900 animate-pulse border border-zinc-800"></div>
        </div>

        {/* Right: Details Skeleton */}
        <div className="flex flex-col p-8 lg:p-16 xl:p-24 bg-black">
          <div className="max-w-xl w-full mx-auto lg:mx-0 flex-1 flex flex-col justify-center">
            
            {/* Title & Price */}
            <div className="h-10 w-3/4 bg-zinc-900 animate-pulse mb-4"></div>
            <div className="h-6 w-1/4 bg-zinc-900 animate-pulse mb-12"></div>

            {/* Description */}
            <div className="space-y-3 mb-12">
              <div className="h-4 w-full bg-zinc-900 animate-pulse"></div>
              <div className="h-4 w-full bg-zinc-900 animate-pulse"></div>
              <div className="h-4 w-2/3 bg-zinc-900 animate-pulse"></div>
            </div>

            {/* Size Selector */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-24 bg-zinc-900 animate-pulse"></div>
                <div className="h-4 w-16 bg-zinc-900 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 bg-zinc-900 animate-pulse border border-zinc-800"></div>
                ))}
              </div>
            </div>

            {/* Button */}
            <div className="h-16 w-full bg-zinc-900 animate-pulse mb-12"></div>

            {/* Meta tags */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-full border-b border-zinc-900 bg-zinc-900/50 animate-pulse"></div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}