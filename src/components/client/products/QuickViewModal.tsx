"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { Heart, Plus, Minus, CheckCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductImageSlider from "./ProductImageSlider";
import { addToCart } from "@/redux/slices/cartSlice";
import { useWishlist } from "@/hooks/userWishList";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";

// Define or import the CartItem type to ensure type safety
interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  category: any;
  quantity: number;
  stock: number;
  image: any;
  variant: any;
  sku: string;
}

export function QuickViewModal({
  product,
  isOpen,
  onOpenChange,
}: {
  product: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [sanitizedDescription, setSanitizedDescription] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const { toggleWishlist, isProductInWishlist } = useWishlist();
  const isInWishlist = isProductInWishlist(product?._id);

  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(null);
    if (typeof window !== "undefined" && product.description) {
      setSanitizedDescription(DOMPurify.sanitize(product.description));
    }
    if (isOpen && product) {
      trackViewContent({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category?.name,
        brand: product.brand?.name || "Future com",
      });
    }
  }, [product, isOpen]);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = e.target.value;
    const variant = product.variants.find((v: any) => v._id === variantId);
    setSelectedVariant(variant);
  };

  const displayProduct = selectedVariant || product;
  const unitSellingPrice = displayProduct.price;
  const unitOriginalPrice = displayProduct.salePrice;
  const finalPrice = unitSellingPrice * quantity;

  const addToCartHandler = () => {
    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: displayProduct.price,
      discount: displayProduct.discount ?? 0,
      category: product.category,
      quantity: quantity,
      stock: displayProduct.stock,
      image: displayProduct.images?.[0] || product.images?.[0],
      variant: selectedVariant,
      sku: displayProduct.sku || product.sku,
    };
    dispatch(addToCart(cartItem));
    toast.success(`${product.name} added to cart!`);

    // Unified Tracking: add_to_cart (GTM, Meta Pixel, GA4)
    trackAddToCart({
      _id: product._id,
      name: product.name,
      price: displayProduct.price,
      quantity: quantity,
      category: product.category?.name,
      brand: product.brand?.name || "Future com",
      variant: selectedVariant?.name,
    });

    onOpenChange(false);
  };

  const buyNowHandler = () => {
    addToCartHandler();
    router.push("/cart/checkout");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 h-[40vh]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProductImageSlider
                images={displayProduct.images || product.images}
              />

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    ৳{finalPrice.toFixed(0)}
                  </span>
                  {unitOriginalPrice &&
                    unitOriginalPrice > unitSellingPrice && (
                      <span className="text-gray-500 line-through">
                        ৳{(unitOriginalPrice * quantity).toFixed(0)}
                      </span>
                    )}
                </div>

                {product.shortDescription && (
                  <p className="text-gray-600 text-sm">
                    {product.shortDescription}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`${
                      displayProduct.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    } font-semibold flex items-center text-sm`}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    {displayProduct.stock > 0
                      ? `${displayProduct.stock} in stock`
                      : "Out of Stock"}
                  </span>
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Variant
                    </label>
                    <select
                      onChange={handleVariantChange}
                      className="mt-1 block w-full p-2 border rounded-md"
                    >
                      <option value="">Select a variant</option>
                      {product.variants.map((variant: any) => (
                        <option key={variant._id} value={variant._id}>
                          {variant.name} (৳{variant.price})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center shadow-sm rounded-md">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                      className="w-10 h-10 rounded-r-none"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-12 h-10 text-center border-y"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setQuantity((p) =>
                          Math.min(displayProduct.stock, p + 1)
                        )
                      }
                      className="w-10 h-10 rounded-l-none"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => toggleWishlist(product)}
                    variant="outline"
                    size="icon"
                    className="w-10 h-10"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isInWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-black"
                      }`}
                    />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={buyNowHandler}
                    disabled={displayProduct.stock === 0}
                    className="w-full font-bold shadow-md bg-black hover:bg-gray-800 text-white h-11"
                  >
                    Buy It Now
                  </Button>
                  <Button
                    onClick={addToCartHandler}
                    disabled={displayProduct.stock === 0}
                    variant="outline"
                    className="w-full font-bold shadow-md h-11"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description" className="mt-8">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />
              </TabsContent>
              <TabsContent value="specifications" className="mt-4">
                <dl className="divide-y divide-gray-200">
                  {product.specifications?.map((item: any, index: any) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 px-1 py-3 text-sm"
                    >
                      <dt className="text-gray-600 font-medium">{item.name}</dt>
                      <dd className="col-span-2 text-gray-800 whitespace-pre-wrap">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
