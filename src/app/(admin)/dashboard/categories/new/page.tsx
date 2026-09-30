"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { ImageUpload } from "@/components/dashboard/image-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CloudinaryImage {
  public_id: string;
  url: string;
}

export default function AddCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    images: [] as (string | CloudinaryImage)[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (images: (string | CloudinaryImage)[]) => {
    setCategory((prev) => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name || category.images.length === 0) {
      return toast.error("Please fill all required fields");
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          image: category.images[0],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An unknown error occurred.");
      }

      setCategory({
        name: "",
        description: "",
        images: [],
      });

      toast.success("Category has been created", {
        description: "Go Categories Page to check the new category",
        action: {
          label: "Go to Categories",
          onClick: () => router.push("/dashboard/categories"),
        },
      });
    } catch (error: any) {
      toast.error("Failed to create category", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Create New Category</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={category.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={category.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Category Image</Label>
                <ImageUpload
                  value={category.images}
                  onChange={handleImagesChange}
                  maxImages={1}
                  label="Upload category image"
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" asChild disabled={isLoading}>
                  <Link href="/products">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
