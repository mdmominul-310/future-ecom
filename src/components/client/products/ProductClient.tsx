"use client";

import { Star, Heart, Plus, Minus, CheckCircle2, ShieldCheck, Truck, RotateCcw, Zap, Sparkles, Share2 } from "lucide-react";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

import ProductImageSlider from "./ProductImageSlider";
import { addToCart } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/userWishList";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";

const YouTubeEmbed = dynamic(() =>
  import("../youtube-embad").then((mod) => mod.YouTubeEmbed)
);
const AdditionalProductImageSlider = dynamic(
  () => import("./AditionalProductImageSlider")
);
const RelatedProducts = dynamic(() => import("./RelatedProducts"));

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function ProductClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toggleWishlist, isProductInWishlist } = useWishlist();
  const isInWishlist = isProductInWishlist(product?._id);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description");

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = e.target.value;
    const variant = product.variants.find((v: any) => v._id === variantId);
    setSelectedVariant(variant);
  };

  const displayProduct = selectedVariant || product;
  const unitSellingPrice = displayProduct.price;
  const unitOriginalPrice = displayProduct.salePrice;
  const finalPrice = unitSellingPrice * quantity;
  const originalPrice = unitOriginalPrice * quantity;
  const savingsAmount = originalPrice - finalPrice;
  const discountPercent =
    displayProduct.discount ??
    (unitOriginalPrice && unitSellingPrice
      ? Math.round((1 - unitSellingPrice / unitOriginalPrice) * 100)
      : 0);

  const [sanitizedDescription, setSanitizedDescription] = useState("");

  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product._id,
        name: product.name,
        price: displayProduct.price,
        category: product.category?.name,
        brand: product.brand?.name || "Future com",
        variant: selectedVariant?.name,
      });
    }
  }, [product, displayProduct, selectedVariant]);

  useEffect(() => {
    if (typeof window !== "undefined" && product.description) {
      setSanitizedDescription(DOMPurify.sanitize(product.description));
    }
  }, [product.description]);

  const addToCartHandler = () => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: displayProduct.price,
      salePrice: displayProduct.salePrice,
      discount: displayProduct.discount ?? 0,
      quantity: quantity,
      stock: displayProduct.stock,
      image: product.images[0],
      category: product.category,
      variant: selectedVariant,
      sku: displayProduct.sku || product.sku,
    };
    dispatch(addToCart(cartItem));
    trackAddToCart({
      _id: product._id,
      name: product.name,
      price: displayProduct.price,
      quantity: quantity,
      category: product.category?.name,
      brand: product.brand?.name,
      variant: selectedVariant?.name,
    });
    toast.success(`"${product.name}" added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  const buyNowHandler = () => {
    addToCartHandler();
    router.push("/cart/checkout");
  };

  const shareHandler = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  return (
    <div className="bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-gray-900 dark:to-gray-950 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 dark:text-gray-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug || "all"}`} className="hover:text-orange-600 transition-colors">
                {product.category.name || "Category"}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-stone-800 dark:text-stone-200 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-gray-800 shadow-xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Left Column: Image Gallery */}
          <motion.div className="lg:col-span-6" variants={sectionVariants}>
            <ProductImageSlider images={product.images} />
          </motion.div>

          {/* Right Column: Product Information & Purchase Panel */}
          <motion.div className="lg:col-span-6 space-y-6 flex flex-col justify-between" variants={sectionVariants}>
            <div className="space-y-4">
              
              {/* Category & Rating Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {product.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> {product.category.name}
                  </span>
                )}
                <button
                  onClick={shareHandler}
                  className="p-2 rounded-full bg-stone-100 dark:bg-gray-800 hover:bg-stone-200 text-stone-600 dark:text-gray-300 transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {product.rating || 4.8}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-stone-500 dark:text-gray-400">
                  ({product.reviewsCount || 24} Verified Customer Reviews)
                </span>
              </div>

              {/* Price Banner Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-gray-800/60 border border-stone-200/80 dark:border-gray-700/80 space-y-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400">
                    ৳{finalPrice.toFixed(0)}
                  </span>
                  {unitOriginalPrice && unitOriginalPrice > unitSellingPrice && (
                    <span className="text-base sm:text-lg text-stone-400 line-through font-medium">
                      ৳{originalPrice.toFixed(0)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-full shadow-sm">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>
                {savingsAmount > 0 && (
                  <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    🎉 You save ৳{savingsAmount.toFixed(0)} on this order!
                  </p>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                    Select Option / Variant:
                  </label>
                  <select
                    onChange={handleVariantChange}
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="">Choose an option...</option>
                    {product.variants.map((variant: any) => (
                      <option key={variant._id} value={variant._id}>
                        {variant.name} - ৳{variant.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2 pt-1">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${displayProduct.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${displayProduct.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}></span>
                </span>
                <span className={`text-xs sm:text-sm font-bold ${displayProduct.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"}`}>
                  {displayProduct.stock > 0 ? `In Stock (${displayProduct.stock} items available)` : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">Quantity:</span>
                  <div className="flex items-center border border-stone-300 dark:border-gray-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-gray-800 shadow-inner">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-12 h-10 text-center font-bold text-stone-900 dark:text-white bg-transparent outline-none"
                    />
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.min(displayProduct.stock || 99, prev + 1)
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Button
                    onClick={buyNowHandler}
                    disabled={displayProduct.stock === 0}
                    className="w-full sm:flex-1 h-13 text-base font-extrabold shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <Zap className="w-5 h-5 mr-2 fill-current" /> Buy It Now
                  </Button>
                  
                  <Button
                    onClick={addToCartHandler}
                    disabled={displayProduct.stock === 0}
                    variant="outline"
                    className="w-full sm:flex-1 h-13 text-base font-bold bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white border-none rounded-xl transition-all duration-300 shadow-md"
                  >
                    Add to Cart
                  </Button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-13 h-13 flex-shrink-0 flex items-center justify-center rounded-xl border border-stone-300 dark:border-gray-700 hover:bg-stone-100 dark:hover:bg-gray-800 transition-all shadow-sm ${
                      isInWishlist ? "bg-red-50 border-red-200 dark:bg-red-950/40" : "bg-white dark:bg-gray-800"
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isInWishlist ? "fill-red-500 text-red-500" : "text-stone-700 dark:text-gray-300"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Seals Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-200/80 dark:border-gray-800">
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-stone-50 dark:bg-gray-800/40">
                <Truck className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">Express Delivery</span>
                <span className="text-[9px] text-stone-500">Fast nationwide</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-stone-50 dark:bg-gray-800/40">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">100% Authentic</span>
                <span className="text-[9px] text-stone-500">Verified Quality</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-stone-50 dark:bg-gray-800/40">
                <RotateCcw className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">7 Days Return</span>
                <span className="text-[9px] text-stone-500">Hassle-free replacement</span>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Tabbed Specifications & Description Section */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-3xl border border-stone-200/80 dark:border-gray-800 shadow-lg p-6 sm:p-10 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          {/* Section Tabs */}
          <div className="flex border-b border-stone-200 dark:border-gray-800 mb-8 gap-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 text-base sm:text-lg font-extrabold relative transition-colors ${
                activeTab === "description"
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-stone-500 hover:text-stone-800 dark:text-gray-400"
              }`}
            >
              Product Overview
              {activeTab === "description" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />
              )}
            </button>
            {product.specifications && product.specifications.length > 0 && (
              <button
                onClick={() => setActiveTab("specifications")}
                className={`pb-4 text-base sm:text-lg font-extrabold relative transition-colors ${
                  activeTab === "specifications"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-stone-500 hover:text-stone-800 dark:text-gray-400"
                }`}
              >
                Specifications ({product.specifications.length})
                {activeTab === "specifications" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />
                )}
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "description" ? (
            <div className="prose max-w-none text-stone-700 dark:text-stone-300 leading-relaxed space-y-4">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">{product.name}</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizedDescription || product.description }} />
              
              {/* Key Features List if present */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="pt-6 border-t border-stone-100 dark:border-gray-800">
                  <h4 className="text-base font-bold text-stone-900 dark:text-white mb-3">Key Features:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.keyFeatures.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-stone-700 dark:text-stone-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-700 dark:text-stone-300">
                <tbody>
                  {product.specifications?.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-stone-50/70 dark:bg-gray-800/40" : "bg-white dark:bg-gray-900"}
                    >
                      <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white w-1/3 border-b border-stone-100 dark:border-gray-800">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 border-b border-stone-100 dark:border-gray-800">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Video Embed Section */}
        {product.videoUrl && (
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-3xl border border-stone-200/80 dark:border-gray-800 p-6 sm:p-10 mb-12 shadow-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-white mb-6">Product Video Demonstration</h3>
            <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <YouTubeEmbed url={product.videoUrl} title={`${product.name} video`} />
            </div>
          </motion.div>
        )}

        {/* Additional Images Showcase */}
        {product.additionalImages && product.additionalImages.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
            className="mb-12"
          >
            <AdditionalProductImageSlider images={product.additionalImages} />
          </motion.div>
        )}

        {/* Related Products Recommendations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <RelatedProducts
            categoryId={product.category?._id}
            currentProductId={product?._id}
          />
        </motion.div>
      </div>
    </div>
  );
}
