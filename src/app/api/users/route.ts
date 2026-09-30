// app/api/users/route.ts
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const users = await User.find().select("-password");
    return Response.json(users);
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
}
