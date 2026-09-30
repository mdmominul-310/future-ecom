"use client";

import { useState, useEffect } from "react";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({
  url,
  title = "YouTube video",
  className = "",
}: YouTubeEmbedProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setVideoId(null);
      return;
    }

    /**
     * Extracts the YouTube video ID from various URL formats.
     * @param ytUrl The YouTube URL.
     * @returns The 11-character video ID or null if not found.
     */
    const extractVideoId = (ytUrl: string): string | null => {
      let videoIdStr: string | undefined;

      try {
        const urlObj = new URL(ytUrl);
        const hostname = urlObj.hostname;

        // Standard youtube.com, www.youtube.com
        if (hostname.includes("youtube.com")) {
          // Handles URLs like: /watch?v=VIDEO_ID
          if (urlObj.pathname === "/watch") {
            videoIdStr = urlObj.searchParams.get("v") ?? undefined;
          }
          // Handles Shorts URLs like: /shorts/VIDEO_ID
          else if (urlObj.pathname.startsWith("/shorts/")) {
            videoIdStr = urlObj.pathname.substring("/shorts/".length);
          }
          // Handles embed URLs like: /embed/VIDEO_ID
          else if (urlObj.pathname.startsWith("/embed/")) {
            videoIdStr = urlObj.pathname.substring("/embed/".length);
          }
        }
        // Shortened URLs like: youtu.be/VIDEO_ID
        else if (hostname === "youtu.be") {
          videoIdStr = urlObj.pathname.substring(1);
        }
        // User-content URLs for cached content
        else if (hostname.includes("googleusercontent.com")) {
          // Extracts ID from path like: /.../VIDEO_ID
          const pathParts = urlObj.pathname.split("/");
          videoIdStr = pathParts.pop() || undefined;
        }
      } catch (error) {
        console.error("Invalid URL provided to YouTubeEmbed:", error);
        return null;
      }

      // A valid YouTube ID is typically 11 characters long.
      // This helps filter out invalid results from path splitting.
      return videoIdStr && videoIdStr.length >= 11
        ? videoIdStr.substring(0, 11)
        : null;
    };

    setVideoId(extractVideoId(url));
  }, [url]);

  if (!videoId) {
    return (
      <div
        className={`flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-md ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Invalid or unsupported YouTube URL
        </p>
      </div>
    );
  }

  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-md ${className}`}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
