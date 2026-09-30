import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function PromotionalBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12 p-4 max-w-7xl mx-auto">
      {/* Watches Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-950 to-blue-800 p-6 flex items-center">
        <div className="z-10">
          <h2 className="text-white text-2xl font-bold mb-1">Discounts 50%</h2>
          <p className="text-white text-xl mb-4">On All Watchs</p>
          <Link
            href="#"
            className="text-white mt-2 inline-flex items-center text-sm border-b border-white hover:opacity-80"
          >
            Shop Now <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[180px] h-[180px]">
          {/* Placeholder for watch image */}
          <div className="w-full h-full bg-blue-700/30 rounded-full flex items-center justify-center text-white text-xs">
            <Image
              src={"/products/applewatch.png"}
              alt="Apple Watch"
              width={500}
              height={500}
              className="object-contain h-32 w-auto"
            />
          </div>
        </div>
      </div>

      {/* AirPods Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-950 to-purple-800 p-6 flex items-center">
        <div className="z-10">
          <h2 className="text-white text-2xl font-bold mb-1">Mega Discounts</h2>
          <p className="text-white text-xl mb-4">
            50% Off <span className="text-amber-300">This Week</span>
          </p>
          <Link
            href="#"
            className="text-white mt-2 inline-flex items-center text-sm border-b border-white hover:opacity-80"
          >
            Shop Now <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[180px] h-[180px]">
          {/* Placeholder for airpods image */}
          <div className="w-full h-full bg-purple-700/30 rounded-full flex items-center justify-center text-white text-xs">
            <Image
              src={"/products/samsung-gear-camera.png"}
              alt="Samsung Gear Camera"
              width={500}
              height={500}
              className="object-contain h-32 w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
