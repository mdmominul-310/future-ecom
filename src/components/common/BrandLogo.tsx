import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  logoUrl?: string | null;
  siteTitle?: string;
  variant?: "light" | "dark" | "auto";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({
  logoUrl,
  siteTitle = "Future com",
  variant = "auto",
  className = "",
  size = "md",
}: BrandLogoProps) {
  // If the user has uploaded a custom image (from /uploads or external URL) that is not the legacy default
  const isCustomUpload =
    logoUrl &&
    logoUrl !== "/logo.png" &&
    logoUrl !== "/placeholder.svg" &&
    (logoUrl.startsWith("/uploads/") ||
      logoUrl.startsWith("http://") ||
      logoUrl.startsWith("https://") ||
      logoUrl.startsWith("data:"));

  if (isCustomUpload) {
    const heightClass =
      size === "sm" ? "h-8" : size === "lg" ? "h-14" : "h-10";
    return (
      <Image
        src={logoUrl!}
        alt={siteTitle}
        width={180}
        height={50}
        className={`${heightClass} w-auto object-contain ${className}`}
        priority
      />
    );
  }

  // Dimension scaling
  const dims =
    size === "sm"
      ? { w: 160, h: 36, scale: 0.8 }
      : size === "lg"
      ? { w: 220, h: 52, scale: 1.15 }
      : { w: 185, h: 42, scale: 1.0 };

  const isDark = variant === "dark";
  const isLight = variant === "light";

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none transition-transform duration-200 ${className}`}
      style={{ minHeight: dims.h }}
    >
      {/* Emblem SVG */}
      <svg
        width={dims.h * 0.95}
        height={dims.h * 0.95}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="logoFlame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#FF9E00" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="bagBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>

        {/* Shopping Bag Contour */}
        <path
          d="M14 16 L34 16 L38 42 L10 42 Z"
          fill="url(#bagBase)"
          rx="3"
          opacity="0.95"
        />
        {/* Shopping Bag Handle */}
        <path
          d="M19 16 V11 C19 8.2 21.2 6 24 6 C26.8 6 29 8.2 29 11 V16"
          stroke="#FDBA74"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Dynamic Stylized "F" swoosh */}
        <path
          d="M10 38 C10 24 18 19 32 19 C37 19 41 15 44 9"
          stroke="#FFFFFF"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 29 L32 29"
          stroke="#FEE2E2"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Future Star / Spark */}
        <polygon
          points="43,6 45,10 49,11 46,14 47,18 43,15 39,18 40,14 37,11 41,10"
          fill="#FDE047"
        />
      </svg>

      {/* Typography: FUTURE COM */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center tracking-tight">
          <span
            className={`font-black text-[22px] tracking-wider font-sans transition-colors ${
              isDark
                ? "text-white"
                : isLight
                ? "text-stone-900"
                : "text-stone-900 dark:text-white"
            }`}
          >
            FUTURE
          </span>
          <span className="ml-1 px-1.5 py-0.5 text-[14px] font-extrabold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-md shadow-sm tracking-wide">
            COM
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.24em] uppercase text-orange-500 mt-0.5">
          General Store
        </span>
      </div>
    </div>
  );
}
