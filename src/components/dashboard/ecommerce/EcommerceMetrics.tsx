"use client";

import React, { useEffect, useState } from "react";
import {
  Boxes,
  Users,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface MetricsData {
  totalRevenue?: number;
  totalCustomers: number;
  totalOrders: number;
  totalAllOrders?: number;
  pendingOrders?: number;
  totalProducts?: number;
  revenueGrowth?: {
    percent: number;
    trend: "up" | "down";
  };
  customerGrowth: {
    percent: number;
    trend: "up" | "down";
  };
  orderGrowth: {
    percent: number;
    trend: "up" | "down";
  };
}

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Month");
  const [openDropdown, setOpenDropdown] = useState(false);

  const filterOptions = ["Day", "Week", "Month"];

  const handleFilterChange = (option: string) => {
    setSelectedFilter(option);
    setOpenDropdown(false);
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/metricsstats?filter=${selectedFilter.toLowerCase()}`
        );
        const data = await response.json();

        if (data.success) {
          setMetrics(data);
        } else {
          console.error("Failed to fetch metrics:", data.message);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedFilter]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: metrics ? formatCurrency(metrics.totalRevenue || 0) : "৳0",
      growth: metrics?.revenueGrowth,
      icon: Wallet,
      gradient: "from-orange-500 to-amber-600",
      accentBg:
        "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      borderGlow: "hover:border-orange-500/50",
      subtitle: `Delivered sales in this ${selectedFilter.toLowerCase()}`,
      href: "/dashboard/orders",
    },
    {
      title: "Completed Orders",
      value: metrics ? formatNumber(metrics.totalOrders || 0) : "0",
      extra: metrics?.pendingOrders ? `${metrics.pendingOrders} pending` : null,
      growth: metrics?.orderGrowth,
      icon: ShoppingBag,
      gradient: "from-amber-500 to-orange-500",
      accentBg:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      borderGlow: "hover:border-amber-500/50",
      subtitle: `${metrics?.totalAllOrders || 0} total placed orders`,
      href: "/dashboard/orders",
    },
    {
      title: "Unique Customers",
      value: metrics ? formatNumber(metrics.totalCustomers || 0) : "0",
      growth: metrics?.customerGrowth,
      icon: Users,
      gradient: "from-indigo-500 to-blue-600",
      accentBg:
        "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      borderGlow: "hover:border-indigo-500/50",
      subtitle: "Verified buyers nationwide",
      href: "/dashboard/users",
    },
    {
      title: "Active Catalog",
      value: metrics ? formatNumber(metrics.totalProducts || 0) : "0",
      extra: "In Stock",
      icon: Boxes,
      gradient: "from-emerald-500 to-teal-600",
      accentBg:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      borderGlow: "hover:border-emerald-500/50",
      subtitle: "Live products ready for order",
      href: "/dashboard/products",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
          <h3 className="text-xs font-bold tracking-wide uppercase text-stone-500 dark:text-stone-400">
            Realtime Performance Overview
          </h3>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:border-orange-500/50 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
            <span>Range: {selectedFilter}</span>
          </button>

          {openDropdown && (
            <div className="absolute right-0 z-20 mt-1 w-28 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden py-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleFilterChange(opt)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedFilter === opt
                      ? "bg-orange-500 text-white font-bold"
                      : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`group relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 ${card.borderGlow}`}
            >
              {/* Ambient Glow */}
              <div
                className={`absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.06] group-hover:opacity-[0.14] blur-2xl transition-opacity duration-300 pointer-events-none`}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-sm transition-transform duration-300 group-hover:scale-105 ${card.accentBg}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {card.title}
                    </span>
                    <p className="text-[11px] text-stone-400 dark:text-stone-500 font-medium line-clamp-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-stone-400 group-hover:text-orange-500 transition-colors">
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                <div>
                  {loading ? (
                    <div className="h-8 w-28 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-lg" />
                  ) : (
                    <div className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                      {card.value}
                    </div>
                  )}
                </div>

                {card.growth && !loading && (
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      card.growth.trend === "up"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {card.growth.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{card.growth.percent}%</span>
                  </div>
                )}

                {card.extra && !card.growth && !loading && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                    {card.extra}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
