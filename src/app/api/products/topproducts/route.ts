// import dbConnect from "@/lib/dbConnect";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const topProducts = await Product.find()
      .sort({ soldCount: -1 })
      .limit(6)
      .select(
        "name slug soldCount price buyPrice costPerProduct images category"
      )
      .populate("category", "name");

    const result = topProducts.map((product) => {
      const { price, buyPrice, costPerProduct, soldCount } = product;

      const revenue =
        (Number(price || 0) - (Number(buyPrice || 0) + Number(costPerProduct || 0))) *
        Number(soldCount || 0);

      const rawImg = product.images?.[0];
      const image = typeof rawImg === "string" ? rawImg : rawImg?.url || "/placeholder.png";

      return {
        id: product._id,
        name: product.name,
        category: product.category?.name || "General",
        unitsSold: soldCount || 0,
        revenue: Math.max(0, Number(revenue.toFixed(2))),
        image,
        slug: product.slug,
        price: Number(price || 0),
      };
    });

    // res.status(200).json(result);
    return NextResponse.json({
      success: true,
      message: "success",
      products: result,
    });
  } catch (error) {
    console.error("Top Products Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
