"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

export default function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the CTA after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-lg md:hidden z-50 animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-base">$149.99</p>
          <p className="text-xs text-red-600">25% OFF</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Heart className="h-5 w-5" />
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
