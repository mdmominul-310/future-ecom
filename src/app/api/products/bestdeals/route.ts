import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const deals = await Product.find({
      status: "published",
      $or: [
        { discount: { $gt: 0 } },
        { $expr: { $lt: ["$salePrice", "$price"] } },
      ],
    })
      .sort({ discount: -1 })
      .limit(limit)
      .populate("category", "name slug");
    // .populate("subcategory", "name slug");

    return NextResponse.json({ products: deals });
  } catch (error: any) {
    console.error("Error fetching best deals:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch best deals" },
      { status: 500 }
    );
  }
}
