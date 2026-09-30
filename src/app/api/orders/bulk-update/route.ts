import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { orderIds, status } = body;

    // Validate input
    if (!Array.isArray(orderIds) || orderIds.length === 0 || !status) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const updateResult = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { status: status } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({
        message:
          "No orders were updated. They may already have the selected status or could not be found.",
      });
    }

    return NextResponse.json({
      message: `${updateResult.modifiedCount} orders updated successfully to ${status}.`,
      count: updateResult.modifiedCount,
    });
  } catch (error: any) {
    console.error("[BULK_ORDER_UPDATE_POST]", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
