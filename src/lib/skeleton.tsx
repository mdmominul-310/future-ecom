import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export const renderSkeletonRow = () => (
  <TableRow className="w-full">
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
