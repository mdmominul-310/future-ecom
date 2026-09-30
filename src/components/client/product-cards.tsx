import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ProductCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Apple Watch Card */}
      <div className="bg-[#5d1a2d] rounded-lg p-6 h-[200px] relative overflow-hidden">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">
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
        </div>
        <div className="absolute bottom-4 right-4">
          <Image
            src="/products/applewatch.png"
            alt="Apple Watch"
            width={500}
            height={500}
            className="object-contain  h-32 w-auto"
          />
        </div>
      </div>

      {/* Samsung Gear Camera Card */}
      <div className="bg-[#1e1e1e] rounded-lg p-6 h-[200px] relative overflow-hidden">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">
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
        </div>
        <div className="absolute bottom-4 right-4">
          <Image
            src="/products/samsung-gear-camera.png"
            alt="Samsung Gear Camera"
            width={500}
            height={500}
            className="object-contain h-32 w-auto"
          />
        </div>
      </div>

      {/* Hero Camera Card */}
      <div className=" bg-[#b06e3e]  rounded-lg p-6 h-[200px] relative overflow-hidden">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">Hero Camera</h2>
          </div>
          <div>
            <Link
              href="#"
              className="inline-flex items-center text-white hover:underline"
            >
              Shop Now <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <Image
            src="/products/hero-camera.png"
            alt="Hero Camera"
            width={120}
            height={120}
            className="object-contain h-32 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
