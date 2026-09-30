"use client";
import React from "react";

const ShippingPage = () => {
  return (
    <div className="container mx-auto px-4 py-5 md:py-8 lg:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Shipping Policy
        </h1>

        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to our Shipping Policy page. Here you&apos;ll find
            information about our shipping methods, delivery times, and costs.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Shipping Methods and Delivery Times
          </h2>
          <p>
            We offer various shipping methods to cater to your needs. Delivery
            times may vary depending on your location and the shipping method
            chosen.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Standard Shipping:</strong> Typically delivered within 3-7
              business days after processing.
            </li>
            <li>
              <strong>Express Shipping:</strong> Available for faster delivery,
              usually within 1-3 business days after processing.
            </li>
            <li>
              <strong>International Shipping:</strong> Delivery times vary
              widely based on destination, typically 7-21 business days. Customs
              processing may add additional time.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Shipping Costs
          </h2>
          <p>
            Shipping costs are calculated based on the weight of your order, the
            shipping method selected, and your delivery address. You can view
            the exact shipping cost during checkout before finalizing your
            order.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Domestic Shipping:</strong> Free shipping may be offered
              for orders above a certain value.
            </li>
            <li>
              <strong>International Shipping:</strong> Additional customs duties
              and taxes may apply, which are the responsibility of the
              recipient.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Order Processing
          </h2>
          <p>
            Orders are typically processed within 1-2 business days. You will
            receive a confirmation email with tracking information once your
            order has shipped.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Tracking Your Order
          </h2>
          <p>
            Once your order is shipped, we will send you a tracking number via
            email. You can use this number to track the status of your delivery
            on the courier&apos;s website.
          </p>

          <p className="mt-8">
            If you have any questions about our shipping policy, please
            don&apos;t hesitate to{" "}
            <a href="/contact" className="text-orange-600 hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
