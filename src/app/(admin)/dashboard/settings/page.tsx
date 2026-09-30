import Link from "next/link";
import React from "react";
import { FiImage, FiClock, FiSliders, FiGlobe, FiPhoneCall, FiShare2 } from "react-icons/fi";

const settingsOptions = [
  {
    title: "General & Site Settings",
    description: "Manage site title, logo, favicon, SEO meta tags, contact details, social links & footer.",
    link: "/dashboard/settings/general",
    icon: <FiSliders className="w-8 h-8 text-orange-500" />,
    badge: "System Core",
  },
  {
    title: "Herobanner Management",
    description: "Manage main hero slides and banners on your homepage.",
    link: "/dashboard/settings/hero-banner-management",
    icon: <FiImage className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Timer Offer Banner Management",
    description: "Create and manage limited-time campaign offer banners.",
    link: "/dashboard/settings/timer-banner-management",
    icon: <FiClock className="w-8 h-8 text-green-500" />,
  },
];

const SettingsPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-white">
          System & Content Settings
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Configure site identity, branding, SEO metadata, contact information, social links, and homepage banners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option, index) => (
          <Link
            href={option.link}
            key={index}
            className="block group"
          >
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col items-start h-full shadow-sm hover:shadow-lg hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center justify-between w-full mb-4">
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl group-hover:scale-110 transition-transform">
                  {option.icon}
                </div>
                {option.badge && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 rounded-full border border-orange-200 dark:border-orange-800">
                    {option.badge}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 group-hover:text-orange-600 transition-colors mb-2">
                {option.title}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
                {option.description}
              </p>
              <div className="mt-auto flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                Configure Settings &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
