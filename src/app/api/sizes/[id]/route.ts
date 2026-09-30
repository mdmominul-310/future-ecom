import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Size from "@/models/Size";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const id = (await params).id;
    const size = await Size.findById(id);
    if (!size) {
      return NextResponse.json({ message: "Size not found" }, { status: 404 });
    }

    return NextResponse.json(size);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, value, description, available } = await req.json();
    const id = (await params).id;
    const size = await Size.findById(id);
    if (!size) return new Response("Size not found", { status: 404 });

    size.name = name || size.name;
    size.value = value || size.value;
    size.description = description || size.description;
    if (available !== undefined) size.available = available;

    await size.save();

    return Response.json(size);
  } catch (err) {
    console.error(err);
    return new Response("Failed to update size", { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const id = (await params).id;
    const size = await Size.findById(id);
    if (!size) return new Response("Not found", { status: 404 });

    await Size.findByIdAndDelete(id);
    return new Response("Deleted successfully");
  } catch (err) {
    console.log(err);
    return new Response("Server error", { status: 500 });
  }
}
