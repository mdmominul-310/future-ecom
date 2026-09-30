import { EcommerceMetrics } from "@/components/dashboard/ecommerce/EcommerceMetrics";
import EcommerceOverview from "@/components/dashboard/ecommerce/EcommerceOverview";
import MonthlySalesChart from "@/components/dashboard/ecommerce/MonthlySalesChart";
import MonthlyTarget from "@/components/dashboard/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/dashboard/ecommerce/RecentOrders";
import TopProducts from "@/components/dashboard/ecommerce/TopProducts";
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  ExternalLink,
  ShoppingBag,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Future com",
  description: "Executive control panel and real-time commerce intelligence for Future com.",
};

export default function EcommerceDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Launch Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 md:p-8 border border-stone-800 shadow-xl">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Future com • Live Commerce Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome to Your Store Control Hub
            </h1>
            <p className="text-stone-400 text-sm md:text-base leading-relaxed">
              Track live performance, manage customer orders, monitor revenue goals, and configure full store operations in real-time.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </Link>

            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm border border-stone-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span>Orders</span>
            </Link>

            <Link
              href="/dashboard/settings/general"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm border border-stone-700 transition-colors"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Settings</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 font-semibold text-sm border border-white/10 transition-colors"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-12 gap-5 md:gap-6">
        {/* Left Column: Metrics & Monthly Sales (7 cols) */}
        <div className="col-span-12 xl:col-span-7 space-y-6">
          <EcommerceMetrics />
          <MonthlySalesChart />
        </div>

        {/* Right Column: Monthly Target Radial (5 cols) */}
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        {/* Full-width Financial Overview */}
        <div className="col-span-12">
          <EcommerceOverview />
        </div>

        {/* Recent Orders (7 cols) */}
        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>

        {/* Top Products (5 cols) */}
        <div className="col-span-12 xl:col-span-5">
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
