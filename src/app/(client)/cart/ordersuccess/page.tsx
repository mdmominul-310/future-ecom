"use client";
import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import Link from "next/link";
import successAnimation from "@/animations/congratulation-2.json";

// Import the new components
// import Invoice from "@/components/orders/Invoice";
import InvoicePDF from "@/components/orders/InvoicePDF";
import InvoiceComponent from "@/components/orders/InvoiceComponent";

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Updated InvoiceData interface
export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    address: string;
    phone?: string; // Optional field
    email?: string; // Optional field
  };
  contact: {
    phone: string;
    address: string;
    website: string;
  };
  items: any[]; // Adjust type as needed
  subTotal: string | number;
  DeliveryCharge: number;
  totalAmount: string;
  paymentMethod: string;
  footerMessage: string;
  companyTagline: string;
}

export default function SuccessPage() {
  const [isClient, setIsClient] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    // IMPORTANT: Ensure the data you save to "latestInvoice" in localStorage
    // now includes the new optional 'phone' and 'email' fields for the customer.
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("latestInvoice");
      if (stored && stored !== "undefined" && stored !== "null") {
        try {
          const parsed: InvoiceData = JSON.parse(stored);
          setInvoice(parsed);
        } catch (error) {
          console.error("Failed to parse invoice data:", error);
        }
      } else {
        console.warn("No valid invoice data found in localStorage.");
      }
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!invoice) {
    return <p className="text-center py-8">Loading invoice...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Congratulations!
      </h1>
      <p className="text-center font-semibold mb-5">
        আপনার অর্ডারটি আমাদের কাছে সফলভাবে পৌঁছেছে, কিছুক্ষনের মধ্যে আমাদের একজন
        প্রতিনিধি আপনার নাম্বারে কল করবেন
      </p>

      <div className="my-5">
        {isClient && (
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} />}
            fileName={`invoice-${invoice.invoiceNumber}.pdf`}
            className="inline-block mx-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : "Download Invoice"
            }
          </PDFDownloadLink>
        )}
        <Link href={"/"}>
          <button className="inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors mx-2">
            Go to Home
          </button>
        </Link>
      </div>

      {isClient && (
        <div className="fixed z-20 top-50 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="h-96 w-96"
          />
        </div>
      )}

      {isClient && (
        <div className="fixed z-10 top-50 right-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="h-96 w-96"
          />
        </div>
      )}
      {isClient && (
        <div className="fixed z-30 top-50 left-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="h-96 w-96"
          />
        </div>
      )}

      {/* Replaced InvoiceComponent with the new Invoice component */}
      <div className="w-full max-w-4xl z-10">
        <InvoiceComponent invoice={invoice} />
      </div>
    </div>
  );
}
