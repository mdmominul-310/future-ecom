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
  image: slide.image.url,
  url: slide.url,
  linkType: slide.linkType,
  linkedId: slide.linkedId,
});

// PUT (Update) a specific hero slide
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();
    const { title, subtitle, description, image, url, linkType, linkedId } =
      body;

    const slideToUpdate = await HeroSlide.findById(id);
    if (!slideToUpdate) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    let imagePayload = slideToUpdate.image;

    // Check if the image is a new base64 string to be uploaded
    if (image && image.startsWith("data:image")) {
      // It's a new image, so delete the old one from Cloudinary first
      if (slideToUpdate.image?.public_id) {
        await cloudinary.uploader.destroy(slideToUpdate.image.public_id);
      }

      // Upload the new image
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "hero-slides",
        quality: "auto:low",
      });
      imagePayload = {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      };
    }

    const updatedData = {
      title,
      subtitle,
      description,
      image: imagePayload,
      url,
      linkType,
      linkedId,
    };

    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedSlide) {
      return NextResponse.json(
        { message: "Slide not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json(transformSlide(updatedSlide));
  } catch (error: any) {
    console.error(`Failed to update slide ${id}:`, error);
    return NextResponse.json(
      { message: "Failed to update slide", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a specific hero slide
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();

    const slideToDelete = await HeroSlide.findByIdAndDelete(id);

    if (!slideToDelete) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    // Delete the associated image from Cloudinary
    if (slideToDelete.image?.public_id) {
      await cloudinary.uploader.destroy(slideToDelete.image.public_id);
    }

    return NextResponse.json(
      { message: "Slide deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Failed to delete slide ${id}:`, error);
    return NextResponse.json(
      { message: "Failed to delete slide", error: error.message },
      { status: 500 }
    );
  }
}
