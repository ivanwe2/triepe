import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/lib/api";
import AddToCartSection from "./AddToCartSection";
import { Metadata } from "next";
import CloudinaryWrapper from '@/components/ClodinaryWrapper';

const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return { title: "Not Found | Triepe" };

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

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const allMedia = [product.image, ...(product.gallery || [])];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gray-400 selection:text-black">
      <main className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-16 min-h-screen">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-12"
        >
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          {/* LEFT: Vertical Media Stack */}
          <div className="w-full lg:w-3/5 flex flex-col gap-4">
            {allMedia.map((mediaUrl, index) => {
              const video = isVideo(mediaUrl);
              return (
                <div
                  key={`${mediaUrl}-${index}`}
                  className="relative w-full aspect-[4/5] bg-zinc-900 border border-zinc-800"
                >
                  {index === 0 && product.status && (
                    <div className="absolute top-6 left-6 z-20 px-4 py-2 text-sm font-black tracking-widest uppercase bg-white text-black shadow-lg">
                      {product.status}
                    </div>
                  )}

                  {video ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover grayscale contrast-125"
                    />
                  ) : (
                    <CloudinaryWrapper
                      src={mediaUrl}
                      alt={`${product.title} - View ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover grayscale contrast-125"
                      priority={index === 0}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Product Details (Sticky Sidebar) */}
          <div className="w-full lg:w-2/5 flex flex-col pt-4 lg:sticky lg:top-32">
            <h1
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4"
              style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
            >
              {product.title}
            </h1>

            <p className="text-2xl font-medium tracking-widest text-zinc-300 mb-8">
              €{product.price.toFixed(2)} EUR
            </p>

            <div className="w-full h-[1px] bg-zinc-800 mb-8" />

            <p className="text-zinc-400 leading-relaxed tracking-wide mb-12 uppercase text-sm">
              {product.description ||
                "Archival piece. Heavyweight construction. Refer to size guide for exact measurements."}
            </p>

            <AddToCartSection product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
