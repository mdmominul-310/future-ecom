// models/Blog.ts

import mongoose, { Schema, Document, models } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  imageUrl: {
    public_id: string;
    url: string;
  };
  date: Date;
  slug: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    imageUrl: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    author: {
      type: String,
      default: "Future com",
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "",
    },
    canonicalUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Blog = models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
