"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { getProductById } from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('tops');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NEW');
  
  // Inventory States (We track the DB 'id' so we can update specific rows)
  const [variants, setVariants] = useState<{ id?: string, size: string, stock: number }[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('triepe_admin_token');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
    
    // Fetch existing product data
    if (productId) {
      fetchProductData(productId);
    }
  }, [productId, router]);

  const fetchProductData = async (id: string) => {
    try {
      const product = await getProductById(id);
      if (!product) throw new Error("Product not found");
      
      setTitle(product.title);
      setPrice(product.price.toString());
      setCategory(product.category);
      setDescription(product.description || '');
      setStatus(product.status || 'ACTIVE');
      setVariants(product.variants || []);
    } catch (err: any) {
      setError(err.message || "Failed to load product data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index].stock = parseInt(value) || 0;
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Create a PUT request API call (Requires you to add updateAdminProduct to api.ts)
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '') + '/api';
      
      const payload = {
        title,
        price: parseFloat(price),
        category,
        description,
        status: status === 'ACTIVE' ? null : status,
        variants
      };

      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to update product");
      
      alert("PRODUCT UPDATED SUCCESSFULLY!");
      router.push('/admin');

    } catch (err: any) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  }

  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> ABORT / BACK TO DASHBOARD
        </Link>

        <h1 className="text-4xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8 text-white">
          EDIT: {title}
        </h1>

        {error && (
          <div className="mb-8 p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm tracking-widest font-bold uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Details Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">Product Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-white transition-colors uppercase tracking-wider text-sm" />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">Price (EUR)</label>
              <input type="number" required min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-white transition-colors tracking-wider text-sm" />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">Status Flag</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-white transition-colors uppercase tracking-wider text-sm">
                <option value="ACTIVE">ACTIVE (NO BADGE)</option>
                <option value="NEW">NEW</option>
                <option value="SOLD OUT">SOLD OUT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">Description</label>
              <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-white transition-colors tracking-wide text-sm resize-none" />
            </div>
          </section>

          {/* Restock Section */}
          <section>
            <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">Manage Inventory (Stock)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {variants.map((variant, index) => (
                <div key={variant.id || index} className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col items-center gap-3">
                  <span className="text-white font-black tracking-widest text-lg">{variant.size}</span>
                  <input type="number" min="0" value={variant.stock} onChange={(e) => handleStockChange(index, e.target.value)} className="w-full bg-black border border-zinc-700 p-2 text-center text-white focus:border-white transition-colors text-sm" />
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 tracking-widest uppercase mt-4">Updating stock to 0 will prevent checkout for that size.</p>
          </section>

          <button type="submit" disabled={isSaving} className="w-full py-6 mt-10 bg-white text-black font-black text-xl tracking-widest uppercase hover:bg-zinc-300 transition-colors disabled:opacity-50 flex justify-center items-center gap-3">
            {isSaving ? <><Loader2 className="animate-spin" size={24} /> SAVING CHANGES...</> : <><Save size={24} /> SAVE PRODUCT UPDATES</>}
          </button>
        </form>
      </div>
    </main>
  );
}