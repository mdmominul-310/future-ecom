"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
}

export default function PreviewModal({
  isOpen,
  onClose,
  formData,
}: PreviewModalProps) {
  const [iframeHeight, setIframeHeight] = useState("600px");

  // Adjust iframe height based on window size
  useEffect(() => {
    const handleResize = () => {
      setIframeHeight(`${window.innerHeight * 0.7}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Landing Page Preview</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            This is how your landing page will look when published
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg overflow-hidden mt-4">
          <div className="bg-gray-100 border-b p-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-white rounded px-2 py-1 text-xs text-gray-500 flex-grow mx-16">
              yoursite.com/{formData.pageUrl || "product-page"}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </Button>
            </div>
          </div>

          <div style={{ height: iframeHeight, overflow: "auto" }}>
            <PreviewContent formData={formData} />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700">
            Publish Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PreviewContent({ formData }: { formData: any }) {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-teal-50 to-white py-12 md:py-24">
        <div className="container px-4 mx-auto lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full inline-block text-sm font-medium">
              Limited Time Offer
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {formData.heroHeading || "Premium Wireless Headphones"}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FBBF24"
                    stroke="#FBBF24"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">(128 reviews)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${formData.salePrice || "149.99"}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ${formData.regularPrice || "199.99"}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                {formData.regularPrice && formData.salePrice
                  ? `${Math.round(
                      (1 -
                        Number(formData.salePrice) /
                          Number(formData.regularPrice)) *
                        100
                    )}% OFF`
                  : "25% OFF"}
              </span>
            </div>
            <p className="text-lg text-gray-600 max-w-md">
              {formData.heroDescription ||
                "Experience crystal-clear sound and unmatched comfort with our premium wireless headphones. Perfect for music lovers, gamers, and professionals alike."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors">
                {formData.ctaPrimary || "Buy Now"}
              </button>
              <button className="px-6 py-3 border border-teal-600 text-teal-600 rounded-md font-medium hover:bg-teal-50 transition-colors">
                {formData.ctaSecondary || "Learn More"}
              </button>
            </div>
            {formData.limitedStock && (
              <p className="text-sm font-medium text-red-600">
                Only 5 left in stock - order soon!
              </p>
            )}
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2 relative">
            <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center gap-3 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-gray-600">On all orders over $50</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <h3 className="font-medium">Secure Checkout</h3>
                <p className="text-sm text-gray-600">100% protected payments</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              <div>
                <h3 className="font-medium">30-Day Returns</h3>
                <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="border rounded-lg shadow-md p-6 text-center"
              >
                <div className="text-4xl mb-4">
                  {formData[`featureIcon${index}`]
                    ? formData[`featureIcon${index}`]
                    : "⚡"}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {formData[`featureTitle${index}`] || `Feature ${index}`}
                </h3>
                <p className="text-gray-600">
                  {formData[`featureDescription${index}`] ||
                    "This is a sample feature description. Replace with your actual feature details."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Preview */}
      {formData.youtubeUrl && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6">
              {formData.videoTitle || "See It In Action"}
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              {formData.videoDescription ||
                "Watch our product video to experience the amazing features."}
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            {formData.galleryTitle || "Product Gallery"}
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Explore our product from every angle
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-xl mb-4 bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="relative h-16 rounded-md overflow-hidden bg-gray-100"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience Premium Quality?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and elevate your experience
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-teal-600 rounded-md font-medium hover:bg-gray-100 transition-colors">
              {formData.ctaPrimary || "Buy Now"}
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-teal-700 transition-colors">
              {formData.ctaSecondary || "Learn More"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
