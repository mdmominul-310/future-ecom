"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash, Eye, ArrowUpDown, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { DeleteProductDialog } from "@/components/dashboard/delete-product-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { renderSkeletonRow } from "@/lib/skeleton";
import { toast } from "sonner";
import Badge from "@/components/dashboard/ui/badge/Badge";

// --- Interface Definitions (No Change) ---
interface Product {
  _id: string;
  name: string;
  images: [{ url: string; public_id: string }];
  aditionalImages: [{ url: string; public_id: string }];
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  stock: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  // --- State Definitions (No Change) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // --- FIXED: Memoized fetchProducts function ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      params.append("sort", sortBy);
      params.append("order", sortOrder);
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter && categoryFilter !== "all")
        params.append("category", categoryFilter);
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err: any) {
      const errorMessage = err.message || "Error fetching products";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    sortBy,
    sortOrder,
    searchQuery,
    categoryFilter,
    statusFilter,
  ]);

  // --- FIXED: Fetch categories only once on component mount ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Error", {
          description: "Failed to load categories filter.",
        });
      }
    };

    fetchCategories();
  }, []); // Empty array ensures this runs only once

  // --- FIXED: Refetch products when filters, pagination or sorting changes ---
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Relies on the memoized fetchProducts function

  // --- Handle delete confirmation (No Change) ---
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  // --- Handle delete action (No Change, but relies on a stable fetchProducts) ---
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete product");
      }
      toast.warning("Product deleted successfully.");
      fetchProducts(); // Refresh the product list
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Failed to delete product",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // --- All helper functions and JSX rendering remain the same ---
  // ... (generatePaginationItems, getStatusBadgeColor, etc.)
  // ... (return statement with JSX)
  // NOTE: The rest of your component's code (helper functions and JSX) was well-structured and did not need changes.

  // Helper for pagination links
  const generatePaginationItems = () => {
    const { page, totalPages } = pagination;
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          size="default"
          onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}
          isActive={page === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <span className="px-4 py-2">...</span>
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            size="default"
            onClick={() => setPagination((prev) => ({ ...prev, page: i }))}
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <span className="px-4 py-2">...</span>
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            size="default"
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: totalPages }))
            }
            isActive={page === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Helper to get status badge color
  const getStatusBadgeColor = (status: string, stock: number) => {
    if (stock === 0) return "error";
    if (stock < 10) return "warning";
    if (status === "published") return "success";
    if (status === "draft") return "info";
    return "primary";
  };

  // Helper to get formatted status text
  const getStatusText = (status: string, stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Toggle sort order
  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full dark:text-gray-100">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products Management</h2>
          <Button
            className="dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 border dark:border-gray-700"
            asChild
          >
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>

        <Card className="bg-white dark:border-gray-800 border-gray-200 dark:bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
            <CardTitle>Product Inventory</CardTitle>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64"
                />

                <div className="md:flex gap-4 hidden">
                  <Select
                    onValueChange={setCategoryFilter}
                    value={categoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select onValueChange={setStatusFilter} value={statusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Filter Button */}
                <div className="md:hidden w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                  >
                    <FileText className="mr-2 h-4 w-4" /> Filters
                  </Button>

                  {showMobileFilter && (
                    <div className="mt-2 space-y-2">
                      <Select
                        onValueChange={setCategoryFilter}
                        value={categoryFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={setStatusFilter}
                        value={statusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md">
              <Table className="border-none">
                <TableHeader className="border-none">
                  <TableRow className="border-b border-gray-200 dark:border-gray-800">
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortToggle("name")}
                      >
                        Product
                        {sortBy === "name" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortOrder === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortToggle("price")}
                      >
                        Price
                        {sortBy === "price" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortOrder === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortToggle("stock")}
                      >
                        Stock
                        {sortBy === "stock" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortOrder === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <React.Fragment key={i}>
                        {renderSkeletonRow()}
                      </React.Fragment>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-16 text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-16 text-gray-500"
                      >
                        No products found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow
                        className="border-b border-gray-200 dark:border-gray-800"
                        key={product._id}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No image
                                </span>
                              )}
                            </div>
                            <span
                              className="font-medium truncate max-w-[200px]"
                              title={product.name}
                            >
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{product.category?.name || "-"}</TableCell>
                        <TableCell>৳{product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge
                            size="sm"
                            color={getStatusBadgeColor(
                              product.status,
                              product.stock
                            )}
                          >
                            {getStatusText(product.status, product.stock)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              className="border border-gray-200 dark:border-gray-800"
                              size="icon"
                              asChild
                            >
                              <Link href={`/dashboard/products/${product._id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <Button
                              className="border border-gray-200 dark:border-gray-800"
                              size="icon"
                              asChild
                            >
                              <Link
                                href={`/dashboard/products/update/${product._id}`}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Button
                              className="border border-gray-200 dark:border-gray-800 hover:text-red-500"
                              size="icon"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {!loading && !error && products.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} products
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          size="default"
                          onClick={() =>
                            pagination.page > 1 &&
                            setPagination((prev) => ({
                              ...prev,
                              page: prev.page - 1,
                            }))
                          }
                          className={
                            pagination.page <= 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {generatePaginationItems()}

                      <PaginationItem>
                        <PaginationNext
                          size="default"
                          onClick={() =>
                            pagination.page < pagination.totalPages &&
                            setPagination((prev) => ({
                              ...prev,
                              page: prev.page + 1,
                            }))
                          }
                          className={
                            pagination.page >= pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {selectedProduct && (
        <DeleteProductDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          productName={selectedProduct.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
