import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import cloudinary from "@/lib/cloudinary";

interface UploadedImage {
  public_id: string;
  url: string;
}

// GET all reviews for the admin dashboard
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const rating = searchParams.get("rating"); // Get rating from URL

    const query: { [key: string]: any } = {};

    // Filter by status if provided and valid
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    // Filter by rating if provided and valid
    if (rating) {
      const ratingNumber = parseInt(rating, 10);
      if (!isNaN(ratingNumber) && ratingNumber >= 1 && ratingNumber <= 5) {
        query.rating = ratingNumber;
      }
    }

    const reviews = await Review.find(query)
      .populate({
        path: "product",
        select: "name images",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review (existing function)
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { productId, rating, comment, name, images } = body;

    if (!productId || !rating || !comment || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let uploadedImages: UploadedImage[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((img: string) => {
        return cloudinary.uploader.upload(img, {
          folder: "reviews",
          quality: "auto:low",
        });
      });
      const uploadResults = await Promise.all(uploadPromises);
      uploadedImages = uploadResults.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
      }));
    }

    const reviewData = {
      product: productId,
      name,
      rating,
      comment,
      images: uploadedImages,
      // The 'status' will default to 'pending' from the schema
    };

    const newReview = await Review.create(reviewData);

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (error: unknown) {
    let message = "Failed to create review";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Critical Error in review creation:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
