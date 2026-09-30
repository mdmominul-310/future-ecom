import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { cache } from "react";

export type CategorySummary = {
  _id: string;
  name: string;
  slug: string;
  image: {
    public_id: string;
    url: string;
  };
  description?: string;
};

export const getCategories = cache(async (): Promise<CategorySummary[]> => {
  try {
    await connectDB();
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .select("_id name slug image description")
      .lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
});
