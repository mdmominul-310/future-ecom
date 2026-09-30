"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-r from-orange-500 to-orange-400    rounded-lg overflow-hidden">
      {/* Deep blue background with water-like texture */}
      <div
        className="absolute inset-0 bg-orange-400s"
        style={{
          backgroundImage: "url('/bg/orange.jpgs')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Left side - Text content */}
          <div className="max-w-md">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
              Sony HomePod
              <br />
              2nd Gen Speaker
            </h1>
            <ul className="mb-8">
              <li className="text-white/90 flex items-start gap-2 mb-2">
                {/* <span className="text-yellow-400 mt-1">•</span> */}
                <span>
                  Apple ecosystem and provide high-quality audio playback while
                  also serving as a hub for controlling smart home devices.
                </span>
              </li>
            </ul>
            <Link
              href="#"
              className="inline-flex items-center bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Right side - Product image */}
          <div className="hidden md:block w-1/2 h-full relative">
            {/* Placeholder for the HomePod image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Image
                src="/products/speaker.webp"
                alt="Apple HomePod 2nd Gen"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              activeSlide === index ? "bg-white" : "bg-white/40"
            }`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
