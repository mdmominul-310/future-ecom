"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Truck,
  TrendingDown,
} from "lucide-react";
import { ICampaignBanner } from "@/models/CampaignBanner";

function CampaignBannerContent({ banner }: { banner: ICampaignBanner }) {
  const targetDate = useMemo(
    () => new Date(banner.targetDate),
    [banner.targetDate]
  );

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const { title, description, image, linkedProductId } = banner;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-amber-50/60 text-stone-900 shadow-xl border border-stone-200/80 my-6 lg:my-12"
    >
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none translate-y-1/2" />

      <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Flash Details & Countdown */}
        <div className="w-full lg:w-7/12 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* Top Live Flash Sale Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-700 text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-6 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600"></span>
            </span>
            <Flame className="w-4 h-4 text-orange-600 animate-bounce" />
            <span>Limited Time Flash Event</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600 ml-1" />
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.15] mb-4">
            {title.split(" ").slice(0, 2).join(" ")}{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              {title.split(" ").slice(2).join(" ") || "Event"}
            </span>
          </h2>

          {/* Subtitle / Description */}
          <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-xl mb-8 leading-relaxed font-medium">
            {description}
          </p>

          {/* Glowing Timer Bar Label */}
          <div className="flex items-center gap-2 mb-3 text-xs font-extrabold tracking-wider uppercase text-orange-700">
            <Clock className="w-4 h-4 text-orange-600 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Offer Expires In:</span>
          </div>

          {/* Luxury White Countdown Cards */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-8 w-full max-w-md">
            <CountdownCard label="Days" value={timeLeft.days} />
            <CountdownCard label="Hours" value={timeLeft.hours} />
            <CountdownCard label="Mins" value={timeLeft.minutes} />
            <CountdownCard label="Secs" value={timeLeft.seconds} />
          </div>

          {/* Flash Stock Progress Bar */}
          <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl p-4 mb-8 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-orange-700">
                <Zap className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
                <span>Urgency Alert</span>
              </span>
              <span className="text-orange-600 font-extrabold">85% Claimed</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-stone-200/60">
              <div
                className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: "85%" }}
              />
            </div>
          </div>

          {/* CTA & Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href={`/products/${linkedProductId}`}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
            >
              <span>Grab Flash Deal Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-4 text-xs text-stone-600 font-bold px-2 py-1">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-orange-600" /> Free Shipping
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Authentic
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Hero Product Image Display */}
        <div className="w-full lg:w-5/12 flex justify-center relative">
          
          {/* Ambient Glow Aura under Image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-2xl transform scale-90 pointer-events-none" />

          {/* Floating Product Image Container */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full aspect-square max-w-[380px] lg:max-w-[420px] rounded-3xl overflow-hidden border border-stone-200/80 bg-white shadow-xl p-6 group"
          >
            {/* Top Floating Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center gap-1 bg-red-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                <TrendingDown className="w-3.5 h-3.5" /> SAVE UP TO 60%
              </span>
            </div>

            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-50">
              <Image
                src={image.url}
                alt={title}
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </motion.div>

        </div>

      </div>
    </motion.section>
  );
}

interface CampaignLargeBannerProps {
  banner: ICampaignBanner | null;
}

export default function CampaignLargeBanner({
  banner,
}: CampaignLargeBannerProps) {
  if (!banner) {
    return null;
  }

  return <CampaignBannerContent banner={banner} />;
}

// Reusable Countdown Card Component
function CountdownCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white border border-stone-200/80 py-3 sm:py-4 px-2 text-center shadow-md hover:border-orange-500/50 hover:shadow-lg transition-all">
      <div className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-orange-600 mt-0.5">
        {label}
      </div>
    </div>
  );
}


