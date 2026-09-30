import Image from "next/image";
import React from "react";

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
    phone?: string;
    email?: string;
  };
  contact: {
    phone: string;
    address: string;
    website: string;
  };
  items: InvoiceItem[];
  subTotal: string | number;
  DeliveryCharge: number;
  totalAmount: string;
  paymentMethod: string;
  footerMessage: string;
  companyTagline: string;
}

const InvoiceComponent: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
  return (
    <div className="bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
            <p className="text-sm text-gray-500">{invoice.companyTagline}</p>
          </div>
          <div className="text-right">
            <Image
              src="/logo.png" // Ensure this path is correct
              alt="Company Logo"
              width={150}
              height={50}
              className="h-14 w-auto"
            />
          </div>
        </header>

        {/* Customer and Invoice Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Billed To
            </p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {invoice.customer.name}
            </h2>
            <p className="text-gray-500">{invoice.customer.address}</p>
            {invoice.customer.phone && (
              <p className="text-gray-500">{invoice.customer.phone}</p>
            )}
            {invoice.customer.email && (
              <p className="text-gray-500">{invoice.customer.email}</p>
            )}
          </div>
          <div className="text-left md:text-right">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">
                Invoice Number
              </p>
              <p className="text-gray-800 font-medium">
                {invoice.invoiceNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Invoice Date
              </p>
              <p className="text-gray-800 font-medium">{invoice.date}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 text-sm text-gray-600 uppercase">
                <th className="p-4 font-semibold">#</th>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 text-center font-semibold">Qty</th>
                <th className="p-4 text-right font-semibold">Price</th>
                <th className="p-4 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {item.description}
                  </td>
                  <td className="p-4 text-center text-gray-600">{item.qty}</td>
                  <td className="p-4 text-right text-gray-600">
                    ৳{Number(item.price).toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-medium text-gray-800">
                    ৳{Number(item.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mt-8">
          <div className="w-full max-w-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{Number(invoice.subTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>৳{Number(invoice.DeliveryCharge).toFixed(2)}</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>৳{Number(invoice.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Payment Information
              </h3>
              <p className="text-gray-500">Method: {invoice.paymentMethod}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Thank You!</h3>
              <p className="text-gray-500">{invoice.footerMessage}</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              {invoice.contact.address} | {invoice.contact.phone} |{" "}
              {invoice.contact.website}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InvoiceComponent;
