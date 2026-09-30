import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import mongoose from "mongoose";
import { saveBase64Image, deleteLocalImage } from "@/lib/storage";

// GET /api/products/[id] - Get a single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Find product
    const product = await Product.findById(id).populate(
      "category",
      "name slug"
    );
    // .populate("subcategory", "name slug");

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Helper function to check if a string is a data URL
// const isDataUrl = (str: string) => {
//   return str && str.startsWith('data:');
// };

// PUT /api/products/[id] - Update a product
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // console.log("PUT request received");
  // console.log("Request body:", req.body);
  try {
    await connectDB();

    const id = (await params).id;
    const body = await req.json();

    console.log("Request body:", body);

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Parse body.images and body.additionalImages if they are strings
    if (typeof body.images === "string") {
      try {
        body.images = JSON.parse(body.images);
      } catch (error) {
        console.error("Error parsing images:", error);
      }
    }

    if (typeof body.additionalImages === "string") {
      try {
        body.additionalImages = JSON.parse(body.additionalImages);
      } catch (error) {
        console.error("Error parsing additionalImages:", error);
      }
    }

    // Handle images - upload new ones to local storage
    if (body.images && Array.isArray(body.images)) {
       const mainImagesPromises = body.images.map(async (image: any) => {
         if (typeof image === "object" && image.url) {
           return image;
         }
         try {
           return await saveBase64Image(image, "products");
         } catch (error) {
           console.error("Error uploading image locally:", error);
           return null;
         }
       });

       const mainImagesResults = await Promise.all(mainImagesPromises);
       body.images = mainImagesResults.filter(Boolean);
     }

    // Handle additional images - upload new ones to local storage
    if (body.additionalImages && Array.isArray(body.additionalImages)) {
       const additionalImagesPromises = body.additionalImages.map(
         async (image: any) => {
           if (typeof image === "object" && image.url) {
             return image;
           }
           try {
             return await saveBase64Image(image, "products");
           } catch (error) {
             console.error("Error uploading additional image locally:", error);
             return null;
           }
         }
       );

       const additionalImagesResults = await Promise.all(
         additionalImagesPromises
       );
       body.additionalImages = additionalImagesResults.filter(Boolean);

      // For detailed debugging
      console.log(
        "Additional images before update:",
        typeof body.additionalImages,
        Array.isArray(body.additionalImages),
        body.additionalImages
      );
    }

    if (body.subcategory === "") {
      delete body.subcategory;
    }

    // Update product with new data including Cloudinary images

    console.log("Body before update:", body);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `Duplicate ${field}. This ${field} already exists.` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const id = (await params).id;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete local images
    const mainImageDeletes = product.images?.map((img: any) =>
      deleteLocalImage(img.public_id || img.url)
    );

    const additionalImageDeletes = product.additionalImages?.map((img: any) =>
      deleteLocalImage(img.public_id || img.url)
    );

    // Wait for all deletions
    await Promise.all([
      ...(mainImageDeletes || []),
      ...(additionalImageDeletes || []),
    ]);

    // Now delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Product and images deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
