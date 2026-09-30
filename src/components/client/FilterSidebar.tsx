"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, Check, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";

export function FilterSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: {
  categories: any[];
  selectedCategory: any;
  setSelectedCategory: any;
  minPrice: any;
  setMinPrice: any;
  maxPrice: any;
  setMaxPrice: any;
}) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
  });

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleApplyPrice = () => {
    setMinPrice(localMinPrice);
    setMaxPrice(localMaxPrice);
  };

  const setPresetPrice = (min: number, max: number) => {
    setLocalMinPrice(min);
    setLocalMaxPrice(max);
    setMinPrice(min);
    setMaxPrice(max);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    (minPrice && minPrice > 0) ||
    (maxPrice && maxPrice < 100000);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Filters</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Refine your selection</p>
          </div>
        </div>
        {hasActiveFilters && (
          <Link
            href="/categories/all"
            onClick={() => {
              setSelectedCategory("all");
              setMinPrice(0);
              setMaxPrice(100000);
            }}
            className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Link>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-200">
        <button
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
          onClick={() => toggleSection("categories")}
        >
          <div className="flex items-center gap-2">
            <span>Categories</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {(categories?.length || 0) + 1}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
              expandedSections.categories ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.categories && (
          <div className="px-3 pb-3 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-1 max-h-72 overflow-y-auto scrollbar-thin">
            {/* "All" Category Option */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 text-orange-600 dark:text-orange-400 font-bold border border-orange-200/80 dark:border-orange-800/50"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 flex items-center justify-center rounded-md border transition-all ${
                    selectedCategory === "all"
                      ? "bg-orange-600 border-orange-600 shadow-xs"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                >
                  {selectedCategory === "all" && <Check className="h-3 w-3 text-white stroke-[3]" />}
                </div>
                <span>All Products</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-orange-500 opacity-80" />
            </button>

            {/* Other Categories */}
            {categories?.map((category: any) => {
              const isSelected = selectedCategory === category.slug;
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 text-orange-600 dark:text-orange-400 font-bold border border-orange-200/80 dark:border-orange-800/50"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`w-4 h-4 shrink-0 flex items-center justify-center rounded-md border transition-all ${
                        isSelected
                          ? "bg-orange-600 border-orange-600 shadow-xs"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                    </div>
                    <span className="truncate">{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-200">
        <button
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
          onClick={() => toggleSection("price")}
        >
          <span>Price Range</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
              expandedSections.price ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.price && (
          <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
            {/* Quick Presets */}
            <div className="pt-2">
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Quick Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Under ৳500", min: 0, max: 500 },
                  { label: "৳500 - ৳2,000", min: 500, max: 2000 },
                  { label: "৳2,000 - ৳5,000", min: 2000, max: 5000 },
                  { label: "৳5,000+", min: 5000, max: 100000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPresetPrice(preset.min, preset.max)}
                    className="text-[11px] py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors text-center border border-transparent hover:border-orange-200 dark:hover:border-orange-900"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Inputs */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label
                  htmlFor="min-price"
                  className="block text-[11px] text-slate-500 font-medium mb-1"
                >
                  Min (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">৳</span>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    value={localMinPrice ?? ""}
                    onChange={(e) => setLocalMinPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>
              <div className="text-slate-400 mt-5 font-semibold text-xs">–</div>
              <div className="flex-1">
                <label
                  htmlFor="max-price"
                  className="block text-[11px] text-slate-500 font-medium mb-1"
                >
                  Max (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">৳</span>
                  <input
                    type="number"
                    id="max-price"
                    min={localMinPrice || 0}
                    value={localMaxPrice ?? ""}
                    onChange={(e) => setLocalMaxPrice(e.target.value === "" ? 100000 : Number(e.target.value))}
                    placeholder="100000"
                    className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyPrice}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-xs"
            >
              Apply Price
            </button>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div>
          <Link
            href="/categories/all"
            onClick={() => {
              setSelectedCategory("all");
              setMinPrice(0);
              setMaxPrice(100000);
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-medium transition-colors text-xs border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </Link>
        </div>
      )}
    </div>
  );
}
