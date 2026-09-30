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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Plus, Trash, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ImageUpload } from "@/components/dashboard/image-upload";
import ReactSelect from "react-select";
import { Skeleton } from "@/components/ui/skeleton";
import { TipTapEditor } from "@/components/dashboard/tiptap-editor";
import { CloudinaryImage } from "@/types/products";
import { toast } from "sonner";
import { SEOEditorCard } from "@/components/dashboard/SEOEditorCard";

// Interfaces (no changes needed here)
interface ColorOption {
  value: string;
  label: string;
  _id: string;
  name: string;
  description?: string;
}

interface SizeOption {
  value: string;
  label: string;
  _id: string;
  name: string;
  description?: string;
}

interface Variant {
  name: string;
  salePrice: number;
  price: number;
  discount: number;
  sku: string;
  stock: number;
}

interface Product {
  _id: string;
  title: string;
  name: string;
  description: string;
  shortDescription?: string;
  keyFeatures?: string[];
  price: string | number;
  salePrice?: string | number;
  discount?: string | number;
  buyPrice?: string | number;
  costPerProduct?: string | number;
  sku: string;
  stock: string | number;
  category: string;
  subcategory?: string;
  brand?: string;
  weight?: string;
  dimensions?: {
    width?: string;
    height?: string;
    depth?: string;
  };
  warranty?: string;
  returnPolicy?: string;
  videoUrl?: string;
  tags: string[];
  images: (string | CloudinaryImage)[];
  additionalImages: (string | CloudinaryImage)[];
  specifications: Array<{
    name: string;
    value: string;
  }>;
  variants: Variant[];
  colors: any[];
  sizes: any[];
  featured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  currency?: string;
  status: "draft" | "published" | "archived";
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([]);
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }
        const data = await res.json();
        setProduct({
          ...data,
          price: data.price?.toString() || "",
          salePrice: data.salePrice?.toString() || "",
          discount: data.discount?.toString() || "",
          buyPrice: data.buyPrice?.toString() || "",
          costPerProduct: data.costPerProduct?.toString() || "",
          stock: data.stock?.toString() || "",
          category: data.category?._id || "",
          subcategory: data.subcategory?._id || "",
          shortDescription: data.shortDescription || "",
          keyFeatures: data.keyFeatures || [],
          variants: data.variants || [],
        });
      } catch (err: any) {
        setError(err.message);
        toast.error("Error: " + err.message, {
          description: "Failed to fetch product data.",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchOptions = async () => {
      try {
        const [categoriesRes, colorsRes, sizesRes, subcategoriesRes] =
          await Promise.all([
            fetch("/api/categories"),
            fetch("/api/colors"),
            fetch("/api/sizes"),
            fetch("/api/subcategories"),
          ]);

        const [categoriesData, colorsData, sizesData, subcategoriesData] =
          await Promise.all([
            categoriesRes.json(),
            colorsRes.json(),
            sizesRes.json(),
            subcategoriesRes.json(),
          ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);

        setColorOptions(
          colorsData.map((color: any) => ({
            value: color.value,
            label: color.name,
            _id: color._id,
            name: color.name,
            description: color.description,
          }))
        );
        setSizeOptions(
          sizesData.map((size: any) => ({
            value: size.value,
            label: size.name,
            _id: size._id,
            name: size.name,
            description: size.description,
          }))
        );
      } catch (fetchError) {
        console.error("Error fetching options:", fetchError);
        toast.error("Could not load categories and options.");
      }
    };

    fetchProduct();
    fetchOptions();
  }, [id]);

  useEffect(() => {
    if (product?.category && subcategories.length > 0) {
      const filtered = subcategories.filter(
        (subcategory) => subcategory.category === product.category
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [product?.category, subcategories]);

  // All handler functions remain the same...

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      if (!prev) return null;

      const updatedProduct = { ...prev, [name]: value };

      if (name === "salePrice" || name === "price") {
        const salePrice =
          name === "salePrice"
            ? parseFloat(value)
            : parseFloat(String(prev.salePrice)) || 0;
        const price =
          name === "price"
            ? parseFloat(value)
            : parseFloat(String(prev.price)) || 0;

        if (salePrice > 0 && price > 0 && salePrice > price) {
          const discount = ((salePrice - price) / salePrice) * 100;
          updatedProduct.discount = parseFloat(discount.toFixed(2));
        } else {
          updatedProduct.discount = 0;
        }
      }

      return updatedProduct;
    });
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    setProduct((prev) => {
      if (!prev) return null;
      const updatedVariants = [...prev.variants];
      const variantToUpdate = { ...updatedVariants[index], [field]: value };

      if (field === "salePrice" || field === "price") {
        const salePrice =
          (field === "salePrice" ? Number(value) : variantToUpdate.salePrice) ||
          0;
        const price =
          (field === "price" ? Number(value) : variantToUpdate.price) || 0;

        if (salePrice > 0 && price > 0 && salePrice > price) {
          const discount = ((salePrice - price) / salePrice) * 100;
          variantToUpdate.discount = parseFloat(discount.toFixed(2));
        } else {
          variantToUpdate.discount = 0;
        }
      }

      updatedVariants[index] = variantToUpdate;
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleAddVariant = () => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            variants: [
              ...prev.variants,
              {
                name: "",
                salePrice: 0,
                price: 0,
                discount: 0,
                sku: "",
                stock: 0,
              },
            ],
          }
        : null
    );
  };

  const handleRemoveVariant = (index: number) => {
    if (!product) return;
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct((prev) => (prev ? { ...prev, [name]: checked } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev) => {
      if (!prev) return null;
      const newProduct = { ...prev, [name]: value };
      // Reset subcategory if category changes
      if (name === "category") {
        newProduct.subcategory = "";
      }
      return newProduct;
    });
  };

  const handleDescriptionChange = (html: string) => {
    setProduct((prev) => (prev ? { ...prev, description: html } : null));
  };

  const handleImagesChange = (images: (string | CloudinaryImage)[]) => {
    if (product) setProduct({ ...product, images });
  };

  const handleAdditionalImagesChange = (
    images: (string | CloudinaryImage)[]
  ) => {
    if (product) setProduct({ ...product, additionalImages: images });
  };

  const handleSpecificationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (!product) return;
    const updatedSpecs = [...product.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setProduct({ ...product, specifications: updatedSpecs });
  };

  const handleAddSpecification = () => {
    if (!product) return;
    setProduct({
      ...product,
      specifications: [...product.specifications, { name: "", value: "" }],
    });
  };

  const handleRemoveSpecification = (index: number) => {
    if (!product) return;
    const updatedSpecs = product.specifications.filter((_, i) => i !== index);
    setProduct({ ...product, specifications: updatedSpecs });
  };

  const handleColorChange = (selectedOptions: any) => {
    if (!product) return;
    const selectedColors = selectedOptions
      ? selectedOptions.map((option: ColorOption) => ({
          _id: option._id,
          name: option.name,
          value: option.value,
          description: option.description || "",
        }))
      : [];
    setProduct({ ...product, colors: selectedColors });
  };

  const handleSizeChange = (selectedOptions: any) => {
    if (!product) return;
    const selectedSizes = selectedOptions
      ? selectedOptions.map((option: SizeOption) => ({
          _id: option._id,
          name: option.name,
          value: option.value,
          description: option.description || "",
        }))
      : [];
    setProduct({ ...product, sizes: selectedSizes });
  };

  const onInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setProduct((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const MAX_SHORT_DESC_LENGTH = 140;
  const handleShortDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "shortDescription" && value.length > MAX_SHORT_DESC_LENGTH) {
      return;
    }
    setProduct((prev) => (prev ? { ...prev, shortDescription: value } : null));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // The validation block is correctly removed as per your request

    const productToSend = { ...product };

    // --- Start of Correction ---
    if (Array.isArray(productToSend.images)) {
      productToSend.images = productToSend.images.map((img) =>
        // If 'img' is a string (a new image data URL), return it directly.
        // Otherwise, it's an existing CloudinaryImage object, so return that.
        typeof img === "string"
          ? img
          : { public_id: img.public_id, url: img.url }
      );
    }
    if (Array.isArray(productToSend.additionalImages)) {
      productToSend.additionalImages = productToSend.additionalImages.map(
        (img) =>
          typeof img === "string"
            ? img
            : { public_id: img.public_id, url: img.url }
      );
    }
    // --- End of Correction ---

    try {
      setSubmitting(true);
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSend),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast("Product Updated", {
        description: "Product has been updated successfully.",
      });
      router.push(`/dashboard/products`);
    } catch (err: any) {
      toast.error("Error updating product", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ProductUpdateSkeleton />;
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error || "Product not found"}
        </p>
        <Button asChild>
          <Link href="/dashboard/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/products`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white/90">
            Edit Product: {product.name || "..."}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="w-full bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="mainImage">Main Image</TabsTrigger>
              <TabsTrigger value="additionalImages">
                Additional Images
              </TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="moreInfo">Pricing & More</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white/90">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={product.name || product.title}
                        onChange={handleInputChange}
                        placeholder="Product Name (Text)"
                        className="bg-white dark:bg-white/[0.05]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={product.sku}
                        onChange={handleInputChange}
                        placeholder="SKU-XXXX (Text)"
                        className="bg-white dark:bg-white/[0.05]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={product.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-white/[0.05]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select
                        value={product.subcategory || ""}
                        onValueChange={(value) =>
                          handleSelectChange("subcategory", value)
                        }
                        disabled={filteredSubcategories.length === 0}
                      >
                        <SelectTrigger className="bg-white dark:bg-white/[0.05]">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSubcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={product.brand || ""}
                        onChange={handleInputChange}
                        placeholder="Brand Name (Text)"
                        className="bg-white dark:bg-white/[0.05]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={product.stock}
                        onChange={handleInputChange}
                        placeholder="e.g. 100 (Number)"
                        className="bg-white dark:bg-white/[0.05]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={product.status}
                        onValueChange={(
                          value: "draft" | "published" | "archived"
                        ) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger className="bg-white dark:bg-white/[0.05]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Switch
                          checked={product.featured}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("featured", checked)
                          }
                        />
                        <span>Featured Product</span>
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyFeatures">Key Features</Label>
                    <div className="space-y-2">
                      {product.keyFeatures?.map(
                        (feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [
                                  ...(product.keyFeatures || []),
                                ];
                                newFeatures[index] = e.target.value;
                                onInputChange({
                                  target: {
                                    name: "keyFeatures",
                                    value: newFeatures,
                                  },
                                } as any);
                              }}
                              className="flex-1"
                              placeholder={`Feature ${index + 1} (Text)`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newFeatures = product.keyFeatures?.filter(
                                  (_, i) => i !== index
                                );
                                onInputChange({
                                  target: {
                                    name: "keyFeatures",
                                    value: newFeatures,
                                  },
                                } as any);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}

                      {Number(product.keyFeatures?.length) < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newFeatures = [
                              ...(product.keyFeatures || []),
                              "",
                            ];
                            onInputChange({
                              target: {
                                name: "keyFeatures",
                                value: newFeatures,
                              },
                            } as any);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <textarea
                      id="shortDescription"
                      name="shortDescription"
                      value={product.shortDescription}
                      onChange={handleShortDescriptionChange}
                      className="w-full p-2 border rounded-md bg-white dark:bg-white/[0.05]"
                      rows={3}
                      placeholder="Brief product description (Text)"
                    />
                    <div className="text-sm text-right text-gray-500">
                      {MAX_SHORT_DESC_LENGTH -
                        (product?.shortDescription?.length || 0)}{" "}
                      characters remaining
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <TipTapEditor
                      content={product.description}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mainImage">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white/90">
                    Main Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={product.images}
                    onChange={handleImagesChange}
                    maxImages={5}
                    label="Upload main product images (1-5 images)"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additionalImages">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white/90">
                    Additional Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={product.additionalImages}
                    onChange={handleAdditionalImagesChange}
                    maxImages={5}
                    label="Upload additional product images (max 5)"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-800 dark:text-white/90">
                    Product Specifications
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSpecification}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Specification
                  </Button>
                </CardHeader>
                <CardContent>
                  {product.specifications?.length > 0 ? (
                    <div className="space-y-4">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex items-end gap-4">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`spec-name-${index}`}>Name</Label>
                            <Input
                              id={`spec-name-${index}`}
                              value={spec.name}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Color (Text)"
                              className="bg-white dark:bg-white/[0.05]"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`spec-value-${index}`}>Value</Label>
                            <Input
                              id={`spec-value-${index}`}
                              value={spec.value}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Blue (Text)"
                              className="bg-white dark:bg-white/[0.05]"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSpecification(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No specifications added.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-800 dark:text-white">
                    Product Variants
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddVariant}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Variant
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 border p-4 rounded-md relative"
                      >
                        <div className="space-y-2 col-span-2 sm:col-span-3 md:col-span-2">
                          <Label htmlFor={`variant-name-${index}`}>
                            Variant Name
                          </Label>
                          <Input
                            id={`variant-name-${index}`}
                            value={variant.name}
                            onChange={(e) =>
                              handleVariantChange(index, "name", e.target.value)
                            }
                            placeholder="e.g., Red, Large (Text)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`variant-salePrice-${index}`}>
                            Sale Price
                          </Label>
                          <Input
                            id={`variant-salePrice-${index}`}
                            type="number"
                            value={variant.salePrice}
                            placeholder="0 (Number)"
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "salePrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`variant-price-${index}`}>
                            Price
                          </Label>
                          <Input
                            id={`variant-price-${index}`}
                            type="number"
                            value={variant.price}
                            placeholder="0 (Number)"
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`variant-discount-${index}`}>
                            Discount (%)
                          </Label>
                          <Input
                            id={`variant-discount-${index}`}
                            type="number"
                            value={variant.discount || 0}
                            readOnly
                            placeholder="Auto (Number)"
                            className="bg-gray-100 dark:bg-gray-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`variant-stock-${index}`}>
                            Stock
                          </Label>
                          <Input
                            id={`variant-stock-${index}`}
                            type="number"
                            value={variant.stock}
                            placeholder="0 (Number)"
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 md:top-2 md:right-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 rounded-full"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {product.variants.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No variants added. Click Add Variant to start.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moreInfo">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white/90">
                    Pricing & More
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="salePrice">
                          Sale Price (Original Price)
                        </Label>
                        <Input
                          id="salePrice"
                          name="salePrice"
                          type="number"
                          step="0.01"
                          value={product.salePrice || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. 1200 (Number)"
                          className="bg-white dark:bg-white/[0.05]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (After Discount)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          value={product.price || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. 999 (Number)"
                          className="bg-white dark:bg-white/[0.05]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          value={product.discount || 0}
                          readOnly
                          placeholder="Auto-calculated"
                          className="bg-gray-100 dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buyPrice">Buy Price</Label>
                        <Input
                          id="buyPrice"
                          name="buyPrice"
                          type="number"
                          step="1"
                          value={product.buyPrice || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. 500 (Number)"
                          className="bg-white dark:bg-white/[0.05]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costPerProduct">Cost Per Product</Label>
                        <Input
                          id="costPerProduct"
                          name="costPerProduct"
                          type="number"
                          step="0.01"
                          value={product.costPerProduct || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. 550 (Number)"
                          className="bg-white dark:bg-white/[0.05]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="videoUrl">YouTube Video URL</Label>
                        <Input
                          id="videoUrl"
                          name="videoUrl"
                          value={product.videoUrl || ""}
                          onChange={handleInputChange}
                          placeholder="Video URL (Text)"
                          className="bg-white dark:bg-white/[0.05]"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="block mb-2">Colors</Label>
                      <ReactSelect
                        isMulti
                        options={colorOptions}
                        value={colorOptions.filter((option) =>
                          product.colors.some(
                            (color) => color._id === option._id
                          )
                        )}
                        onChange={handleColorChange}
                        className="text-black"
                        classNamePrefix="select"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">Sizes</Label>
                      <ReactSelect
                        isMulti
                        options={sizeOptions}
                        value={sizeOptions.filter((option) =>
                          product.sizes.some((size) => size._id === option._id)
                        )}
                        onChange={handleSizeChange}
                        className="text-black"
                        classNamePrefix="select"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                          id="currency"
                          name="currency"
                          value={product.currency || "BDT"}
                          onChange={handleInputChange}
                          placeholder="e.g. BDT (Text)"
                          className="bg-white dark:bg-white/[0.05]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2">
                        <Switch
                          checked={product.isNewArrival || false}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isNewArrival", checked)
                          }
                        />
                        <span>New Arrival</span>
                      </Label>
                      <Label className="flex items-center gap-2">
                        <Switch
                          checked={product.isBestSeller || false}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isBestSeller", checked)
                          }
                        />
                        <span>Best Seller</span>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <SEOEditorCard
                metaTitle={product.metaTitle || ""}
                metaDescription={product.metaDescription || ""}
                metaKeywords={product.metaKeywords || ""}
                slug={product.slug || ""}
                canonicalUrl={product.canonicalUrl || ""}
                defaultTitle={product.name || ""}
                defaultDescription={product.description || product.shortDescription || ""}
                baseUrlPath="products"
                showSlug={true}
                onChange={(field, value) =>
                  setProduct((prev) => (prev ? { ...prev, [field]: value } : null))
                }
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/products`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function ProductUpdateSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </main>
    </div>
  );
}
