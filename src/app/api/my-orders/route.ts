import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { generateInvoice } from "@/lib/utls/invoice";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  // 1. Check for authenticated user
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  try {
    // 2. Fetch orders matching the logged-in user's ID
    const userOrders = await Order.find({ userId: session.user.id }).sort({
      createdAt: -1, // Show most recent orders first
    });

    // 3. Generate invoice data for each order
    const result = userOrders.map((order: any) => ({
      order,
      invoice: generateInvoice(order),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch user orders" },
      { status: 500 }
    );
  }
}
