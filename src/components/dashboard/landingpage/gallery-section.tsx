"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GallerySection() {
  const images = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <section id="gallery" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Product Gallery</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Explore our premium wireless headphones from every angle
        </p>

        <div className="max-w-5xl mx-auto">
          {/* Main Image */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl mb-4">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Product image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative h-20 rounded-md overflow-hidden cursor-pointer transition-all ${
                  index === currentIndex
                    ? "ring-2 ring-teal-600 ring-offset-2"
                    : "hover:opacity-80 filter grayscale hover:grayscale-0"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
