import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/auth";
import LandingPage from "@/models/LandingPage";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// GET a single landing page by ID
export async function GET(
  _req: NextRequest, // FIX: Prefixed 'req' with '_' as it's unused
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const landingPage = await LandingPage.findById(id).populate({
      path: "product",
      model: Product,
    });
    if (!landingPage) {
      return NextResponse.json(
        { message: "Landing page not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(landingPage, { status: 200 });
  } catch (error) {
    console.error("Error fetching landing page:", error); // FIX: Prefixed 'error' with '_' as it's unused
    // FIX: Prefixed 'error' with '_' as it's unused
    // We are not logging the specific error here, just returning a generic message
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE a landing page by ID
export async function PUT(
  req: NextRequest, // 'req' is used here, so no change needed
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const currentPage = await LandingPage.findById(id);
    if (!currentPage) {
      return NextResponse.json(
        { message: "Landing page not found" },
        { status: 404 }
      );
    }

    const uploadImage = async (imgData: string) => {
      if (!imgData || !imgData.startsWith("data:")) return null;
      const uploaded = await cloudinary.uploader.upload(imgData, {
        folder: "landing_pages",
      });
      return { public_id: uploaded.public_id, url: uploaded.secure_url };
    };

    // 1. Handle Review Screenshot Deletions
    const oldScreenshotIds = currentPage.content.reviewScreenshots.map(
      (img) => img.public_id
    );
    const newScreenshotIds = content.reviewScreenshots
      .map((img: any) => img.public_id)
      .filter(Boolean);
    const idsToDelete = oldScreenshotIds.filter(
      (id) => !newScreenshotIds.includes(id)
    );
    if (idsToDelete.length > 0) {
      await cloudinary.api.delete_resources(idsToDelete);
    }

    // 2. Handle Review Screenshot Uploads
    if (content.reviewScreenshots && Array.isArray(content.reviewScreenshots)) {
      const processedScreenshots = await Promise.all(
        content.reviewScreenshots.map(
          (img: { url: string; public_id: string }) =>
            img.url.startsWith("blob:") ? uploadImage(img.url) : img
        )
      );
      content.reviewScreenshots = processedScreenshots.filter(Boolean);
    }

    const updatedLandingPage = await LandingPage.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Landing page updated successfully!",
        landingPage: updatedLandingPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating landing page:", error); // 'error' is used here
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE a landing page by ID
export async function DELETE(
  _req: NextRequest, // FIX: Prefixed 'req' with '_' as it's unused
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const pageToDelete = await LandingPage.findById(id);
    if (!pageToDelete) {
      return NextResponse.json(
        { message: "Landing page not found" },
        { status: 404 }
      );
    }

    const screenshotIds = pageToDelete.content.reviewScreenshots.map(
      (img) => img.public_id
    );
    if (screenshotIds.length > 0) {
      await cloudinary.api.delete_resources(screenshotIds);
    }
    if (pageToDelete.content.heroImage?.public_id) {
      await cloudinary.uploader.destroy(
        pageToDelete.content.heroImage.public_id
      );
    }

    await LandingPage.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Landing page deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting landing page:", error); // 'error' is used here
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
