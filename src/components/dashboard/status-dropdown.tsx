"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusDropdownProps {
  status: string;
  onStatusChange: (status: string) => void;
}

const STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    glowClass: string;
  }
> = {
  Delivered: {
    label: "Delivered",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
    dotClass: "bg-emerald-500",
    glowClass: "bg-emerald-400",
  },
  Processing: {
    label: "Processing",
    badgeClass:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/20",
    dotClass: "bg-orange-500",
    glowClass: "bg-orange-400",
  },
  Shipped: {
    label: "Shipped",
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 hover:bg-sky-500/20",
    dotClass: "bg-sky-500",
    glowClass: "bg-sky-400",
  },
  Pending: {
    label: "Pending",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
    dotClass: "bg-amber-500",
    glowClass: "bg-amber-400",
  },
  Cancelled: {
    label: "Cancelled",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20",
    dotClass: "bg-rose-500",
    glowClass: "bg-rose-400",
  },
};

export function getStatusStyle(rawStatus: string) {
  const norm = rawStatus?.trim().toLowerCase();
  if (norm?.includes("deliver")) return STATUS_CONFIG.Delivered;
  if (norm?.includes("process")) return STATUS_CONFIG.Processing;
  if (norm?.includes("ship")) return STATUS_CONFIG.Shipped;
  if (norm?.includes("cancel")) return STATUS_CONFIG.Cancelled;
  return STATUS_CONFIG.Pending;
}

export function StatusDropdown({
  status,
  onStatusChange,
}: StatusDropdownProps) {
  const currentConfig = getStatusStyle(status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer select-none",
            currentConfig.badgeClass
          )}
        >
          {/* Animated Glowing Dot */}
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                currentConfig.glowClass
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                currentConfig.dotClass
              )}
            />
          </span>

          <span className="tracking-wide">{currentConfig.label}</span>

          <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-40 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-1.5 space-y-1"
      >
        <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
          Change Status
        </div>
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          const isSelected =
            status.toLowerCase().includes(s.toLowerCase()) ||
            (s === "Processing" && status.toLowerCase().includes("process"));

          return (
            <DropdownMenuItem
              key={s}
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors",
                isSelected
                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
              onClick={() => onStatusChange(s)}
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", cfg.dotClass)} />
                <span>{cfg.label}</span>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-orange-500" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
