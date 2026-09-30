import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  try {
    // Find the user and populate the wishlist field with full product documents
    const userWithWishlist = await User.findById(session.user.id)
      .select("wishlist")
      .populate({
        path: "wishlist",
        model: Product,
        select: "name slug price salePrice images discount stock variants", // Select desired product fields
      });

    if (!userWithWishlist) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userWithWishlist.wishlist || []);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
