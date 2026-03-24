"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '@/lib/api';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginAdmin({ email, password });
      
      // Basic role check just in case a normal user tries to log in here
      if (data.user.role !== 'ADMIN') {
        throw new Error("Unauthorized: Admin access required.");
      }

      // Store the JWT token securely in localStorage
      localStorage.setItem('triepe_admin_token', data.token);
      
      // Redirect to the dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6 pt-24 bg-black">
      <div className="w-full max-w-md bg-[#050505] border border-zinc-900 p-8 md:p-12 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
            <Lock size={32} className="text-black" />
          </div>
          <h1 className="text-4xl font-black tracking-widest uppercase text-center" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
            RESTRICTED ACCESS
          </h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase mt-2 text-center">
            Triepe Admin Personnel Only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-xs tracking-widest font-bold uppercase text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ADMIN EMAIL" 
              required
              className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD" 
              required
              className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors tracking-wider text-sm"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-5 mt-4 bg-white text-black font-black text-lg tracking-widest uppercase hover:bg-zinc-300 transition-colors disabled:opacity-50 flex justify-center items-center gap-3"
          >
            {isLoading ? <><Loader2 className="animate-spin" size={20} /> AUTHENTICATING...</> : 'LOGIN TO TERMINAL'}
          </button>
        </form>
      </div>
    </main>
  );
}