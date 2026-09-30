"use client";

import React from "react";
import Image from "next/image";

// Define the type for a single image object
interface ImageProps {
  url: string;
}

// Define the props for the component
interface AdditionalProductImagesProps {
  images: ImageProps[];
}

// The component is now renamed to reflect its grid layout
export default function AdditionalProductImages({
  images,
}: AdditionalProductImagesProps) {
  // Return null or a message if there are no images to display
  if (!images || images.length === 0) {
    return null;
  }

  return (
    // Main container with consistent styling
    <div className=" dark:bg-gray-900/50 p-4 sm:p-6  my-4">
      <div className="text-slate-700 dark:text-gray-300 font-semibold text-xl py-3 rounded-t-lg">
        <p>Product Images</p>
      </div>

      {/* --- START: GRID LAYOUT FOR IMAGES --- */}
      {/* A responsive grid that shows 2 columns on mobile, 3 on tablets, and 4 on desktops */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="group aspect-square relative w-full h-auto overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <Image
              src={img.url}
              alt={`Additional product image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
      {/* --- END: GRID LAYOUT FOR IMAGES --- */}
    </div>
  );
}
