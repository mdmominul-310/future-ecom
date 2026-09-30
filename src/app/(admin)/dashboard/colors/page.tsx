"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/dashboard/DeleteConfirmationDialog";
import { useRouter } from "next/navigation";

const ColorsPage = () => {
  const router = useRouter();
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const fetchColors = async () => {
    try {
      const res = await fetch("/api/colors");
      const data = await res.json();
      setColors(data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/colors/${selected._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setColors((prev) => prev.filter((c) => c._id !== selected._id));
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <>
      <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-2xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="dark:text-white/90">Product Colors</CardTitle>
          <Button
            size="sm"
            className="dark:bg-gray-800 dark:text-gray-400 border dark:border-gray-700"
            onClick={() => {
              router.push("/dashboard/colors/new");
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Color
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
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
                      <Skeleton className="w-16 h-4" />
                    </TableCell>
                  </TableRow>
                ))
              ) : colors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No colors found
                  </TableCell>
                </TableRow>
              ) : (
                colors.map((color) => (
                  <TableRow key={color._id}>
                    <TableCell>{color.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.value}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(color.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={async () => {
                            router.push(`/dashboard/colors/${color._id}`);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="hover:text-red-500"
                          onClick={() => {
                            setSelected(color);
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
        title="Delete color?"
        description="This will permanently remove the color from the system."
      />
    </>
  );
};

export default ColorsPage;
