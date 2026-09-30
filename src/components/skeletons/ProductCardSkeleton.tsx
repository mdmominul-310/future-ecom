// src/components/skeletons/ProductCardSkeleton.tsx

import React from "react";

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
      <div className="mt-2 space-y-2">
        {/* Title Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        {/* Price Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};
