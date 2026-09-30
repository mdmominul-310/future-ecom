import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import LandingPage from "@/models/LandingPage";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

// GET function can remain the same for listing pages
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectDB();
    const landingPages = await LandingPage.find({})
      .populate({ path: "product", select: "name images slug" })
      .sort({ createdAt: -1 });
    return NextResponse.json(landingPages);
  } catch (error) {
    console.error("API_LANDING_PAGES_GET_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @desc    Create or update a landing page (Upsert), handles image uploads
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectDB();

    const body = await req.json();
    const { productId, content } = body;

    if (!productId || !content) {
      return new NextResponse("Product ID and content are required", {
        status: 400,
      });
    }

    // Helper to upload base64 images to Cloudinary
    const uploadImage = async (imgData: string) => {
      if (!imgData || !imgData.startsWith("data:image")) return null;
      const uploaded = await cloudinary.uploader.upload(imgData, {
        folder: "landing_pages",
      });
      return { public_id: uploaded.public_id, url: uploaded.secure_url };
    };

    // Process review screenshots: upload new ones, keep existing ones
    if (content.reviewScreenshots && Array.isArray(content.reviewScreenshots)) {
      const processedScreenshots = await Promise.all(
        content.reviewScreenshots.map((img: string | { url: string }) =>
          typeof img === "string"
            ? uploadImage(img)
            : // if it's an object with a temporary blob url, upload it
            img.url.startsWith("blob:")
            ? uploadImage(img.url)
            : img
        )
      );
      content.reviewScreenshots = processedScreenshots.filter(Boolean);
    }

    // Process hero image if it's a new upload
    if (
      content.heroImage &&
      typeof content.heroImage.url === "string" &&
      content.heroImage.url.startsWith("data:image")
    ) {
      const uploadedHero = await uploadImage(content.heroImage.url);
      if (uploadedHero) content.heroImage = uploadedHero;
    }

    const product = await Product.findById(productId).select("slug");
    if (!product) {
      return new NextResponse("Associated product not found", { status: 404 });
    }

    const landingPageData = {
      product: productId,
      content: content,
      urlSlug: `promo/${product.slug}`,
    };

    // Find and update, or create if it doesn't exist
    const newOrUpdatedPage = await LandingPage.findOneAndUpdate(
      { product: productId },
      landingPageData,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Landing page saved successfully!",
      landingPage: newOrUpdatedPage,
    });
  } catch (error: any) {
    console.error("API_LANDING_PAGES_POST_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
