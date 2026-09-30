import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  await connectDB();
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5);

    return NextResponse.json({
      success: true,
      message: "success",
      orders: recentOrders,
    });
  } catch (error) {
    console.error("Recent Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}

// // import dbConnect from "@/lib/dbConnect";
// import { connectDB } from "@/lib/mongodb";
// import { Order } from "@/models/Order";
// // import Product from "@/models/Product";
// import { NextResponse } from "next/server";

// export async function GET() {
//   connectDB();

//   try {
//     const recentOrder = await Order.find()
//       .sort({ soldCount: -1 }) // You can also sort by revenueGenerated
//       .limit(5);
//     //   .select(
//     //     "name slug soldCount price buyPrice costPerProduct soldCount revenueGenerated images category"
//     //   ) // Select only required fields
//     //   .populate("category", "name"); // If you want category name

//     // res.status(200).json(result);
//     return NextResponse.json({
//       success: true,
//       message: "success",
//       orders: recentOrder,
//     });
//   } catch (error) {
//     console.error("Top Products Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// }
