"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { ProductData } from "@/types/products";
import { ProductCardSkeleton } from "../skeletons/ProductCardSkeleton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80";

export default function CategoryWiseProduct({ category }: any) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryId = category._id;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${categoryId}&limit=8`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Auto-scroll effect: slides left to right every 3.5 seconds
  useEffect(() => {
    if (isPaused || !products || products.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 20) {
          // Seamlessly wrap back to the beginning
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll right by 1 product card width
          container.scrollBy({ left: 280, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, products]);

  // Manual scroll controls
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!isLoading && products.length === 0) {
    return null;
  }

  const categoryImage = category.image?.url || DEFAULT_IMAGE;

  return (
    <motion.section
      className="relative py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-[#F7F5EF] text-stone-900 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Flex Layout: Left Light Hero Banner + Right Auto-Sliding Products Carousel */}
        <div className="flex flex-col lg:flex-row items-stretch gap-5 sm:gap-6">
          
          {/* Left Side: Category Banner Card (Clean Light Aesthetic) */}
          <motion.div
            variants={cardVariants}
            className="w-full lg:w-3/12 flex-shrink-0 flex"
          >
            <Link
              href={`/categories/${category.slug}`}
              className="group relative flex flex-col justify-between w-full h-full min-h-[300px] sm:min-h-[340px] rounded-2xl overflow-hidden bg-[#EAECEE] dark:bg-stone-800 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-7"
            >
              {/* Category Background Image */}
              <div className="absolute inset-x-0 bottom-0 top-1/3 z-0">
                <Image
                  src={categoryImage}
                  alt={category.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
                {/* Soft gradient overlay for smooth transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#EAECEE]/40 via-[#EAECEE]/20 to-[#EAECEE]" />
              </div>

              {/* Top Details Header */}
              <div className="relative z-10 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {category.name}
                </h3>
                
                {/* Clean Buy Now Outline Button */}
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-stone-800 text-stone-800 group-hover:bg-stone-900 group-hover:text-white font-bold text-xs transition-all duration-300 shadow-2xs">
                  Buy Now
                </span>
              </div>

              {/* Bottom Department Tag */}
              <div className="relative z-10 mt-auto pt-16 flex items-center justify-between text-xs font-semibold text-stone-700">
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                  Explore Department <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right Side: Auto-Sliding Products Carousel */}
          <div className="w-full lg:w-9/12 flex flex-col justify-between overflow-hidden">
            {/* Right Header with Controls */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200/80">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  {category.name}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Manual Chevron Slider Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scroll("left")}
                    aria-label={`Previous ${category.name} Products`}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-orange-600 text-stone-800 hover:text-white border border-stone-200/80 shadow-2xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    aria-label={`Next ${category.name} Products`}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-orange-600 text-stone-800 hover:text-white border border-stone-200/80 shadow-2xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  href={`/categories/${category.slug}`}
                  className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-stone-600 hover:text-orange-600 transition-colors ml-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Auto-Sliding Products Carousel Container */}
            <div
              ref={scrollContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory flex-1"
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="w-[230px] sm:w-[250px] lg:w-[265px] flex-shrink-0">
                      <ProductCardSkeleton />
                    </div>
                  ))
                : products.map((product: ProductData) => (
                    <motion.div
                      key={product._id}
                      variants={cardVariants}
                      className="w-[230px] sm:w-[250px] lg:w-[265px] flex-shrink-0 snap-start h-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}


