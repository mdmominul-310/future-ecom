"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  url: string;
  public_id: string;
}

interface ProductImageSliderProps {
  images: ProductImage[];
}

export default function ProductImageSlider({
  images,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = Array.isArray(images) && images.length > 0
    ? images.map((img: any, idx) => ({
        url: typeof img === "string" ? img : img?.url || "/placeholder.svg",
        public_id: img?.public_id || `img_${idx}`,
      }))
    : [{ url: "/placeholder.svg", public_id: "placeholder" }];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const currentImg = imageList[currentIndex] || imageList[0];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Image Viewport */}
      <div className="relative w-full h-[320px] sm:h-[420px] border border-stone-200/80 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
        <div
          key={currentImg.public_id}
          className="absolute inset-0 bg-white dark:bg-gray-800 transition-opacity duration-300 flex items-center justify-center p-4"
        >
          <Image
            src={currentImg.url}
            alt={`Product image ${currentIndex + 1}`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 text-stone-800 dark:text-white rounded-full p-2.5 shadow-md hover:scale-110 hover:bg-orange-500 hover:text-white transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 text-stone-800 dark:text-white rounded-full p-2.5 shadow-md hover:scale-110 hover:bg-orange-500 hover:text-white transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto p-1 py-2 justify-center">
          {imageList.map((img, i) => (
            <button
              key={img.public_id || i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative w-20 h-20 border rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all flex-shrink-0",
                i === currentIndex
                  ? "ring-2 ring-orange-500 shadow-md scale-105"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={`Thumb ${i + 1}`}
                fill
                className="object-cover p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
