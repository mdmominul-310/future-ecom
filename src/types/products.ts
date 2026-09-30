// --- START: MODIFICATION ---
// Define and export the Variant type so it can be imported elsewhere
export interface Variant {
  _id?: string;
  name: string;
  salePrice: number; // Original price
  price: number; // Discounted price
  discount?: number; // Calculated discount
  sku?: string;
  stock: number;
}
// --- END: MODIFICATION ---

export interface CloudinaryImage {
  public_id: string;
  url: string;
}

export type ImageType = CloudinaryImage | string;

export interface ProductData {
  _id?: string;
  name: string;
  description: string;
  shortDescription?: string;
  keyFeatures?: string[];
  price: number;
  salePrice?: number;
  discount?: number;
  buyPrice?: number;
  costPerProduct?: number;
  sku: string;
  stock: number;
  subcategory?: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warranty?: string;
  returnPolicy?: string;
  videoUrl?: string;
  tags?: string[];
  images: ImageType[];
  additionalImages?: ImageType[];
  specifications: { name: string; value: string }[];
  colors: { _id: string; name: string; value: string; description?: string }[];
  sizes: { _id: string; name: string; value: string; description?: string }[];
  rating?: number;
  reviewsCount?: number;
  soldCount?: number;
  clickCount?: number;
  revenueGenerated?: number;
  wishlistCount?: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  currency?: string;
  status?: string;
  category?: Category | string;
  // --- START: MODIFICATION ---
  // Add the variants array to the main product data type
  variants: Variant[];
  // --- END: MODIFICATION ---
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string;
  subcategories?: Category[];
}
