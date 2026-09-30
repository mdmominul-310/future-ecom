"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { trackViewCart } from "@/lib/tracking";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default function CartPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalQty = useSelector((state: RootState) => state.cart.totalQty);

  const shippingCost = totalQty > 1 ? 0 : 130;
  const subtotal = cartItems.reduce(
    (sum, item) => (item.variant?.price ?? item.price) * item.quantity + sum,
    0
  );
  const discountAmount = couponApplied ? (subtotal * discountPercent) / 100 : 0;
  const finalTotal = subtotal - discountAmount + shippingCost;

  // --- Tracking: view_cart ---
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      trackViewCart(cartItems, subtotal);
    }
  }, [cartItems, subtotal]);

  useEffect(() => {
    if (cartItems) {
      setLoading(false);
    }
  }, [cartItems]);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "discount20") {
      setCouponApplied(true);
      setDiscountPercent(20);
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        {/* --- UI Upgraded --- */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/"
            // --- UI Upgraded: Orange Button ---
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 md:py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Your Shopping Cart
        </h1>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:w-2/3 w-full space-y-4">
            {cartItems.map((item) => {
              const cartItemId = item.variant
                ? `${item.productId}-${item.variant._id}`
                : item.productId;
              const itemPrice = item.variant?.price ?? item.price;
              const totalItemPrice = itemPrice * item.quantity;

              return (
                <div
                  key={cartItemId}
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <Image
                    src={item.image?.url || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md h-20 w-20 object-cover"
                  />
                  <div className="flex-grow ml-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm lg:text-lg font-semibold text-gray-800 hover:text-orange-600"
                      title={item.name}
                    >
                      {item.name}
                      {item.variant && (
                        <span className="text-xs text-gray-500 block">
                          Variant: {item.variant.name}
                        </span>
                      )}
                    </Link>
                    <p className="text-xs text-gray-500 lg:text-md">
                      ৳{itemPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col lg:flex-row items-end lg:items-center gap-2 lg:gap-4">
                    {/* --- UI Upgraded: Quantity Buttons --- */}
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        className="px-2 lg:px-3 py-1 text-orange-600 hover:bg-orange-100 rounded-l-md"
                        onClick={() => dispatch(decreaseQty(cartItemId))}
                      >
                        -
                      </button>
                      <span className="px-2 lg:px-4 py-1 text-xs lg:text-base border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 lg:px-3 py-1 text-orange-600 hover:bg-orange-100 rounded-r-md"
                        onClick={() => dispatch(increaseQty(cartItemId))}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm lg:text-lg font-semibold text-gray-800 w-24 text-right">
                      ৳{totalItemPrice.toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 hover:text-red-700" // Kept as red for clear "delete" action
                      onClick={() => dispatch(removeFromCart(cartItemId))}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
              <Link
                href="/"
                // --- UI Upgraded ---
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
              >
                &larr; Continue Shopping
              </Link>
              <button
                // --- UI Upgraded: Outline Style for Secondary Button ---
                className="border border-orange-500 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    ৳{subtotal.toFixed(2)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-lg text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-800">
                    ৳{shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between text-xl">
                  <span className="font-semibold text-gray-800">Total</span>
                  {/* --- UI Upgraded: Total Price Color --- */}
                  <span className="font-bold text-orange-600">
                    ৳{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    // --- UI Upgraded: Input Focus Ring ---
                    className="flex-1 border w-1/3 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <button
                    // --- UI Upgraded: Orange Button ---
                    className={`px-5 py-2 rounded-md text-white transition-colors shadow-sm ${
                      couponApplied
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    onClick={applyCoupon}
                    disabled={couponApplied}
                  >
                    Apply
                  </button>
                </div>
                <Link href="/cart/checkout" className="w-full block">
                  <button
                    // --- UI Upgraded: Orange Button ---
                    className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
