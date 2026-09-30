"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PackageX } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { ProductData } from "@/types/products";
import { addToCart } from "@/redux/slices/cartSlice";
import { trackAddToCart } from "@/lib/gtm";
import { QuickViewModal } from "./products/QuickViewModal";
import { FaCartPlus } from "react-icons/fa6";

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if the product has selectable variants
  const hasVariants = product.variants && product.variants.length > 0;

  // Calculate display prices, discount, and stock status based on variants
  let displayPrice: number;
  let originalPrice: number | null = null;
  let isOutOfStock: boolean;
  let discount: number = product.discount ?? 0;

  if (hasVariants) {
    const prices = product.variants.map((v) => v.price);
    displayPrice = Math.min(...prices);
    const cheapestVariant = product.variants.find(
      (v) => v.price === displayPrice
    );
    if (cheapestVariant && cheapestVariant.salePrice > cheapestVariant.price) {
      originalPrice = cheapestVariant.salePrice;
      discount = cheapestVariant.discount ?? 0;
    }
    isOutOfStock = product.variants.every((v) => v.stock === 0);
  } else {
    displayPrice = product.price;
    if (product.salePrice && product.salePrice > product.price) {
      originalPrice = product.salePrice;
    }
    isOutOfStock = product.stock === 0;
  }

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      salePrice: originalPrice || displayPrice,
      discount: discount,
      quantity: 1,
      stock: product.stock,
      image: product.images?.[0],
      category: product.category,
      variant: null,
      sku: product.sku,
    };

    dispatch(addToCart(cartItem as any));
    toast.success(`"${product.name}" added to cart!`);
    trackAddToCart({ ...product, price: displayPrice });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock.");
      return;
    }
    handleAddToCart();
    router.push("/cart/checkout");
  };

  // Setup Image URLs for hover effect
  const primaryImageUrl =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : product.images?.[0]?.url || "/placeholder.svg";

  const secondaryImageUrl =
    product.images && product.images.length > 1
      ? typeof product.images[1] === "string"
        ? product.images[1]
        : product.images[1]?.url
      : null;

  return (
    <>
      <div className="group relative border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-orange-300 dark:hover:border-orange-500/50 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
          <Link href={`/products/${product._id}`} aria-label={product.name}>
            {secondaryImageUrl ? (
              <>
                {/* Primary Image (fades out on hover) */}
                <Image
                  src={primaryImageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:scale-108"
                />
                {/* Secondary Image (fades in on hover) */}
                <Image
                  src={secondaryImageUrl}
                  alt={`${product.name} alternate view`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-108 absolute inset-0"
                />
              </>
            ) : (
              // Fallback to single image if no secondary image exists
              <Image
                src={primaryImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
            )}
          </Link>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 z-10">
              <PackageX className="h-9 w-9 mb-1 text-slate-300" />
              <span className="font-bold text-sm tracking-wide uppercase">Out of Stock</span>
            </div>
          )}

          {discount > 0 && !isOutOfStock && (
            <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-0.5">
              <span>-{discount}%</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col z-10 bg-white dark:bg-slate-900">
          <h3
            className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
            title={product.name}
          >
            <Link href={`/products/${product._id}`}>
              {product.name}
            </Link>
          </h3>

          <div className="mt-auto pt-1">
            {/* Price Display */}
            <div className="flex items-baseline gap-2 mb-3">
              <p className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {hasVariants && <span className="text-xs font-normal text-slate-500">From </span>}
                ৳{displayPrice.toFixed(0)}
              </p>
              {originalPrice && (
                <p className="text-xs text-slate-400 line-through">
                  ৳{originalPrice.toFixed(0)}
                </p>
              )}
            </div>

            {hasVariants ? (
              <Link
                href={`/products/${product._id}`}
                className="block w-full text-center bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                Select Options
              </Link>
            ) : (
              <div className="flex items-center gap-2 flex-nowrap">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold h-9.5 px-3 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:bg-slate-700 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  aria-label="Add to cart"
                  className="bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 text-xs font-bold h-9.5 px-3 rounded-xl transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 dark:disabled:border-slate-700 disabled:cursor-not-allowed"
                >
                  <FaCartPlus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
