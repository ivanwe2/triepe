"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import {
  createAdminProduct,
  CreateProductPayload,
  verifyAdminSession,
} from "@/lib/api";
import { toast } from "sonner";

interface MediaPreview {
  file: File;
  url: string;
  type: "image" | "video";
}

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("TOPS");
  const [description, setDescription] = useState("");

  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const [variants, setVariants] = useState([
    { size: "XS", stock: 0 },
    { size: "S", stock: 0 },
    { size: "M", stock: 0 },
    { size: "L", stock: 0 },
    { size: "XL", stock: 0 },
  ]);

  useEffect(() => {
    verifyAdminSession()
      .then(() => setIsAuthChecking(false))
      .catch(() => {
        toast.error("Session expired or unauthorized.");
        router.push("/admin/login");
      });
  }, [router]);

  // FIX: Auto-generate the slug based on the title, making it bulletproof
  useEffect(() => {
    if (title) {
      setId(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    } else {
      setId("");
    }
  }, [title]);

  useEffect(() => {
    if (category === "OTHER") {
      setVariants([{ size: "ONE SIZE", stock: 0 }]);
    } else {
      setVariants([
        { size: "XS", stock: 0 },
        { size: "S", stock: 0 },
        { size: "M", stock: 0 },
        { size: "L", stock: 0 },
        { size: "XL", stock: 0 },
      ]);
    }
  }, [category]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : ("image" as const),
      })) as MediaPreview[];
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeMedia = (indexToRemove: number) => {
    setMediaFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleStockChange = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index].stock = parseInt(value) || 0;
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading("Deploying product to databanks...");

    try {
      if (mediaFiles.length === 0) {
        throw new Error("At least one product image is required.");
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset)
        throw new Error("Cloudinary env vars missing.");

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const uploadPromises = mediaFiles.map(async (media) => {
        const formData = new FormData();
        formData.append("file", media.file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("A media upload failed.");
        const data = await res.json();
        return data.secure_url as string;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const payload: CreateProductPayload = {
        id,
        title,
        price: parseFloat(price),
        category,
        description,
        image: uploadedUrls[0],
        gallery: uploadedUrls.slice(1),
        status: "NEW",
        variants: variants.filter((v) => v.stock >= 0),
      };

      await createAdminProduct(payload);
      toast.success("Product successfully deployed!", { id: loadingToastId });
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product.", {
        id: loadingToastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase">
        <Loader2 className="animate-spin mr-3" size={24} /> VERIFYING ACCESS...
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black pt-32 pb-24 px-4 sm:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-sm font-bold uppercase mb-8"
        >
          <ArrowLeft size={16} /> ABORT / BACK TO DASHBOARD
        </Link>

        <h1
          className="text-5xl font-black tracking-widest uppercase mb-12 border-b border-zinc-900 pb-8"
          style={{ fontFamily: "var(--font-koulen), Impact, sans-serif" }}
        >
          DEPLOY NEW PRODUCT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                Product ID (SKU){" "}
                <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-sm">
                  AUTO-LOCKED
                </span>
              </label>
              {/* FIX: Set to readOnly and visually distinct */}
              <input
                type="text"
                readOnly
                value={id}
                className="w-full bg-black border border-zinc-800 p-4 text-zinc-600 focus:outline-none cursor-not-allowed lowercase tracking-wider text-sm"
              />
            </div>

            <div>
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                Price (EUR)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors tracking-wider text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                Category
              </label>
              {/* FIX: Explicit category options */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors uppercase tracking-wider text-sm"
              >
                <option value="TOPS">TOPS / TEES</option>
                <option value="OUTERWEAR">OUTERWEAR / HOODIES</option>
                <option value="BOTTOMS">BOTTOMS</option>
                <option value="OTHER">OTHER / ACCESSORIES</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors tracking-wide text-sm resize-none"
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase">
                Product Media (First is Cover)
              </label>
              <div className="relative overflow-hidden cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-zinc-600 text-white hover:text-zinc-300 transition-colors pb-1">
                  <Upload size={14} /> ADD FILES
                </div>
              </div>
            </div>

            {mediaFiles.length === 0 ? (
              <div className="w-full aspect-[21/9] border-2 border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-600 relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <Upload size={32} className="mb-4" />
                <span className="text-xs tracking-widest font-bold uppercase">
                  Click or Drag to upload images & video
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaFiles.map((media, index) => (
                  <div
                    key={media.url}
                    className={`relative group aspect-[4/5] bg-zinc-900 border ${index === 0 ? "border-white" : "border-zinc-800"}`}
                  >
                    <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-black/80 text-[10px] font-black tracking-widest uppercase text-white backdrop-blur-sm">
                      {index === 0 ? "COVER" : `GALLERY 0${index}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 z-20 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                    {media.type === "video" ? (
                      <video
                        src={media.url}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={media.url}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <label className="block text-zinc-500 text-xs font-bold tracking-widest uppercase mb-4">
              Initial Inventory (Stock)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {variants.map((variant, index) => (
                <div
                  key={variant.size}
                  className="p-4 bg-zinc-900 border border-zinc-800 flex flex-col items-center gap-3"
                >
                  <span className="text-white font-black tracking-widest text-lg">
                    {variant.size}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => handleStockChange(index, e.target.value)}
                    className="w-full bg-black border border-zinc-700 p-2 text-center text-white focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={isLoading || mediaFiles.length === 0}
            className="w-full py-6 mt-10 bg-white text-black font-black text-xl tracking-widest uppercase hover:bg-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} /> DEPLOYING...
              </>
            ) : (
              "DEPLOY PRODUCT"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
