import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import cloudinary from "@/lib/cloudinary";

// Helper to transform slide data for the frontend
const transformSlide = (slide: any) => ({
  _id: slide._id.toString(),
  title: slide.title,
  subtitle: slide.subtitle,
  description: slide.description,
  image: slide.image.url, // Send only the image URL string
  url: slide.url,
  linkType: slide.linkType,
  linkedId: slide.linkedId,
});

// GET all hero slides
export async function GET() {
  try {
    await connectDB();
    // Sort by creation date to allow for manual re-ordering later if needed
    const slides = await HeroSlide.find({}).sort({ createdAt: "asc" });

    return NextResponse.json(slides.map(transformSlide));
  } catch (error: any) {
    console.error("Failed to fetch hero slides:", error);
    return NextResponse.json(
      { message: "Failed to fetch hero slides", error: error.message },
      { status: 500 }
    );
  }
}

// POST a new hero slide
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, subtitle, description, image, url, linkType, linkedId } =
      body;

    // Basic validation
    if (!title || !subtitle || !image || !url || !linkType || !linkedId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload the new image (which is a base64 string) to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "hero-slides",
      quality: "auto:low",
    });

    const newSlide = await HeroSlide.create({
      title,
      subtitle,
      description,
      image: {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      },
      url,
      linkType,
      linkedId,
    });

    return NextResponse.json(transformSlide(newSlide), { status: 201 });
  } catch (error: any) {
    console.error("Failed to create hero slide:", error);
    return NextResponse.json(
      { message: "Failed to create hero slide", error: error.message },
      { status: 500 }
    );
  }
}
