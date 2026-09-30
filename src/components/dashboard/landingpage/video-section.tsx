"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function VideoSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section id="video" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          See It In Action
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Watch our product video to experience the amazing sound quality and
          features of our premium wireless headphones.
        </p>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <iframe
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Product Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setVideoLoaded(true)}
            ></iframe>

            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-16 w-16 flex items-center justify-center"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                  <p className="mt-4 text-gray-600">Loading video...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Watch our detailed review and see how our headphones perform in
            real-world scenarios.
          </p>
        </div>
      </div>
    </section>
  );
}
