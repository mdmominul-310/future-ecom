"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  firstName: string;
  lastName: string;
  image?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user: any) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUsers((prevUsers: User[]) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, role: newRole as "user" | "admin" }
            : user
        )
      );

      toast.success("Role updated", {
        description: "The user role has been updated successfully.",
      });
    } catch (error: any) {
      toast.error("Update failed", {
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Users</h2>
        </div>

        <Card className="bg-white dark:border-gray-800 border-gray-200 dark:bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>User Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <SkeletonRow key={idx} />
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user: any) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={user.image || "/placeholder.svg"}
                                alt={user.firstName}
                              />
                              <AvatarFallback>
                                {user.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            disabled={isSubmitting}
                            value={user.role}
                            onValueChange={(value) =>
                              handleRoleChange(user._id, value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
    </TableCell>
  </TableRow>
);
