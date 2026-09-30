import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    const decoded: any = jwt.verify(token, JWT_SECRET);

    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }
}
