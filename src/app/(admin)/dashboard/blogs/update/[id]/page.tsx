// app/dashboard/blogs/update/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { TipTapEditor } from "@/components/dashboard/tiptap-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOEditorCard } from "@/components/dashboard/SEOEditorCard";
import type { ImageType } from "@/types/products";

interface Blog {
  _id: string;
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

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog post");
        const data = await res.json();
        setBlog({
          ...data,
          date: data.date ? data.date.split("T")[0] : new Date().toISOString().split("T")[0],
          imageUrl: data.imageUrl?.url ? [data.imageUrl.url] : [],
          author: data.author || "Future com",
          slug: data.slug || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          metaKeywords: data.metaKeywords || "",
          canonicalUrl: data.canonicalUrl || "",
        });
      } catch (err: any) {
        toast.error("Error", { description: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlog((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBlog((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleContentChange = (html: string) => {
    setBlog((prev) => (prev ? { ...prev, content: html } : null));
  };

  const handleImageChange = (images: ImageType[]) => {
    setBlog((prev) => (prev ? { ...prev, imageUrl: images } : null));
  };

  const handleSEOChange = (field: string, value: string) => {
    setBlog((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    setSubmitting(true);
    try {
      const blogToSend = {
        ...blog,
        imageUrl: blog.imageUrl[0],
      };

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogToSend),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update blog post");
      }
      toast.success("Blog post updated successfully.");
      router.push("/dashboard/blogs");
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <BlogUpdateSkeleton />;
  if (!blog) return <div>Error loading blog post.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/blogs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Edit Blog Post</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={blog.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
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
                  <CardTitle>Publishing & Author</CardTitle>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={blog.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={blog.imageUrl}
                    onChange={handleImageChange}
                    maxImages={1}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/blogs">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function BlogUpdateSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
