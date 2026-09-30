export function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative pt-[100%] bg-gray-200 dark:bg-gray-700" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Category Skeleton */}
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>

            {/* Rating Skeleton */}
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Price Skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 