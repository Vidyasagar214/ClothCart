"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/data/images";
import { cn } from "@/lib/utils";

interface ProductImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function ProductImage({
  src,
  alt,
  fallbackSrc = IMAGES.fallback,
  className,
  ...props
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const isLocal = currentSrc.startsWith("/");

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      unoptimized={isLocal}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
