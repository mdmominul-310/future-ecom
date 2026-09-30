"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Badge from "./ui/badge/Badge";

interface StatusDropdownProps {
  status: string;
  onStatusChange: (status: string) => void;
}

export function StatusDropdown({
  status,
  onStatusChange,
}: StatusDropdownProps) {
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "delivered":
  //       return "bg-green-100 dark:bg-green-500 dark:text-white text-green-800";
  //     case "pending":
  //     case "processing":
  //       return "bg-yellow-100 dark:bg-yellow-500 dark:text-white text-yellow-800";
  //     case "shipped":
  //       return "bg-blue-100 dark:bg-blue-500 dark:text-white text-blue-800";
  //     case "cancelled":
  //       return "bg-red-100 dark:bg-red-500 text-white text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex   justify-between w-32 px-3 py-1 h-auto">
          {/* <span className={`px-2 py-0.5 rounded-full min-w-24 text-xs ${getStatusColor(status)}`}>{status}</span> */}
          <Badge
            size="sm"
            color={
              status === "Delivered"
                ? "success"
                : status === "Pending"
                ? "warning"
                : "error"
            }
          >
            {status}
          </Badge>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-800"
      >
        {statuses.map((s) => (
          <DropdownMenuItem
            key={s}
            className={cn(
              "flex items-center dark:bg-gray-800 justify-between cursor-pointer",
              status.toLowerCase() === s.toLowerCase() && "font-medium"
            )}
            onClick={() => onStatusChange(s)}
          >
            {/* <div className={`px-2 py-0.5   rounded-full text-xs ${getStatusColor(s)}`}>{s}</div> */}
            <Badge
              size="sm"
              color={
                s === "Delivered"
                  ? "success"
                  : s === "Pending"
                  ? "warning"
                  : s === "Processing"
                  ? "info"
                  : s === "Shipped"
                  ? "primary"
                  : "error"
              }
            >
              {s}
            </Badge>
            {status.toLowerCase() === s.toLowerCase() && (
              <Check className="h-4 w-4 dark:text-white" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
