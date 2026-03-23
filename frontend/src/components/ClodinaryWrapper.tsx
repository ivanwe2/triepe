"use client";

import { CldImage, CldImageProps } from 'next-cloudinary';

export default function CloudinaryWrapper(props: CldImageProps) {
  return <CldImage {...props} />;
}