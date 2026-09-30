"use client";

import React, { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteConfirmationDialog } from "@/components/dashboard/DeleteConfirmationDialog";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      const res = await fetch(`/api/categories/${selectedCategory._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete category");
      }
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedCategory._id)
      );
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderSkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-32 h-4" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="w-12 h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-20 h-4" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div>
        <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-gray-800 dark:text-white/90">
              Product Categories
            </CardTitle>
            <Button
              size="sm"
              asChild
              className="dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 border dark:border-gray-700"
            >
              <Link href="/dashboard/categories/new">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            <div className="rounded-md overflow-hidden">
              <Table>
                <TableHeader className="border-ys border-gray-100 dark:border-gray-800">
                  <TableRow className="border-b border-gray-200 dark:border-gray-800">
                    <TableHead className="text-gray-500 text-theme-xs dark:text-gray-400">
                      Category
                    </TableHead>
                    <TableHead className="text-gray-500 text-theme-xs dark:text-gray-400">
                      Products
                    </TableHead>
                    <TableHead className="text-gray-500 text-theme-xs dark:text-gray-400">
                      Created Date
                    </TableHead>
                    <TableHead className="w-[120px] text-gray-500 text-theme-xs dark:text-gray-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="dark:divide-gray-800">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <React.Fragment key={i}>
                        {renderSkeletonRow()}
                      </React.Fragment>
                    ))
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        No colors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="py-3 text-gray-800 dark:text-white/90">
                          <div className="flex items-center gap-3">
                            <Image
                              src={category.image?.url || "/placeholder.svg"}
                              alt={category.name}
                              width={40}
                              height={40}
                              className="rounded-md"
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          {category.products?.length || 0}
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                              asChild
                            >
                              <Link
                                href={`/dashboard/categories/${category._id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:text-red-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                              onClick={() => {
                                setSelectedCategory(category);
                                setOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationDialog
        open={open}
        setOpen={setOpen}
        onConfirm={handleDelete}
        title="Delete this item?"
        description="This will permanently remove the item from your system."
      />
    </>
  );
};

export default CategoriesPage;
