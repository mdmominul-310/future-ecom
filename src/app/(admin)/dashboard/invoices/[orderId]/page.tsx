"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Assuming these components are in the specified paths
import InvoiceComponent from "@/components/orders/InvoiceComponent";
import InvoicePDF from "@/components/orders/InvoicePDF";

// Define the type for the invoice data based on your API response
export interface InvoiceItem {
  sl: number;
  description: string;
  price: string;
  qty: number;
  total: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    address: string;
  };
  items: InvoiceItem[];
  subTotal: number;
  DeliveryCharge: number;
  totalAmount: string;
  advanceAmount: number;
  dueAmount: string;
  paymentMethod: string;
  contact: {
    phone: string;
    address: string;
    website: string;
  };
  footerMessage: string;
  companyTagline: string;
}

export default function InvoicePage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client-side
    setIsClient(true);

    if (!orderId) {
      setLoading(false);
      toast.error("Order ID is missing.");
      return;
    }

    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch invoice data");
        }
        const data = await res.json();
        setInvoice(data.invoice);
      } catch (error: any) {
        console.error(error);
        toast.error("Error Fetching Invoice", {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  //   const handlePrint = () => {
  //     window.print();
  //   };

  // A skeleton loader for a better user experience
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-[800px] w-full rounded-xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-semibold mb-2">Invoice Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The invoice you are looking for could not be loaded or does not exist.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              Invoice #{invoice.invoiceNumber}
            </h2>
            <p className="text-sm text-muted-foreground">
              Date: {new Date(invoice.date).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isClient && (
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} />}
              fileName={`invoice-${invoice?.customer?.name}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          {/* <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button> */}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden print-container">
        <CardContent className="p-0">
          {isClient ? (
            <InvoiceComponent invoice={invoice} />
          ) : (
            <p>Loading invoice preview...</p>
          )}
        </CardContent>
      </div>
    </main>
  );
}
