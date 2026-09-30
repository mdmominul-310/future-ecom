import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { connectDB } from "@/lib/mongodb";

// --- GET All Reviews ---
export async function GET() {
  await connectDB();
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

// --- POST a New Review ---
export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const { name, comment, rating } = body;

    if (!name || !comment || !rating) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = await Review.create({ name, comment, rating });

    return NextResponse.json(
      { success: true, data: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
