"use client";
import React from "react";

const ReturnRefundPage = () => {
  return (
    <div className="container mx-auto px-4 py-5 md:py-8 lg:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Return & Refund Policy
        </h1>

        <div className="space-y-6 text-gray-700">
          <p>
            We want you to be completely satisfied with your purchase. If
            you&apos;re not, here&apos;s how our return and refund process
            works.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Return Eligibility
          </h2>
          <p>
            You can return most new, unopened items within{" "}
            <strong>[Number] days</strong> of delivery for a full refund. To be
            eligible for a return, your item must be unused and in the same
            condition that you received it. It must also be in the original
            packaging.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Items must be returned within <strong>[Number] days</strong> of
              the delivery date.
            </li>
            <li>
              The item must be in its original, unused, and resalable condition.
            </li>
            <li>
              All original packaging, tags, and accessories must be included.
            </li>
            <li>
              Certain items, such as [list non-returnable items, e.g.,
              personalized items, digital products], are not eligible for
              return.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            How to Initiate a Return
          </h2>
          <p>
            To initiate a return, please contact our customer service team at{" "}
            <a
              href="mailto:mavengadget1@gmail.com"
              className="text-orange-600 hover:underline"
            >
              mavengadget1@gmail.com
            </a>{" "}
            with your order number and the reason for your return. We will
            provide you with instructions on how to send your item back.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Refund Process
          </h2>
          <p>
            Once your return is received and inspected, we will send you an
            email to notify you that we have received your returned item. We
            will also notify you of the approval or rejection of your refund.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              If approved, your refund will be processed, and a credit will
              automatically be applied to your original method of payment within{" "}
              <strong>[Number] business days</strong>.
            </li>
            <li>
              Shipping costs are non-refundable. If you receive a refund, the
              cost of return shipping will be deducted from your refund.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Exchanges
          </h2>
          <p>
            We only replace items if they are defective or damaged. If you need
            to exchange it for the same item, send us an email at{" "}
            <a
              href="mailto:mavengadget1@gmail.com"
              className="text-orange-600 hover:underline"
            >
              mavengadget1@gmail.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
            Damaged or Incorrect Items
          </h2>
          <p>
            If you received a damaged or incorrect item, please contact us
            immediately upon receipt with photos of the item and packaging. We
            will work to resolve the issue promptly.
          </p>

          <p className="mt-8">
            For any further questions regarding returns and refunds, please{" "}
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

export default ReturnRefundPage;
