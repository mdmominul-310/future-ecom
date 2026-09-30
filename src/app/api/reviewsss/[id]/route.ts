// /src/app/api/reviews/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import mongoose from "mongoose";

// Helper function to update product rating
async function updateProductRating(productId: string) {
  try {
    // Get all approved reviews for this product
    const reviews = await Review.find({
      product: productId,
      status: "approved",
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Update product
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal place
      reviewsCount: reviews.length,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}

// GET /api/reviews/[id] - Get a single review
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const id = (await params).id;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(id)
      .populate("product", "name slug images")
      .populate("user", "name email image");

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update a review
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const id = (await params).id;
    const body = await req.json();

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the review
    // This should be implemented with proper authentication
    // For now, we'll just check the user ID in the request body
    // if (body.user && review.user.toString() !== body.user) {
    //   return NextResponse.json(
    //     { message: "Unauthorized to update this review" },
    //     { status: 403 }
    //   );
    // }

    // Validate rating if it's being updated
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("product", "name slug images")
      .populate("user", "name email image");

    // Update product rating if review status or rating changed
    if (
      body.status === "approved" ||
      body.status === "rejected" ||
      body.rating
    ) {
      await updateProductRating(review.product.toString());
    }

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const id = (await params).id;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Find review
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Store product ID for rating update
    const productId = review.product.toString();

    // Delete review
    await Review.findByIdAndDelete(id);

    // Update product rating
    await updateProductRating(productId);

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
