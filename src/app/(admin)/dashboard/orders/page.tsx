"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import Link from "next/link";
import { DeleteOrderDialog } from "@/components/dashboard/delete-order-dialog";
import Select from "@/components/dashboard/form/Select";
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

const statusOptions = [
  { value: "All", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
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
        setAllOrders(data.orders);
        setTotalOrders(data.totalOrders);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        toast.error("Error fetching orders", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [searchQuery, selectedStatus, startDate, endDate, currentPage]);

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
          `Invoice-${invoice.invoiceNumber || item.order._id}.pdf`,
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
      console.log("Bulk download error:", err);
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

  const isAllSelectedOnPage =
    allOrders.length > 0 && selectedOrderIds.length === allOrders.length;

  return (
    <div className="flex flex-col min-h-screen dark:text-gray-100">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <h2 className="text-2xl font-bold">All Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
          <div className="relative">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-400"
            >
              Search
            </label>
            <Search className="absolute left-2.5 top-[calc(50%+4px)] h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by ID, Name, Phone..."
              className="pl-8 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-400"
            >
              Status: {selectedStatus}
            </label>
            <Select
              options={statusOptions}
              defaultValue={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              placeholder="Filter by Status"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">
              Start Date: {startDate ? format(startDate, "PP") : "None"}
            </label>
            <DatePicker
              id="start-date-picker"
              onChange={(dates) => setStartDate(dates[0] || null)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-400">
              End Date: {endDate ? format(endDate, "PP") : "None"}
            </label>
            {startDate ? (
              <DatePicker
                id="end-date-picker"
                onChange={(dates) => setEndDate(dates[0] || null)}
              />
            ) : (
              <div className="text-gray-400 italic text-sm">
                Set start date first
              </div>
            )}
          </div>
        </div>

        {selectedOrderIds.length > 0 && (
          <div className="flex items-center gap-4 p-2 rounded-md bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedOrderIds.length} order(s) selected.
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isBulkUpdating}>
                  {isBulkUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Update Status"
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOptions
                  .filter((opt) => opt.value !== "All")
                  .map((status) => (
                    <DropdownMenuItem
                      key={status.value}
                      onSelect={() =>
                        handleBulkStatusUpdate(status.value as OrderStatus)
                      }
                    >
                      Set to {status.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={handleBulkInvoiceDownload}
              disabled={isBulkDownloading}
            >
              {isBulkDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Invoices
            </Button>
          </div>
        )}

        <Card className="bg-white dark:border-gray-800 border-gray-200 dark:bg-white/[0.03]">
          <CardHeader>
            <CardTitle>{totalOrders} Orders found</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">
                  Loading Orders...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <p>Error loading orders: {error}</p>
              </div>
            ) : (
              <>
                <div className="rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200 dark:border-gray-800">
                        <TableHead className="w-[50px] text-center">
                          <Checkbox
                            checked={isAllSelectedOnPage}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all orders on this page"
                          />
                        </TableHead>
                        <TableHead className="max-w-48 text-center">
                          Product
                        </TableHead>
                        <TableHead className="max-w-48 text-center">
                          Customer
                        </TableHead>
                        <TableHead className="text-center">Date</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="w-[150px] text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOrders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No orders found matching your criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        allOrders.map((item) => {
                          const { order, invoice } = item;
                          return (
                            <TableRow
                              key={order._id}
                              className="border-b border-gray-200 dark:border-gray-800 odd:bg-gray-50 even:bg-white dark:odd:bg-gray-900 dark:even:bg-gray-800"
                            >
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={selectedOrderIds.includes(order._id)}
                                  onCheckedChange={(isChecked) =>
                                    handleSelectionChange(
                                      order._id,
                                      !!isChecked
                                    )
                                  }
                                  aria-label={`Select order ${
                                    order.orderNumber || order._id
                                  }`}
                                />
                              </TableCell>
                              <TableCell className="font-medium text-xs max-w-48 overflow-auto">
                                {order.cartItems.map((cartItem) => (
                                  <div
                                    key={cartItem.productId}
                                    className="flex items-center border-b last:border-b-0 py-2 gap-3"
                                  >
                                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md flex-shrink-0">
                                      <Image
                                        src={cartItem.image.url}
                                        alt={cartItem.name}
                                        width={50}
                                        height={50}
                                        className="h-full w-full object-contain"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium text-left text-wrap text-gray-800 text-theme-sm dark:text-white/90">
                                        {cartItem.name}
                                      </p>
                                      {cartItem.variant?.name && (
                                        <p className="text-[8px] text-left text-orange-600 font-semibold">
                                          {cartItem.variant.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </TableCell>
                              <TableCell className="max-w-48 h-full">
                                <div className="flex flex-col items-center justify-center h-full space-y-1 text-center">
                                  <p>{order.customer.name}</p>
                                  <a
                                    href={`tel:${order.customer.phone}`}
                                    className="text-blue-600 underline"
                                  >
                                    {order.customer.phone}
                                  </a>
                                  <p className="text-wrap">
                                    {order.customer.address}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {format(new Date(order.createdAt), "PP")}
                              </TableCell>
                              <TableCell className="text-center">
                                {order.totalItems}
                              </TableCell>
                              <TableCell>
                                {order.totalAmount?.toFixed(2)}
                              </TableCell>
                              <TableCell>
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
                              <TableCell>
                                <div className="flex space-x-2 justify-center">
                                  <Button
                                    title="View Order"
                                    className="border border-gray-200 dark:border-gray-800"
                                    size="icon"
                                    asChild
                                  >
                                    <Link
                                      href={`/dashboard/orders/${order._id}`}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Link>
                                  </Button>
                                  {isClient && invoice && (
                                    <DynamicInvoiceDownloader
                                      invoice={invoice}
                                    />
                                  )}
                                  <Button
                                    title="View Invoice"
                                    className="border border-gray-200 dark:border-gray-800"
                                    size="icon"
                                    asChild
                                  >
                                    <Link
                                      href={`/dashboard/invoices/${order._id}`}
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span className="sr-only">Invoice</span>
                                    </Link>
                                  </Button>
                                  <Button
                                    title="Delete Order"
                                    className="border border-gray-200 dark:border-gray-800 group hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteClick(item)}
                                  >
                                    <Trash className="h-4 w-4 group-hover:text-red-500" />
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
                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      {selectedOrder && (
        <DeleteOrderDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          orderId={selectedOrder.order._id}
        />
      )}
    </div>
  );
}
