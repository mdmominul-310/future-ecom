"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2 } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
import { DeleteConfirmationDialog } from "@/components/dashboard/DeleteConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Color = {
  name: string;
  value: string; // Example: #FF5733
  description?: string;
};

export default function EditColorPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [color, setColor] = useState<Color>({
    name: "",
    value: "",
    description: "",
  });

  // 1. Fetch color details
  useEffect(() => {
    if (!id) return;
    const fetchColor = async () => {
      try {
        const res = await fetch(`/api/colors/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        setColor({
          name: data.name,
          value: data.value,
          description: data.description,
        });
      } catch (error: any) {
        toast("Error", {
          description:
            error.message || "Something went wrong while fetching color.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchColor();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setColor((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!color.name || !color.value) {
      return toast("Missing required fields", {
        description: "Please fill in all required fields.",
      });
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/colors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(color),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast("Color updated", {
        description: "The color has been updated successfully.",
      });
    } catch (error: any) {
      toast("Update failed", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle delete
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/colors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast("Color deleted", {
        description: "The color has been deleted successfully.",
      });

      router.push("/dashboard/colors");
    } catch (error: any) {
      toast("Delete failed", {
        description: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold">Edit Color: {color.name}</h2>
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
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Color Information</CardTitle>
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
                      Color Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={color.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">
                      Color Value <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="value"
                      name="value"
                      type="color"
                      value={color.value}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500"></span>
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={color.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/colors">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        </main>
      </div>

      <DeleteConfirmationDialog
        open={open}
        setOpen={setOpen}
        onConfirm={handleDelete}
        title="Delete this color?"
        description="This will permanently remove the color from your system."
      />
    </>
  );
}
