import { NextResponse } from "next/server";
import { saveBufferImage } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await saveBufferImage(buffer, file.name, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      filename: result.public_id,
    });
  } catch (error: any) {
    console.error("Local file upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file locally" },
      { status: 500 }
    );
  }
}
