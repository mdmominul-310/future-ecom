// app/dashboard/blogs/new/page.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { TipTapEditor } from "@/components/dashboard/tiptap-editor";
import { SEOEditorCard } from "@/components/dashboard/SEOEditorCard";
import type { ImageType } from "@/types/products";

interface BlogData {
  title: string;
  content: string;
  imageUrl: ImageType[];
  date: string;
  status: "draft" | "published";
  author?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

export default function AddBlogPage() {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData>({
    title: "",
    content: "",
    imageUrl: [],
    date: new Date().toISOString().split("T")[0],
    status: "draft",
    author: "Future com",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (html: string) => {
    setBlog((prev) => ({ ...prev, content: html }));
  };

  const handleImageChange = (images: ImageType[]) => {
    setBlog((prev) => ({ ...prev, imageUrl: images }));
  };

  const handleStatusChange = (value: "draft" | "published") => {
    setBlog((prev) => ({ ...prev, status: value }));
  };

  const handleSEOChange = (field: string, value: string) => {
    setBlog((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blog.title || !blog.content || blog.imageUrl.length === 0) {
      toast.warning("Please fill all required fields and upload an image.");
      return;
    }

    setIsLoading(true);
    try {
      const blogToSend = {
        ...blog,
        imageUrl: blog.imageUrl[0],
      };

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post");
      }

      toast.success("Blog post created successfully", {
        description: "Your new blog post will be available shortly.",
        action: {
          label: "View Blogs",
          onClick: () => router.push("/dashboard/blogs"),
        },
      });
      router.push("/dashboard/blogs");
    } catch (error: any) {
      toast.error("Error creating post", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/blogs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Create New Blog Post</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Blog Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={blog.title}
                      onChange={handleInputChange}
                      placeholder="Enter the blog post title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Blog Content</Label>
                    <TipTapEditor
                      content={blog.content}
                      onChange={handleContentChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO OPTIONS SECTION */}
              <SEOEditorCard
                metaTitle={blog.metaTitle || ""}
                metaDescription={blog.metaDescription || ""}
                metaKeywords={blog.metaKeywords || ""}
                slug={blog.slug || ""}
                canonicalUrl={blog.canonicalUrl || ""}
                author={blog.author || ""}
                defaultTitle={blog.title}
                defaultDescription={blog.content}
                baseUrlPath="blogs"
                showSlug={true}
                showAuthor={true}
                onChange={handleSEOChange}
              />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={blog.imageUrl}
                    onChange={handleImageChange}
                    maxImages={1}
                    label="Upload a featured image"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      value={blog.author || ""}
                      onChange={handleInputChange}
                      placeholder="Future com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={blog.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={blog.status}
                      onValueChange={(value: "draft" | "published") =>
                        handleStatusChange(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" asChild type="button">
              <Link href="/dashboard/blogs">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
