import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Color } from "@/models/Color";
// import Color from "@/models/Color";

export async function GET() {
  await connectDB();
  const colors = await Color.find().sort({ createdAt: -1 });
  return Response.json(colors);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();
    const { name, description,value } = await req.json();
    if (!name || !value ) return new Response("Missing fields", { status: 400 });

    const newColor = await Color.create({ name, description, value });
    return Response.json(newColor);
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
