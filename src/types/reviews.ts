// types/reviews.ts (Create this file if it doesn't exist, or add to existing types file)

import { ProductData } from "./products"; // Assuming products.ts defines ProductData

export interface ReviewData {
  id: string; // Unique ID for the review
  rating: number; // 1-5 star rating
  text: string;
  customerName: string;
  verified: boolean; // For the green checkmark
  reviewedProduct: ProductData; // The product associated with the review
}
