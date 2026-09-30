"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { User, Package, Loader2, FileDown, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InvoiceComponent from "@/components/orders/InvoiceComponent";
import InvoicePDF, { InvoiceData } from "@/components/orders/InvoicePDF";
import OrderStatusTracker from "@/components/client/OrderStatusTracker";

// --- Helper Components ---

const ProfileSidebar = () => (
  <Card>
    <CardContent className="p-4">
      <nav className="flex flex-row lg:flex-col gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <User size={18} />
          <span className="hidden sm:inline">My Profile</span>
        </Link>
        <Link
          href="/profile/orders"
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold bg-orange-100 text-orange-600 rounded-lg"
        >
          <Package size={18} />
          <span className="hidden sm:inline">My Orders</span>
        </Link>
      </nav>
    </CardContent>
  </Card>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
  </div>
);

const EmptyState = ({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) => (
  <div className="text-center py-20">
    <div className="mx-auto h-16 w-16 text-gray-400">{icon}</div>
    <h3 className="mt-2 text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
  </div>
);

// --- Main Page Component ---
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const ordersRes = await fetch("/api/my-orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleViewOrder = (invoiceData: InvoiceData) => {
    setSelectedInvoice(invoiceData);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- Sidebar --- */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* --- Main Content --- */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>
                  View your complete order history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-6">
                    {orders.length > 0 ? (
                      orders.map(({ order, invoice }) => (
                        <div
                          key={order._id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col gap-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-3">
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">
                                Order #
                                {order.orderNumber || order._id.slice(-6)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Placed on:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Total: ৳{order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(invoice)}
                            >
                              View Details
                            </Button>
                          </div>
                          <div className="w-full pt-4 border-t border-dashed">
                            <OrderStatusTracker currentStatus={order.status} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        icon={<ShoppingBag className="h-full w-full" />}
                        title="No Orders Yet"
                        message="You haven't placed any orders with us."
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Order Details (Invoice #{selectedInvoice?.invoiceNumber})
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedInvoice && <InvoiceComponent invoice={selectedInvoice} />}
          </div>
          <div className="flex-shrink-0 p-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            {isClient && selectedInvoice && (
              <PDFDownloadLink
                document={<InvoicePDF invoice={selectedInvoice} />}
                fileName={`invoice-${selectedInvoice.invoiceNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Generating..." : "Download Invoice"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
