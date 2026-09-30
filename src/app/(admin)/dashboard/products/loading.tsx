import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-white/[0.03]">
      <main className="flex-1 p-4 md:p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90">
            Products
          </h2>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <div className="w-full md:w-64">
              <Skeleton className="h-10 w-full" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="border rounded-md">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 bg-gray-50 dark:bg-white/[0.05] border-b">
                <Skeleton className="h-5 w-6" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24 hidden md:block" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>

              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 border-b items-center"
                  >
                    <Skeleton className="h-5 w-6" />
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-5 w-24 hidden md:block" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <Skeleton className="h-5 w-48" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
