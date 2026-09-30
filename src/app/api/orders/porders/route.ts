import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

// Import Product model
import "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // First ensure the Product model is registered by mongoose
    try {
      // Check if Product model exists, if not it will throw an error
      mongoose.model("Product");
    } catch (error) {
      console.log(error);
      // If error, import the Product model directly
      await import("@/models/Product");
    }

    // Attempt normal population first
    try {
      const orders = await Order.find({})
        .populate({
          path: "cartItems.productId",
          model: "Product",
        })
        .lean();

      return NextResponse.json({ success: true, orders });
    } catch (populateError) {
      console.error("Population failed:", populateError);

      // Fallback to manual population
      const orders = await Order.find({}).lean();

      // Type for cart items
      interface CartItem {
        productId: mongoose.Types.ObjectId;
        name?: string;
        slug?: string;
        sku?: string;
        price?: number;
        quantity?: number;
        [key: string]: any;
      }

      // Manually populate each order
      for (const order of orders) {
        if (order.cartItems && Array.isArray(order.cartItems)) {
          for (const item of order.cartItems as CartItem[]) {
            if (item.productId) {
              try {
                // Get product directly
                const product = await mongoose
                  .model("Product")
                  .findById(item.productId)
                  .lean();
                if (product) {
                  item.product = product;
                }
              } catch (err) {
                console.error("Error fetching product:", err);
              }
            }
          }
        }
      }

      return NextResponse.json({ success: true, orders });
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
