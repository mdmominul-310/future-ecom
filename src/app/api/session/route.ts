// /app/api/session/route.ts (server-side)
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
    console.log(session);
  return NextResponse.json({
    user: {
      id:session.user.id,
      email: session.user.email,
      role: session.user.role,
    },
  });
}
