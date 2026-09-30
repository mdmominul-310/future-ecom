// pages/api/orders/pending.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/lib/dbConnect"; // your DB connection utility
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const pendingOrders = await Order.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .limit(10);
    return NextResponse.json(pendingOrders);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch pending orders", error },
      { status: 500 }
    );
  }
}
