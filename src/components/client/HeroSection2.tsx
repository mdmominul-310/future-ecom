import Image from "next/image";
import React from "react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroSection2 = () => {
  return (
    <section className="container mx-auto md:px-4 md:py-4 grid grid-cols-1 md:grid-cols-3 md:gap-4">
      {/* Slider Section */}
      <div className="md:col-span-2">
        <ImageSlider />
      </div>

      {/* Right Side Cards */}
      <div className=" grid-cols-1  gap-2 hidden lg:grid">
        {/* Apple Watch */}
        <div className="bg-[#5d1a2d] rounded-lg p-4 md:p-6 flex flex-col justify-between relative  overflow-hidden">
          <div>
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight">
              Explore
              <br />
              Apple Watch
            </h2>
          </div>
          <div>
            <Link
              href="#"
              className="inline-flex items-center text-white hover:underline"
            >
              Shop Now <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="absolute bottom-2 right-2">
            <Image
              src="/products/applewatch.png"
              alt="Apple Watch"
              width={120}
              height={120}
              className="object-contain w-auto h-20 md:h-24"
            />
          </div>
        </div>

        {/* Samsung Gear Camera */}
        <div className="bg-[#1e1e1e] rounded-lg p-4 md:p-6 flex flex-col justify-between relative  overflow-hidden">
          <div>
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight">
              Samsung
              <br />
              Gear Camera
            </h2>
          </div>
          <div>
            <Link
              href="#"
              className="inline-flex items-center text-white hover:underline"
            >
              Shop Now <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="absolute bottom-2 right-2">
            <Image
              src="/products/samsung-gear-camera.png"
              alt="Samsung Gear Camera"
              width={120}
              height={120}
              className="object-contain w-auto h-20 md:h-24"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;
