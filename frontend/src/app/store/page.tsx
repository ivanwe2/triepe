import React from 'react';
import { getAllProducts } from '@/lib/api';
import StoreClient from './StoreClient';

export default async function StorePage() {
  // Fetch real data from the Postgres database!
  // This happens on the server, meaning it's blazing fast and perfectly indexed by Google.
  const liveProducts = await getAllProducts();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-400 selection:text-black">
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 pt-32 md:pt-40 pb-20 min-h-screen">
        {/* Pass the server-fetched data into the interactive Client component */}
        <StoreClient initialProducts={liveProducts} />
      </main>
    </div>
  );
}