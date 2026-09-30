"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Minus } from "lucide-react";
import Image from "next/image";

// --- Updated Product interface to include all options ---
interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  images: { url: string; public_id: string }[];
  price: number;
  salePrice?: number;
  stock: number;
  discount?: number;
  variants: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    stock: number;
    discount?: number;
  }[];
  colors: {
    _id: string;
    name: string;
    value: string;
  }[];
  sizes: {
    _id: string;
    name: string;
    value: string;
  }[];
}

interface Props {
  product: Product;
  phoneNumber: string;
}

export default function EmbeddedCheckoutForm({ product, phoneNumber }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const displayProduct = selectedVariant || product;
  const finalPrice = (displayProduct.price || 0) * quantity;
  const shippingCharge = 100; // Example shipping price
  const totalAmount = finalPrice + shippingCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error("Please fill in your Name, Address, and Phone Number.");
      return;
    }
    setIsSubmitting(true);
    toast.info("Processing your order...");

    const orderData = {
      customer: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        note: formData.notes,
      },
      cartItems: [
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          sku: displayProduct.sku || product.sku,
          price: displayProduct.price,
          salePrice: displayProduct.salePrice,
          discount: displayProduct.discount,
          quantity: quantity,
          stock: displayProduct.stock,
          image: product.images[0],
          variant: selectedVariant
            ? {
                _id: selectedVariant._id,
                name: selectedVariant.name,
                price: selectedVariant.price,
                salePrice: selectedVariant.salePrice,
                stock: selectedVariant.stock,
                discount: selectedVariant.discount,
              }
            : null,
          color: selectedColor,
          size: selectedSize,
        },
      ],
      totalItems: quantity,
      subTotal: finalPrice,
      deliveryCharge: shippingCharge,
      totalAmount: totalAmount,
      paymentMethod: "Cash On Delivery",
      status: "Pending",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Order creation failed. Please try again.");
      }

      const { invoice } = await res.json();
      if (invoice) {
        localStorage.setItem("latestInvoice", JSON.stringify(invoice));
      }

      toast.success(
        "Congratulations! Your order has been placed successfully."
      );
      router.push(`/cart/ordersuccess`);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Added dark mode styles to the form container
    <div
      className="border p-4 sm:p-8 rounded-lg bg-white dark:bg-gray-800/50 dark:border-gray-700 shadow-lg"
      id="order-form"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">
          অর্ডার করতে নিচের ফর্মটি সঠিক ভাবে পুরন করুন
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          যেকোনো প্রয়োজনে কল করুনঃ{" "}
          <a
            href={`tel:${phoneNumber}`}
            className="text-orange-600 font-semibold"
          >
            {phoneNumber}
          </a>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Side: Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="font-semibold">
              আপনার নাম <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="সম্পূর্ণ নাম লিখুন"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address" className="font-semibold">
              আপনার ঠিকানা <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="সম্পূর্ণ ঠিকানা লিখুন"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="font-semibold">
              মোবাইল নম্বর <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="সচল মোবাইল নম্বর দিন"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="font-semibold">
              বিশেষ দ্রষ্টব্য
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="কিছু বলার থাকলে লিখুন"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-md border dark:border-gray-700">
          <h4 className="text-xl font-bold mb-4">আপনার অর্ডার</h4>
          <div className="flex items-start space-x-4 border-b dark:border-gray-700 pb-4">
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-md border dark:border-gray-600"
            />
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Price: ৳{displayProduct.price}
              </p>
            </div>
            <p className="ml-auto font-semibold">
              ৳{displayProduct.price * quantity}
            </p>
          </div>

          <div className="space-y-4 mt-4">
            {product.variants?.length > 0 && (
              <div>
                <Label className="font-semibold text-sm">Select Variant</Label>
                <select
                  onChange={(e) =>
                    setSelectedVariant(
                      product.variants.find((v) => v._id === e.target.value)
                    )
                  }
                  className="w-full mt-1 p-2 border dark:border-gray-600 dark:bg-gray-800 rounded-md text-sm"
                >
                  {product.variants.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name} (৳{v.price})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {product.colors?.length > 0 && (
              <div>
                <Label className="font-semibold text-sm">Color</Label>
                <div className="flex gap-2 mt-1">
                  {product.colors.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 dark:border-gray-500 ${
                        selectedColor?._id === c._id
                          ? "ring-2 ring-orange-500"
                          : ""
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div>
                <Label className="font-semibold text-sm">Size</Label>
                <div className="flex gap-2 mt-1">
                  {product.sizes.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-1 border dark:border-gray-600 rounded h-9 flex items-center justify-center text-xs ${
                        selectedSize?._id === s._id
                          ? "bg-orange-500 text-white border-orange-500"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label className="font-semibold text-sm">Quantity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold w-10 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setQuantity((q) => (q < displayProduct.stock ? q + 1 : q))
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 border-t dark:border-gray-700 pt-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>৳{finalPrice}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>৳{shippingCharge}</p>
            </div>
            <div className="flex justify-between font-bold text-lg border-t dark:border-gray-700 pt-2 mt-2">
              <p>Total</p>
              <p>৳{totalAmount}</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-lg"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> প্রসেসিং...
              </>
            ) : (
              "অর্ডার কনফার্ম করুন"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
