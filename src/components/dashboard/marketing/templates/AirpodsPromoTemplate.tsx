// src/components/dashboard/marketing/templates/AirpodsPromoTemplate.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Send, Check, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { YouTubeEmbed } from "@/components/client/youtube-embad";
import { toast } from "sonner";

// Import Swiper for the customer image carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// --- INTERFACES FOR PROPS ---
interface Product {
  _id: string;
  name: string;
  images: { url: string }[];
  price: number;
  salePrice?: number;
  videoUrl?: string;
}
interface Content {
  mainHeadline?: string; // Optional, will use hardcoded text if not provided
  subHeadline?: string;
  comparisonTitle?: string;
  comparisonText?: string;
  showVideo: boolean;
  satisfactionImages?: { url: string; public_id: string }[];
}
interface Props {
  product: Product;
  content: Content;
}

const OrderForm = ({ product }: { product: Product }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("80");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryCharge = parseInt(deliveryLocation);
  const subTotal = product.salePrice || product.price;
  const total = subTotal + deliveryCharge;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      toast.error("দয়া করে আপনার নাম, ঠিকানা এবং ফোন নম্বর পূরণ করুন।");
      return;
    }
    setIsSubmitting(true);
    toast.info("অর্ডার সাবমিট করা হচ্ছে...");
    await new Promise((res) => setTimeout(res, 2000));
    toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! (সিমুলেশন)");
    setIsSubmitting(false);
  };

  return (
    <section id="order-form" className="bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto border-t-4 border-red-500 border-dashed pt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            অর্ডার করতে নিচের ফর্মটি সঠিক তথ্য দিয়ে পুরন করুন।
          </h2>
          <p className="text-gray-600 mt-2">
            যেকোনো প্রয়োজনে কল করুন:{" "}
            <a href="tel:01819000000" className="text-blue-600 font-semibold">
              01819000000
            </a>
          </p>
        </div>
        <div className="bg-gray-50 p-4 sm:p-8 rounded-lg shadow-lg border">
          <form
            onSubmit={handleOrderSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  আপনার নাম <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="সম্পূর্ণ নাম লিখুন"
                />
              </div>
              <div>
                <Label htmlFor="address">
                  আপনার ঠিকানা <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন (বাসা/হোল্ডিং, রোড, থানা, জেলা)"
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="সচল মোবাইল নাম্বার লিখুন"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-md border">
              <h3 className="text-xl font-bold mb-4">Your Order</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
                <div className="flex justify-between">
                  <span>{product.name} x 1</span>
                  <span>৳{subTotal}</span>
                </div>
                <div className="flex flex-col border-t pt-2">
                  <span className="font-semibold mb-2">Shipping</span>
                  <RadioGroup
                    value={deliveryLocation}
                    onValueChange={setDeliveryLocation}
                  >
                    <Label className="flex items-center justify-between p-2 border rounded-md">
                      <span className="flex items-center">
                        <RadioGroupItem
                          value="80"
                          id="inside-dhaka"
                          className="mr-2"
                        />
                        ঢাকার ভিতরে
                      </span>
                      <span>৳80</span>
                    </Label>
                    <Label className="flex items-center justify-between p-2 border rounded-md">
                      <span className="flex items-center">
                        <RadioGroupItem
                          value="150"
                          id="outside-dhaka"
                          className="mr-2"
                        />
                        ঢাকার বাহিরে
                      </span>
                      <span>৳150</span>
                    </Label>
                  </RadioGroup>
                </div>
                <div className="flex justify-between border-t-2 border-gray-900 pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6 bg-[#0f894c] hover:bg-[#0c6b3a] text-white font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "অর্ডার হচ্ছে..." : "অর্ডার করুন"}
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export function AirpodsPromoTemplate({ product, content }: Props) {
  if (!product)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  const scrollToOrderForm = () =>
    document
      .getElementById("order-form")
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-white font-sans text-gray-800">
      {/* Section 1: Hero */}
      <section className="bg-[#f0f1f3] text-center py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            সব থেকে সেরা Airpods Pro 2nd Gen প্রিমিয়াম ডুবাই A1 Grade এবং
            অরিজিনাল এর সকল ফিচারস সমৃদ্ধ।
          </h1>
          <ul className="list-none p-0 my-4 inline-block text-left">
            <li>✅ অটো কানেক্ট।</li>
            <li>✅ প্রিমিয়াম কোয়ালিটি।</li>
            <li>✅ কানের সাইজ অনুযায়ী ব্যবহার করতে পারবেন।</li>
            <li>✅ সারাউন্ড সাউন্ড।</li>
          </ul>
          <div className="my-4 max-w-md mx-auto">
            <Image
              src={product.images[0]?.url || "/placeholder.png"}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Price & Order */}
      <section className="bg-[#f0f1f3] text-center pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl font-semibold mt-4">
            এই দামে সেরা মানের এয়ারপডস প্রো।
          </p>
          <div className="my-4 text-2xl font-bold">
            <span className="text-gray-500 line-through mr-3">
              ৳{product.price}
            </span>
            <span className="text-red-500 text-4xl">৳{product.salePrice}</span>
          </div>
          <Button
            size="lg"
            className="bg-[#0f894c] hover:bg-[#0c6b3a] text-white font-bold text-lg px-10 py-6 rounded-md shadow-lg"
            onClick={scrollToOrderForm}
          >
            অর্ডার করতে এখানে ক্লিক করুন
          </Button>
        </div>
      </section>

      {/* Section 3: Why We Are The Best */}
      <section className="bg-[#f5f2e9] py-12 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              কেন আমাদের এই এয়ারপডস প্রো বাজারের সেরা?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>কপি মার্কেটের মধ্যে আমাদের এয়ারপডসটি সবথেকে সেরা।</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>সাউন্ড কোয়ালিটি এবং দেখতে হুবুহ অরিজিনাল এর মতো।</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>
                  একবার চার্জ দিলে কথা বলা এবং গান শোনা মিলিয়ে ৭-৮ ঘন্টা চার্জ
                  থাকে।
                </span>
              </li>
            </ul>
            <Button
              className="bg-[#0f894c] hover:bg-[#0c6b3a] text-white mt-6"
              onClick={scrollToOrderForm}
            >
              অর্ডার করুন
            </Button>
          </div>
          <div>
            <Image
              src="https://i.ibb.co/L5kCHd7/ad-image-1.png"
              alt="Person using Airpods"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Comparison */}
      <section className="bg-[#fcf3f4] py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            আমাদের প্রডাক্ট এবং অন্যান্ন প্রডাক্ট এর মধ্যে পার্থক্য কোথায়?
          </h2>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
            আমরা দিচ্ছি ডুবাই এর A1 গ্রেডের মাস্টারকপি এয়ারপডস প্রো, যা বাজারের
            অন্যান্য কপি থেকে সম্পূর্ণ আলাদা। এর সাউন্ড কোয়ালিটি, বিল্ড কোয়ালিটি
            এবং ফিচারস প্রায় অরিজিনাল এর কাছাকাছি। কম দামে সেরা পণ্যটি নিশ্চিত
            করতে আমরা সর্বদা সচেষ্ট।
          </p>
          <Button
            className="bg-[#0f894c] hover:bg-[#0c6b3a] text-white mt-6"
            onClick={scrollToOrderForm}
          >
            অর্ডার করুন
          </Button>
        </div>
      </section>

      {/* Section 5: Video */}
      {content.showVideo && product.videoUrl && (
        <section className="py-12 bg-white px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              আমাদের যেকোনো একটি প্রডাক্টের ভিডিও দেখে আসতে পারেন
            </h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl max-w-2xl mx-auto">
              <YouTubeEmbed
                url={product.videoUrl}
                title={`${product.name} video`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Section 6: Contact Buttons */}
      <section className="py-12 bg-white px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            আমাদের সাথে মেসেঞ্জারে অথবা সরাসরি হোয়াটসএপে যোগাযোগ করতে পারেন
          </h2>
          <div className="flex justify-center gap-4 mt-6">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="mr-2" /> Messenger
            </Button>
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Phone className="mr-2" /> WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Section 7: Customer Image Carousel */}
      {content.satisfactionImages && content.satisfactionImages.length > 0 && (
        <section className="bg-[#fcf3f4] py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              আমাদের কাস্টমারদের মূল্যবান মতামত দেখুন
            </h2>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {content.satisfactionImages.map((img) => (
                <SwiperSlide key={img.public_id}>
                  <div className="p-2 bg-white rounded-lg shadow-lg">
                    <Image
                      src={img.url}
                      alt="Customer satisfaction"
                      width={400}
                      height={600}
                      className="rounded-md w-full h-auto"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Section 8: Order Form */}
      <OrderForm product={product} />
    </div>
  );
}
