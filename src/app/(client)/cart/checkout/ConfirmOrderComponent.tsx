// src/app/(client)/cart/checkout/ConfirmOrderComponent.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Select from "@/components/custom/form/Select";
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import BkashModal from "@/components/modals/BkashModal";
import CardPaymentModal from "@/components/modals/CardPaymentModal";
import { trackInitiateCheckout, trackPurchase } from "@/lib/tracking";

interface ConfirmOrderComponentProps {
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export default function ConfirmOrderComponent({
  userId,
  userName,
  userEmail,
}: ConfirmOrderComponentProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartTotalQuantity = useSelector(
    (state: RootState) => state.cart.totalQty
  );
  const cartTotalAmount = useSelector(
    (state: RootState) => state.cart.totalAmount
  );

  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [shipping, setShipping] = useState(80);
  const [area, setArea] = useState("Dhaka");
  const [isLoading, setIsLoading] = useState(false);

  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const subtotal = cartTotalAmount;
  const totalAmountWithShipping = subtotal + shipping;

  // --- Unified Tracking: begin_checkout (GTM, Meta Pixel, GA4) ---
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      trackInitiateCheckout(cartItems, subtotal);
    }
  }, []); // Run once when checkout page mounts
  // --- End Tracking ---

  const handleAreaSelectChange = (value: string) => {
    setArea(value);
    setShipping(value === "dhaka" ? 80 : 130);
  };

  const handleFinalizeOrder = async (paymentDetails: object = {}) => {
    setIsLoading(true);
    const orderData = {
      customer: { name, email, phone, address: `${address}, ${area}`, note },
      cartItems,
      totalItems: cartTotalQuantity,
      paymentMethod,
      deliveryCharge: shipping,
      subTotal: subtotal,
      totalAmount: totalAmountWithShipping,
      status: paymentMethod === "Cash On Delivery" ? "Pending" : "Processing",
      paymentDetails,
      createdAt: new Date().toISOString(),
      ...(userId && { userId }),
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

      // --- Unified Tracking for purchase (GTM, Meta Pixel, GA4) ---
      if (invoice) {
        trackPurchase({
          transactionId: invoice,
          totalAmount: totalAmountWithShipping,
          shipping: shipping,
          cartItems: cartItems,
        });

        localStorage.setItem("latestInvoice", JSON.stringify(invoice));
      } else {
        console.warn("Invoice data was not found in the API response.");
      }
      // --- End Tracking ---

      dispatch(clearCart());
      toast.success("✅ Order placed successfully!");
      router.push("/cart/ordersuccess");
    } catch (err: any) {
      console.error(err);
      toast.error(`❌ ${err.message || "Failed to place order."}`);
    } finally {
      setIsLoading(false);
      setIsBkashModalOpen(false);
      setIsCardModalOpen(false);
    }
  };

  const handleOrder = async () => {
    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      toast.error("⭐ Please fill all required fields (Name, Phone, Address).");
      return;
    }
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 11-digit phone number.");
      return;
    }

    if (paymentMethod === "Cash On Delivery") {
      await handleFinalizeOrder();
    } else if (paymentMethod === "Bkash") {
      setIsBkashModalOpen(true);
    } else if (paymentMethod === "Card") {
      setIsCardModalOpen(true);
    }
  };

  const handleBkashSubmit = async (transactionId: string) => {
    await handleFinalizeOrder({ transactionId });
  };

  const handleCardSubmit = async (cardDetails: any) => {
    await handleFinalizeOrder({
      cardLast4: cardDetails.number.slice(-4),
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Cart is Empty
        </h2>
        <Link href="/" className="text-orange-600 font-bold hover:underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      {isBkashModalOpen && (
        <BkashModal
          amount={totalAmountWithShipping}
          onClose={() => setIsBkashModalOpen(false)}
          onSubmit={handleBkashSubmit}
          isLoading={isLoading}
        />
      )}
      {isCardModalOpen && (
        <CardPaymentModal
          amount={totalAmountWithShipping}
          onClose={() => setIsCardModalOpen(false)}
          onSubmit={handleCardSubmit}
          isLoading={isLoading}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 flex items-center flex-col">
        <div className="flex flex-col items-center justify-center mb-8  p-5 rounded-lg">
          <h1 className="text-2xl mx-auto font-bold text-gray-600 w-fit text-center mb-6  pb-4">
            অর্ডার টি সম্পন্ন করতে আপনার নাম, মোবাইল নাম্বার ও ঠিকানা নিচে লিখুন
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 ">
            <div className="md:order-1 p-5 lg:p-8 rounded-lg  bg-white shadow-md">
              <h1 className="text-xl mb-5 font-semibold uppercase border-dashed border-b-2 border-slate-600 w-fit">
                বিলিং ডিটেইলস
              </h1>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-2 lg:gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      placeholder="নাম:"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border px-4 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">
                      আপনার ইমেইল
                    </label>
                    <input
                      type="email"
                      value={email}
                      placeholder="ইমেইল:"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border px-4 py-2 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    মোবাইল নাম্বার *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    placeholder="মোবাইল নাম্বার:"
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    ঠিকানা *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ঠিকানা: বাড়ির নাম্বার, গ্রাম বা এলেকার নাম, উপজেলা, জেলা, বিভাগ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    অর্ডার নোট
                  </label>
                  <textarea
                    rows={4}
                    value={note}
                    placeholder="অর্ডার নোট:"
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">
                      Payment Method
                    </label>
                    <Select
                      options={[
                        {
                          value: "Cash On Delivery",
                          label: "Cash On Delivery",
                        },
                        { value: "Bkash", label: "Bkash" },
                        { value: "Card", label: "Pay with Card" },
                      ]}
                      defaultValue={paymentMethod}
                      onChange={(value) => setPaymentMethod(value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-700">
                      Area
                    </label>
                    <Select
                      options={[
                        { value: "dhaka", label: "ঢাকা সিটির ভিতর - 80 টাকা" },
                        {
                          value: "outsideDhaka",
                          label: "ঢাকা সিটির বাহিরে - 130 টাকা",
                        },
                      ]}
                      defaultValue="dhaka"
                      onChange={handleAreaSelectChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="md:order-2 p-5 lg:p-8  rounded-lg  bg-white shadow-md h-fit">
              <h1 className="text-xl mb-5 font-semibold uppercase border-dashed border-b-2 border-slate-600 w-fit">
                প্রোডাক্ট ডিটেইল
              </h1>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  const cartItemId = item.variant
                    ? `${item.productId}-${item.variant._id}`
                    : item.productId;
                  return (
                    <div
                      key={cartItemId}
                      className="flex   rounded-lg border  px-4 py-2  items-start justify-between border-b pb-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden border">
                          <Image
                            src={item.image.url}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              Variant: {item.variant.name}
                            </p>
                          )}
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <button
                              type="button"
                              onClick={() => dispatch(decreaseQty(cartItemId))}
                              className="w-6 h-6 border text-center rounded-md font-bold"
                            >
                              -
                            </button>
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => dispatch(increaseQty(cartItemId))}
                              className="w-6 h-6 border text-center rounded-md font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ৳{item.price * item.quantity}
                        </p>
                        {item.salePrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ৳{item.salePrice * item.quantity}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(cartItemId))}
                          className="text-xs text-red-500 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-gray-700 border-b pb-4">
                  <span>সাব টোটাল</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed pt-4 flex justify-between text-gray-900 text-lg font-semibold">
                  <span>সর্বমোট</span>
                  <span>৳{totalAmountWithShipping.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleOrder}
                disabled={isLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 text-center py-2 px-4 rounded bg-orange-500 text-white hover:bg-orange-600 font-semibold transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
