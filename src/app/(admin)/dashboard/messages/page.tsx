"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/dashboard/ui/badge/Badge";
import { SlidersHorizontal } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  subject: string;
  createdAt: string;
  seen: boolean;
}

// function Skeleton({ className }: { className: string }) {
//   return (
//     <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
//   );
// }

export default function MessageList() {
  const [filter, setFilter] = useState<"all" | "seen" | "unseen">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/message?filter=${filter}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Messages
        </h3>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SlidersHorizontal size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10">
              {["all", "seen", "unseen"].map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setFilter(option as "all" | "seen" | "unseen");
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    filter === option
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell className="py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Sender
              </TableCell>
              <TableCell className="py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Subject
              </TableCell>
              <TableCell className="py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Date
              </TableCell>
              <TableCell className="py-3 text-start text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <>
                <TableRow>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              </>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <TableRow key={msg._id}>
                  <TableCell className="py-3 text-gray-700 dark:text-white">
                    <Link
                      href={`/dashboard/messages/${msg._id}`}
                      className="hover:underline"
                    >
                      {msg.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 dark:text-gray-300">
                    {msg.subject}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 dark:text-gray-300">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color={msg.seen ? "success" : "warning"}>
                      {msg.seen ? "Seen" : "Unseen"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                No messages found.
              </div>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}
