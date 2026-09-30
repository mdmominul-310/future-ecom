"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

// import { ProductCard } from '../public/ProductCard';
import { ProductData } from "@/types/products";
import { ProductCard } from "../ProductCard";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isRelated, setIsRelated] = useState(true); // For heading

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/products?category=${categoryId}&page=1`);
        const data = await res.json();
        const filtered = (data.products || []).filter(
          (product: ProductData) => product._id !== currentProductId
        );

        if (filtered.length === 0) {
          // Fallback: fetch more products excluding current
          setIsRelated(false);
          const fallbackRes = await fetch(`/api/products?page=1`);
          const fallbackData = await fallbackRes.json();
          const fallbackFiltered = (fallbackData.products || []).filter(
            (product: ProductData) => product._id !== currentProductId
          );
          setProducts(fallbackFiltered.slice(0, 10));
        } else {
          setIsRelated(true);
          setProducts(filtered.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchRelated();
  }, [categoryId, currentProductId]);

  return (
    <div className="mt-8">
      {!loading && products.length > 0 && (
        <h2 className="text-xl font-semibold mb-4">
          {isRelated ? "Related Products" : "More Products"}
        </h2>
      )}

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <RelatedProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <Swiper
          freeMode={true}
          spaceBetween={16}
          modules={[FreeMode]}
          className="px-1"
          breakpoints={{
            0: {
              slidesPerView: 2.2,
            },
            640: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto">
              <ProductCard
                key={product._id}
                product={
                  {
                    ...product,
                    // Ensure all required properties exist for ProductCard
                    id: product._id, // For compatibility with existing code that might still use id
                  } as any
                }
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </div>
  );
}

function RelatedProductSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse rounded-md w-[40vw] sm:w-[22vw] lg:w-[18%] h-[220px] shrink-0" />
  );
}
