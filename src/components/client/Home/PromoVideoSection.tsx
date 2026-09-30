"use client";

import React from "react";
// import { ShoppingBag, Zap, Award, Leaf } from "lucide-react";
// import Link from "next/link";

export const PromoVideoSection = () => {
  return (
    // Section container with background color and padding
    <section className="bg-[#F7F5EF] dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid layout for video and text content */}
        <div className="grid grid-cols-1 items-center gap-y-10 2 lg:gap-x-16 lg:gap-y-0">
          {/* Left column: Text content */}

          {/* Right column: Video player */}
          <div className="lg:order-2">
            <div className="group relative aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-2xl shadow-2xl">
              {/* Video element updated for autoplay */}
              <video
                className="h-full w-full object-cover"
                poster="https://images.pexels.com/photos/3945316/pexels-photo-3945316.jpeg?_gl=1*jxspnc*_ga*Mjg2NTQ4MjY1LjE3NDkxMTEzODA.*_ga_8JE65Q40S6*czE3NTIwMjI4NjEkbzMkZzAkdDE3NTIwMjI4NjEkajYwJGwwJGgw"
                autoPlay
                muted
                loop
                playsInline
                // The video source URL. Using a placeholder from Pexels.
                src="https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
