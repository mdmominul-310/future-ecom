"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, ArrowLeft, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { YouTubeEmbed } from "@/components/dashboard/"
import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "@/components/public/ui/use-toast"
import { useRouter, useParams } from "next/navigation";
// import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { YouTubeEmbed } from "@/components/client/youtube-embad";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  discount?: number;
  images: { url: string; public_id: string }[];
  additionalImages: { url: string; public_id: string }[];
  category: { _id: string; name: string; slug: string };
  subcategory?: { _id: string; name: string; slug: string };
  brand?: string;
  sku: string;
  stock: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  rating: number;
  reviewsCount: number;
  colors: Array<{
    _id: string;
    name: string;
    value: string;
    description?: string;
  }>;
  sizes: Array<{
    _id: string;
    name: string;
    value: string;
    description?: string;
  }>;
  specifications: Array<{
    name: string;
    value: string;
  }>;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailsPage() {
  // const [isLoading, setIsLoading] = useState(false);
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to fetch product");

        // toast({
        //   title: "Error",
        //   description: err.message,
        //   variant: "destructive"
        // })
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        setDeleting(true);
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to delete product");
        }

        // toast({
        //   title: "Success",
        //   description: "Product deleted successfully",
        // })
        toast.success("Product deleted successfully", {
          description: "Redirecting to products page...",
          action: {
            label: "Go to Products",
            onClick: () => router.push("/dashboard/products"),
          },
        });

        router.push("/dashboard/products");
      } catch (err: unknown) {
        console.log(err);
        // toast({
        //   title: "Error",
        //   description: err.message,
        //   variant: "destructive"
        // })
        toast.error("Failed to delete product");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

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

  // Helper to get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "published":
        return {
          text: "Published",
          class:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
      case "draft":
        return {
          text: "Draft",
          class:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
      case "archived":
        return {
          text: "Archived",
          class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
      default:
        return {
          text: status,
          class:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        };
    }
  };

  const statusDisplay = getStatusDisplay(product.status);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white/90">
                {product.name}
              </h2>
              {product.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </>
                )}
              </Button>
              <Button asChild>
                <Link href={`/dashboard/products/update/${product._id}`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Product Images */}
            <Card className="md:col-span-1 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                    <Image
                      src={product.images[0].url || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {product.additionalImages &&
                    product.additionalImages.length > 0 && (
                      <>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Additional Images
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {product.additionalImages.map((image, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
                            >
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`${product.name} - Image ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                  {product.videoUrl && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Video
                      </h4>
                      <YouTubeEmbed
                        url={product.videoUrl}
                        title={`${product.name} video`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card className="md:col-span-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white/90">
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full bg-gray-100 dark:bg-white/[0.05] mb-4">
                    <TabsTrigger value="details" className="flex-1">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="flex-1">
                      Colors & Sizes
                    </TabsTrigger>
                    <TabsTrigger value="specifications" className="flex-1">
                      Specifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Price
                        </h4>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            ${Number(product.price).toFixed(2)}
                          </p>
                          {product.salePrice &&
                            Number(product.salePrice) <
                              Number(product.price) && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ${Number(product.price).toFixed(2)}
                              </p>
                            )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${statusDisplay.class}`}
                        >
                          {statusDisplay.text}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Category
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100">
                          {product.category?.name}
                          {product.subcategory &&
                            ` / ${product.subcategory.name}`}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Brand
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100">
                          {product.brand || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          SKU
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100">
                          {product.sku}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Stock
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100">
                          {product.stock} units
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Rating
                        </h4>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-gray-900 dark:text-gray-100">
                              {product.rating}/5
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({product.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Last Updated
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100">
                          {formatDate(product.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Description
                      </h4>
                      <div
                        className="text-sm text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4">
                    {product.colors && product.colors.length > 0 ? (
                      <div className="rounded-md border border-gray-200 dark:border-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-white/[0.05]">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                Color
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                Value
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
                            {product.colors.map((color) => (
                              <tr
                                key={color._id}
                                className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                              >
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                  {color.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full border border-gray-300"
                                      style={{ backgroundColor: color.value }}
                                    />
                                    {color.value}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">
                                  {color.description || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No colors specified for this product.
                      </p>
                    )}

                    {product.sizes && product.sizes.length > 0 ? (
                      <>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sizes
                        </h4>
                        <div className="rounded-md border border-gray-200 dark:border-gray-800">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-white/[0.05]">
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Size
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Value
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
                              {product.sizes.map((size) => (
                                <tr
                                  key={size._id}
                                  className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                                >
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                    {size.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                    {size.value}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">
                                    {size.description || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No sizes specified for this product.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="specifications" className="pt-4">
                    {product.specifications &&
                    product.specifications.length > 0 ? (
                      <div className="rounded-md border border-gray-200 dark:border-gray-800">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-white/[0.05]">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                Specification
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
                            {product.specifications.map((spec, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {spec.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  {spec.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        No specifications provided for this product.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Product Images Skeleton */}
          <Card className="md:col-span-1 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-md" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="aspect-square w-full rounded-md" />
                  <Skeleton className="aspect-square w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Info Skeleton */}
          <Card className="md:col-span-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                </div>
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
