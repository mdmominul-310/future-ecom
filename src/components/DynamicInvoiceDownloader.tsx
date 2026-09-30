"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import InvoicePDF from "@/components/orders/InvoicePDF"; // Make sure this path is correct
import { toast } from "sonner";

export const DynamicInvoiceDownloader = ({ invoice }: { invoice: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  // This function now handles the entire PDF generation and download process on click.
  const handleDownload = async () => {
    if (isLoading) return; // Prevent multiple clicks while generating

    setIsLoading(true);
    toast.info("Generating your invoice PDF...");

    try {
      // 1. Generate the PDF blob on demand
      const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

      // 2. Create a URL from the blob
      const url = URL.createObjectURL(blob);

      // 3. Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${
        invoice.invoiceNumber || invoice.order._id
      }.pdf`;
      document.body.appendChild(link);
      link.click();

      // 4. Clean up the temporary link and URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Download Failed", {
        description: "An error occurred while generating the PDF.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      title="Download Invoice"
      className="border border-gray-200 dark:border-gray-800"
      size="icon"
      disabled={isLoading}
      onClick={handleDownload}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
};
