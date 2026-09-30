import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Subcategory from "@/models/Subcategory";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const id = (await params).id;
    const subcategory = await Subcategory.findById(id).populate('category', 'name slug');
    if (!subcategory) {
      return NextResponse.json({ message: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, description, image, categoryId } = await req.json();
    const id = (await params).id;
    const subcategory = await Subcategory.findById(id);
    
    if (!subcategory) {
      return new Response("Subcategory not found", { status: 404 });
    }

    // Handle category change if provided
    if (categoryId && categoryId !== subcategory.category.toString()) {
      // Remove subcategory from old category
      await Category.findByIdAndUpdate(
        subcategory.category,
        { $pull: { subcategories: subcategory._id } }
      );
      
      // Add to new category
      await Category.findByIdAndUpdate(
        categoryId,
        { $push: { subcategories: subcategory._id } }
      );
      
      subcategory.category = categoryId;
    }

    // If image changed, delete the old one and upload new
    if (image && image !== (subcategory.image?.url || '')) {
      if (subcategory.image?.public_id) {
        await cloudinary.uploader.destroy(subcategory.image.public_id);
      }
      
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "subcategories",
        quality: "auto:low",
      });
      
      subcategory.image = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }

    subcategory.name = name || subcategory.name;
    subcategory.slug = name ? slugify(name, { lower: true }) : subcategory.slug;
    subcategory.description = description || subcategory.description;
    
    await subcategory.save();

    return Response.json(subcategory);
  } catch (err) {
    console.error(err);
    return new Response("Failed to update subcategory", { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const id = (await params).id;
    const subcategory = await Subcategory.findById(id);
    
    if (!subcategory) {
      return new Response("Subcategory not found", { status: 404 });
    }

    // Remove the subcategory reference from its category
    await Category.findByIdAndUpdate(
      subcategory.category,
      { $pull: { subcategories: subcategory._id } }
    );

    // Delete image from cloudinary if exists
    if (subcategory.image?.public_id) {
      await cloudinary.uploader.destroy(subcategory.image.public_id);
    }
    
    // Delete the subcategory
    await Subcategory.findByIdAndDelete(id);

    return new Response("Subcategory deleted successfully");
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
} 