"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Boxes,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Scale,
  Ban,
} from "lucide-react";

const filterOptions = ["Day", "Week", "Month"];

interface MetricItem {
  value: number;
  percentChange: number;
  trend: "up" | "down" | "neutral";
}

interface OverviewData {
  revenue: MetricItem;
  cost: MetricItem;
  profit: MetricItem;
  cancelledOrders: MetricItem;
}

const EcommerceOverview = () => {
  const [selectedFilter, setSelectedFilter] = useState("Month");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OverviewData | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const period = selectedFilter.toLowerCase();
        const response = await fetch(
          `/api/dashboard/overview?period=${period}`
        );
        const result = await response.json();

        if (result.success) {
          setData(result.metrics);
        } else {
          console.error("Failed to fetch overview data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [selectedFilter]);

  const handleFilterChange = (option: string) => {
    setSelectedFilter(option);
    setOpenDropdownIndex(null);
  };

  const items = [
    {
      title: "Gross Sales Revenue",
      value: loading ? null : formatCurrency(data?.revenue?.value || 0),
      icon: Receipt,
      accentBg:
        "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      badge: {
        percentChange: data?.revenue?.percentChange || 0,
        trend: data?.revenue?.trend || "neutral",
      },
      invertBadge: false,
    },
    {
      title: "Cost of Goods Sold",
      value: loading ? null : formatCurrency(data?.cost?.value || 0),
      icon: Scale,
      accentBg:
        "bg-stone-500/10 text-stone-600 dark:bg-stone-500/20 dark:text-stone-400",
      badge: {
        percentChange: data?.cost?.percentChange || 0,
        trend: data?.cost?.trend || "neutral",
      },
      invertBadge: true,
    },
    {
      title: "Calculated Net Profit",
      value: loading ? null : formatCurrency(data?.profit?.value || 0),
      icon: LineChart,
      accentBg:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      badge: {
        percentChange: data?.profit?.percentChange || 0,
        trend: data?.profit?.trend || "neutral",
      },
      invertBadge: false,
    },
    {
      title: "Cancelled / Void Orders",
      value: loading
        ? null
        : formatNumber(data?.cancelledOrders?.value || 0),
      icon: Ban,
      accentBg:
        "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      badge: {
        percentChange: data?.cancelledOrders?.percentChange || 0,
        trend: data?.cancelledOrders?.trend || "neutral",
      },
      invertBadge: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Financial Health & P&L Indicators
          </h3>
        </div>

        {/* Global Period Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700/60">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedFilter(opt)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedFilter === opt
                  ? "bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isPositive = item.invertBadge
            ? item.badge.trend === "down"
            : item.badge.trend === "up";

          return (
            <div
              key={index}
              className="relative rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-sm ${item.accentBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {!loading && item.badge && item.badge.percentChange !== 0 && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                      isPositive
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(item.badge.percentChange).toFixed(1)}%</span>
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block truncate">
                  {item.title}
                </span>
                {loading ? (
                  <div className="mt-2 h-7 w-24 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-lg" />
                ) : (
                  <h4 className="mt-1 font-extrabold text-stone-900 dark:text-white text-xl md:text-2xl tracking-tight">
                    {item.value}
                  </h4>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EcommerceOverview;
