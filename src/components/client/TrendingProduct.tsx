"use client";

// import React, { useRef, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { ProductCard } from "./ProductCard";
import { ProductData } from "@/types/products";
import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface Category {
  id: number;
  _id: string;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

interface TrendingProductsProps {
  categories: Category[];
  products: ProductData[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <section className="max-w-7xl mx-auto py-8 px-4">
      <div className="text-start mb-5">
        <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">
          Trending Products
        </h2>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6  gap-1 lg:gap-5">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* Optional: "View All Posts" Button */}
      <div className="text-center my-5">
        <Link
          href={"/category/all"}
          className="inline-flex items-center px-8 py-1 border border-transparent text-lg font-medium rounded-full shadow-xl text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition duration-150 ease-in-out transform hover:scale-105"
        >
          View All Products
          <svg
            className="ml-3 -mr-1 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
