"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Eye,
  FileText,
  Search,
  Trash,
  Loader2,
  Download,
  ChevronDown,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  MapPin,
  Phone,
  Package,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  X,
} from "lucide-react";
import Link from "next/link";
import { DeleteOrderDialog } from "@/components/dashboard/delete-order-dialog";
import DatePicker from "@/components/dashboard/form/date-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { StatusDropdown } from "@/components/dashboard/status-dropdown";
import { DynamicInvoiceDownloader } from "@/components/DynamicInvoiceDownloader";

// Imports for client-side PDF generation
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/components/orders/InvoicePDF";
import JSZip from "jszip";

// Type definitions
type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderType {
  _id: string;
  orderNumber?: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
    note?: string;
  };
  cartItems: any[];
  totalItems: number;
  totalAmount: number;
  subTotal: number;
  paymentMethod: string;
  deliveryCharge: number;
  status: OrderStatus;
  createdAt: string;
}

interface OrderWithInvoice {
  order: OrderType;
  invoice: any;
}

const STATUS_TABS: { value: string; label: string; dotColor: string }[] = [
  { value: "All", label: "All Orders", dotColor: "bg-orange-500" },
  { value: "Pending", label: "Pending", dotColor: "bg-amber-500" },
  { value: "Processing", label: "Processing", dotColor: "bg-orange-500" },
  { value: "Shipped", label: "Shipped", dotColor: "bg-sky-500" },
  { value: "Delivered", label: "Delivered", dotColor: "bg-emerald-500" },
  { value: "Cancelled", label: "Cancelled", dotColor: "bg-rose-500" },
];

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<OrderWithInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithInvoice | null>(
    null
  );
  const [totalOrders, setTotalOrders] = useState(0);

  // State for Bulk Actions
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Copied Order ID state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collapsible multi-product items in rows
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedOrderIds([]);
  }, [searchQuery, selectedStatus, startDate, endDate]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedStatus && selectedStatus !== "All")
          params.append("status", selectedStatus);
        if (startDate) params.append("startDate", startDate.toISOString());
        if (endDate) params.append("endDate", endDate.toISOString());
        params.append("page", currentPage.toString());
        params.append("limit", "10");

        const res = await fetch(`/api/orders?${params.toString()}`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setAllOrders(data.orders || []);
        setTotalOrders(data.totalOrders || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        toast.error("Error fetching orders", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [searchQuery, selectedStatus, startDate, endDate, currentPage]);

  // Dynamic KPI Stats from current page and total
  const stats = useMemo(() => {
    let pendingCount = 0;
    let deliveredCount = 0;
    let pageRevenue = 0;

    allOrders.forEach((item) => {
      const s = item.order.status?.toLowerCase() || "";
      if (s.includes("pending") || s.includes("process")) {
        pendingCount++;
      } else if (s.includes("deliver")) {
        deliveredCount++;
      }
      pageRevenue += Number(item.order.totalAmount || 0);
    });

    return {
      pendingCount,
      deliveredCount,
      pageRevenue,
    };
  }, [allOrders]);

  const handleSelectionChange = (orderId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedOrderIds(allOrders.map((item) => item.order._id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: OrderStatus) => {
    if (selectedOrderIds.length === 0) {
      toast.info("No orders selected.");
      return;
    }
    setIsBulkUpdating(true);
    try {
      const res = await fetch("/api/orders/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedOrderIds, status: newStatus }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(result.message);

      setAllOrders((prevOrders) =>
        prevOrders.map((item) =>
          selectedOrderIds.includes(item.order._id)
            ? { ...item, order: { ...item.order, status: newStatus } }
            : item
        )
      );
      setSelectedOrderIds([]);
    } catch (err: any) {
      toast.error("Bulk update failed", { description: err.message });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkInvoiceDownload = async () => {
    if (selectedOrderIds.length === 0) {
      toast.info("No orders selected for download.");
      return;
    }
    setIsBulkDownloading(true);
    toast.info(
      `Generating ${selectedOrderIds.length} invoices... Please wait.`
    );

    try {
      const zip = new JSZip();
      const selectedOrders = allOrders.filter((item) =>
        selectedOrderIds.includes(item.order._id)
      );

      for (const item of selectedOrders) {
        const { invoice } = item;
        const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
        zip.file(
          `Invoice-${invoice?.invoiceNumber || item.order._id}.pdf`,
          blob
        );
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoices.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success(
        `${selectedOrderIds.length} invoices downloaded successfully.`
      );
      setSelectedOrderIds([]);
    } catch (err: any) {
      console.error("Bulk download error:", err);
      toast.error("Download failed", {
        description: "An error occurred while generating the zip file.",
      });
    } finally {
      setIsBulkDownloading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).message);

      const updatedData = (await res.json()) as OrderWithInvoice;
      setAllOrders((prev) =>
        prev.map((item) => (item.order._id === orderId ? updatedData : item))
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error("Failed to update status", { description: err.message });
    }
  };

  const handleDeleteClick = (item: OrderWithInvoice) => {
    setSelectedOrder(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.order._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).message);

      toast.success(`Order ${selectedOrder.order._id} has been deleted.`);
      const newTotal = totalOrders - 1;
      setTotalOrders(newTotal);
      if (allOrders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setAllOrders(
          allOrders.filter((item) => item.order._id !== selectedOrder.order._id)
        );
      }
    } catch (err: any) {
      toast.error("Failed to delete order", { description: err.message });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const isAllSelectedOnPage =
    allOrders.length > 0 && selectedOrderIds.length === allOrders.length;

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedStatus !== "All" ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <div className="flex flex-col min-h-screen space-y-6 pb-12">
      {/* Top Header & Visual Aura */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 md:p-8 border border-stone-800 shadow-xl">
        {/* Glow lights */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Future com • Order Fulfillment Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Customer Orders & Invoicing
            </h1>
            <p className="text-stone-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Track customer purchases, process shipments, update real-time
              statuses, and generate instant tax-compliant invoices.
            </p>
          </div>

          {/* Quick Refresh & Clear */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="rounded-xl border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Filters
              </Button>
            )}
            <div className="px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-400" />
              <span>{totalOrders} Total Recorded</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Total Orders
              </p>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
                {totalOrders}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 font-medium">
                All-time store orders
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: Active Processing */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Active Queue
                </p>
              </div>
              <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {stats.pendingCount}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 font-medium">
                Pending / Processing on page
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Delivered */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Delivered
              </p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.deliveredCount}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 font-medium">
                Successfully delivered
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Page Order Value */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Page Volume
              </p>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
                ৳{stats.pageRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 font-medium">
                Sum of current page total
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-5 shadow-sm space-y-4">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25 scale-[1.02]"
                    : "bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-750"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isActive ? "bg-white" : tab.dotColor
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Inputs row: Search & Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            <Input
              id="search"
              type="search"
              placeholder="Search by Order ID, Customer Name, Phone number..."
              className="pl-10 pr-9 h-11 rounded-xl bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-750 text-sm font-medium focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Start Date */}
          <div className="md:col-span-3">
            <DatePicker
              id="start-date-picker"
              onChange={(dates) => setStartDate(dates[0] || null)}
            />
          </div>

          {/* End Date */}
          <div className="md:col-span-3">
            {startDate ? (
              <DatePicker
                id="end-date-picker"
                onChange={(dates) => setEndDate(dates[0] || null)}
              />
            ) : (
              <div className="h-11 px-3.5 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-center text-xs text-stone-400 font-medium bg-stone-50/50 dark:bg-stone-800/20">
                <Calendar className="w-3.5 h-3.5 mr-2 opacity-60" />
                Select start date first
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/10 border border-orange-500/30 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white mr-1.5 text-xs">
                {selectedOrderIds.length}
              </span>
              order(s) selected
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bulk Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isBulkUpdating}
                  className="rounded-xl border-orange-500/40 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-orange-500 font-bold"
                >
                  {isBulkUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-orange-500" />
                  ) : (
                    <Layers className="mr-2 h-4 w-4 text-orange-500" />
                  )}
                  <span>Change Status</span>
                  <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xl p-1.5">
                {STATUS_TABS.filter((t) => t.value !== "All").map((status) => (
                  <DropdownMenuItem
                    key={status.value}
                    className="rounded-lg text-xs font-semibold cursor-pointer hover:bg-orange-500/10 hover:text-orange-600"
                    onSelect={() =>
                      handleBulkStatusUpdate(status.value as OrderStatus)
                    }
                  >
                    Set to {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Invoice Download */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkInvoiceDownload}
              disabled={isBulkDownloading}
              className="rounded-xl border-orange-500/40 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-orange-500 font-bold"
            >
              {isBulkDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-orange-500" />
              ) : (
                <Download className="mr-2 h-4 w-4 text-orange-500" />
              )}
              <span>Download Invoices (ZIP)</span>
            </Button>

            {/* Deselect All */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOrderIds([])}
              className="rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-bold"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-24 space-y-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
              Fetching store orders...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
              <X className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-rose-600 dark:text-rose-400">
              Failed to load orders
            </p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">{error}</p>
            <Button
              onClick={resetFilters}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-stone-50/80 dark:bg-stone-950/70 border-b border-stone-200/80 dark:border-stone-800">
                    <TableHead className="w-[48px] text-center pl-4">
                      <Checkbox
                        checked={isAllSelectedOnPage}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all orders on this page"
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                    </TableHead>
                    <TableHead className="text-left font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 min-w-[240px]">
                      Product Items
                    </TableHead>
                    <TableHead className="text-left font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 min-w-[200px]">
                      Customer Info
                    </TableHead>
                    <TableHead className="text-left font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 min-w-[120px]">
                      Date & Time
                    </TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 w-[80px]">
                      Items
                    </TableHead>
                    <TableHead className="text-left font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 min-w-[120px]">
                      Total Price
                    </TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 min-w-[140px]">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 w-[170px] pr-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-20 text-stone-500"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                            <ShoppingBag className="w-7 h-7" />
                          </div>
                          <p className="text-base font-bold text-stone-800 dark:text-stone-200">
                            No orders found
                          </p>
                          <p className="text-xs text-stone-400 max-w-sm">
                            No orders match your selected search keywords, status, or date range.
                          </p>
                          {hasActiveFilters && (
                            <Button
                              onClick={resetFilters}
                              size="sm"
                              variant="outline"
                              className="rounded-xl mt-2 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                              Reset All Filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allOrders.map((item, idx) => {
                      const { order, invoice } = item;
                      const orderCode =
                        order.orderNumber ||
                        order._id.slice(-6).toUpperCase();
                      const isSelected = selectedOrderIds.includes(order._id);

                      // Customer initials
                      const customerInitial =
                        order.customer?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "CU";

                      const isExpanded = expandedOrders[order._id];
                      const visibleItems = isExpanded
                        ? order.cartItems
                        : order.cartItems.slice(0, 2);
                      const hasMoreItems = order.cartItems.length > 2;

                      return (
                        <TableRow
                          key={order._id}
                          className={`border-b border-stone-200/60 dark:border-stone-800/80 transition-colors duration-150 ${
                            isSelected
                              ? "bg-orange-500/[0.08] dark:bg-orange-500/[0.12]"
                              : idx % 2 === 0
                              ? "bg-white dark:bg-stone-900/70"
                              : "bg-stone-50/60 dark:bg-stone-900/30"
                          } hover:bg-orange-500/[0.03] dark:hover:bg-orange-500/[0.05]`}
                        >
                          {/* Checkbox */}
                          <TableCell className="align-top text-center pl-4 pt-5 pb-5">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(isChecked) =>
                                handleSelectionChange(order._id, !!isChecked)
                              }
                              aria-label={`Select order ${orderCode}`}
                              className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                          </TableCell>

                          {/* Product Items */}
                          <TableCell className="align-top py-5">
                            <div className="space-y-2.5 max-w-[280px]">
                              {/* Order Code pill with copy */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(order._id)}
                                  className="group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-[11px] font-extrabold text-stone-700 dark:text-stone-300 hover:bg-orange-500/10 hover:text-orange-600 transition-colors cursor-pointer border border-stone-200/60 dark:border-stone-700/60"
                                  title="Copy Order ID"
                                >
                                  <span>#{orderCode}</span>
                                  {copiedId === order._id ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-stone-400 group-hover:text-orange-500" />
                                  )}
                                </button>
                              </div>

                              {/* Products List */}
                              <div className="space-y-2">
                                {visibleItems.map((cartItem, cIdx) => (
                                  <div
                                    key={cartItem.productId || cIdx}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60"
                                  >
                                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex-shrink-0 relative">
                                      <Image
                                        src={cartItem.image?.url || "/placeholder.jpg"}
                                        alt={cartItem.name || "Product"}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                                        {cartItem.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {cartItem.variant?.name && (
                                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold truncate max-w-[120px]">
                                            {cartItem.variant.name}
                                          </span>
                                        )}
                                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
                                          Qty: {cartItem.quantity || 1}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {hasMoreItems && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(order._id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 hover:underline cursor-pointer pt-0.5"
                                  >
                                    <span>
                                      {isExpanded
                                        ? "Show less items"
                                        : `+${order.cartItems.length - 2} more items`}
                                    </span>
                                    <ChevronDown
                                      className={`w-3 h-3 transition-transform duration-200 ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Customer Info */}
                          <TableCell className="align-top py-5">
                            <div className="flex items-start gap-2.5 max-w-[220px]">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                                {customerInitial}
                              </div>
                              <div className="space-y-1 min-w-0">
                                <p className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                                  {order.customer?.name || "Anonymous Customer"}
                                </p>
                                {order.customer?.phone && (
                                  <a
                                    href={`tel:${order.customer.phone}`}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{order.customer.phone}</span>
                                  </a>
                                )}
                                {order.customer?.address && (
                                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed flex items-start gap-1">
                                    <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5 text-stone-400" />
                                    <span>{order.customer.address}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Date & Time */}
                          <TableCell className="align-top py-5">
                            <div className="space-y-1 text-left">
                              <p className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-stone-400" />
                                <span>{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
                              </p>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium pl-4">
                                {format(new Date(order.createdAt), "hh:mm a")}
                              </p>
                            </div>
                          </TableCell>

                          {/* Items Count */}
                          <TableCell className="align-top text-center py-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-extrabold text-xs border border-stone-200/50 dark:border-stone-700/50">
                              <Package className="w-3.5 h-3.5 text-orange-500" />
                              <span>{order.totalItems}</span>
                            </span>
                          </TableCell>

                          {/* Total Price */}
                          <TableCell className="align-top py-5">
                            <div className="space-y-1.5">
                              <div className="text-sm font-black text-stone-900 dark:text-stone-100 flex items-center gap-0.5">
                                <span className="text-orange-600 dark:text-orange-400 text-xs">৳</span>
                                <span>
                                  {order.totalAmount?.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase tracking-wider border border-stone-200/50 dark:border-stone-700/50">
                                <CreditCard className="w-2.5 h-2.5 text-stone-400" />
                                <span>{order.paymentMethod || "COD"}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Status Dropdown */}
                          <TableCell className="align-top text-center py-5">
                            <StatusDropdown
                              status={order.status}
                              onStatusChange={(status) =>
                                handleStatusChange(
                                  order._id,
                                  status as OrderStatus
                                )
                              }
                            />
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="align-top text-center py-5 pr-4">
                            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-sm">
                              {/* View Details */}
                              <Button
                                title="View Order Details"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-stone-600 dark:text-stone-300 hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
                                asChild
                              >
                                <Link href={`/dashboard/orders/${order._id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>

                              {/* Download Invoice PDF */}
                              {isClient && invoice && (
                                <DynamicInvoiceDownloader invoice={invoice} />
                              )}

                              {/* View Invoice Web */}
                              <Button
                                title="View Web Invoice"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-stone-600 dark:text-stone-300 hover:text-sky-500 hover:bg-sky-500/10 transition-colors"
                                asChild
                              >
                                <Link href={`/dashboard/invoices/${order._id}`}>
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">Invoice</span>
                                </Link>
                              </Button>

                              {/* Delete */}
                              <Button
                                title="Delete Order"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-stone-600 dark:text-stone-300 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Showing page <span className="font-bold text-stone-900 dark:text-white">{currentPage}</span> of{" "}
                  <span className="font-bold text-stone-900 dark:text-white">{totalPages}</span> ({totalOrders} total orders)
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-xl border-stone-200 dark:border-stone-800 hover:border-orange-500 text-xs font-bold"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                              : "text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="rounded-xl border-stone-200 dark:border-stone-800 hover:border-orange-500 text-xs font-bold"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedOrder && (
        <DeleteOrderDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          orderId={selectedOrder.order.orderNumber || selectedOrder.order._id}
        />
      )}
    </div>
  );
}
