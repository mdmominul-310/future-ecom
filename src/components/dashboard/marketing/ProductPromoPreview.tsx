"use client";

import Image from "next/image";
import { Check, Star, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/client/youtube-embad";
import EmbeddedCheckoutForm from "@/components/client/EmbeddedCheckoutForm";
import Link from "next/link";
import AnimateOnScroll from "@/components/client/AnimateOnScroll";
import AdditionalProductImageSlider from "@/components/client/products/AditionalProductImageSlider";

// --- Aligned this Product interface with the one expected by EmbeddedCheckoutForm ---
interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  images: { url: string; public_id: string }[];
  additionalImages?: { url: string; public_id: string }[];
  price: number;
  salePrice?: number;
  stock: number;
  discount?: number;
  videoUrl?: string;
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

interface PageContent {
  heroHeadline: string;
  heroImage: { url: string; public_id: string };
  heroFeatures: string[];
  ctaSubheadline: string;
  ctaDescription: string;
  offerSectionHeadline: string;
  offerSectionFeatures: string[];
  comparisonHeadline: string;
  comparisonText: string;
  reviewSectionHeadline: string;
  facebookReviewUrl: string;
  youtubeReviewUrl: string;
  customerReviewHeadline: string;
  phoneNumber: string;
  additionalImagesHeadline: string;
  reviewScreenshots: { url: string; public_id: string }[];
}

interface Props {
  product: Product;
  content: PageContent;
}

export default function ProductPromoPreview({ product, content }: Props) {
  const orderNow = () => {
    document
      .getElementById("order-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const additionalImages = product.additionalImages || [];
  const reviewScreenshots = content.reviewScreenshots || [];

  return (
    // Added dark mode base styles
    <div className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">
              {content.heroHeadline}
            </h1>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimateOnScroll delay={200}>
              <div className="w-full">
                <Image
                  src={
                    content.heroImage?.url ||
                    (product.images.length > 0
                      ? product.images[0].url
                      : "/placeholder.png")
                  }
                  alt="Hero Product Image"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-md mx-auto"
                />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={400}>
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  অরিজিনাল ও রিপ্লিকার মধ্যে পার্থক্য বোঝার কোন উপায় নেই।
                </h2>
                <ul className="space-y-3">
                  {content.heroFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-6 h-6 bg-green-500 text-white rounded-full p-1 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll delay={300}>
            <div className="text-center mt-12 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg">
              <h3 className="text-xl md:text-2xl font-bold">
                {content.ctaSubheadline}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {content.ctaDescription}
              </p>
              <Button
                onClick={orderNow}
                size="lg"
                className="mt-6 bg-blue-600 hover:bg-blue-700"
              >
                অর্ডার করতে ক্লিক করুন
              </Button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Section 2: Offer/Why Us */}
      <section className="py-12 md:py-16 bg-yellow-50 dark:bg-yellow-900/10">
        <AnimateOnScroll className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {content.offerSectionHeadline}
            </h2>
            <ul className="space-y-3">
              {content.offerSectionFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={orderNow}
              size="lg"
              className="mt-8 bg-blue-600 hover:bg-blue-700"
            >
              অর্ডার করতে ক্লিক করুন
            </Button>
          </div>
          <div className="w-full">
            {product.videoUrl && (
              <YouTubeEmbed
                url={product.videoUrl}
                title="Product Offer Video"
              />
            )}
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 3: Comparison */}
      <section className="py-12 md:py-16 bg-pink-50 dark:bg-pink-900/10">
        <AnimateOnScroll className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">{content.comparisonHeadline}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            {content.comparisonText}
          </p>
          <Button
            onClick={orderNow}
            size="lg"
            className="mt-8 bg-blue-600 hover:bg-blue-700"
          >
            অর্ডার করতে ক্লিক করুন
          </Button>
        </AnimateOnScroll>
      </section>

      {/* Section 4: External Reviews */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
        <AnimateOnScroll className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">
            {content.reviewSectionHeadline}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href={content.facebookReviewUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="bg-blue-800 hover:bg-blue-900 w-full"
              >
                <Facebook className="mr-2" /> ফেসবুক রিভিউ
              </Button>
            </Link>
            <Link
              href={content.youtubeReviewUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="bg-red-600 hover:bg-red-700 w-full">
                <Youtube className="mr-2" /> ইউটিউব রিভিউ
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 5: Additional Images Slider */}
      {additionalImages.length > 0 && (
        <section className="py-12 md:py-16 bg-white dark:bg-gray-950">
          <AnimateOnScroll className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              {content.additionalImagesHeadline}
            </h2>
            <AdditionalProductImageSlider images={additionalImages} />
          </AnimateOnScroll>
        </section>
      )}

      {/* Section 6: Display Admin-Uploaded Review Screenshots */}
      {reviewScreenshots.length > 0 && (
        <section className="py-12 md:py-16 bg-pink-50 dark:bg-pink-900/10">
          <AnimateOnScroll className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              {content.customerReviewHeadline}
            </h2>
            <AdditionalProductImageSlider images={reviewScreenshots} />
          </AnimateOnScroll>
        </section>
      )}

      {/* Section 7: Order Form */}
      <section className="py-12 md:py-20 bg-gray-100 dark:bg-gray-900">
        <AnimateOnScroll className="container mx-auto px-4">
          <EmbeddedCheckoutForm
            product={product}
            phoneNumber={content.phoneNumber}
          />
        </AnimateOnScroll>
      </section>
    </div>
  );
}
