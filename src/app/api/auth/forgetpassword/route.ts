import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!; 

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${BASE_URL}/resetpassword?token=${token}`;

    // Use your real mail transporter setup here
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return NextResponse.json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
