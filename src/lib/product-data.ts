import { cache } from "react";

// --- Type Definitions ---
interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  images: { url: string }[];
  price: number;
  salePrice?: number;
  stock: number;
  category: { _id: string; name: string; slug: string };
  rating: number;
  reviewsCount: number;
  sku: string;
  brand?: { name: string };
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  currency?: string;
}

interface Review {
  rating: number;
  comment: string;
  name: string;
}

/**
 * Fetches all product IDs to be used by generateStaticParams.
 */
export const getAllProductIds = cache(async (): Promise<{ _id: string }[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?select=_id`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch product IDs from API");
    }
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Error in getAllProductIds:", error);
    return [];
  }
});

/**
 * Fetches the data for a single product and its reviews.
 */
export const getProductData = cache(
  async (
    id: string
  ): Promise<{ product: Product | null; reviews: Review[] }> => {
    try {
      const [productRes, reviewsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/reviews`, {
          cache: "no-store",
        }),
      ]);

      if (!productRes.ok) {
        return { product: null, reviews: [] };
      }

      const product = await productRes.json();
      const reviewsData = reviewsRes.ok
        ? await reviewsRes.json()
        : { reviews: [] };

      return { product, reviews: reviewsData.reviews || [] };
    } catch (error) {
      console.error(`Failed to fetch product data for id ${id}:`, error);
      return { product: null, reviews: [] };
    }
  }
);
