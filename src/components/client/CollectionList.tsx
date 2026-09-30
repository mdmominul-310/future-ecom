"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  TrendingUp,
  Star,
  Compass,
  Layers,
  ShoppingBag,
  Clock,
  ShieldCheck,
} from "lucide-react";

type Collection = {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url?: string;
  };
  description?: string;
};

// Rich Category Metadata Mapping
const CATEGORY_META: Record<
  string,
  { badge: string; icon: React.ReactNode; itemCount: string }
> = {
  electronics: {
    badge: "Trending Tech",
    icon: <Sparkles className="w-3.5 h-3.5 text-cyan-300" />,
    itemCount: "12+ Items",
  },
  "fashion-apparel": {
    badge: "Hot Style",
    icon: <Flame className="w-3.5 h-3.5 text-amber-300" />,
    itemCount: "15+ Items",
  },
  "home-living": {
    badge: "Best Seller",
    icon: <Star className="w-3.5 h-3.5 text-yellow-300" />,
    itemCount: "12+ Items",
  },
  "beauty-wellness": {
    badge: "Organic Care",
    icon: <Sparkles className="w-3.5 h-3.5 text-rose-300" />,
    itemCount: "10+ Items",
  },
  "sports-outdoors": {
    badge: "Pro Fitness",
    icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />,
    itemCount: "10+ Items",
  },
  "footwear-kicks": {
    badge: "New Release",
    icon: <Flame className="w-3.5 h-3.5 text-orange-300" />,
    itemCount: "8+ Kicks",
  },
  "watches-accessories": {
    badge: "Luxury Gear",
    icon: <Compass className="w-3.5 h-3.5 text-purple-300" />,
    itemCount: "6+ Items",
  },
  "gourmet-coffee": {
    badge: "Artisanal",
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
    itemCount: "5+ Blends",
  },
  "automotive-tools": {
    badge: "Pro Grade",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />,
    itemCount: "5+ Tools",
  },
  "books-stationery": {
    badge: "Craft Edition",
    icon: <Clock className="w-3.5 h-3.5 text-teal-300" />,
    itemCount: "5+ Items",
  },
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80";

export default function CategorySlider({
  collections,
}: {
  collections: Collection[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabScrollContainerRef = useRef<HTMLDivElement>(null);

  if (!collections || collections.length === 0) {
    return (
      <section className="py-16 px-4 bg-[#F7F5EF]">
        <div className="container mx-auto text-center">
          <p className="text-base font-semibold text-stone-500 animate-pulse">
            Loading collections...
          </p>
        </div>
      </section>
    );
  }

  // Filter collections if a pill tab is selected
  const filteredCollections =
    selectedFilter === "all"
      ? collections
      : collections.filter(
          (c) => c.slug.toLowerCase() === selectedFilter.toLowerCase()
        );

  // Auto-scroll effect left to right every 3.5s
  React.useEffect(() => {
    if (isPaused || filteredCollections.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 20) {
          // Wrap back to beginning seamlessly
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll right by 1 card width
          container.scrollBy({ left: 340, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, filteredCollections.length]);

  // Carousel navigation handlers
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Category Pills Bar navigation handler
  const scrollTabs = (direction: "left" | "right") => {
    if (tabScrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      tabScrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F5EF] text-stone-900 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-sm">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Curated Department Store</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-none">
              Shop By{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-xl">
              Explore our 10 handcrafted collections featuring premium fashion,
              modern tech, lifestyle essentials, and luxury gear.
            </p>
          </div>

          {/* Slider Arrow Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous Categories"
              className="w-12 h-12 rounded-2xl bg-white hover:bg-orange-600 text-stone-800 hover:text-white border border-stone-200/80 hover:border-orange-600 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next Categories"
              className="w-12 h-12 rounded-2xl bg-white hover:bg-orange-600 text-stone-800 hover:text-white border border-stone-200/80 hover:border-orange-600 shadow-sm hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/categories/all"
              className="group hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-300 ml-2"
            >
              <span>All 10 Departments</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Category Pill Navigation Tabs with Left/Right Slide Controls */}
        <div className="relative flex items-center gap-2 mb-8 group/tabs">
          <button
            onClick={() => scrollTabs("left")}
            aria-label="Slide Pills Left"
            className="w-9 h-9 rounded-full bg-white hover:bg-orange-600 text-stone-700 hover:text-white border border-stone-200/80 shadow-sm flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer hover:scale-110 active:scale-95 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={tabScrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar scroll-smooth flex-1 select-none"
          >
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                selectedFilter === "all"
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/20 scale-105"
                  : "bg-white text-stone-700 hover:bg-orange-50 border border-stone-200/80 shadow-xs"
              }`}
            >
              ✨ All ({collections.length})
            </button>

            {collections.map((c) => {
              const isSelected = selectedFilter === c.slug;
              return (
                <button
                  key={c._id}
                  onClick={() => setSelectedFilter(c.slug)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/20 scale-105"
                      : "bg-white text-stone-700 hover:bg-orange-50 border border-stone-200/80 shadow-xs"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollTabs("right")}
            aria-label="Slide Pills Right"
            className="w-9 h-9 rounded-full bg-white hover:bg-orange-600 text-stone-700 hover:text-white border border-stone-200/80 shadow-sm flex items-center justify-center transition-all duration-300 flex-shrink-0 cursor-pointer hover:scale-110 active:scale-95 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Multi-Card Carousel Slider with Auto-Scroll */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((collection, index) => {
              const key = collection.slug.toLowerCase();
              const meta = CATEGORY_META[key] || {
                badge: "Explore",
                icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
                itemCount: "Multiple Items",
              };

              return (
                <motion.div
                  key={collection._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] snap-start"
                >
                  <Link
                    href={`/categories/${collection.slug}`}
                    className="group relative block w-full h-[420px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/80 shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {/* Background Image */}
                    <Image
                      src={collection.image?.url || DEFAULT_IMAGE}
                      alt={collection.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-105"
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 340px"
                    />

                    {/* Rich Dark Vignette Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent group-hover:from-stone-950/95 group-hover:via-stone-950/50 transition-all duration-500" />

                    {/* Top Floating Glass Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                        {meta.icon}
                        <span>{meta.badge}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-amber-200">
                        <ShoppingBag className="w-3 h-3" />
                        {meta.itemCount}
                      </span>
                    </div>

                    {/* Bottom Details Container */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end transform transition-transform duration-300">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors tracking-tight leading-tight">
                          {collection.name}
                        </h3>

                        {collection.description && (
                          <p className="text-xs text-stone-300 line-clamp-2 opacity-85 group-hover:opacity-100 transition-opacity">
                            {collection.description}
                          </p>
                        )}
                      </div>

                      {/* Explore Button */}
                      <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/15">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 group-hover:text-orange-400 transition-colors">
                          Explore Collection
                        </span>
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-stone-900 transition-all duration-300 shadow-md">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Border Ring Accent */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/0 group-hover:border-orange-500/60 transition-colors duration-500 pointer-events-none" />
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Callout & Stats Strip */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 flex-shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-stone-900">
                Explore All 10 Curated Departments
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Featuring over 66+ handpicked authentic items with 24-hour express shipping options.
              </p>
            </div>
          </div>
          <Link
            href="/categories/all"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex-shrink-0"
          >
            Browse Complete Catalog
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

