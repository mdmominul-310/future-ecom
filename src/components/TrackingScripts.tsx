"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking";

interface TrackingScriptsProps {
  gtmId?: string;
  enableGtm?: boolean;
  fbPixelId?: string;
  enableFbPixel?: boolean;
  googleAnalyticsId?: string;
  enableGoogleAnalytics?: boolean;
  customHeadScript?: string;
  customBodyScript?: string;
}

export function TrackingScripts({
  gtmId,
  enableGtm = true,
  fbPixelId,
  enableFbPixel = true,
  googleAnalyticsId,
  enableGoogleAnalytics = true,
  customHeadScript,
  customBodyScript,
}: TrackingScriptsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGtmId = enableGtm && gtmId ? gtmId.trim() : "";
  const activeFbPixelId = enableFbPixel && fbPixelId ? fbPixelId.trim() : "";
  const activeGaId = enableGoogleAnalytics && googleAnalyticsId ? googleAnalyticsId.trim() : "";

  // Track pageviews on route change
  useEffect(() => {
    if (pathname) {
      const url =
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* 1. GOOGLE TAG MANAGER (GTM) */}
      {activeGtmId && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${activeGtmId}');
            `}
          </Script>
        </>
      )}

      {/* 2. META PIXEL (FACEBOOK PIXEL) */}
      {activeFbPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${activeFbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}

      {/* 3. GOOGLE ANALYTICS (GA4 / GOOGLE TAG) */}
      {activeGaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${activeGaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${activeGaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* 4. CUSTOM HEAD SCRIPTS (TikTok, Pinterest, etc.) */}
      {customHeadScript && (
        <Script id="custom-head-tracking" strategy="afterInteractive">
          {customHeadScript}
        </Script>
      )}

      {/* 5. CUSTOM BODY SCRIPTS */}
      {customBodyScript && (
        <Script id="custom-body-tracking" strategy="lazyOnload">
          {customBodyScript}
        </Script>
      )}
    </>
  );
}

/**
 * Body noscript fallbacks
 */
export function TrackingNoScript({
  gtmId,
  enableGtm = true,
  fbPixelId,
  enableFbPixel = true,
}: {
  gtmId?: string;
  enableGtm?: boolean;
  fbPixelId?: string;
  enableFbPixel?: boolean;
}) {
  const activeGtmId = enableGtm && gtmId ? gtmId.trim() : "";
  const activeFbPixelId = enableFbPixel && fbPixelId ? fbPixelId.trim() : "";

  return (
    <>
      {activeGtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${activeGtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      {activeFbPixelId && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${activeFbPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}
