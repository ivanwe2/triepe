import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO HOME
        </Link>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8" style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}>
          RETURNS & EXCHANGES
        </h1>

        <div className="space-y-8 text-zinc-400 tracking-wide leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-white">14-DAY RETURN POLICY</h2>
            <p>
              We accept returns and exchanges within 14 days of the delivery date. To be eligible for a return, your item must be strictly in the same condition that you received it: unworn, unwashed, unaltered, and with all original tags and packaging intact.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-widest uppercase mt-12 mb-4 text-white">HOW TO INITIATE A RETURN</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                Email <a href="mailto:support@triepe.com" className="text-white underline underline-offset-4">support@triepe.com</a> with your <strong>Order Number</strong> and the reason for your return/exchange.
              </li>
              <li>
                Our support team will review your request within 24-48 hours and provide you with a return shipping address and instructions.
              </li>
              <li>
                Pack the items securely. We highly recommend using a trackable shipping service, as we are not responsible for return packages lost in transit.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-widest uppercase mt-12 mb-4 text-white">REFUNDS</h2>
            <p>
              Once your return is received and inspected, we will send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed back to your original method of payment (or via bank transfer for Cash on Delivery orders) within 5-7 business days. Original shipping costs are non-refundable.
            </p>
          </section>

          <section className="p-6 border border-red-900/50 bg-red-900/10 mt-12">
            <h2 className="text-lg font-bold tracking-widest uppercase mb-2 text-red-500">EXCEPTIONS / NON-RETURNABLE ITEMS</h2>
            <p className="text-sm">
              For hygiene reasons, certain items such as underwear, socks, and highly discounted final-sale archive pieces cannot be returned or exchanged. Please check the product description before purchasing.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}