"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminOrders, Order } from '@/lib/api';
import { LogOut, Package, Users, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PRODUCTS'>('ORDERS');

  // 1. Check Auth & Fetch Data on Mount
  useEffect(() => {
    const token = localStorage.getItem('triepe_admin_token');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      setIsLoading(true);
      const ordersData = await getAdminOrders(token);
      setOrders(ordersData);
    } catch (err: any) {
      setError("Session expired or unauthorized. Please log in again.");
      localStorage.removeItem('triepe_admin_token');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('triepe_admin_token');
    router.push('/admin/login');
  };

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-24 text-white">
        <RefreshCw className="animate-spin mb-4 text-zinc-600" size={32} />
        <p className="tracking-widest font-bold uppercase text-sm text-zinc-500">INITIALIZING TERMINAL...</p>
      </div>
    );
  }

  // 3. Main Dashboard UI
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
              SYSTEM TERMINAL
            </h1>
            <p className="text-zinc-500 tracking-widest text-sm uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE & SECURE
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase"
          >
            <LogOut size={16} /> END SESSION
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-12 border-b border-zinc-900">
          <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`pb-4 tracking-widest font-bold uppercase text-sm transition-colors border-b-2 ${activeTab === 'ORDERS' ? 'border-white text-white' : 'border-transparent text-zinc-600 hover:text-zinc-300'}`}
          >
            ORDERS ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('PRODUCTS')}
            className={`pb-4 tracking-widest font-bold uppercase text-sm transition-colors border-b-2 ${activeTab === 'PRODUCTS' ? 'border-white text-white' : 'border-transparent text-zinc-600 hover:text-zinc-300'}`}
          >
            INVENTORY & PRODUCTS
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'ORDERS' && (
          <div className="bg-[#050505] border border-zinc-900 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs tracking-widest uppercase bg-zinc-900/50">
                  <th className="p-6 font-medium">Order ID</th>
                  <th className="p-6 font-medium">Date</th>
                  <th className="p-6 font-medium">Customer</th>
                  <th className="p-6 font-medium">Method</th>
                  <th className="p-6 font-medium">Total</th>
                  <th className="p-6 font-medium">Status</th>
                  <th className="p-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm tracking-wider">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-zinc-500 uppercase tracking-widest">
                      <Package size={32} className="mx-auto mb-4 opacity-50" />
                      No orders found in the database.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                      <td className="p-6 font-mono text-zinc-400 text-xs">{order.id.split('-')[0].toUpperCase()}</td>
                      <td className="p-6 text-zinc-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-6">
                        <p className="font-bold text-white uppercase">{order.customerName}</p>
                        <p className="text-xs text-zinc-500">{order.customerEmail}</p>
                      </td>
                      <td className="p-6">
                        <span className="px-2 py-1 bg-zinc-800 text-xs text-zinc-300 font-bold uppercase">
                          {order.deliveryMethod}
                        </span>
                      </td>
                      <td className="p-6 font-bold text-white">${order.totalAmount.toFixed(2)}</td>
                      <td className="p-6">
                        <span className={`px-2 py-1 text-xs font-black tracking-widest uppercase ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-xs font-bold tracking-widest uppercase border-b border-zinc-600 text-zinc-400 hover:text-white pb-1 transition-colors">
                          VIEW
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
          <div className="bg-[#050505] border border-zinc-900 p-12 flex flex-col items-center text-center">
            <h2 className="text-3xl font-black tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
              INVENTORY MANAGEMENT
            </h2>
            <p className="text-zinc-500 tracking-widest text-sm uppercase max-w-lg mb-8 leading-relaxed">
              Use the deployment tool to upload new items to the store. Images and videos are automatically processed and hosted via Cloudinary.
            </p>
            <Link 
              href="/admin/products/new"
              className="px-8 py-4 bg-white text-black font-black tracking-widest uppercase hover:bg-zinc-300 transition-colors flex items-center gap-3"
            >
              DEPLOY NEW PRODUCT
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}