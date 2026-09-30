// src/lib/tracking.ts
/**
 * Unified Analytics & Pixel Tracking System for Future com
 * Supports:
 * - Google Tag Manager (GTM) dataLayer with GA4 Enhanced Ecommerce
 * - Meta Pixel (Facebook Pixel) with Standard Events (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)
 * - Google Analytics / Google Tag (gtag)
 */

import { ProductData } from "@/types/products";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track Page Views across all platforms
 */
export const trackPageView = (url: string) => {
  if (typeof window === "undefined") return;

  // 1. Google Tag Manager
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "pageview",
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });

  // 2. Meta (Facebook) Pixel
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }

  // 3. Google Analytics (gtag)
  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

/**
 * Track Product View / ViewContent
 */
export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  variant?: string;
}) => {
  if (typeof window === "undefined" || !product) return;

  // 1. GTM Enhanced Ecommerce: view_item
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: "BDT",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_brand: product.brand || "Future com",
          item_category: product.category,
          item_variant: product.variant,
          quantity: 1,
        },
      ],
    },
  });

  // 2. Meta Pixel: ViewContent
  if (typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      content_category: product.category,
      value: product.price,
      currency: "BDT",
    });
  }

  // 3. Google Analytics (gtag)
  if (typeof window.gtag === "function") {
    window.gtag("event", "view_item", {
      currency: "BDT",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    });
  }
};

/**
 * Track Add to Cart across GTM, Meta Pixel, and Google Analytics
 */
export const trackAddToCart = (product: ProductData | any) => {
  if (typeof window === "undefined" || !product) return;

  const productId = product._id || product.id || product.productId;
  const productName = product.name;
  const price = product.price || 0;
  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : typeof product.category === "string"
      ? product.category
      : undefined;

  // 1. GTM Enhanced Ecommerce: add_to_cart
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "BDT",
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          item_brand: product.brand?.name || product.brand || "Future com",
          item_category: categoryName,
          item_variant: product.variant?.name || product.variant,
          quantity: product.quantity || 1,
        },
      ],
    },
  });

  // 2. Meta Pixel: AddToCart
  if (typeof window.fbq === "function") {
    window.fbq("track", "AddToCart", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      content_category: categoryName,
      value: price * (product.quantity || 1),
      currency: "BDT",
    });
  }

  // 3. Google Analytics (gtag)
  if (typeof window.gtag === "function") {
    window.gtag("event", "add_to_cart", {
      currency: "BDT",
      value: price * (product.quantity || 1),
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: product.quantity || 1,
        },
      ],
    });
  }
};

/**
 * Track Begin Checkout / InitiateCheckout
 */
export const trackInitiateCheckout = (cartItems: any[], totalValue: number) => {
  if (typeof window === "undefined" || !cartItems) return;

  const contentIds = cartItems.map((item) => item.productId || item._id || item.id);
  const gtmItems = cartItems.map((item) => ({
    item_id: item.productId || item._id || item.id,
    item_name: item.name,
    item_variant: item.variant?.name || item.variant,
    price: item.variant?.price ?? item.price,
    quantity: item.quantity || 1,
  }));

  // 1. GTM Enhanced Ecommerce: begin_checkout
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "BDT",
      value: totalValue,
      items: gtmItems,
    },
  });

  // 2. Meta Pixel: InitiateCheckout
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      content_ids: contentIds,
      num_items: cartItems.length,
      value: totalValue,
      currency: "BDT",
    });
  }

  // 3. Google Analytics (gtag)
  if (typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      currency: "BDT",
      value: totalValue,
      items: gtmItems,
    });
  }
};

/**
 * Track Purchase across all platforms
 */
export const trackPurchase = ({
  transactionId,
  totalAmount,
  shipping = 0,
  cartItems = [],
}: {
  transactionId: string;
  totalAmount: number;
  shipping?: number;
  cartItems: any[];
}) => {
  if (typeof window === "undefined") return;

  const contentIds = cartItems.map((item) => item.productId || item._id || item.id);
  const gtmItems = cartItems.map((item) => ({
    item_id: item.productId || item._id || item.id,
    item_name: item.name,
    item_variant: item.variant?.name || item.variant,
    price: item.variant?.price ?? item.price,
    quantity: item.quantity || 1,
  }));

  // 1. GTM Enhanced Ecommerce: purchase
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      value: totalAmount,
      shipping: shipping,
      currency: "BDT",
      items: gtmItems,
    },
  });

  // 2. Meta Pixel: Purchase
  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      content_ids: contentIds,
      content_type: "product",
      value: totalAmount,
      currency: "BDT",
      num_items: cartItems.length,
    });
  }

  // 3. Google Analytics (gtag)
  if (typeof window.gtag === "function") {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: totalAmount,
      shipping: shipping,
      currency: "BDT",
      items: gtmItems,
    });
  }
};

/**
 * Track View Cart
 */
export const trackViewCart = (cartItems: any[], subtotal: number) => {
  if (typeof window === "undefined" || !cartItems || cartItems.length === 0) return;
  const gtmItems = cartItems.map((item) => ({
    item_id: item.productId || item._id || item.id,
    item_name: item.name,
    item_variant: item.variant?.name || item.variant,
    price: item.variant?.price ?? item.price,
    quantity: item.quantity || 1,
  }));

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "view_cart",
    ecommerce: {
      currency: "BDT",
      value: subtotal,
      items: gtmItems,
    },
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", "view_cart", {
      currency: "BDT",
      value: subtotal,
      items: gtmItems,
    });
  }
};

/**
 * Track Category / Product List View
 */
export const trackViewItemList = (categoryName: string, items: any[]) => {
  if (typeof window === "undefined" || !items || items.length === 0) return;
  const gtmItems = items.map((product, index) => ({
    item_id: product._id || product.id,
    item_name: product.name,
    price: product.price,
    item_brand: product.brand?.name || product.brand || "Unbranded",
    item_list_name: categoryName,
    index: index + 1,
  }));

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "view_item_list",
    ecommerce: { item_list_name: categoryName, items: gtmItems },
  });

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", "ViewCategory", {
      content_category: categoryName,
      content_ids: items.slice(0, 10).map((p) => p._id || p.id),
    });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "view_item_list", {
      item_list_name: categoryName,
      items: gtmItems,
    });
  }
};

// Aliases for backward compatibility
export const pageview = trackPageView;
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
