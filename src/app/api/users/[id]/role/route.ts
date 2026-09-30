// app/api/users/[id]/role/route.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const { role } = await req.json();
    if (!["user", "admin"].includes(role)) {
      return new Response("Invalid role", { status: 400 });
    }

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) return new Response("User not found", { status: 404 });

    return Response.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
}
