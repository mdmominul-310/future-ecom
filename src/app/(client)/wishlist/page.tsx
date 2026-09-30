"use client";

import React from "react";
import { ProductCard } from "@/components/client/ProductCard";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
// import { useWishlist } from "@/hooks/useWishlist"; // Import the hook
import { ProductData } from "@/types/products"; // Make sure to import ProductData
import { useWishlist } from "@/hooks/userWishList";

export default function WishlistPage() {
  // Use the custom wishlist hook
  const { wishlistItems, loading, removeProductFromWishlist } = useWishlist();

  const handleAddToCart = (product: ProductData) => {
    toast.info(
      `"${product.name}" added to cart! (Functionality to be implemented, e.g., dispatch to Redux cart)`
    );
    // Optionally, if you want to remove from wishlist after adding to cart:
    // removeProductFromWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Wishlist
        </h1>
        <WishlistGridSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Wishlist
      </h1>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="relative">
              {/* ProductCard component can remain mostly the same,
                  it will use the useWishlist hook internally to determine its Heart icon state. */}
              <ProductCard product={product as any} />{" "}
              {/* Cast as any if ProductData is slightly different than ProductCard expects */}
              {/* Actions for Wishlist items */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    if (product._id) {
                      removeProductFromWishlist(product._id);
                    }
                  }} // Use the hook's remove function
                  className="bg-black text-white p-2 rounded-full shadow-md hover:bg-slate-800 transition-colors"
                  title="Remove from Wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-colors"
                  title="Add to Cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-cart"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/30 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven&apos;t added anything to your wishlist yet.
          </p>
          <Link
            href="/category/all"
            className="inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Start Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}

function WishlistGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <Skeleton className="w-full aspect-square" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        ))}
    </div>
  );
}
