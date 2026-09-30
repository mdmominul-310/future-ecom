"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag, Clock } from "lucide-react";

interface RecentOrder {
  _id: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  cartItems?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: any;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/recentorders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Failed to fetch recent orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "processing":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "cancelled":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default: // "Pending"
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-white text-base">
              Recent Store Orders
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Latest transactions placed on Future com
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline transition-colors"
        >
          <span>View All Orders</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <th className="pb-3 font-semibold">Items</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 font-medium">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-800" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
                        <div className="h-2.5 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="h-3.5 w-20 bg-stone-200 dark:bg-stone-800 rounded" />
                  </td>
                  <td className="py-3.5">
                    <div className="h-3.5 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="h-5 w-14 ml-auto bg-stone-200 dark:bg-stone-800 rounded-full" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-stone-400 text-xs">
                  No orders recorded yet. Once customers checkout, orders will appear here.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const firstItem = order.cartItems?.[0];
                const rawImg = firstItem?.image;
                const imgUrl =
                  typeof rawImg === "string"
                    ? rawImg
                    : rawImg?.url || "/placeholder.png";

                return (
                  <tr
                    key={order._id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={firstItem?.name || "Order Item"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px]">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="max-w-[160px] sm:max-w-[200px]">
                          <p className="font-semibold text-stone-800 dark:text-stone-200 text-xs truncate">
                            {firstItem?.name || "Order Package"}
                          </p>
                          <span className="text-[11px] text-stone-400">
                            {order.cartItems && order.cartItems.length > 1
                              ? `+${order.cartItems.length - 1} more items`
                              : `Qty: ${firstItem?.quantity || 1}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="text-xs">
                        <span className="font-medium text-stone-700 dark:text-stone-300 block truncate max-w-[120px]">
                          {order.customer?.name || "Guest Customer"}
                        </span>
                        <span className="text-[10px] text-stone-400 block truncate max-w-[120px]">
                          {order.customer?.phone || ""}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-stone-900 dark:text-white text-xs">
                        ৳{order.totalAmount?.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
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
