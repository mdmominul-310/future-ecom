"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

// Define the CloudinaryImage type
interface CloudinaryImage {
  public_id: string;
  url: string;
}

// Update the props to accept either strings or CloudinaryImage objects
interface ImageUploadProps {
  value?: (string | CloudinaryImage)[];
  onChange: (value: (string | CloudinaryImage)[]) => void;
  maxImages?: number;
  label?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  label = "Upload Images",
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] =
    useState<(string | CloudinaryImage)[]>(value);

  // Get image URL regardless of whether it's a string or CloudinaryImage
  const getImageUrl = (image: string | CloudinaryImage): string => {
    if (typeof image === "string") {
      return image;
    }
    return image.url;
  };

  useEffect(() => {
    // Update previewImages when value changes from outside
    setPreviewImages(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    const fileArray = Array.from(files);

    // Only process up to the maximum allowed images
    const filesToProcess = fileArray.slice(0, maxImages - previewImages.length);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);

          // If this is the last file, update state
          if (newImages.length === filesToProcess.length) {
            const updatedImages = [...previewImages, ...newImages];
            setPreviewImages(updatedImages);
            onChange(updatedImages);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    onChange(updatedImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {previewImages.map((image, index) => (
          <div
            key={index}
            className="relative h-24 w-24 rounded-md overflow-hidden border"
          >
            {image ? (
              <Image
                src={getImageUrl(image)}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="Placeholder"
                fill
                className="object-cover"
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => handleRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {previewImages.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            className="h-24 w-24 border-dashed"
            onClick={handleButtonClick}
            disabled={disabled}
          >
            <Upload className="h-6 w-6" />
          </Button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple={maxImages > 1}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <p className="text-sm text-muted-foreground">
        {label} (Max {maxImages} images)
      </p>
    </div>
  );
}
