import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CampaignBanner from "@/models/CampaignBanner";
import cloudinary from "@/lib/cloudinary";

// GET all campaign banners, or only the active one
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const getActive = url.searchParams.get("active");

    // If '?active=true' is in the URL, return only the active banner
    if (getActive === "true") {
      const activeBanner = await CampaignBanner.findOne({ isActive: true });
      // It's okay if no active banner is found, return null in that case
      return NextResponse.json(activeBanner);
    }

    // Otherwise, return all banners for the management page
    const allBanners = await CampaignBanner.find({}).sort({ createdAt: -1 });
    return NextResponse.json(allBanners);
  } catch (error: any) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json(
      { message: "Failed to fetch banners", error: error.message },
      { status: 500 }
    );
  }
}

// POST a new campaign banner
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, image, targetDate, linkedProductId, isActive } =
      body;

    // Validate required fields
    if (!title || !description || !image || !targetDate || !linkedProductId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload the image (assumed to be a base64 string) to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "campaign_banners",
      quality: "auto:low",
    });

    const newBanner = new CampaignBanner({
      title,
      description,
      image: {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      },
      targetDate,
      linkedProductId,
      isActive,
    });

    // Save the new banner. The 'pre-save' hook in the schema will handle deactivating others.
    await newBanner.save();

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create banner:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create banner", error: error.message },
      { status: 500 }
    );
  }
}
