// app/loading.tsx

import React from "react";

const SkeletonCard = () => (
  <div className="w-full bg-white p-4 rounded-lg shadow-md">
    <div className="w-full h-40 bg-gray-200 rounded-md animate-pulse mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
  </div>
);

const CategorySkeleton = () => (
  <div className="flex flex-col items-center space-y-2">
    <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header/Navbar Skeleton */}
        {/* <header className="flex justify-between items-center py-4 mb-8">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
          <div className="hidden md:flex space-x-6">
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
            <div className="h-6 w-16 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </header> */}

        {/* Hero Section Skeleton */}
        <section className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-8 md:space-y-0 md:space-x-12">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-12 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-12 w-32 bg-gray-300 rounded mt-4"></div>
          </div>
          <div className="w-full md:w-1/2 h-80 bg-gray-300 rounded-lg"></div>
        </section>

        {/* Categories Skeleton */}
        <section className="mb-16">
          <div className="h-8 w-48 bg-gray-300 rounded mb-6 mx-auto"></div>
          <div className="flex justify-center space-x-4 md:space-x-8 overflow-x-auto pb-4">
            {[...Array(5)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Featured Products Skeleton */}
        <section className="mb-16">
          <div className="h-8 w-56 bg-gray-300 rounded mb-8 mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>

        {/* Promo Banner Skeleton */}
        <section className="mb-16 bg-gray-200 h-64 rounded-lg flex items-center justify-center p-8">
          <div className="w-full md:w-1/2 flex items-center space-x-8">
            <div className="w-40 h-40 bg-gray-300 rounded-lg hidden md:block"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-10 w-28 bg-gray-400 rounded mt-2"></div>
            </div>
          </div>
        </section>

        {/* Trending Products Skeleton */}
        <section className="mb-16">
          <div className="h-8 w-56 bg-gray-300 rounded mb-8 mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>

        {/* Two Column Banners Skeleton */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-200 h-80 rounded-lg p-8 flex flex-col justify-end">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-10 w-24 bg-gray-400 rounded"></div>
          </div>
          <div className="bg-gray-200 h-80 rounded-lg p-8 flex flex-col justify-end">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-10 w-24 bg-gray-400 rounded"></div>
          </div>
        </section>

        {/* Blog Section Skeleton */}
        <section className="mb-16">
          <div className="h-8 w-48 bg-gray-300 rounded mb-8 mx-auto"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                <div className="w-full h-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Crafted with Passion Skeleton */}
        <section className="flex flex-col md:flex-row items-center justify-between mb-16 space-y-8 md:space-y-0 md:space-x-12">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-10 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="w-full md:w-1/2 h-72 bg-gray-300 rounded-lg"></div>
        </section>
      </div>

      {/* Footer Skeleton */}
      <footer className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-600 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-600 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-600 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-600 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
