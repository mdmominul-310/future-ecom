import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { saveBase64Image } from "@/lib/storage";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Ensure models are registered for populate
    const _catModel = Category;
    const _subCatModel = Subcategory;

    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");

    const query: any = {};

    if (category && category !== "all") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          query.category = null;
        }
      }
    }

    if (subcategory) {
      if (mongoose.Types.ObjectId.isValid(subcategory)) {
        query.subcategory = subcategory;
      } else {
        const subDoc = await Subcategory.findOne({ slug: subcategory });
        if (subDoc) {
          query.subcategory = subDoc._id;
        } else {
          query.subcategory = null;
        }
      }
    }

    if (status) query.status = status;
    if (featured === "true") query.featured = true;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortObj: { [key: string]: "asc" | "desc" } = {
      [sort]: order as "asc" | "desc",
    };

    const projection = {
      buyPrice: 0,
      costPerProduct: 0,
      revenueGenerated: 0,
    };

    const products = await Product.find(query, projection)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    const totalProducts = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();

    const uploadImage = async (imgData: string) => {
      if (!imgData) return null;
      if (typeof imgData === "string" && imgData.startsWith("data:image")) {
        return await saveBase64Image(imgData, "products");
      }
      if (typeof imgData === "string") {
        return { public_id: "prod_img", url: imgData };
      }
      return imgData;
    };

    // This part processes new base64 image strings for upload
    const uploadedImages = await Promise.all(
      (body.images || []).map((img: string | { url: string }) =>
        typeof img === "string" ? uploadImage(img) : img
      )
    );
    const uploadedAdditionalImages = await Promise.all(
      (body.additionalImages || []).map((img: string | { url: string }) =>
        typeof img === "string" ? uploadImage(img) : img
      )
    );

    body.images = uploadedImages.filter(Boolean);
    body.additionalImages = uploadedAdditionalImages.filter(Boolean);

    // --- FIX: Handle empty category and subcategory ---
    // If category is an empty string, delete it to prevent cast error
    if (body.category === "") {
      delete body.category;
    }
    // Do the same for subcategory
    if (body.subcategory === "") {
      delete body.subcategory;
    }
    // --- End of Fix ---

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: `Duplicate key error: A product with this ${
            Object.keys(error.keyPattern)[0]
          } already exists.`,
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      // Provide a more detailed validation error message
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { message: "Validation Error", errors: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
