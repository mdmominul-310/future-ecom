// app/products/loading.tsx

import React from "react";

const SkeletonProductCard = () => (
  <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200">
    <div className="w-full h-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
    <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse mb-4"></div>
    <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
  </div>
);

const FilterSectionSkeleton = ({ lines = 4 }) => (
  <div className="py-4 border-b border-gray-200">
    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4 animate-pulse"></div>
    <div className="space-y-3">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar Skeleton */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit animate-pulse">
          <FilterSectionSkeleton lines={6} />

          {/* Price Range Skeleton */}
          <div className="py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>

          <FilterSectionSkeleton lines={5} />

          <div className="pt-4">
            <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>
          </div>
        </aside>

        {/* Products Grid Skeleton */}
        <main className="lg:col-span-3">
          <div className="flex justify-end mb-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
