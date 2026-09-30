import { notFound } from "next/navigation";
import ProductPromoPreview from "@/components/dashboard/marketing/ProductPromoPreview";

// --- Type Definitions ---
interface ImageObject {
  url: string;
  public_id: string;
}

// This interface should match the extended one in your ProductPromoPreview component
interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  images: { url: string; public_id: string }[];
  additionalImages?: { url: string; public_id: string }[];
  price: number;
  salePrice?: number;
  stock: number;
  discount?: number;
  videoUrl?: string;
  variants: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    stock: number;
    discount?: number;
  }[];
  colors: {
    _id: string;
    name: string;
    value: string;
  }[];
  sizes: {
    _id: string;
    name: string;
    value: string;
  }[];
}

// --- FIX: Updated PageContent interface to match the new structure ---
interface PageContent {
  heroHeadline: string;
  heroImage: ImageObject;
  heroFeatures: string[];
  ctaSubheadline: string;
  ctaDescription: string;
  offerSectionHeadline: string;
  offerSectionFeatures: string[];
  comparisonHeadline: string;
  comparisonText: string;
  reviewSectionHeadline: string;
  facebookReviewUrl: string;
  youtubeReviewUrl: string;
  customerReviewHeadline: string;
  phoneNumber: string;
  additionalImagesHeadline: string;
  reviewScreenshots: ImageObject[];
}

interface LandingPageData {
  _id: string;
  product: Product;
  content: PageContent;
  urlSlug: string;
}

// --- Data Fetching Function ---
async function getLandingPageData(id: string): Promise<LandingPageData | null> {
  try {
    // --- FIX: Correct API endpoint (plural) ---
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/landingpage/${id}`,
      {
        // Revalidate cache every 1 second for immediate updates
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch landing page data:", error);
    return null;
  }
}

// --- The Page Component ---
export default async function LandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const landingPageData = await getLandingPageData(id);

  if (!landingPageData) {
    notFound();
  }

  const { product, content } = landingPageData;

  return <ProductPromoPreview product={product} content={content} />;
}
