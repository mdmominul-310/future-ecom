"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/dashboard/tag-input";
import type { ProductData } from "@/types/products";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

interface BasicInfoFormProps {
  product: ProductData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onShortDescriptionChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSelectChange: (name: string, value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onDescriptionChange?: (html: string) => void;
}

export function BasicInfoForm({
  product,
  onInputChange,
  onShortDescriptionChange,
  onSwitchChange,
  onSelectChange,
  onTagsChange,
  onDescriptionChange,
}: BasicInfoFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!product.category) {
      setSubcategories([]);
      return;
    }
    const fetchSubcategories = async () => {
      setLoadingSubcategories(true);
      try {
        const res = await fetch(
          `/api/subcategories?categoryId=${product.category}`
        );
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        const data = await res.json();
        setSubcategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoadingSubcategories(false);
      }
    };
    fetchSubcategories();
  }, [product.category]);

  const handleDescriptionChange = (html: string) => {
    if (onDescriptionChange) {
      onDescriptionChange(html);
    } else {
      const event = {
        target: {
          name: "description",
          value: html,
        },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onInputChange(event);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="name"
            name="name"
            value={product.name}
            onChange={onInputChange}
            placeholder="Product Name (Text)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="sku"
            name="sku"
            value={product.sku}
            onChange={onInputChange}
            placeholder="SKU-XXXX (Text)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={
              typeof product?.category === "string"
                ? product.category
                : product.category?._id
            }
            onValueChange={(value) => {
              onSelectChange("category", value);
              onSelectChange("subcategory", "");
            }}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue
                placeholder={
                  loadingCategories
                    ? "Loading categories..."
                    : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              {loadingCategories ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={product.subcategory}
            onValueChange={(value) => onSelectChange("subcategory", value)}
            disabled={!product.category || loadingSubcategories}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue
                placeholder={
                  !product.category
                    ? "Select category first"
                    : loadingSubcategories
                    ? "Loading subcategories..."
                    : "Select subcategory"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              {loadingSubcategories ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : subcategories.length === 0 ? (
                <div className="p-2 text-gray-500">
                  No subcategories available
                </div>
              ) : (
                subcategories.map((subcategory) => (
                  <SelectItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={onInputChange}
            placeholder="Brand Name (Text)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={onInputChange}
            placeholder="e.g., 100 (Number)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={product.status}
            onValueChange={(value) => onSelectChange("status", value)}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          value={product.shortDescription}
          onChange={onShortDescriptionChange}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Brief description of the product (Text)"
        />
        <div className="text-sm text-right text-gray-500">
          {140 - Number(product?.shortDescription?.length || 0)} characters
          remaining
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyFeatures">Key Features</Label>
        <div className="space-y-2">
          {product.keyFeatures?.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...(product.keyFeatures || [])];
                  newFeatures[index] = e.target.value;
                  onInputChange({
                    target: { name: "keyFeatures", value: newFeatures },
                  } as any);
                }}
                className="flex-1 p-2 border rounded-md"
                placeholder={`Feature ${index + 1} (Text)`}
              />
              <button
                type="button"
                onClick={() => {
                  const newFeatures = product.keyFeatures?.filter(
                    (_, i) => i !== index
                  );
                  onInputChange({
                    target: { name: "keyFeatures", value: newFeatures },
                  } as any);
                }}
                className="p-2 text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          {Number(product.keyFeatures?.length) < 5 && (
            <button
              type="button"
              onClick={() => {
                const newFeatures = [...(product.keyFeatures || []), ""];
                onInputChange({
                  target: { name: "keyFeatures", value: newFeatures },
                } as any);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              + Add Feature
            </button>
          )}
          {Number(product.keyFeatures?.length) >= 5 && (
            <p className="text-sm text-red-500">Maximum 5 features allowed.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <RichTextEditor
          value={product.description}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            value={product.weight}
            onChange={onInputChange}
            placeholder="e.g., 0.5 (Number)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warranty">Warranty</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="warranty"
            name="warranty"
            value={product.warranty}
            onChange={onInputChange}
            placeholder="e.g., 1 Year Limited Warranty (Text)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Product Video URL</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="videoUrl"
            name="videoUrl"
            value={product.videoUrl}
            onChange={onInputChange}
            placeholder="YouTube or Vimeo URL (Text)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="returnPolicy">Return Policy</Label>
          <Input
            className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            id="returnPolicy"
            name="returnPolicy"
            value={product.returnPolicy}
            onChange={onInputChange}
            placeholder="e.g., 30-day return (Text)"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          className="border border-gray-200 dark:border-gray-700 "
          checked={product.featured}
          onCheckedChange={(checked) => onSwitchChange("featured", checked)}
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>

      <div className="space-y-2 mt-4">
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          value={product.tags || []}
          onChange={onTagsChange}
          placeholder="Add product tags... (Text)"
        />
      </div>
    </div>
  );
}
