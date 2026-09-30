// app/api/message/route.ts
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import User from "@/models/User";
import { sendEmail } from "@/lib/mail/email";
import { NextRequest, NextResponse } from "next/server";

// 📩 POST - Create new message and notify admin
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const newMessage = await Message.create(body);

    // Get admin emails
    const admins = await User.find({ role: "admin" });

    // Send email to each admin
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: `📬 নতুন মেসেজ - ${body.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>📝 New Message Receive from Maven Zone</h2>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Subject:</strong> ${body.subject}</p>
            <p><strong>Message:</strong><br/>${body.message}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ message: "Message sent successfully", data: newMessage }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get("filter"); // "all", "seen", "unseen"

    let query = {};
    if (filter === "seen") {
      query = { seen: true };
    } else if (filter === "unseen") {
      query = { seen: false };
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 });
  }
}
