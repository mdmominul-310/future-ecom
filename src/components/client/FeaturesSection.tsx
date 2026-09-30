// /src/components/client/FeaturesSection.tsx
"use client"; // 1. Convert to a Client Component to enable animations

import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { Ri24HoursLine } from "react-icons/ri";
import { BsCashCoin } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { IconType } from "react-icons";
import { motion, Variants } from "framer-motion"; // 2. Import Framer Motion

// Define the structure for a single feature
type Feature = {
  icon: IconType;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: TbTruckDelivery,
    title: "দ্রুত হোম ডেলিভারি",
    description: "সারাদেশে দ্রুততম সময়ে ডেলিভারি",
  },
  {
    icon: Ri24HoursLine,
    title: "নির্ভরযোগ্য গ্রাহকসেবা",
    description: "আপনার প্রয়োজনে আমরা আছি সার্বক্ষণিক",
  },
  {
    icon: BsCashCoin,
    title: "ক্যাশ অন ডেলিভারি",
    description: "পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা",
  },
  {
    icon: GoVerified,
    title: "শতভাগ অরিজিনাল পণ্য",
    description: "প্রতিটি পণ্যের গুণগত মানের নিশ্চয়তা",
  },
];

// 3. Define animation variants for the container and items
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Each item will animate 0.2s after the previous one
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const FeaturesSection = () => {
  return (
    <motion.section
      className="bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16 border-y border-stone-200/60 dark:border-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-gray-800/80 border border-stone-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                variants={itemVariants}
              >
                <div className="mb-4 p-4 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon size={36} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
