// app/dashboard/blogs/page.tsx
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
import { Plus, Pencil, Trash, Eye, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { renderSkeletonRow } from "@/lib/skeleton"; // Assuming you have this helper
import Badge from "@/components/dashboard/ui/badge/Badge";
import { DeleteBlogDialog } from "@/components/dashboard/delete-blog-dialog"; // We will create this

interface Blog {
  _id: string;
  title: string;
  imageUrl: {
    url: string;
    public_id: string;
  };
  date: string;
  status: "draft" | "published";
  slug: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to page 1 when search query changes
      setPagination((p) => ({ ...p, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Centralized data fetching logic
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      params.append("sort", sortBy);
      params.append("order", sortOrder);

      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/blogs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch blog posts");

      const data = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error", { description: "Failed to load blog posts." });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    sortBy,
    sortOrder,
    debouncedSearchQuery,
    statusFilter,
  ]);

  // Effect to trigger fetchBlogs when dependencies change
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDeleteClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${selectedBlog._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete post");
      }
      toast.success("Blog post deleted successfully.");
      fetchBlogs(); // Refresh list
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full dark:text-gray-100">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <Button asChild>
            <Link href="/dashboard/blogs/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Post
            </Link>
          </Button>
        </div>

        <Card className="bg-white dark:border-gray-800 border-gray-200 dark:bg-white/[0.03]">
          <CardHeader>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <CardTitle>All Blog Posts</CardTitle>
              <div className="flex gap-4">
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64"
                />
                <Select
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  value={statusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSortToggle("title")}
                    >
                      Title
                      {sortBy === "title" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSortToggle("date")}
                    >
                      Date
                      {sortBy === "date" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) =>
                    // Assuming renderSkeletonRow returns a valid <TableRow> component
                    // The key is added to prevent React warnings.
                    React.cloneElement(renderSkeletonRow(), { key: i })
                  )
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-16 text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-16 text-gray-500"
                    >
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>
                        <div className="w-16 h-10 relative rounded-md overflow-hidden bg-gray-100">
                          {blog.imageUrl?.url && (
                            <Image
                              src={blog.imageUrl.url}
                              alt={blog.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {blog.title}
                      </TableCell>
                      <TableCell>
                        {format(new Date(blog.date), "PPP")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          size="sm"
                          color={
                            blog.status === "published" ? "success" : "info"
                          }
                        >
                          {blog.status
                            ? blog.status.charAt(0).toUpperCase() +
                              blog.status.slice(1)
                            : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/blog/${blog.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/dashboard/blogs/update/${blog._id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(blog)}
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
            {/* Pagination would go here */}
          </CardContent>
        </Card>
      </main>

      {selectedBlog && (
        <DeleteBlogDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          blogTitle={selectedBlog.title}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
