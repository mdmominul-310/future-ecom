"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import { ProductData } from "@/types/products";
import { ProductCard } from "./ProductCard";

interface FeaturedProductsProps {
  products: ProductData[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect: slides left-to-right every 3.5s unless paused
  useEffect(() => {
    if (isPaused || !products || products.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 20) {
          // Wrap smoothly back to start
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll right by 1 product card width
          container.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, products]);

  // Manual scroll controls handler
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F5EF] text-stone-900 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>Handpicked Premium Selections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900 leading-none">
              Featured{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-lg font-medium">
              Discover top-rated luxury arrivals, bestsellers, and exclusive seasonal releases.
            </p>
          </div>

          {/* Slider Controls & View All CTA */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous Featured Products"
              className="w-11 h-11 rounded-2xl bg-white hover:bg-orange-600 text-stone-800 hover:text-white border border-stone-200/80 hover:border-orange-600 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next Featured Products"
              className="w-11 h-11 rounded-2xl bg-white hover:bg-orange-600 text-stone-800 hover:text-white border border-stone-200/80 hover:border-orange-600 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/categories/all"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-orange-500/25 transition-all duration-300 ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Single Row Auto-Slideable Product Carousel Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="flex-shrink-0 w-[260px] sm:w-[290px] lg:w-[310px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

