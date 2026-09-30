import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { name, description, image } = await req.json();

    const trimmedName = name ? name.trim() : "";

    if (!trimmedName || !image) {
      return NextResponse.json(
        { message: "Name and image are required fields" },
        { status: 400 }
      );
    }

    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "categories",
      quality: "auto:low",
    });

    // ✔️ FIX: Added the 'remove' option to preserve Bangla characters.
    const slug = slugify(trimmedName, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });

    if (!slug) {
      return NextResponse.json(
        { message: "Failed to generate a valid slug from the provided name." },
        { status: 400 }
      );
    }

    const newCategory = await Category.create({
      name: trimmedName,
      slug: slug,
      description,
      image: {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err) {
    console.error(err);
    if (err instanceof Error && "code" in err && (err as any).code === 11000) {
      return NextResponse.json(
        { message: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }
    if (err instanceof Error && err.name === "ValidationError") {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
