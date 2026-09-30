import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/models/Message";

// ✅ GET message by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const id = (await params).id;

    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Mark as seen
    if (!message.seen) {
      message.seen = true;
      await message.save();
    }

    return NextResponse.json({ data: message });
  } catch (error) {
    console.error("GET /api/message/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE message
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const id = (await params).id;
    const body = await req.json();

    const updatedMessage = await Message.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("PUT /api/message/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE message
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    // const id = params.id;
    const id = (await params).id;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/message/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT example (mark as seen):
// ts
// Copy
// Edit
// await fetch(`/api/message/${id}`, {
//   method: "PUT",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ seen: true }),
// });
// DELETE example:
// ts
// Copy
// Edit
// await fetch(`/api/message/${id}`, {
//   method: "DELETE",
// });
