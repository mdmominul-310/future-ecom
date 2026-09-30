// app/api/users/[id]/route.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("session", session);

    await connectDB();
    const { role } = await req.json();
    if (!role) return new Response("Missing fields", { status: 400 });

    const id = (await params).id;
    const updated = await User.findByIdAndUpdate(id, { role }, { new: true });
    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const id = (await params).id;
    const user = await User.findById(id).select("-password");
    if (!user) return new Response("User not found", { status: 404 });

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const id = (await params).id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return new Response("User not found", { status: 404 });

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
}
