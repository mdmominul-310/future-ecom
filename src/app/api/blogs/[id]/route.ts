// app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

// --- GET a single blog post by ID ---
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// --- PUT (update) a blog post ---
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;

    const body = await req.json();
    const {
      title,
      content,
      imageUrl,
      date,
      status,
      author,
      slug: customSlug,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
    } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(date !== undefined && { date }),
      ...(status !== undefined && { status }),
      ...(author !== undefined && { author }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(metaKeywords !== undefined && { metaKeywords }),
      ...(canonicalUrl !== undefined && { canonicalUrl }),
    };

    if (customSlug) {
      updateData.slug = customSlug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    } else if (title && !existingBlog.slug) {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    if (imageUrl && imageUrl !== existingBlog.imageUrl.url) {
      if (existingBlog.imageUrl && existingBlog.imageUrl.public_id) {
        await cloudinary.uploader.destroy(existingBlog.imageUrl.public_id);
      }
      const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
        folder: "blogs",
        quality: "auto:good",
      });
      updateData.imageUrl = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    // ✅ Corrected line
    console.error("Failed to update blog:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update blog" },
      { status: 500 }
    );
  }
}

// --- DELETE a blog post ---
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    if (blog.imageUrl && blog.imageUrl.public_id) {
      await cloudinary.uploader.destroy(blog.imageUrl.public_id);
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}
