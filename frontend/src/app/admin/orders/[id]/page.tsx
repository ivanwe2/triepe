"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Package, Truck, User, MapPin, CreditCard } from 'lucide-react';
import { getAdminOrders, updateAdminOrderStatus, Order } from '@/lib/api';
import Image from 'next/image';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('triepe_admin_token');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
    fetchOrderDetails(storedToken, orderId);
  }, [orderId, router]);

  const fetchOrderDetails = async (jwt: string, targetId: string) => {
    try {
      // Fetch all orders and find the specific one 
      // (This guarantees we have the data without needing a new backend route)
      const allOrders = await getAdminOrders(jwt);
      const foundOrder = allOrders.find(o => o.id === targetId);
      
      if (!foundOrder) throw new Error("Order not found");
      setOrder(foundOrder);
    } catch (err: any) {
      setError(err.message || "Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      // Optimistic UI update
      setOrder({ ...order, status: newStatus });
      await updateAdminOrderStatus(order.id, newStatus, token);
    } catch (err: any) {
      alert(err.message || "Status update failed. Backend route may need configuration.");
      // Revert on failure
      fetchOrderDetails(token, orderId);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8 text-center">
        <h1 className="text-3xl font-black tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>ERROR</h1>
        <p className="text-zinc-500 mb-8">{error}</p>
        <Link href="/admin" className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors tracking-widest text-sm font-bold uppercase">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO ORDERS
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-widest uppercase mb-2 text-white" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
              ORDER #{order.id.split('-')[0]}
            </h1>
            <p className="text-zinc-500 tracking-widest text-sm uppercase">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">STATUS:</span>
            <select 
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className={`px-4 py-2 text-xs font-black tracking-widest uppercase appearance-none cursor-pointer border focus:outline-none ${
                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' : 
                order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/50' : 
                order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 
                'bg-red-500/10 text-red-500 border-red-500/50'
              }`}
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3 text-white">
                <Package size={20} className="text-zinc-500" /> ORDER ITEMS
              </h2>
              
              <div className="space-y-6">
                {order.items.map((item: any, idx) => (
                  <div key={idx} className="flex gap-6 border-b border-zinc-900 pb-6 last:border-0 last:pb-0">
                    <div className="relative w-24 h-32 bg-zinc-900 flex-shrink-0">
                      {/* Assuming your backend sends the product details via Prisma include */}
                      {item.product?.image ? (
                        <Image src={item.product.image} alt={item.product.title} fill className="object-cover grayscale" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700"><Package size={24}/></div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                      <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-2">
                        {item.product?.title || `PRODUCT ID: ${item.productId}`}
                      </h3>
                      <div className="flex gap-6 text-xs text-zinc-500 tracking-widest uppercase mb-4">
                        <p>SIZE: <span className="text-zinc-300">{item.size}</span></p>
                        <p>QTY: <span className="text-zinc-300">{item.quantity}</span></p>
                      </div>
                      <p className="font-bold tracking-wider text-white">€{(item.priceAtBuy || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#050505] border border-zinc-900 p-8 flex flex-col items-end">
               <div className="w-full max-w-xs space-y-4 text-sm tracking-widest uppercase">
                  <div className="flex justify-between text-zinc-500">
                    <span>SUBTOTAL</span>
                    <span>€{(order.totalAmount - (order.deliveryMethod === 'IN_STORE' ? 0 : 6.50)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>SHIPPING</span>
                    <span>{order.deliveryMethod === 'IN_STORE' ? 'FREE' : '€6.50'}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-zinc-900">
                    <span>TOTAL</span>
                    <span>€{order.totalAmount.toFixed(2)}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Customer Info */}
          <div className="space-y-8">
            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-3 text-white border-b border-zinc-900 pb-4">
                <User size={18} className="text-zinc-500" /> CUSTOMER
              </h2>
              <div className="space-y-4 text-sm tracking-wide">
                <div>
                  <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">Name</p>
                  <p className="text-white uppercase">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">Email</p>
                  <p className="text-zinc-300">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">Phone</p>
                  <p className="text-zinc-300">{order.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-3 text-white border-b border-zinc-900 pb-4">
                <MapPin size={18} className="text-zinc-500" /> SHIPPING
              </h2>
              <div className="space-y-4 text-sm tracking-wide">
                <div>
                  <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">Method</p>
                  <span className="px-2 py-1 bg-zinc-800 text-xs text-white font-bold uppercase tracking-widest">{order.deliveryMethod}</span>
                </div>
                {order.deliveryMethod !== 'IN_STORE' && (
                  <>
                    <div>
                      <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">City</p>
                      <p className="text-white uppercase">{order.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">Address / Office</p>
                      <p className="text-zinc-300 uppercase leading-relaxed">{(order as any).addressOrOffice || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#050505] border border-zinc-900 p-8">
              <h2 className="text-lg font-bold tracking-widest uppercase mb-6 flex items-center gap-3 text-white border-b border-zinc-900 pb-4">
                <CreditCard size={18} className="text-zinc-500" /> PAYMENT
              </h2>
              <div>
                <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-1">Method</p>
                <p className="text-white uppercase">{(order as any).paymentMethod || 'CASH ON DELIVERY'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}