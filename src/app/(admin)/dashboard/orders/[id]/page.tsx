"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Download,
  FileText,
  Trash,
  Edit,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusDropdown } from "@/components/dashboard/status-dropdown";
import { DeleteOrderDialog } from "@/components/dashboard/delete-order-dialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/orders/InvoicePDF"; // Assuming this path is correct

// Type Definitions
type CartItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: { url: string };
  color?: { name: string };
  size?: { name: string };
  variant?: { name: string };
};

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
};

type Order = {
  _id: string;
  orderId: string;
  customer: Customer;
  cartItems: CartItem[];
  totalAmount: number;
  subTotal: number;
  deliveryCharge: number;
  paymentMethod: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // State for dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State for editable order data
  const [editableCustomer, setEditableCustomer] = useState<Customer | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error(
            (await res.json()).message || "Failed to fetch order"
          );
        }
        const data = await res.json();
        setOrder(data.order);
        setInvoice(data.invoice);
        setEditableCustomer(data.order.customer); // Initialize editable data
      } catch (error: any) {
        toast.error("Error Fetching Order", { description: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      const data = await res.json();
      setOrder(data.order);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error("Failed to update status", { description: err.message });
    }
  };

  const handleUpdateConfirm = async () => {
    if (!order || !editableCustomer) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: editableCustomer }),
      });
      if (!res.ok) throw new Error((await res.json()).message);

      const data = await res.json();
      setOrder(data.order);
      toast.success("Order details updated successfully!");
      setEditDialogOpen(false);
    } catch (err: any) {
      toast.error("Failed to update order", { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).message);

      toast.success(`Order #${order.orderId} has been deleted.`);
      router.push("/dashboard/orders");
    } catch (err: any) {
      toast.error("Failed to delete order", { description: err.message });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loading) return <OrderDetailsSkeleton />;
  if (!order)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The order you are looking for does not exist.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    );

  return (
    <>
      <main className="flex-1 p-4 md:p-6 space-y-6   dark:text-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/orders">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold dark:text-gray-100">
                Order #{order.orderId}
              </h2>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isClient && invoice && (
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} />}
                fileName={`Invoice-${order.orderId}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" size="sm" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? "Preparing..." : "Download Invoice"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/invoices/${order._id}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Invoice
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items Card */}
          <Card className="rounded-xl lg:col-span-2 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">
                Order Items ({order.cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                {order.cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center py-4 space-x-4"
                  >
                    <Image
                      src={item.image.url || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover bg-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold dark:text-gray-100">
                        {item.name}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground gap-x-2 flex-wrap">
                        {item.variant?.name && (
                          <span className="font-bold text-orange-600">
                            Variant: {item.variant.name}
                          </span>
                        )}
                        {item.size?.name && <span>Size: {item.size.name}</span>}
                        {item.color?.name && (
                          <span>Color: {item.color.name}</span>
                        )}
                      </div>
                      <p className="text-sm dark:text-gray-300">
                        {item.quantity} x BDT {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium dark:text-gray-100">
                      BDT {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardContent className="border-t dark:border-gray-700 pt-4">
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="dark:text-gray-200">
                      BDT {order.subTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Charge:
                    </span>
                    <span className="dark:text-gray-200">
                      BDT {order.deliveryCharge.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div className="flex justify-between font-semibold text-base">
                    <span className="dark:text-gray-100">Total:</span>
                    <span className="dark:text-gray-100">
                      BDT {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card className="rounded-xl lg:col-span-1 h-fit dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Status:</span>
                  <StatusDropdown
                    status={order.status}
                    onStatusChange={(status) =>
                      handleStatusChange(status as Order["status"])
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium dark:text-gray-200">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant={
                      order.paymentMethod === "Cash On Delivery"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {order.paymentMethod === "Cash On Delivery"
                      ? "Pending"
                      : "Paid"}
                  </Badge>
                </div>
              </div>
              <Separator className="dark:bg-gray-700" />
              <div className="space-y-2">
                <h3 className="font-semibold dark:text-gray-100">
                  Customer Details
                </h3>
                <p className="font-medium dark:text-gray-200">
                  {order.customer.name}
                </p>
                <p className="text-muted-foreground">
                  {order.customer.email || "No email provided"}
                </p>
                <p className="text-muted-foreground">{order.customer.phone}</p>
              </div>
              <Separator className="dark:bg-gray-700" />
              <div className="space-y-2">
                <h3 className="font-semibold dark:text-gray-100">
                  Shipping Address
                </h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {order.customer.address}
                </p>
              </div>
              {order.customer.note && (
                <>
                  <Separator className="dark:bg-gray-700" />
                  <div className="space-y-2">
                    <h3 className="font-semibold dark:text-gray-100">
                      Order Note
                    </h3>
                    <p className="text-muted-foreground italic">
                      &quot;{order.customer.note}&quot;
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      {order && (
        <DeleteOrderDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          orderId={order.orderId}
        />
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              Edit Order Details
            </DialogTitle>
          </DialogHeader>
          {editableCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right dark:text-gray-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editableCustomer.name}
                  onChange={(e) =>
                    setEditableCustomer({
                      ...editableCustomer,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="phone"
                  className="text-right dark:text-gray-300"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editableCustomer.phone}
                  onChange={(e) =>
                    setEditableCustomer({
                      ...editableCustomer,
                      phone: e.target.value,
                    })
                  }
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="email"
                  className="text-right dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  value={editableCustomer.email}
                  onChange={(e) =>
                    setEditableCustomer({
                      ...editableCustomer,
                      email: e.target.value,
                    })
                  }
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="address"
                  className="text-right dark:text-gray-300"
                >
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={editableCustomer.address}
                  onChange={(e) =>
                    setEditableCustomer({
                      ...editableCustomer,
                      address: e.target.value,
                    })
                  }
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="note" className="text-right dark:text-gray-300">
                  Note
                </Label>
                <Textarea
                  id="note"
                  value={editableCustomer.note}
                  onChange={(e) =>
                    setEditableCustomer({
                      ...editableCustomer,
                      note: e.target.value,
                    })
                  }
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleUpdateConfirm}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const OrderDetailsSkeleton = () => (
  <div className="p-4 md:p-6 space-y-6 animate-pulse">
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-12 w-1/3 rounded-lg" />
        <div className="space-y-4 rounded-xl border p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <div className="w-full max-w-sm space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-full mt-2" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Skeleton className="h-12 w-1/2 rounded-lg" />
        <div className="space-y-6 rounded-xl border p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-3 pt-4 border-t">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-3 pt-4 border-t">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
