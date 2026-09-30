export function ProductListSkeleton() {
  return (
    <section className="max-w-7xl mx-auto py-8 px-4">
      {/* Skeleton for Title */}
      <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-5"></div>

      {/* Skeleton for Product Grid/Carousel */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="bg-gray-200 h-48 w-full rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mt-1 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
