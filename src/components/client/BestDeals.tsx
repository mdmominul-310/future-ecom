"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductData } from "@/types/products";

interface BestDealsProps {
  products: ProductData[];
}

export function BestDeals({ products }: BestDealsProps) {
  return (
    <div className="space-y-6 mt-12 max-w-7xl mx-auto p-4">
      {/* Best Deals Section */}
      <h2 className="text-2xl font-bold">Best Deals</h2>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1 bg-indigo-900 text-white rounded-lg flex flex-col justify-between min-h-[400px]">
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Hot Deals</h3>
            <p className="text-sm opacity-90">
              Our hot deals to help you focus on your chosen product,
              collection, or blog post.
            </p>

            <div className="mt-8">
              <Link
                href="/deals"
                className="inline-flex items-center bg-white text-indigo-900 px-4 py-2 rounded-md text-sm font-medium"
              >
                Shop Now <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="mb-16">
            <Image
              src="/products/white-apple-watch.png"
              alt="Hot deals watch"
              width={800}
              height={800}
              className="object-cover h-56 w-auto"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:grid-rows-2">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
