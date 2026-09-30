// app/api/categories/[id]/route.ts
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";

// app/api/categories/route.ts

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const id = (await params).id;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, description, image } = await req.json();
    const id = (await params).id;
    const category = await Category.findById(id);
    if (!category) return new Response("Category not found", { status: 404 });

    // If image changed, delete the old one and upload new
    if (image && image !== category.image.url) {
      await cloudinary.uploader.destroy(category.image.public_id);
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "categories",
        quality: "auto:low",
        transformation: [{ width: 400, height: 400, crop: "limit" }],
      });
      category.image = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    category.name = name || category.name;
    category.slug = name ? slugify(name, { lower: true }) : category.slug;
    category.description = description || category.description;
    await category.save();

    return Response.json(category);
  } catch (err) {
    console.log(err);
    return new Response("Failed to update category", { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const id = (await params).id;
    const category = await Category.findById(id);
    if (!category) return new Response("Not found", { status: 404 });

    await cloudinary.uploader.destroy(category.image.public_id);
    await Category.findByIdAndDelete(id);

    return new Response("Deleted successfully");
  } catch (err) {
    console.log(err);
    return new Response("Server error", { status: 500 });
  }
}
