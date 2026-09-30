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
    // MODIFIED: Added phone and email to customer details
    phone: string;
    email: string;
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

const Invoice: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => {
  return (
    <div className="max-w-4xl mx-auto bg-black shadow-2xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-b-4xl text-black p-8 relative">
        <div className=" translate-y-8">
          <h1 className="text-xl mb-2 text-center">
            Your trust means the world to us.
          </h1>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Invoice</h1>
              <p className="text-gray-600 text-lg">{invoice.companyTagline}</p>
            </div>
            <div className="text-right">
              <Image
                src={"/maven.webp"}
                alt="Company Logo"
                width={300}
                height={300}
                className="w-auto h-24 "
              />
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className=" bg-orange-500 translate-y-16  text-black p-4 w-[70%] mx-auto  rounded-b-4xl rounded-tr-4xl round ">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium mb-1 opacity-90">
                Invoice To
              </h2>
              <h3 className="text-2xl font-bold mb-3">
                {invoice.customer.name}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{invoice.customer.address}</span>
                </div>
                {/* MODIFIED: Added Phone Number display */}
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 004.28 4.28l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  <span>{invoice.customer.phone}</span>
                </div>
                {/* MODIFIED: Added Email display */}
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  <span>{invoice.customer.email}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className=" rounded-lg p-4">
                <p className="text-xs opacity-90 mb-1">No. Invoice</p>
                <p className="font-bold text-lg">{invoice.invoiceNumber}</p>
                <p className="text-xs opacity-90 mt-2 mb-1">Date</p>
                <p className="font-medium">{invoice.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-8 pb-8 pt-20 ">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white text-black">
              <tr>
                <th className="text-left py-4 px-2 font-semibold w-16">SL.</th>
                <th className="text-left py-4 px-2 font-semibold">
                  ITEM DESCRIPTION
                </th>
                <th className="text-right py-4 px-2 font-semibold">PRICE</th>
                <th className="text-center py-4 px-2 font-semibold w-16">
                  QTY.
                </th>
                <th className="text-right py-4 px-2 font-semibold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 even:bg-gray-900"
                >
                  <td className="py-4 px-2 text-gray-200">{index + 1}</td>
                  <td className="py-4 px-2 text-gray-200">
                    {item.description}
                  </td>
                  <td className="py-4 px-2 text-right text-gray-400">
                    {Number(item.price).toFixed(2)}
                  </td>
                  <td className="py-4 px-2 text-center text-gray-400">
                    {item.qty}
                  </td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-200">
                    {Number(item.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Sub Total:</span>
                <span className="font-semibold text-gray-200">
                  {Number(invoice.subTotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Delivery Charge:</span>
                <span className="font-semibold text-gray-200">
                  {Number(invoice.DeliveryCharge).toFixed(2)}
                </span>
              </div>
              <div className="border-t-2 border-gray-700 pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-lg font-bold text-gray-200">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-orange-500">
                    BDT {Number(invoice.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-orange-400 p-3 rounded-lg mt-4">
                <div className="flex justify-between text-white">
                  <span className="font-bold text-lg">Due:</span>
                  <span className="font-bold text-lg">
                    BDT {Number(invoice.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">THANK YOU</h3>
            <p className="text-base">{invoice.footerMessage}</p>
          </div>
          <div className="b-br text-white bg-yellow-600  rounded-xl p-6 ">
            <h3 className="font-bold text-lg mb-4">PAYMENT INFO</h3>
            <div className="text-base">
              <p>{invoice.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="flex justify-end mt-12">
          <div className="text-center">
            <p className="text-sm text-gray-400">Abdul Aziz</p>
            <p className="text-sm text-gray-400 font-semibold">MANAGER</p>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-8 border-t border-orange-400 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2 text-sm text-gray-300">
            <p>{invoice.contact.phone}</p>
            <span>|</span>
            <p>{invoice.contact.address}</p>
            <span>|</span>
            <p>{invoice.contact.website}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
