"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const OrdersFAQsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our products, add the items you wish to purchase to your cart, and proceed to checkout. Follow the on-screen instructions to provide your shipping details and payment information.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods, including credit/debit cards (Visa, MasterCard, American Express), mobile banking (e.g., bKash, Nagad), and cash on delivery for eligible orders.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website where you can monitor your delivery status.",
    },
    {
      question: "Can I change or cancel my order after it has been placed?",
      answer:
        "If you need to change or cancel your order, please contact our customer service immediately. We can only make changes or cancel orders that have not yet been processed for shipping.",
    },
    {
      question: "What if my order is delayed?",
      answer:
        "While we strive for timely deliveries, unforeseen circumstances can cause delays. If your order is significantly delayed, please check your tracking information and then contact us for assistance.",
    },
    {
      question: "What is your return policy for orders?",
      answer:
        "Please refer to our dedicated Return & Refund Policy page for detailed information on how to return an item and our refund process.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we offer international shipping to select countries. Shipping costs and delivery times for international orders vary by destination and will be calculated at checkout.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-5 md:py-8 lg:py-10">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Frequently Asked Questions (FAQs) - Orders
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition duration-300"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-700">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-orange-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-white border-t border-gray-200 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-gray-700">
          Didn&apos;t find what you were looking for? Please{" "}
          <a href="/contact" className="text-orange-600 hover:underline">
            contact us
          </a>{" "}
          directly.
        </p>
      </div>
    </div>
  );
};

export default OrdersFAQsPage;
