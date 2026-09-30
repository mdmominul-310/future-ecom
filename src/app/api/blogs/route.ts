// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import cloudinary from "@/lib/cloudinary";

// --- GET all blog posts ---
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "date";
    const order = url.searchParams.get("order") || "desc";
    const status = url.searchParams.get("status"); // Get status from query params

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // --- ADDED logic to filter by status ---
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortObj: any = { [sort]: order === "asc" ? 1 : -1 };

    const blogs = await Blog.find(query).sort(sortObj).skip(skip).limit(limit);
    const totalBlogs = await Blog.countDocuments(query);

    return NextResponse.json({
      blogs,
      pagination: {
        total: totalBlogs,
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// --- POST a new blog post ---
export async function POST(req: NextRequest) {
  try {
    await connectDB();
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

    if (!title || !content || !imageUrl) {
      return NextResponse.json(
        { message: "Title, content, and an image URL are required" },
        { status: 400 }
      );
    }

    const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
      folder: "blogs",
      quality: "auto:good",
    });

    const slug = (customSlug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newBlog = await Blog.create({
      title,
      content,
      slug: slug || `blog-${Date.now()}`,
      date: date || new Date(),
      status: status || "draft",
      author: author || "Future com",
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      metaKeywords: metaKeywords || "",
      canonicalUrl: canonicalUrl || "",
      imageUrl: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create blog post:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A blog post with this title already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}
