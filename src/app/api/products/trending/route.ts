import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/trending
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const trendingProducts = await Product.find({ status: "published" })
      .sort({
        clickCount: -1,
        wishlistCount: -1,
        soldCount: -1,
      })
      .limit(limit)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    return NextResponse.json({ products: trendingProducts });
  } catch (error: unknown) {
    let message = "Failed to fetch trending products";

    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Error fetching trending products:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
