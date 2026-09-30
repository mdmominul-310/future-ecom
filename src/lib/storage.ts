import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  public_id: string;
  url: string;
  secure_url?: string;
}

/**
 * Universal local file storage helper for Future com
 * Replaces Cloudinary with local storage under public/uploads/
 */
export async function saveBase64Image(
  dataUri: string,
  folder = "products"
): Promise<UploadResult | null> {
  if (!dataUri || typeof dataUri !== "string") return null;

  // If it's already a local uploaded path or relative URL, return as-is
  if (dataUri.startsWith("/uploads/")) {
    const filename = path.basename(dataUri);
    return { public_id: filename, url: dataUri, secure_url: dataUri };
  }

  // Check if it's a base64 data URI
  const matches = dataUri.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!matches) {
    // If it's a regular URL, return as-is
    if (dataUri.startsWith("http://") || dataUri.startsWith("https://")) {
      return { public_id: path.basename(dataUri), url: dataUri, secure_url: dataUri };
    }
    return null;
  }

  const rawExt = matches[1].toLowerCase();
  const ext = rawExt === "jpeg" ? "jpg" : rawExt === "svg+xml" ? "svg" : rawExt;
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const randomHash = crypto.randomBytes(6).toString("hex");
  const filename = `${Date.now()}_${randomHash}.${ext}`;
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${filename}`;
  return {
    public_id: filename,
    url: publicUrl,
    secure_url: publicUrl,
  };
}

/**
 * Save Buffer or File to public/uploads/<folder>
 */
export async function saveBufferImage(
  buffer: Buffer,
  originalFilename = "image.jpg",
  folder = "products"
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(originalFilename) || ".jpg";
  const cleanBase = path
    .basename(originalFilename, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const randomHash = crypto.randomBytes(4).toString("hex");
  const filename = `${Date.now()}_${cleanBase || "img"}_${randomHash}${ext}`;
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${filename}`;
  return {
    public_id: filename,
    url: publicUrl,
    secure_url: publicUrl,
  };
}

/**
 * Delete a local uploaded file if it exists in public/uploads/
 */
export async function deleteLocalImage(urlOrFilename: string): Promise<boolean> {
  if (!urlOrFilename) return false;
  try {
    let relPath = urlOrFilename;
    if (relPath.startsWith("/uploads/")) {
      relPath = relPath.replace(/^\//, "");
    } else if (!relPath.includes("uploads/")) {
      relPath = `uploads/${relPath}`;
    }
    const fullPath = path.join(process.cwd(), "public", relPath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return true;
    }
  } catch (err) {
    console.warn("Failed to delete local file:", err);
  }
  return false;
}
