"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onSuccess: (url: string) => void;
}

export default function ImageUpload({ onSuccess }: ImageUploadProps) {
  return (
    <CldUploadWidget
      // Note: You must create an "unsigned" upload preset in your Cloudinary Dashboard
      // Settings -> Upload -> Upload Presets -> Add Upload Preset -> Mode: Unsigned
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "triepe_store"}
      onSuccess={(result) => {
        if (
          result.info &&
          typeof result.info === "object" &&
          "secure_url" in result.info
        ) {
          onSuccess(result.info.secure_url as string);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
          className="w-full h-full min-h-[120px] flex flex-col items-center justify-center gap-3 text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-colors"
        >
          <Upload size={24} />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Upload Media
          </span>
        </button>
      )}
    </CldUploadWidget>
  );
}