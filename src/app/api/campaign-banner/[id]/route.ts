import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CampaignBanner from "@/models/CampaignBanner";
import cloudinary from "@/lib/cloudinary";

// GET a single banner by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const banner = await CampaignBanner.findById(id);
    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(banner);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch banner", error: error.message },
      { status: 500 }
    );
  }
}

// PUT (Update) a specific banner
// PUT (Update) a specific banner
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await params;

    // --- ⬇️ FIXED: Changed 'let' to 'const' ⬇️ ---
    const { image, ...updateData } = body;

    // Input Validation
    if (updateData.title !== undefined && !updateData.title) {
      return NextResponse.json(
        { message: "Title cannot be empty" },
        { status: 400 }
      );
    }
    if (updateData.description !== undefined && !updateData.description) {
      return NextResponse.json(
        { message: "Description cannot be empty" },
        { status: 400 }
      );
    }
    if (updateData.targetDate !== undefined && !updateData.targetDate) {
      return NextResponse.json(
        { message: "Target date is required" },
        { status: 400 }
      );
    }
    if (
      updateData.linkedProductId !== undefined &&
      !updateData.linkedProductId
    ) {
      return NextResponse.json(
        { message: "A linked product is required" },
        { status: 400 }
      );
    }

    const bannerToUpdate = await CampaignBanner.findById(id);
    if (!bannerToUpdate) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 }
      );
    }

    if (image && image.startsWith("data:image")) {
      if (bannerToUpdate.image?.public_id) {
        await cloudinary.uploader.destroy(bannerToUpdate.image.public_id);
      }
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "campaign_banners",
        quality: "auto:low",
      });
      // Note: This MODIFIES the 'updateData' object, but does not REASSIGN the variable.
      updateData.image = {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      };
    }

    Object.assign(bannerToUpdate, updateData);
    const updatedBanner = await bannerToUpdate.save(); // 'pre-save' hook handles logic

    return NextResponse.json(updatedBanner);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update banner", error: error.message },
      { status: 500 }
    );
  }
}
// DELETE a specific banner
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const bannerToDelete = await CampaignBanner.findByIdAndDelete(id);

    if (!bannerToDelete) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 }
      );
    }

    if (bannerToDelete.image?.public_id) {
      await cloudinary.uploader.destroy(bannerToDelete.image.public_id);
    }

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete banner", error: error.message },
      { status: 500 }
    );
  }
}
