import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ShoppingBag,
  Truck,
  Headphones,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Store,
} from "lucide-react";
import { getSiteSettings } from "@/lib/api/settings";

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const siteTitle = settings.siteTitle || "Future com";
  const aboutTitle = settings.aboutTitle || `Welcome to ${siteTitle}`;
  const aboutSubtitle =
    settings.aboutSubtitle ||
    "Where cutting-edge digital convenience meets everyday lifestyle essentials in one modern general store.";
  const aboutStory =
    settings.aboutStory ||
    `${siteTitle} was founded with a forward-looking vision: to revolutionize the e-commerce and general retail landscape in Bangladesh. In partnership with Futgensoft's digital technology infrastructure, we deliver an extensive, carefully vetted catalog spanning modern electronics, gadgets, home goods, fashion, and daily essentials directly to your doorstep.\n\nWe eliminate the hassle of traditional shopping by offering authentic products, transparent pricing, secure payment methods, and speedy nationwide fulfillment. Every product is backed by rigorous quality assurance and dependable customer care.`;
  const aboutMission =
    settings.aboutMission ||
    "Our mission is to empower households and modern shoppers across Bangladesh with immediate access to authentic, high-quality general merchandise, seamless online ordering, and uncompromising post-sale support.";
  const aboutImage = settings.aboutImage || "/about-futurecom.png";

  const features = [
    {
      icon: ShieldCheck,
      title: settings.aboutFeature1Title || "100% Authentic Guarantee",
      desc:
        settings.aboutFeature1Desc ||
        "All products are sourced directly from verified manufacturers and distributors with strict quality control.",
    },
    {
      icon: Store,
      title: settings.aboutFeature2Title || "Next-Gen General Store",
      desc:
        settings.aboutFeature2Desc ||
        "From smart tech and home utilities to lifestyle and daily necessities, find everything you need in one destination.",
    },
    {
      icon: Truck,
      title: settings.aboutFeature3Title || "Fast Nationwide Delivery",
      desc:
        settings.aboutFeature3Desc ||
        "Enjoy rapid delivery with real-time order tracking and flexible cash-on-delivery options across the country.",
    },
    {
      icon: Headphones,
      title: settings.aboutFeature4Title || "24/7 Dedicated Support",
      desc:
        settings.aboutFeature4Desc ||
        "Backed by Futgensoft's dedicated tech and support team, we are always ready to answer your questions and assist you.",
    },
  ];

  const storyParagraphs = aboutStory.split("\n\n").filter(Boolean);

  return (
    <div className="bg-[#FFFBF5] dark:bg-stone-950 text-stone-800 dark:text-stone-200 transition-colors">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-6xl space-y-16">
        
        {/* --- Hero Section --- */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Modern General Store • Powered by Futgensoft</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            {aboutTitle}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            {aboutSubtitle}
          </p>
        </div>

        {/* --- Our Story Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600 dark:text-orange-400">
                Behind the Brand
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                Our Story & Vision
              </h2>
            </div>

            <div className="space-y-4 text-stone-600 dark:text-stone-300 leading-relaxed text-base sm:text-lg">
              {storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Quick Stat Pill Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                <div className="text-xl sm:text-2xl font-black text-orange-600">100%</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Genuine Items</div>
              </div>
              <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                <div className="text-xl sm:text-2xl font-black text-orange-600">Fast</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Nationwide Delivery</div>
              </div>
              <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm text-center col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-black text-orange-600">24/7</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Customer Helpline</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 aspect-[16/10]">
              <Image
                src={aboutImage}
                alt={`${siteTitle} General Store Fulfillment & Team`}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/20 dark:border-stone-800 flex items-center justify-between text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Verified E-Commerce Operations</span>
                </div>
                <span className="text-orange-600 dark:text-orange-400 font-extrabold uppercase text-[11px] tracking-wider">
                  Future com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Mission & Core Values --- */}
        <div className="space-y-10">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="max-w-3xl space-y-3 relative z-10">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-100">
                Core Purpose
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Our Mission & Promise
              </h2>
              <p className="text-base sm:text-lg text-amber-50 leading-relaxed font-medium">
                {aboutMission}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Contact & CTA Section --- */}
        <div className="bg-white dark:bg-stone-900 p-8 sm:p-12 rounded-3xl border border-stone-200 dark:border-stone-800 text-center space-y-6 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Have Questions or Need Assistance?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-base">
            Our support team is always ready to assist you with order inquiries, product details, or corporate partnerships.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <span>Contact Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${(settings.whatsappNumber || "01974003819").replace(/^0/, "880")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
