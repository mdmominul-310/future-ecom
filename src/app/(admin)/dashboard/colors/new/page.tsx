"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AddColorPage() {
  const router = useRouter();
  //   const [isLoading, setIsLoading] = useState(true);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState({
    name: "",
    value: "#000000", // default color
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setColor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!color.name || !color.value) {
      return toast.error("Please fill all required fields.");
    }

    try {
      const res = await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(color),
      });

      if (!res.ok) throw new Error("Failed to create color");

      toast.success("Color created successfully", {
        description: "Redirecting to Colors Page...",
        action: {
          label: "Go to Colors",
          onClick: () => router.push("/dashboard/colors"),
        },
      });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

    // Reset the form fields
    setColor({
      name: "",
      value: "#000000", // default color
      description: "",
    });

    // Reset the form fields
    // Show success toast
    toast.success("Color has been created", {
      description: "Go Colors Page to check the new colors",
      action: {
        label: "Go to Colors",
        onClick: () => router.push("/dashboard/colors"),
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Add New Color</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Color Information</CardTitle>
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
                  placeholder="Enter color name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  Pick Color <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="color"
                  id="value"
                  name="value"
                  value={color.value}
                  onChange={handleInputChange}
                  className="h-10 w-20 p-0 border-none bg-transparent"
                  placeholder="e.g. Red, Sky Blue, Navy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={color.description}
                  onChange={handleInputChange}
                  placeholder="Optional description about this color, e.g. Mostly used for summer products."
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Create Color</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
