import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/lib/api";
import AddToCartSection from "./AddToCartSection";
import { Metadata } from "next";

// Next.js magic: Generates the SEO tags dynamically for iMessage/Instagram previews!
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return { title: "Not Found | Triepe" };
  }

  return {
    title: `${product.title} | TRIEPE`,
    description:
      product.description || `Buy the new ${product.title} at Triepe.`,
    openGraph: {
      title: product.title,
      description:
        product.description || `Buy the new ${product.title} at Triepe.`,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch real data from your Postgres Database!
  const product = await getProductById(params.id);

  if (!product) {
    notFound(); // Shows the 404 page if someone types a bad URL
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-400 selection:text-black">
      <main className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16 min-h-screen">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-12"
        >
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left: Product Image */}
          <div className="w-full lg:w-3/5">
            <div className="relative w-full aspect-[4/5] bg-zinc-900 border border-zinc-800">
              {product.status && (
                <div className="absolute top-6 left-6 z-20 px-4 py-2 text-sm font-black tracking-widest uppercase bg-white text-black">
                  {product.status}
                </div>
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover grayscale contrast-125"
                priority
              />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-2/5 flex flex-col pt-4 lg:pt-12">
            <h1
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              {product.title}
            </h1>

            <p className="text-2xl font-medium tracking-widest text-zinc-300 mb-8">
              ${product.price} USD
            </p>

            <div className="w-full h-[1px] bg-zinc-800 mb-8" />

            <p className="text-zinc-400 leading-relaxed tracking-wide mb-12">
              {product.description ||
                "Archival piece. Heavyweight construction. Refer to size guide for exact measurements."}
            </p>

            {/* Client Component for Interactivity */}
            <AddToCartSection product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
