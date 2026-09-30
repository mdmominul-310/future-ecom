import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  siteTitle: string;
  siteDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  favicon: string;
  logo: string;
  lightLogo?: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  address: string;
  workingHours: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  pinterest: string;
  footerDescription: string;
  copyrightText: string;
  announcementBarText: string;
  showAnnouncementBar: boolean;
  freeShippingThreshold: number;

  // About Section Fields
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory: string;
  aboutMission: string;
  aboutImage: string;
  aboutFeature1Title: string;
  aboutFeature1Desc: string;
  aboutFeature2Title: string;
  aboutFeature2Desc: string;
  aboutFeature3Title: string;
  aboutFeature3Desc: string;
  aboutFeature4Title: string;
  aboutFeature4Desc: string;

  // Analytics & Pixel Tracking
  gtmId: string;
  enableGtm: boolean;
  fbPixelId: string;
  enableFbPixel: boolean;
  googleAnalyticsId: string;
  enableGoogleAnalytics: boolean;
  customHeadScript: string;
  customBodyScript: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteTitle: { type: String, default: "Future com" },
    siteDescription: {
      type: String,
      default:
        "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality groceries at the best prices.",
    },
    metaTitle: {
      type: String,
      default: "Future com | Premier Online General Store",
    },
    metaDescription: {
      type: String,
      default:
        "Shop top-tier electronics, modern lifestyle, daily essentials, and fashion at Future com - quality guaranteed with fast delivery nationwide.",
    },
    keywords: {
      type: String,
      default:
        "Future com, online general store, shopping bangladesh, electronics, fashion, home essentials, daily goods, futgensoft",
    },
    favicon: { type: String, default: "/favicon.ico" },
    logo: { type: String, default: "/logo.png" },
    lightLogo: { type: String, default: "" },
    supportPhone: { type: String, default: "+880 1974-003819" },
    supportEmail: { type: String, default: "support@futgensoft.com" },
    whatsappNumber: { type: String, default: "01974003819" },
    address: { type: String, default: "Dhaka, Bangladesh" },
    workingHours: { type: String, default: "24/7 Helpline & Customer Support" },
    facebook: { type: String, default: "https://facebook.com/futgensoft" },
    twitter: { type: String, default: "https://twitter.com/futgensoft" },
    instagram: { type: String, default: "https://instagram.com/futgensoft" },
    youtube: { type: String, default: "https://youtube.com/@futgensoft" },
    linkedin: { type: String, default: "https://linkedin.com/company/futgensoft" },
    pinterest: { type: String, default: "https://pinterest.com" },
    footerDescription: {
      type: String,
      default:
        "Future com is a next-generation general store offering a curated selection of electronics, daily essentials, apparel, and lifestyle products. We ensure authentic products, competitive pricing, and fast delivery.",
    },
    copyrightText: { type: String, default: "Future com. All Rights Reserved." },
    announcementBarText: {
      type: String,
      default: "Free Express Shipping on orders over ৳2,000! | Welcome to Future com",
    },
    showAnnouncementBar: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 2000 },

    // About Section
    aboutTitle: { type: String, default: "Welcome to Future com" },
    aboutSubtitle: {
      type: String,
      default:
        "Where cutting-edge technology meets everyday lifestyle essentials in one modern general store.",
    },
    aboutStory: {
      type: String,
      default:
        "Future com was founded with a forward-looking vision: to revolutionize the e-commerce and general retail landscape in Bangladesh. In partnership with Futgensoft's digital technology infrastructure, we deliver an extensive, carefully vetted catalog spanning modern electronics, gadgets, home goods, fashion, and daily essentials directly to your doorstep.\n\nWe eliminate the hassle of traditional shopping by offering authentic products, transparent pricing, secure payment methods, and speedy nationwide fulfillment. Every product is backed by rigorous quality assurance and dependable customer care.",
    },
    aboutMission: {
      type: String,
      default:
        "Our mission is to empower households and modern shoppers across Bangladesh with immediate access to authentic, high-quality general merchandise, seamless online ordering, and uncompromising post-sale support.",
    },
    aboutImage: { type: String, default: "/about-futurecom.png" },
    aboutFeature1Title: {
      type: String,
      default: "100% Authentic Guarantee",
    },
    aboutFeature1Desc: {
      type: String,
      default:
        "All products are sourced directly from verified manufacturers and distributors with strict quality control.",
    },
    aboutFeature2Title: {
      type: String,
      default: "Next-Gen General Store",
    },
    aboutFeature2Desc: {
      type: String,
      default:
        "From smart tech and home utilities to lifestyle and daily necessities, find everything you need in one destination.",
    },
    aboutFeature3Title: {
      type: String,
      default: "Fast Nationwide Delivery",
    },
    aboutFeature3Desc: {
      type: String,
      default:
        "Enjoy rapid delivery with real-time order tracking and flexible cash-on-delivery options across the country.",
    },
    aboutFeature4Title: {
      type: String,
      default: "24/7 Dedicated Support",
    },
    aboutFeature4Desc: {
      type: String,
      default:
        "Backed by Futgensoft's dedicated tech and support team, we are always ready to answer your questions and assist you.",
    },

    // Analytics & Pixel Tracking
    gtmId: { type: String, default: "" },
    enableGtm: { type: Boolean, default: true },
    fbPixelId: { type: String, default: "" },
    enableFbPixel: { type: Boolean, default: true },
    googleAnalyticsId: { type: String, default: "" },
    enableGoogleAnalytics: { type: Boolean, default: true },
    customHeadScript: { type: String, default: "" },
    customBodyScript: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
