import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Size from "@/models/Size";
// import Size from "@/models/Size";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, value, description, available = true } = await req.json();

    if (!name || !value) {
      return new Response("Missing fields", { status: 400 });
    }

    const newSize = await Size.create({
      name,
      value,
      description,
      available,
    });

    return Response.json(newSize);
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const sizes = await Size.find().sort({ createdAt: -1 });
    return Response.json(sizes);
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch sizes", { status: 500 });
  }
}
