import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

// GET /api/products/[id]/reviews - Get all reviews for a product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const id = (await params).id;
  try {
    const reviews = await Review.find({ product: id }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      averageRating: parseFloat(avgRating.toFixed(1)),
      reviewsCount: reviews.length,
      reviews,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch reviews", error },
      { status: 500 }
    );
  }
}
