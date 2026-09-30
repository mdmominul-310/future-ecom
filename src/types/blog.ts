// types/blog.ts
import type { ImageType } from "./products"; // Reuse ImageType from your products types

export interface BlogData {
  _id?: string;
  title: string;
  content: string; // For rich text (HTML)
  imageUrl: ImageType[];
  date: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: "draft" | "published";
}
