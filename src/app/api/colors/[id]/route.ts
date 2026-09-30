import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Color } from "@/models/Color";
// import Color from "@/models/Color";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const id = (await params).id;
    const category = await Color.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const id = (await params).id;
    await Color.findByIdAndDelete(id);
    return new Response("Color deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, hex } = await req.json();
    if (!name || !hex) return new Response("Missing fields", { status: 400 });

    const id = (await params).id;
    const updated = await Color.findByIdAndUpdate(id, { name, hex }, { new: true });
    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}
