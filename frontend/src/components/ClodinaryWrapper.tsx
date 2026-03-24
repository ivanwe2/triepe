"use client";

import { CldImage, CldImageProps } from "next-cloudinary";

export default function CloudinaryWrapper(props: CldImageProps) {
  return (
    <CldImage
      {...props}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    />
  );
}
