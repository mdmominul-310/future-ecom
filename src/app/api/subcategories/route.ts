import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Subcategory from "@/models/Subcategory";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";
import slugify from "slugify";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, description, image, categoryId } = await req.json();

    if (!name || !categoryId) return new Response("Missing required fields", { status: 400 });

    // Verify the category exists
    const category = await Category.findById(categoryId);
    if (!category) return new Response("Category not found", { status: 404 });

    // If image is provided, upload it
    let imageData = null;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "subcategories",
        quality: "auto:low",
      });

      imageData = {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      };
    }

    const newSubcategory = await Subcategory.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      image: imageData,
      category: categoryId,
    });

    // Update the category to include this subcategory
    await Category.findByIdAndUpdate(
      categoryId,
      { $push: { subcategories: newSubcategory._id } }
    );

    return Response.json(newSubcategory);
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}

// GET all subcategories
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categoryId = url.searchParams.get('categoryId');

    await connectDB();
    
    let query = {};
    if (categoryId) {
      query = { category: categoryId };
    }
    
    const subcategories = await Subcategory.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
      
    return Response.json(subcategories);
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch subcategories", { status: 500 });
  }
} 