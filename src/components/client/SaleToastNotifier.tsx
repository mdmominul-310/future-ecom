"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

type Product = {
  id: string | number;
  name: string;
  images: { url: string }[];
};

const ProductToast = ({ product }: { product: Product }) => (
  // REMOVED: `w-full` class to avoid conflict with sonner's container.
  <div className="flex items-center gap-3">
    <Image
      height={100}
      width={100}
      src={product.images[0].url}
      alt={product.name}
      className="w-14 h-14 rounded-lg object-cover bg-gray-200 flex-shrink-0"
    />
    <div className="flex flex-col items-start flex-1">
      <p className="text-sm font-medium text-gray-900">A new purchase!</p>
      {/* ADDED: `break-words` to handle long, unbreakable strings. */}
      <p className="text-sm text-gray-600 break-words">
        Someone just bought a{" "}
        <span className="font-semibold">{product.name}</span>.
      </p>
    </div>
  </div>
);

// The rest of your SalesToastNotifier component remains the same.

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function SalesToastNotifier() {
  const [products, setProducts] = useState<Product[]>([]);
  const timerInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }
        const data = await response.json();

        if (isMounted) {
          setProducts(data.products || data);
        }
      } catch (error) {
        console.error("Failed to fetch products for toast notifier:", error);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (products.length === 0 || timerInitialized.current) {
      return;
    }

    timerInitialized.current = true;
    let timerId: NodeJS.Timeout;

    const showRandomToast = () => {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      if (!randomProduct) return;

      toast(<ProductToast product={randomProduct} />, {
        duration: 3000,
        position: "bottom-left",
      });
    };

    const setNextToastTimer = () => {
      const randomDelay = getRandomInt(15000, 90000);
      timerId = setTimeout(() => {
        showRandomToast();
        setNextToastTimer();
      }, randomDelay);
    };

    setNextToastTimer();

    return () => {
      clearTimeout(timerId);
    };
  }, [products]);

  return null;
}
