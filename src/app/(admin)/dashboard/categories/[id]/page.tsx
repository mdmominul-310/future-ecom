"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { DeleteConfirmationDialog } from "@/components/dashboard/DeleteConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CloudinaryImage {
  public_id: string;
  url: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CloudinaryImage;
  category:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };
}

// interface Category {
//   _id: string;
//   name: string;
//   description?: string;
//   image?: CloudinaryImage;
//   subcategories?: string[];
// }

export default function EditCategoryPage() {
  const [open, setOpen] = useState(false);
  const [deleteSubcategoryOpen, setDeleteSubcategoryOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [category, setCategory] = useState<{
    name: string;
    description: string;
    images: (string | CloudinaryImage)[];
  }>({
    name: "",
    description: "",
    images: [],
  });

  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [newSubcategory, setNewSubcategory] = useState<{
    name: string;
    description: string;
    images: string[];
  }>({
    name: "",
    description: "",
    images: [],
  });

  const [sortBy, setSortBy] = useState<"name" | "newest">("name");

  // 🟢 1. Fetch category details
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch category
        const categoryRes = await fetch(`/api/categories/${id}`);
        const categoryData = await categoryRes.json();

        if (!categoryRes.ok)
          throw new Error(categoryData.message || "Failed to fetch category");

        setCategory({
          name: categoryData.name,
          description: categoryData.description || "",
          images: categoryData.image?.url ? [categoryData.image.url] : [],
        });

        // Fetch subcategories for this category
        const subcategoriesRes = await fetch(
          `/api/subcategories?categoryId=${id}`
        );
        const subcategoriesData = await subcategoriesRes.json();

        if (!subcategoriesRes.ok)
          throw new Error("Failed to fetch subcategories");

        setSubcategories(subcategoriesData);
      } catch (error: any) {
        toast.error("Error", {
          description:
            error?.message || "Something went wrong while fetching data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubcategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSubcategory((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImagesChange = (images: (string | CloudinaryImage)[]) => {
  //   setCategory((prev) => ({ ...prev, images }));
  // };

  const handleImagesChange = (images: (string | CloudinaryImage)[]) => {
    setCategory((prev) => ({
      ...prev,
      images: images.map((image) =>
        typeof image === "string" ? image : image.url
      ),
    }));
  };

  // const handleSubcategoryImagesChange = (images: (string | CloudinaryImage)[]) => {
  //   setNewSubcategory((prev) => ({ ...prev, images }));
  // };

  const handleSubcategoryImagesChange = (
    images: (string | CloudinaryImage)[]
  ) => {
    setNewSubcategory((prev) => ({
      ...prev,
      images: images.map((image) =>
        typeof image === "string" ? image : image.url
      ),
    }));
  };

  // 🟢 2. Handle update category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.name) {
      return toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          description: category.description,
          image: category.images[0] || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Category updated", {
        description: "The category has been updated successfully.",
      });
    } catch (error: any) {
      toast.error("Update failed", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 3. Handle delete category
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }

      toast.warning("Category deleted", {
        description: "The category has been deleted successfully.",
      });

      router.push("/dashboard/categories");
    } catch (error: any) {
      toast.warning("Delete failed", {
        description: error.message || "Something went wrong.",
      });
    }
  };

  // Handle add subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategory.name) {
      return toast("Missing required fields", {
        description: "Please enter a subcategory name.",
      });
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubcategory.name,
          description: newSubcategory.description,
          image: newSubcategory.images[0] || null,
          categoryId: id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add subcategory");

      // Add new subcategory to the list
      setSubcategories((prev) => [...prev, data]);

      // Reset form
      setNewSubcategory({
        name: "",
        description: "",
        images: [],
      });

      setIsAdding(false);

      toast("Subcategory added", {
        description: "The subcategory has been added successfully.",
      });
    } catch (error: any) {
      toast("Error adding subcategory", {
        description: error.message || "Something went wrong.",
      });
      setIsAdding(false);
    }
  };

  // Handle edit subcategory
  const handleEditSubcategory = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
    setNewSubcategory({
      name: subcategory.name,
      description: subcategory.description || "",
      images: subcategory.image?.url ? [subcategory.image.url] : [],
    });
    setIsEditing(true);
  };

  // Handle update subcategory
  const handleUpdateSubcategory = async () => {
    if (!selectedSubcategory || !newSubcategory.name) {
      return toast("Missing required fields", {
        description: "Please enter a subcategory name.",
      });
    }

    setIsAdding(true);
    try {
      const res = await fetch(`/api/subcategories/${selectedSubcategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubcategory.name,
          description: newSubcategory.description,
          image: newSubcategory.images[0] || null,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update subcategory");

      // Update subcategory in the list
      setSubcategories((prev) =>
        prev.map((sub) => (sub._id === selectedSubcategory._id ? data : sub))
      );

      // Reset form
      setNewSubcategory({
        name: "",
        description: "",
        images: [],
      });

      setIsAdding(false);
      setIsEditing(false);
      setSelectedSubcategory(null);

      toast("Subcategory updated", {
        description: "The subcategory has been updated successfully.",
      });
    } catch (error: any) {
      toast("Error updating subcategory", {
        description: error.message || "Something went wrong.",
      });
      setIsAdding(false);
    }
  };

  // Handle delete subcategory confirmation
  const handleDeleteSubcategoryConfirm = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteSubcategoryOpen(true);
  };

  // Handle delete subcategory
  const handleDeleteSubcategory = async () => {
    if (!selectedSubcategory) return;

    try {
      const res = await fetch(`/api/subcategories/${selectedSubcategory._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete subcategory");
      }

      // Remove subcategory from the list
      setSubcategories((prev) =>
        prev.filter((sub) => sub._id !== selectedSubcategory._id)
      );

      setDeleteSubcategoryOpen(false);
      setSelectedSubcategory(null);

      toast("Subcategory deleted", {
        description: "The subcategory has been deleted successfully.",
      });
    } catch (error: any) {
      toast("Error deleting subcategory", {
        description: error.message || "Something went wrong.",
      });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedSubcategory(null);
    setNewSubcategory({
      name: "",
      description: "",
      images: [],
    });
  };

  const sortedSubcategories = [...subcategories].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      // Assuming _id contains timestamp information for sorting by newest
      return b._id.localeCompare(a._id);
    }
  });

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/categories">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold">
              Edit Category: {category.name}
            </h2>
          </div>

          {isLoading ? (
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-8 w-20" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-40 w-full" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <form onSubmit={handleSubmit}>
                  <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                      <CardTitle>Category Information</CardTitle>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
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
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Category Image</Label>
                        <ImageUpload
                          value={category.images}
                          onChange={handleImagesChange}
                          maxImages={1}
                          label="Upload category image"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" asChild>
                          <Link href="/dashboard/categories">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>

              <TabsContent value="subcategories">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Subcategories</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="sort-subcategories" className="text-sm">
                        Sort by:
                      </Label>
                      <select
                        id="sort-subcategories"
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as "name" | "newest")
                        }
                        className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                      >
                        <option value="name">Name A-Z</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Subcategories List */}
                      <div className="space-y-4">
                        {subcategories.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <Plus className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                              No subcategories yet
                            </h3>
                            <p className="text-sm text-gray-500 max-w-md">
                              Add your first subcategory to organize your
                              products better. Subcategories help customers find
                              products more easily.
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-hidden rounded-lg border">
                            <div className="min-w-full divide-y">
                              <div className="grid grid-cols-12 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="col-span-6 sm:col-span-7 px-6 py-3">
                                  Subcategory
                                </div>
                                <div className="col-span-6 sm:col-span-5 px-6 py-3 text-right">
                                  Actions
                                </div>
                              </div>
                              <div className="bg-white divide-y divide-gray-200">
                                {sortedSubcategories.map((subcategory) => (
                                  <div
                                    key={subcategory._id}
                                    className="grid grid-cols-12 hover:bg-gray-50"
                                  >
                                    <div className="col-span-6 sm:col-span-7 px-6 py-4 flex items-center">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                                          {subcategory.image?.url ? (
                                            <img
                                              src={subcategory.image.url}
                                              alt={subcategory.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="flex items-center justify-center h-full w-full bg-gray-200">
                                              <span className="text-xs text-gray-500">
                                                No img
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <h3 className="text-sm font-medium truncate">
                                            {subcategory.name}
                                          </h3>
                                          <p className="text-xs text-gray-500 truncate">
                                            {subcategory.description ||
                                              "No description"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-5 px-6 py-4 text-right whitespace-nowrap">
                                      <div className="flex justify-end space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleEditSubcategory(subcategory)
                                          }
                                          className="h-8"
                                        >
                                          <Edit className="h-3.5 w-3.5 mr-1" />
                                          <span className="hidden sm:inline">
                                            Edit
                                          </span>
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteSubcategoryConfirm(
                                              subcategory
                                            )
                                          }
                                          className="h-8"
                                        >
                                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                                          <span className="hidden sm:inline">
                                            Delete
                                          </span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add/Edit Subcategory Form */}
                      <Card
                        className={`border-dashed ${
                          isEditing ? "border-blue-300 bg-blue-50/30" : ""
                        }`}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            {isEditing ? (
                              <>
                                <Edit className="w-5 h-5 mr-2 text-blue-500" />
                                Edit Subcategory: {selectedSubcategory?.name}
                              </>
                            ) : (
                              <>
                                <Plus className="w-5 h-5 mr-2" />
                                Add New Subcategory
                              </>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="subcategory-name">
                                Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subcategory-name"
                                name="name"
                                value={newSubcategory.name}
                                onChange={handleSubcategoryInputChange}
                                required
                                className={isEditing ? "border-blue-300" : ""}
                                placeholder="Enter subcategory name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="subcategory-description">
                                Description
                              </Label>
                              <Textarea
                                id="subcategory-description"
                                name="description"
                                value={newSubcategory.description}
                                onChange={handleSubcategoryInputChange}
                                rows={2}
                                className={isEditing ? "border-blue-300" : ""}
                                placeholder="Enter a short description (optional)"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Image</Label>
                              <ImageUpload
                                value={newSubcategory.images}
                                onChange={handleSubcategoryImagesChange}
                                maxImages={1}
                                label="Upload subcategory image"
                              />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                              {isEditing && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              )}
                              <Button
                                type="button"
                                disabled={isAdding}
                                className={
                                  isEditing
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : ""
                                }
                                onClick={
                                  isEditing
                                    ? handleUpdateSubcategory
                                    : handleAddSubcategory
                                }
                              >
                                {isAdding ? (
                                  <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                                    {isEditing ? "Updating..." : "Adding..."}
                                  </>
                                ) : (
                                  <>
                                    {isEditing ? (
                                      <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Update Subcategory
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Subcategory
                                      </>
                                    )}
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>

      {/* Delete Category Dialog */}
      <DeleteConfirmationDialog
        open={open}
        setOpen={setOpen}
        onConfirm={handleDelete}
        title="Delete this category?"
        description="This will permanently remove the category and all its subcategories from your system."
      />

      {/* Delete Subcategory Dialog */}
      <DeleteConfirmationDialog
        open={deleteSubcategoryOpen}
        setOpen={setDeleteSubcategoryOpen}
        onConfirm={handleDeleteSubcategory}
        title="Delete this subcategory?"
        description="This will permanently remove the subcategory from your system."
      />
    </>
  );
}
