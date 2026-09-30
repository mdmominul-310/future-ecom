import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/lib/ReduxProvider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import GTMPageview from "@/components/GTMPageview";
import { getSiteSettings } from "@/lib/api/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title =
    settings.metaTitle ||
    settings.siteTitle ||
    "Future com | Premier Online General Store";
  const description =
    settings.metaDescription ||
    settings.siteDescription ||
    "Your premier modern general store delivering everyday lifestyle essentials, electronics, fashion, home goods, and quality products at the best prices.";
  const keywords = settings.keywords
    ? settings.keywords.split(",").map((k) => k.trim())
    : [
        "Future com",
        "online general store",
        "shopping bangladesh",
        "electronics",
        "fashion",
        "home essentials",
        "daily goods",
        "futgensoft",
      ];
  const favicon = settings.favicon || "/favicon.ico";
  const logo = settings.logo || "/logo.png";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://futgensoft.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.siteTitle || "Future com"}`,
    },
    description,
    keywords,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings.siteTitle || "Future com",
      images: [
        {
          url: logo,
          width: 1200,
          height: 630,
          alt: `${settings.siteTitle || "Future com"} Logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logo],
    },
    authors: [{ name: settings.siteTitle || "Future com", url: siteUrl }],
    creator: settings.siteTitle || "Future com",
    publisher: "Futgensoft",
  };
}

import { TrackingScripts, TrackingNoScript } from "@/components/TrackingScripts";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = (await getSiteSettings().catch(() => ({}))) as any;
  const gtmId = settings.gtmId || process.env.NEXT_PUBLIC_GTM_ID || "";
  const enableGtm = settings.enableGtm !== false;
  const fbPixelId = settings.fbPixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "";
  const enableFbPixel = settings.enableFbPixel !== false;
  const googleAnalyticsId = settings.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || "";
  const enableGoogleAnalytics = settings.enableGoogleAnalytics !== false;

  return (
    <html lang="en">
      <head>
        <Suspense>
          <TrackingScripts
            gtmId={gtmId}
            enableGtm={enableGtm}
            fbPixelId={fbPixelId}
            enableFbPixel={enableFbPixel}
            googleAnalyticsId={googleAnalyticsId}
            enableGoogleAnalytics={enableGoogleAnalytics}
            customHeadScript={settings.customHeadScript}
            customBodyScript={settings.customBodyScript}
          />
        </Suspense>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TrackingNoScript
          gtmId={gtmId}
          enableGtm={enableGtm}
          fbPixelId={fbPixelId}
          enableFbPixel={enableFbPixel}
        />

        <ReduxProvider>{children}</ReduxProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
