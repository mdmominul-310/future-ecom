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
import { DeleteConfirmationDialog } from "@/components/dashboard/DeleteConfirmationDialog";

const SizesPage = () => {
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!selectedSize) return;
    try {
      const res = await fetch(`/api/sizes/${selectedSize._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete size");
      setSizes((prev) => prev.filter((s) => s._id !== selectedSize._id));
      setOpen(false);
    } catch (err) {
      console.error("Failed to delete size:", err);
    }
  };

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await fetch("/api/sizes");
        const data = await res.json();
        setSizes(data);
      } catch (err) {
        console.error("Failed to fetch sizes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSizes();
  }, []);

  return (
    <>
      <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-800 dark:text-white/90">
            Product Sizes
          </CardTitle>
          <Button asChild size="sm">
            <Link href="/dashboard/sizes/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Size
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="w-24 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-16 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-20 h-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-8 h-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : sizes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No sizes found
                  </TableCell>
                </TableRow>
              ) : (
                sizes.map((size) => (
                  <TableRow key={size._id}>
                    <TableCell>{size.name}</TableCell>
                    <TableCell>{size.value}</TableCell>
                    <TableCell>
                      {new Date(size.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" asChild>
                          <Link href={`/dashboard/sizes/${size._id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedSize(size);
                            setOpen(true);
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={open}
        setOpen={setOpen}
        onConfirm={handleDelete}
        title="Delete this size?"
        description="This will permanently remove the size from your system."
      />
    </>
  );
};

export default SizesPage;
