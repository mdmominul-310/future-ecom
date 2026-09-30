"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame, Package } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  image: string;
  slug: string;
  price?: number;
}

export default function TopProducts() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/topproducts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setTopProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to fetch top products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-white text-base">
              Top Selling Products
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Highest volume & revenue drivers
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline transition-colors"
        >
          <span>All Products</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <th className="pb-3 font-semibold">Product</th>
              <th className="pb-3 font-semibold text-center">Units Sold</th>
              <th className="pb-3 font-semibold text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 font-medium">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-800" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
                        <div className="h-2.5 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="h-4 w-8 mx-auto bg-stone-200 dark:bg-stone-800 rounded" />
                  </td>
                  <td className="py-3 text-right">
                    <div className="h-4 w-16 ml-auto bg-stone-200 dark:bg-stone-800 rounded" />
                  </td>
                </tr>
              ))
            ) : topProducts.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-stone-400 text-xs">
                  No top selling product analytics yet.
                </td>
              </tr>
            ) : (
              topProducts.map((product) => {
                const img = product.image || "/placeholder.png";

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                          {img ? (
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[170px] sm:max-w-[210px]">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="font-semibold text-stone-800 dark:text-stone-200 text-xs hover:text-orange-500 transition-colors block truncate"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[11px] text-stone-400 block truncate">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {product.unitsSold} pcs
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <span className="font-extrabold text-stone-900 dark:text-white text-xs">
                        ৳{product.revenue?.toLocaleString() || "0"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
