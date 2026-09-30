"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function ReviewScreenshotUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    // Placeholder for actual upload logic
    toast.success(`Thank you! "${file.name}" has been submitted for review.`);
    setFile(null); // Reset after "upload"
  };

  return (
    <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50 text-center">
      <div className="grid w-full max-w-sm items-center gap-2 mx-auto">
        <Label htmlFor="review-screenshot" className="text-lg font-semibold">
          Upload Your Review Screenshot
        </Label>
        <Input
          id="review-screenshot"
          type="file"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
          className="bg-white file:text-orange-600 file:font-semibold"
        />
      </div>
      {file && (
        <p className="mt-4 text-sm text-green-700 font-medium">
          Selected: {file.name}
        </p>
      )}
      <Button
        onClick={handleUpload}
        className="mt-6"
        size="lg"
        disabled={!file}
      >
        <Upload className="mr-2 h-5 w-5" /> Submit Screenshot
      </Button>
    </div>
  );
}
