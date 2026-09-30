// app/products/[slug]/loading.tsx

import React from "react";

const SkeletonReview = () => (
  <div className="border-t border-gray-200 py-4">
    <div className="flex items-center mb-2">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
      <div className="w-full">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-1 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/5 animate-pulse"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
  </div>
);

const SkeletonProductCard = () => (
  <div className="w-full">
    <div className="w-full h-40 bg-gray-200 rounded-md animate-pulse mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
  </div>
);

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery Skeleton */}
        <div>
          <div className="w-full h-96 bg-gray-300 rounded-lg mb-4"></div>
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="h-10 bg-gray-300 rounded w-4/5"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>

          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            </div>
          </div>

          <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
        </div>
      </div>

      {/* Description & Specs Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Media Sections Skeleton */}
      <div className="space-y-8 mb-12">
        <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
        <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Reviews Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Leave a Review Form */}
        <div className="bg-gray-100 p-6 rounded-lg space-y-4">
          <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-300 rounded w-1/3"></div>
        </div>
        {/* Customer Reviews List */}
        <div className="space-y-4">
          <div className="h-6 w-1/2 bg-gray-300 rounded mb-4"></div>
          <SkeletonReview />
          <SkeletonReview />
        </div>
      </div>

      {/* More Products Skeleton */}
      <div>
        <div className="h-8 w-1/4 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>
      </div>
    </div>
  );
}
