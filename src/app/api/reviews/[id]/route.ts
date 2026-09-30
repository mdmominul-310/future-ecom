import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

// --- GET a single review by ID ---
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    console.error("[API_REVIEWS_ID_GET]", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

// --- PUT (update) a review by ID ---
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, comment, rating } = body;

    // Build the update object with only the fields that are provided
    const updateData: { name?: string; comment?: string; rating?: number } = {};
    if (name) updateData.name = name;
    if (comment) updateData.comment = comment;
    if (rating) updateData.rating = rating;

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedReview },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_REVIEWS_ID_PUT]", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

// --- DELETE a review by ID ---
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API_REVIEWS_ID_DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
