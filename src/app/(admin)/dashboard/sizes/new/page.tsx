"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddSizePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", value: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.value) {
      return toast.error("Please fill in all fields");
    }

    const res = await fetch("/api/sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return toast.error("Failed to create size");

    toast.success("Size created", {
      action: {
        label: "Go to Sizes",
        onClick: () => router.push("/dashboard/sizes"),
      },
    });

    setForm({ name: "", value: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/sizes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Create New Size</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Size Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  placeholder="e.g. Small"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">
                  Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="value"
                  placeholder="e.g. S"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit">Submit</Button>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
