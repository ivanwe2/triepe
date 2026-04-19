import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PackageCheck, Mail } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white selection:bg-gray-400 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/store" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8">
          <ArrowLeft size={16} /> BACK TO STORE
        </Link>

        <h1
          className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8"
          style={{ fontFamily: 'var(--font-koulen), Impact, sans-serif' }}
        >
          RETURNS &amp; EXCHANGES
        </h1>

        <div className="space-y-12 text-zinc-400 tracking-wide leading-relaxed">

          {/* PRIMARY METHOD */}
          <section className="border border-zinc-800 bg-[#050505] p-8 space-y-4">
            <h2 className="text-xl font-bold tracking-widest uppercase text-white flex items-center gap-3">
              <PackageCheck size={20} className="text-zinc-400 shrink-0" />
              Try Before You Accept — Recommended
            </h2>
            <p>
              The easiest way to handle a size issue is to <strong className="text-zinc-200">inspect your parcel at the Speedy or Econt courier office before accepting it</strong>. Both couriers allow you to open the package on-site. If something doesn&apos;t fit or isn&apos;t right, you can refuse the delivery — the parcel is returned to us at no extra cost to you.
            </p>
            <p className="text-sm text-zinc-500">
              This is the fastest and most friction-free option. No emails, no waiting — just refuse at the office.
            </p>
          </section>

          {/* AFTER ACCEPTANCE */}
          <section>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-white">After Accepting the Parcel</h2>
            <p className="mb-4">
              Once a parcel has been accepted, returns and exchanges are handled on a <strong className="text-zinc-200">case-by-case basis</strong>. We review each request individually — there is no guaranteed return window.
            </p>
            <p>
              To open a return request, contact us at{' '}
              <a href="mailto:support@triepe.com" className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors">
                support@triepe.com
              </a>{' '}
              with:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
              <li>Your order number</li>
              <li>The reason for the return or exchange</li>
              <li>Photos of the item if there is a defect or discrepancy</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              We respond within 48 hours. Approved returns will receive a shipping address and further instructions.
            </p>
          </section>

          {/* ELIGIBILITY */}
          <section>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-white">Eligibility (If Approved)</h2>
            <p>To be considered for a return or exchange, the item must be:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
              <li>Unworn and unwashed</li>
              <li>Unaltered, with all original tags attached</li>
              <li>In its original packaging</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Return shipping costs are the responsibility of the customer, unless the item arrived faulty or incorrect.
            </p>
          </section>

          {/* REFUNDS */}
          <section>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-white flex items-center gap-3">
              <Mail size={18} className="text-zinc-400 shrink-0" />
              Refunds
            </h2>
            <p>
              Once your return is received and inspected, we&apos;ll notify you by email of the decision. If approved, refunds are processed within <strong className="text-zinc-200">5–7 business days</strong>. Original shipping costs are non-refundable.
            </p>
          </section>

          {/* EXCEPTIONS */}
          <section className="p-6 border border-red-900/50 bg-red-900/10">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-3 text-red-500">Non-Returnable Items</h2>
            <p className="text-sm">
              For hygiene reasons, underwear, socks, and similar items cannot be returned. Final-sale archive pieces marked as non-returnable at time of purchase are also excluded.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
