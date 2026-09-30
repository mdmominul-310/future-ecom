// api/orders/[id]/route.ts
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { generateInvoice } from "@/lib/utls/invoice";

// GET Order by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const id = (await params).id;
  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order, invoice: generateInvoice(order) });
}

// UPDATE Order
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const id = (await params).id;
    const updatedOrder = await Order.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: updatedOrder,
      invoice: generateInvoice(updatedOrder),
    });
  } catch (err: any) {
    console.error("PUT /api/orders/[id] error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
// DELETE Order
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();
  const id = (await params).id;
  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) {
    return new Response("Order not found", { status: 404 });
  }

  return new Response("Order and Invoice deleted successfully", {
    status: 200,
  });
}
