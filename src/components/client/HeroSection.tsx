"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type Slide = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string | { url: string };
  url: string;
};

export default function HeroSection({ slides }: { slides: Slide[] }) {
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-[50vh] bg-gradient-to-r from-amber-900 via-stone-800 to-amber-950 flex flex-col items-center justify-center text-white px-4 text-center">
        <Sparkles className="w-12 h-12 text-amber-400 mb-4 animate-pulse" />
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Discover Premium Collections
        </h2>
        <p className="text-amber-200 text-lg max-w-xl mb-6">
          Handpicked luxury products, exclusive discounts, and fast worldwide delivery.
        </p>
        <Link
          href="/categories/all"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Shop All Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] bg-stone-900 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active !bg-orange-500 !w-8 !rounded-full transition-all duration-300",
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => {
          const imageUrl = typeof slide.image === "object" ? slide.image.url : slide.image;
          let targetUrl = slide.url || "/categories/all";
          if (targetUrl === "/products" || targetUrl === "/products/") {
            targetUrl = "/categories/all";
          }

          return (
            <SwiperSlide key={slide._id || index}>
              <div className="relative w-full h-full">
                {/* Background Image */}
                <Image
                  priority={index === 0}
                  src={imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"}
                  alt={slide.title || "Hero Banner"}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                  <div className="container mx-auto px-6 sm:px-10 lg:px-16">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="max-w-2xl text-white space-y-4 sm:space-y-6"
                    >
                      {/* Subtitle Badge */}
                      {slide.subtitle && (
                        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 backdrop-blur-md px-4 py-1.5 rounded-full text-orange-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-sm">
                          <Sparkles className="w-4 h-4 text-orange-400" />
                          {slide.subtitle}
                        </div>
                      )}

                      {/* Main Title */}
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                        {slide.title}
                      </h2>

                      {/* Description */}
                      {slide.description && (
                        <p className="text-gray-200 text-sm sm:text-lg font-light leading-relaxed line-clamp-2 max-w-xl">
                          {slide.description}
                        </p>
                      )}

                      {/* CTA Buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href={targetUrl}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-7 py-3.5 rounded-full shadow-lg hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300"
                        >
                          Explore Collection <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
