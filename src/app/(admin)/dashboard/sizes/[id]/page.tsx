"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SizeDetailsPage() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const params = useParams();
  const sizeId = params?.id as string;

  const [form, setForm] = useState({ name: "", value: "" });

  useEffect(() => {
    const fetchSize = async () => {
      const res = await fetch(`/api/sizes/${sizeId}`);
      const data = await res.json();
      console.log(data);
      setForm({ name: data.name, value: data.value });
    };
    if (sizeId) fetchSize();
  }, [sizeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setSubmitLoading(true);

    const res = await fetch(`/api/sizes/${sizeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return toast.error("Failed to update size");
    toast.success("Size updated");
    setSubmitLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/sizes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Edit Size</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Size Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              placeholder="e.g. Small"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Value</Label>
            <Input
              name="value"
              placeholder="e.g. S"
              value={form.value}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleUpdate}>
            {submitLoading ? "updating..." : "Update"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
