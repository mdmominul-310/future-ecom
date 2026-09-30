"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { BasicInfoForm } from "@/components/dashboard/basic-info-form";
import { SpecificationsForm } from "@/components/dashboard/specifications-form";
import type { ProductData, Variant } from "@/types/products";
import ReactSelect from "react-select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SEOEditorCard } from "@/components/dashboard/SEOEditorCard";

interface CloudinaryImage {
  public_id: string;
  url: string;
}

interface Option {
  _id: string;
  name: string;
  value: string;
  description: string;
}

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

export default function AddProductPage() {
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [colorsRes, sizesRes] = await Promise.all([
          fetch("/api/colors"),
          fetch("/api/sizes"),
        ]);

        const [colorsData, sizesData] = await Promise.all([
          colorsRes.json(),
          sizesRes.json(),
        ]);

        const mappedColorOptions = colorsData.map((color: Option) => ({
          value: color.value,
          label: color.name,
          _id: color._id,
          name: color.name,
          description: color.description,
        }));

        const mappedSizeOptions = sizesData.map((size: Option) => ({
          value: size.value,
          label: size.name,
          _id: size._id,
          name: size.name,
          description: size.description,
        }));

        setColorOptions(mappedColorOptions);
        setSizeOptions(mappedSizeOptions);
      } catch (error) {
        console.error("Error fetching color and size options:", error);
      }
    };

    fetchOptions();
  }, []);

  const [product, setProduct] = useState<ProductData>({
    name: "",
    description: "",
    shortDescription: "",
    keyFeatures: [],
    price: 0,
    salePrice: 0,
    discount: 0,
    buyPrice: 0,
    costPerProduct: 0,
    sku: "",
    stock: 0,
    category: "",
    subcategory: "",
    brand: "",
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warranty: "",
    returnPolicy: "",
    videoUrl: "",
    tags: [],
    images: [],
    additionalImages: [],
    specifications: [{ name: "", value: "" }],
    variants: [],
    colors: [],
    sizes: [],
    rating: 0,
    reviewsCount: 0,
    soldCount: 0,
    clickCount: 0,
    revenueGenerated: 0,
    wishlistCount: 0,
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    currency: "BDT",
    status: "draft",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      const updatedProduct = { ...prev, [name]: value };

      // Automatic discount calculation for the main product
      if (name === "salePrice" || name === "price") {
        const salePrice =
          name === "salePrice" ? parseFloat(value) : prev.salePrice || 0;
        const price = name === "price" ? parseFloat(value) : prev.price || 0;

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

  const MAX_SHORT_DESC_LENGTH = 140;

  const handleShortDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "shortDescription" && value.length > MAX_SHORT_DESC_LENGTH)
      return;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    setProduct((prev) => {
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
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", salePrice: 0, price: 0, discount: 0, sku: "", stock: 0 },
      ],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (images: (string | CloudinaryImage)[]) => {
    setProduct((prev) => ({ ...prev, images }));
  };

  const handleAdditionalImagesChange = (
    images: (string | CloudinaryImage)[]
  ) => {
    setProduct((prev) => ({ ...prev, additionalImages: images }));
  };

  const handleTagsChange = (tags: string[]) => {
    setProduct((prev) => ({ ...prev, tags }));
  };

  const handleSpecificationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSpecs = [...product.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setProduct((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleAddSpecification = () => {
    setProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }));
  };

  const handleRemoveSpecification = (index: number) => {
    const updatedSpecs = product.specifications.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, specifications: updatedSpecs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Removed the frontend validation as requested to make all fields optional
    // if (
    //   !product.name ||
    //   !product.salePrice ||
    //   !product.stock ||
    //   !product.category
    // ) {
    //   return toast.warning(
    //     "Please fill all required fields, including Sale Price."
    //   );
    // }

    const productToSend = { ...product };

    if (Array.isArray(productToSend.images)) {
      productToSend.images = productToSend.images.map((img) =>
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

    try {
      setIsLoading(true);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSend),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      toast.success("Product created successfully", {
        description: "Go to Products Page to check the new product",
        action: {
          label: "Go to Products",
          onClick: () => router.push("/dashboard/products"),
        },
      });
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating product:", error);
      toast.error("Error Creating Product", { description: error.message });
    }
  };

  const handleColorChange = (selectedOptions: any) => {
    const selectedColors = selectedOptions
      ? selectedOptions.map((option: ColorOption) => ({
          _id: option._id,
          name: option.name,
          value: option.value,
          description: option.description || "",
        }))
      : [];
    setProduct((prev) => ({ ...prev, colors: selectedColors }));
  };

  const handleSizeChange = (selectedOptions: any) => {
    const selectedSizes = selectedOptions
      ? selectedOptions.map((option: SizeOption) => ({
          _id: option._id,
          name: option.name,
          value: option.value,
          description: option.description || "",
        }))
      : [];
    setProduct((prev) => ({ ...prev, sizes: selectedSizes }));
  };

  const handleDescriptionChange = (html: string) => {
    setProduct((prev) => ({ ...prev, description: html }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03] text-gray-800 dark:text-white">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Create New Product
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="w-full bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
              <TabsTrigger value="basic" className="inline-block py-2 px-4">
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="mainImage" className="inline-block py-2 px-4">
                Main Image
              </TabsTrigger>
              <TabsTrigger
                value="additionalImages"
                className="inline-block py-2 px-4"
              >
                Additional Images
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="inline-block py-2 px-4"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger value="variants" className="inline-block py-2 px-4">
                Variants
              </TabsTrigger>
              <TabsTrigger value="moreInfo" className="inline-block py-2 px-4">
                Pricing & More
              </TabsTrigger>
              <TabsTrigger value="seo" className="inline-block py-2 px-4">
                SEO & Metadata
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BasicInfoForm
                    product={product}
                    onInputChange={handleInputChange}
                    onShortDescriptionChange={handleShortDescriptionChange}
                    onSwitchChange={handleSwitchChange}
                    onSelectChange={handleSelectChange}
                    onTagsChange={handleTagsChange}
                    onDescriptionChange={handleDescriptionChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mainImage">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">
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
                  <CardTitle className="text-gray-800 dark:text-white">
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
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">
                    Product Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SpecificationsForm
                    specifications={product.specifications}
                    onSpecificationChange={handleSpecificationChange}
                    onAddSpecification={handleAddSpecification}
                    onRemoveSpecification={handleRemoveSpecification}
                  />
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
                            className="bg-gray-100 dark:bg-gray-800"
                            placeholder="Auto (Number)"
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
                        No variants added. Click &quot;Add Variant&quot; to
                        start.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moreInfo">
              <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-white">
                    Pricing & More
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salePrice">
                          Sale Price (Original Price)
                        </Label>
                        <Input
                          id="salePrice"
                          name="salePrice"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 1200 (Number)"
                          value={product.salePrice}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (After Discount)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 999 (Number)"
                          value={product.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          value={product.discount}
                          readOnly
                          className="bg-gray-100 dark:bg-gray-800"
                          placeholder="Auto-calculated"
                        />
                      </div>
                      <div>
                        <Label>Buy Price</Label>
                        <Input
                          type="number"
                          name="buyPrice"
                          value={product.buyPrice}
                          onChange={handleInputChange}
                          placeholder="e.g., 500 (Number)"
                          className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <Label>Cost Per Product</Label>
                        <Input
                          type="number"
                          name="costPerProduct"
                          value={product.costPerProduct}
                          onChange={handleInputChange}
                          placeholder="e.g., 550 (Number)"
                          className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Colors</Label>
                        <ReactSelect
                          isMulti
                          options={colorOptions}
                          onChange={handleColorChange}
                          className="mt-1"
                          classNamePrefix={"select"}
                        />
                      </div>
                      <div>
                        <Label>Sizes</Label>
                        <ReactSelect
                          isMulti
                          options={sizeOptions}
                          onChange={handleSizeChange}
                          className="mt-1"
                          classNamePrefix={"select"}
                        />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Input
                          type="text"
                          name="currency"
                          value={product.currency}
                          onChange={handleInputChange}
                          placeholder="e.g., BDT (Text)"
                          className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isNewArrival"
                          checked={product.isNewArrival}
                          onChange={(e) =>
                            handleSwitchChange("isNewArrival", e.target.checked)
                          }
                          className="form-checkbox"
                        />
                        <span className="ml-2">New Arrival</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isBestSeller"
                          checked={product.isBestSeller}
                          onChange={(e) =>
                            handleSwitchChange("isBestSeller", e.target.checked)
                          }
                          className="form-checkbox"
                        />
                        <span className="ml-2">Best Seller</span>
                      </label>
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
                  setProduct((prev) => ({ ...prev, [field]: value }))
                }
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Product..." : "Create Product"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
