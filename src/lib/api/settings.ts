import { connectDB } from "@/lib/mongodb";
import SiteSettings, { ISiteSettings } from "@/models/SiteSettings";

export const defaultSettings = {
  siteTitle: "Future com",
  siteDescription:
    "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality groceries at the best prices.",
  metaTitle: "Future com | Premier Online General Store",
  metaDescription:
    "Shop top-tier electronics, modern lifestyle, daily essentials, and fashion at Future com - quality guaranteed with fast delivery nationwide.",
  keywords:
    "Future com, online general store, shopping bangladesh, electronics, fashion, home essentials, daily goods, futgensoft",
  favicon: "/favicon.ico",
  logo: "/logo.png",
  lightLogo: "",
  supportPhone: "+880 1974-003819",
  supportEmail: "support@futgensoft.com",
  whatsappNumber: "01974003819",
  address: "Dhaka, Bangladesh",
  workingHours: "24/7 Helpline & Customer Support",
  facebook: "https://facebook.com/futgensoft",
  twitter: "https://twitter.com/futgensoft",
  instagram: "https://instagram.com/futgensoft",
  youtube: "https://youtube.com/@futgensoft",
  linkedin: "https://linkedin.com/company/futgensoft",
  pinterest: "https://pinterest.com",
  footerDescription:
    "Future com is a next-generation general store offering a curated selection of electronics, daily essentials, apparel, and lifestyle products. We ensure authentic products, competitive pricing, and fast delivery.",
  copyrightText: "Future com. All Rights Reserved.",
  announcementBarText: "Free Express Shipping on orders over ৳2,000! | Welcome to Future com",
  showAnnouncementBar: true,
  freeShippingThreshold: 2000,

  // About Section Defaults
  aboutTitle: "Welcome to Future com",
  aboutSubtitle:
    "Where cutting-edge technology meets everyday lifestyle essentials in one modern general store.",
  aboutStory:
    "Future com was founded with a forward-looking vision: to revolutionize the e-commerce and general retail landscape in Bangladesh. In partnership with Futgensoft's digital technology infrastructure, we deliver an extensive, carefully vetted catalog spanning modern electronics, gadgets, home goods, fashion, and daily essentials directly to your doorstep.\n\nWe eliminate the hassle of traditional shopping by offering authentic products, transparent pricing, secure payment methods, and speedy nationwide fulfillment. Every product is backed by rigorous quality assurance and dependable customer care.",
  aboutMission:
    "Our mission is to empower households and modern shoppers across Bangladesh with immediate access to authentic, high-quality general merchandise, seamless online ordering, and uncompromising post-sale support.",
  aboutImage: "/about-futurecom.png",
  aboutFeature1Title: "100% Authentic Guarantee",
  aboutFeature1Desc:
    "All products are sourced directly from verified manufacturers and distributors with strict quality control.",
  aboutFeature2Title: "Next-Gen General Store",
  aboutFeature2Desc:
    "From smart tech and home utilities to lifestyle and daily necessities, find everything you need in one destination.",
  aboutFeature3Title: "Fast Nationwide Delivery",
  aboutFeature3Desc:
    "Enjoy rapid delivery with real-time order tracking and flexible cash-on-delivery options across the country.",
  aboutFeature4Title: "24/7 Dedicated Support",
  aboutFeature4Desc:
    "Backed by Futgensoft's dedicated tech and support team, we are always ready to answer your questions and assist you.",

  // Analytics & Pixel Tracking
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  enableGtm: true,
  fbPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
  enableFbPixel: true,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
  enableGoogleAnalytics: true,
  customHeadScript: "",
  customBodyScript: "",
};

export async function getSiteSettings(): Promise<Partial<ISiteSettings>> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (settings) {
      return JSON.parse(JSON.stringify(settings));
    }
  } catch (error) {
    console.error("Error fetching site settings in getSiteSettings:", error);
  }
  return defaultSettings as any;
}
