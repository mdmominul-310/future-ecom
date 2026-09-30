import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        siteTitle: "Future com",
        siteDescription:
          "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality products at the best prices.",
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
        announcementBarText:
          "Free Express Shipping on orders over ৳2,000! | Welcome to Future com",
        showAnnouncementBar: true,
        freeShippingThreshold: 2000,
      });
    } else if (settings.siteTitle === "Burmese Bazaar" || !settings.siteTitle) {
      // Auto-migrate legacy default text to Future com
      settings.siteTitle = "Future com";
      settings.siteDescription =
        "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality products at the best prices.";
      settings.metaTitle = "Future com | Premier Online General Store";
      settings.metaDescription =
        "Shop top-tier electronics, modern lifestyle, daily essentials, and fashion at Future com - quality guaranteed with fast delivery nationwide.";
      settings.keywords =
        "Future com, online general store, shopping bangladesh, electronics, fashion, home essentials, daily goods, futgensoft";
      settings.supportPhone = "+880 1974-003819";
      settings.supportEmail = "support@futgensoft.com";
      settings.whatsappNumber = "01974003819";
      settings.address = "Dhaka, Bangladesh";
      settings.workingHours = "24/7 Helpline & Customer Support";
      settings.facebook = "https://facebook.com/futgensoft";
      settings.twitter = "https://twitter.com/futgensoft";
      settings.instagram = "https://instagram.com/futgensoft";
      settings.youtube = "https://youtube.com/@futgensoft";
      settings.linkedin = "https://linkedin.com/company/futgensoft";
      settings.footerDescription =
        "Future com is a next-generation general store offering a curated selection of electronics, daily essentials, apparel, and lifestyle products. We ensure authentic products, competitive pricing, and fast delivery.";
      settings.copyrightText = "Future com. All Rights Reserved.";
      settings.announcementBarText =
        "Free Express Shipping on orders over ৳2,000! | Welcome to Future com";
      settings.logo = "/logo.png";
    }

    if (settings && !settings.aboutTitle) {
      settings.aboutTitle = "Welcome to Future com";
      settings.aboutSubtitle =
        "Where cutting-edge technology meets everyday lifestyle essentials in one modern general store.";
      settings.aboutStory =
        "Future com was founded with a forward-looking vision: to revolutionize the e-commerce and general retail landscape in Bangladesh. In partnership with Futgensoft's digital technology infrastructure, we deliver an extensive, carefully vetted catalog spanning modern electronics, gadgets, home goods, fashion, and daily essentials directly to your doorstep.\n\nWe eliminate the hassle of traditional shopping by offering authentic products, transparent pricing, secure payment methods, and speedy nationwide fulfillment. Every product is backed by rigorous quality assurance and dependable customer care.";
      settings.aboutMission =
        "Our mission is to empower households and modern shoppers across Bangladesh with immediate access to authentic, high-quality general merchandise, seamless online ordering, and uncompromising post-sale support.";
      settings.aboutImage = "/about-futurecom.png";
      settings.aboutFeature1Title = "100% Authentic Guarantee";
      settings.aboutFeature1Desc =
        "All products are sourced directly from verified manufacturers and distributors with strict quality control.";
      settings.aboutFeature2Title = "Next-Gen General Store";
      settings.aboutFeature2Desc =
        "From smart tech and home utilities to lifestyle and daily necessities, find everything you need in one destination.";
      settings.aboutFeature3Title = "Fast Nationwide Delivery";
      settings.aboutFeature3Desc =
        "Enjoy rapid delivery with real-time order tracking and flexible cash-on-delivery options across the country.";
      settings.aboutFeature4Title = "24/7 Dedicated Support";
      settings.aboutFeature4Desc =
        "Backed by Futgensoft's dedicated tech and support team, we are always ready to answer your questions and assist you.";
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    let settings = await SiteSettings.findOne();

    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      settings = await SiteSettings.create(body);
    }

    return NextResponse.json({
      success: true,
      message: "Site settings updated successfully!",
      data: settings,
    });
  } catch (error: any) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update site settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
